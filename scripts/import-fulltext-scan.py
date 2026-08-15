#!/usr/bin/env python3
"""Build a review bundle from an official DOCX or PDF source.

This command is deliberately staging-only. It never writes to legi/,
metadata/, import-log/, or generated repository artifacts. OCR output is
always marked NEEDS_HUMAN_REVIEW because OCR can alter legal wording.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
import tempfile
import unicodedata
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from xml.etree import ElementTree


NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
}
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
ARTICLE_RE = re.compile(r"^\s*(?:art(?:icolul)?\.?)[ \t]+([ivxlcdm]+|\d+)", re.I)
ANNEX_RE = re.compile(r"^\s*anex(?:a|ă)\b[ \t]*(.*)$", re.I)
TECH_POINT_RE = re.compile(r"^\s*(\d+(?:\.\d+)+)\b")


class PipelineBlocked(RuntimeError):
    """A source or required conversion dependency failed a hard gate."""


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def normalize_text(value: str) -> str:
    value = unicodedata.normalize("NFC", value.replace("\r\n", "\n").replace("\r", "\n"))
    return "\n".join(re.sub(r"[ \t]+", " ", line).rstrip() for line in value.split("\n")).strip()


def command(name: str) -> str | None:
    return shutil.which(name)


def run_command(args: list[str]) -> str:
    try:
        result = subprocess.run(args, check=True, capture_output=True, text=True)
    except FileNotFoundError as exc:
        raise PipelineBlocked(f"Required command is unavailable: {args[0]}") from exc
    except subprocess.CalledProcessError as exc:
        detail = (exc.stderr or exc.stdout or "command failed").strip()
        raise PipelineBlocked(f"{args[0]} failed: {detail}") from exc
    return result.stdout


def xml_text(element: ElementTree.Element) -> str:
    chunks: list[str] = []
    for node in element.iter():
        if node.tag == f"{{{NS['w']}}}t" and node.text:
            chunks.append(node.text)
        elif node.tag == f"{{{NS['w']}}}tab":
            chunks.append("\t")
        elif node.tag == f"{{{NS['w']}}}br":
            chunks.append("\n")
    return "".join(chunks)


def docx_blocks(path: Path) -> tuple[list[str], list[list[list[str]]]]:
    try:
        with zipfile.ZipFile(path) as archive:
            root = ElementTree.fromstring(archive.read("word/document.xml"))
    except (KeyError, zipfile.BadZipFile, ElementTree.ParseError) as exc:
        raise PipelineBlocked(f"Cannot read DOCX document.xml: {exc}") from exc

    blocks: list[str] = []
    tables: list[list[list[str]]] = []
    body = root.find("w:body", NS)
    if body is None:
        raise PipelineBlocked("DOCX has no document body")

    for child in body:
        if child.tag == f"{{{NS['w']}}}p":
            text = normalize_text(xml_text(child))
            if text:
                style = child.find("w:pPr/w:pStyle", NS)
                style_name = style.get(f"{{{NS['w']}}}val", "") if style is not None else ""
                prefix = "## " if style_name.lower().startswith("heading") else ""
                blocks.append(prefix + text)
        elif child.tag == f"{{{NS['w']}}}tbl":
            rows: list[list[str]] = []
            for row in child.findall("w:tr", NS):
                cells = [normalize_text(xml_text(cell)) for cell in row.findall("w:tc", NS)]
                if any(cells):
                    rows.append(cells)
            if rows:
                tables.append(rows)
                blocks.append("[[DOCX_TABLE_%d]]" % len(tables))

    if not blocks:
        raise PipelineBlocked("DOCX contains no extractable text")
    return blocks, tables


def markdown_table(rows: list[list[str]]) -> str:
    width = max(len(row) for row in rows)
    padded = [row + [""] * (width - len(row)) for row in rows]

    def row(values: list[str]) -> str:
        return "| " + " | ".join(value.replace("|", "\\|") for value in values) + " |"

    header = padded[0]
    return "\n".join([row(header), row(["---"] * width)] + [row(item) for item in padded[1:]])


def extract_docx(path: Path) -> tuple[str, dict[str, int]]:
    blocks, tables = docx_blocks(path)
    table_index = 0
    rendered: list[str] = []
    for block in blocks:
        match = re.fullmatch(r"\[\[DOCX_TABLE_(\d+)\]\]", block)
        if match:
            table_index = int(match.group(1))
            rendered.append(markdown_table(tables[table_index - 1]))
        else:
            rendered.append(block)
    text = normalize_text("\n\n".join(rendered))
    return text, {"paragraphs": len(blocks) - len(tables), "tables": len(tables)}


def pdf_pages(path: Path) -> int | None:
    pdfinfo = command("pdfinfo")
    if not pdfinfo:
        return None
    output = run_command([pdfinfo, str(path)])
    match = re.search(r"^Pages:\s+(\d+)$", output, re.M)
    return int(match.group(1)) if match else None


def extract_pdf(path: Path, allow_ocr: bool) -> tuple[str, dict[str, object]]:
    pdftotext = command("pdftotext")
    if not pdftotext:
        raise PipelineBlocked("pdftotext is required for PDF extraction")

    with tempfile.TemporaryDirectory(prefix="constructii-ocr-") as temp_dir:
        extracted = Path(temp_dir) / "extracted.txt"
        run_command([pdftotext, "-layout", str(path), str(extracted)])
        text = normalize_text(extracted.read_text(encoding="utf-8", errors="replace"))
        ocr_used = False

        if len(re.sub(r"\s+", "", text)) < 200:
            if not allow_ocr:
                raise PipelineBlocked(
                    "PDF has no usable text. Re-run with --allow-ocr only after source identity is verified."
                )
            ocrmypdf = command("ocrmypdf")
            tesseract = command("tesseract")
            if not ocrmypdf or not tesseract:
                raise PipelineBlocked(
                    "Scanned PDF requires both ocrmypdf and tesseract; no OCR or import was performed."
                )
            ocr_pdf = Path(temp_dir) / "ocr.pdf"
            run_command([ocrmypdf, "--skip-text", "--deskew", "--rotate-pages", str(path), str(ocr_pdf)])
            run_command([pdftotext, "-layout", str(ocr_pdf), str(extracted)])
            text = normalize_text(extracted.read_text(encoding="utf-8", errors="replace"))
            ocr_used = True

        if len(re.sub(r"\s+", "", text)) < 200:
            raise PipelineBlocked("PDF extraction produced insufficient text; no bundle was written")
        return text, {"pages": pdf_pages(path), "ocr_used": ocr_used}


def proposed_anchors(text: str) -> list[dict[str, str]]:
    candidates: list[dict[str, str]] = []
    for line_number, line in enumerate(text.splitlines(), 1):
        structural_line = re.sub(r"^\s*#+\s*", "", line)
        article = ARTICLE_RE.match(structural_line)
        annex = ANNEX_RE.match(structural_line)
        point = TECH_POINT_RE.match(structural_line)
        if article:
            candidates.append({"kind": "article", "anchor": f"art-{article.group(1).lower()}", "line": str(line_number)})
        elif annex:
            label = re.sub(r"[^a-z0-9]+", "-", annex.group(1).lower()).strip("-") or "unknown"
            candidates.append({"kind": "annex", "anchor": f"anexa-{label}", "line": str(line_number)})
        elif point:
            label = point.group(1).replace(".", "-")
            candidates.append({"kind": "technical-point", "anchor": f"pct-{label}", "line": str(line_number)})
    return candidates


def write_bundle(args: argparse.Namespace, text: str, extraction: dict[str, object], ocr_used: bool) -> None:
    source = args.input.read_bytes()
    output = args.output_dir
    output.mkdir(parents=True, exist_ok=True)
    source_hash = sha256(source)
    text_hash = sha256(text.encode("utf-8"))
    status = "NEEDS_HUMAN_REVIEW" if ocr_used else "READY_FOR_REVIEW"
    anchors = proposed_anchors(text)

    markdown = "\n".join([
        "---",
        f'title: "{args.title.replace(chr(34), chr(39))}"',
        f"slug: {args.slug}",
        "pipeline_status: " + status,
        "import_method: DOCX/PDF extraction staging bundle",
        f"source_url: {args.source_url}",
        f"last_checked: {args.retrieved_at[:10]}",
        "---",
        "",
        "# Full-text candidate",
        "",
        "<!-- PIPELINE_REVIEW_REQUIRED: verify source identity, structure, wording, tables, and anchors before repository import. -->",
        "",
        "<!-- OFFICIAL_TEXT_START -->",
        text,
        "<!-- OFFICIAL_TEXT_END -->",
        "",
    ])
    (output / f"{args.slug}.md").write_text(markdown, encoding="utf-8")
    (output / "proposed-anchors.json").write_text(json.dumps(anchors, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (output / "source-audit.json").write_text(json.dumps({
        "source_url": args.source_url,
        "source_name": args.input.name,
        "retrieved_at": args.retrieved_at,
        "source_sha256": source_hash,
        "source_bytes": len(source),
        "hash_basis": "raw-bytes",
        "extracted_text_sha256": text_hash,
        "extracted_text_bytes": len(text.encode("utf-8")),
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (output / "pipeline-result.json").write_text(json.dumps({
        "pipeline_status": status,
        "slug": args.slug,
        "source_kind": args.input.suffix.lower().lstrip("."),
        "ocr_used": ocr_used,
        "extraction": extraction,
        "proposed_anchor_count": len(anchors),
        "review_gates": [
            "verify official document identity and publication reference",
            "compare extracted text against the official source page or publication",
            "review OCR substitutions and tables manually" if ocr_used else "review structural extraction and tables manually",
            "run repository validation scripts only after copying reviewed text into the act file",
        ],
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True, help="Local official DOCX or PDF")
    parser.add_argument("--slug", required=True, help="Repository slug, for example hg-845-2018")
    parser.add_argument("--title", required=True, help="Exact official title, verified separately")
    parser.add_argument("--source-url", required=True, help="Official source URL")
    parser.add_argument("--retrieved-at", required=True, help="UTC retrieval timestamp, ISO-8601")
    parser.add_argument("--output-dir", type=Path, required=True, help="Staging directory outside the repository")
    parser.add_argument("--allow-ocr", action="store_true", help="Permit OCR fallback for scanned PDFs; still requires human review")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not SLUG_RE.fullmatch(args.slug):
        print("STOPPED: slug must contain lowercase ASCII words separated by hyphens", file=sys.stderr)
        return 2
    if not args.input.is_file():
        print(f"STOPPED: input does not exist: {args.input}", file=sys.stderr)
        return 2
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}T.*Z", args.retrieved_at):
        print("STOPPED: --retrieved-at must be an ISO-8601 UTC timestamp ending in Z", file=sys.stderr)
        return 2

    try:
        suffix = args.input.suffix.lower()
        if suffix == ".docx":
            text, extraction = extract_docx(args.input)
            ocr_used = False
        elif suffix == ".pdf":
            text, extraction = extract_pdf(args.input, args.allow_ocr)
            ocr_used = bool(extraction.get("ocr_used"))
        else:
            raise PipelineBlocked("Only .docx and .pdf inputs are supported")
        write_bundle(args, text, extraction, ocr_used)
    except PipelineBlocked as exc:
        print(f"STOPPED / SOURCE_BLOCKED: {exc}", file=sys.stderr)
        return 2

    status = "NEEDS_HUMAN_REVIEW" if ocr_used else "READY_FOR_REVIEW"
    print(f"Wrote staging bundle: {args.output_dir}")
    print(f"Pipeline status: {status}")
    print(f"Extracted text SHA-256: {sha256(text.encode('utf-8'))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
