# Full-Text Scan Pipeline

This pipeline converts an official local DOCX or PDF into a review bundle for
legal full-text import. It is intentionally staging-only: it never writes to
`legi/`, `metadata/`, `import-log/`, `citations/`, `graph/`, or generated
reports.

## Safety model

The pipeline separates extraction from repository import:

1. Capture the official source locally and record its source URL and retrieval
   timestamp.
2. Run `scripts/import-fulltext-scan.py` into a temporary staging directory.
3. Review identity, publication, wording, page order, tables, OCR substitutions,
   and proposed anchors against the primary source.
4. Only then copy the reviewed text into the act's repository Markdown file and
   run the normal metadata, integrity, anchor, graph, health, and site checks.

The generated bundle contains `pipeline-result.json`, `source-audit.json`,
`proposed-anchors.json`, and `<slug>.md`. It is not import-ready by itself.

`READY_FOR_REVIEW` means the source was extracted without OCR. `NEEDS_HUMAN_REVIEW`
is always emitted when OCR was used. OCR never receives an automatic pass because
character substitutions can change legal meaning, article numbers, decimal
values, or table contents.

## Dependencies

DOCX extraction uses Python 3 standard-library ZIP/XML support. A text PDF needs
`pdftotext`; a scanned PDF additionally needs `ocrmypdf` and Tesseract. The
pipeline fails closed when a required command is missing.

Example macOS setup:

```sh
brew install poppler tesseract
python3 -m pip install --user ocrmypdf
```

Do not commit these tools, OCR PDFs, page images, or temporary source files.

## Usage

DOCX:

```sh
python3 scripts/import-fulltext-scan.py \
  --input /path/to/official.docx \
  --slug lege-123-2026 \
  --title "Legea nr. 123/2026 ..." \
  --source-url https://official.example/document \
  --retrieved-at 2026-08-15T12:00:00Z \
  --output-dir /private/tmp/lege-123-2026-review
```

Text PDF:

```sh
python3 scripts/import-fulltext-scan.py \
  --input /path/to/official.pdf \
  --slug lege-123-2026 \
  --title "Legea nr. 123/2026 ..." \
  --source-url https://official.example/document \
  --retrieved-at 2026-08-15T12:00:00Z \
  --output-dir /private/tmp/lege-123-2026-review
```

Scanned PDF, only after source identity has been independently verified:

```sh
python3 scripts/import-fulltext-scan.py \
  --input /path/to/official-scan.pdf \
  --slug lege-123-2026 \
  --title "Legea nr. 123/2026 ..." \
  --source-url https://official.example/document \
  --retrieved-at 2026-08-15T12:00:00Z \
  --output-dir /private/tmp/lege-123-2026-review \
  --allow-ocr
```

## Review gates before import

- Confirm the source is an official publication and the title, number/year,
  issuer, and Monitorul Oficial reference match.
- Compare the extracted text page-by-page with the primary source.
- Review every OCR substitution, heading, article number, decimal, footnote,
  table, annex, and page boundary.
- Accept or correct `proposed-anchors.json`; do not invent `art-*` anchors for
  technical points that require `pct-*`.
- Record source byte hash and extracted-text hash in the import log.
- Copy only reviewed content into the normal act file, then run:

```sh
node scripts/validate-metadata.mjs
node scripts/check-markdown-hygiene.mjs
node scripts/check-metadata-parity.mjs
node scripts/check-official-text-integrity.mjs
node scripts/hash-official-text.mjs --check
node scripts/validate-citation-anchors.mjs
node scripts/generate-graph.mjs
node scripts/repository-health-report.mjs
node scripts/generate-manifest.mjs
node scripts/generate-changelog.mjs
git diff --check
```

The staging bundle is evidence for a human-reviewed import, not a substitute
for that review.
