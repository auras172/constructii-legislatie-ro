# Scripts

Validation scripts for local use and CI. Run from the repository root with Node 20+.

## validate-metadata.mjs

```sh
node scripts/validate-metadata.mjs
```

Validates every JSON file under `metadata/acts/` against `metadata/schema.json`:

- required fields present
- no unknown fields
- enum values match schema
- `last_checked` in `YYYY-MM-DD` format
- `tags` array non-empty with non-empty strings

Exits with code 1 if any check fails.

## check-markdown-hygiene.mjs

```sh
node scripts/check-markdown-hygiene.mjs
```

Walks all `.md` files in the repository (skips `.git` and `node_modules`) and checks:

- trailing newline present
- no trailing whitespace on any line
- headings have a space after `#`

Exits with code 1 if any check fails.

## check-official-text-integrity.mjs

```sh
node scripts/check-official-text-integrity.mjs
```

For every JSON file under `metadata/acts/`, skips acts with `import_method: "metadata-only"` and verifies that all full-text imported acts have: a corresponding `legi/<slug>.md` file, exactly one `OFFICIAL_TEXT_START` and one `OFFICIAL_TEXT_END` marker in the correct order, and a non-empty import log file under `import-log/` matching the slug. Exits with code 1 if any check fails — a failure means a full-text act is missing its official text markers or import record.

## audit-source-url.mjs

```sh
node scripts/audit-source-url.mjs <slug>
node scripts/audit-source-url.mjs <slug> --official-detail
```

Reads one metadata file from `metadata/acts/<slug>.json`, fetches its `source_url`
(or `official_detail_url` with `--official-detail`), and prints a small audit
record: slug, title, URL, HTTP status, content type, byte size, SHA-256 hash, and
whether the URL belongs to Portal Legislativ, MDLPA, ISCIR, ANRE, or another
source.

Fetched bodies are saved only under `/tmp/constructii-source-audit/<slug>/`.
The script never writes to `legi/`, `metadata/`, or `import-log/`, and it does
not parse official text into Markdown.

Warning: this helper does not import official text and does not certify legal
accuracy. It only records fetch-level evidence for a single source URL.

See [`docs/source-audit-workflow.md`](../docs/source-audit-workflow.md) for
when to run this helper before source-backed import work, what to record in
the PR/import-log, and its full boundaries and non-goals.

## repository-health-report.mjs

```sh
node scripts/repository-health-report.mjs
```

Generates `reports/repository-health.json` and `reports/repository-health.md` with:

- **Summary**: counts of metadata entries, full-text acts, metadata-only acts, import logs, relationship links, unique domains, and unique issuers
- **Coverage matrix**: per-act status for full text, metadata, import log, official markers, relationships, and provenance
- **Statistics**: breakdowns by domain, issuer kind, publication year, and import method
- **Health score**: deterministic 0–100 score across five weighted dimensions (see formula in the script)
- **Warnings**: missing import logs, missing markdown files, missing relationships, missing official markers, incomplete metadata, duplicate slugs, orphan metadata, orphan markdown

Exits with code 0 always — warnings are collected and reported but never fail the script.
Runs in the CI validate workflow after `check-official-text-integrity`.

## detect-cross-references.mjs

```sh
node scripts/detect-cross-references.mjs
```
Scans all full-text `legi/<slug>.md` files (between `OFFICIAL_TEXT_START` and `OFFICIAL_TEXT_END` markers) for references to other Romanian legal acts and generates suggestion files for human review. Skips metadata-only acts. Does not modify any metadata or text files.
Detects patterns like `Legea nr. 50/1991`, `HG 343/2017`, `OUG nr. 195/2005`, `Ordinul nr. 839/2009`, and article-level references (`art. 7 alin. (1)`) on the same line as an act citation. Resolves references to known slugs via `metadata/acts/`.
Outputs (all in `cross-references/`):
- `cross-references-raw.json` — every individual reference match with source line, matched text, resolved slug, and status
- `relationships-auto.json` — aggregated per-source-act view with resolved/unresolved sets and article-level references
- `relationships-diff.md` — human-readable diff comparing detected references against existing `related_acts` in metadata
Not in CI — this is a generation script. See `cross-references/README.md` for usage instructions.
## generate-changelog.mjs
node scripts/generate-changelog.mjs
Reads the full git log of the `main` branch, classifies each commit by type
(legislation import, infrastructure, documentation, fix, misc), and
cross-references `metadata/acts/` for act details (short title, domain,
import method). Generates two output files:
- `CHANGELOG.md` — human-readable changelog grouped by month, with legislation
  entries marked ✅ `[full-text]` or 📋 `[metadata-only]`
- `reports/changelog.json` — machine-readable equivalent with per-month arrays
  and summary totals
The script is idempotent: running it twice produces the same output.
The generated `CHANGELOG.md` contains a `<!-- do not edit manually -->` comment.
Exits with code 0 always. Integrated into the CI validate workflow.
## add-article-anchors.mjs
node scripts/add-article-anchors.mjs
One-time modification script. Adds `{#art-N}` anchors to article headings within `<!-- OFFICIAL_TEXT_START -->`/`<!-- OFFICIAL_TEXT_END -->` blocks in all full-text `legi/*.md` files. Skips metadata-only acts. Idempotent — running it twice produces the same result. Handles duplicate article numbers (e.g. acts with two document sections) by appending `-b`, `-c`, etc.
Do **not** add this to CI — it is a one-time modifier, not a validator.
## generate-citation-index.mjs
node scripts/generate-citation-index.mjs
Reads all anchored full-text `legi/*.md` files and produces `citations/citation-index.json` — a machine-readable registry mapping every act's articles to their canonical anchors and line numbers. AI agents and RAG systems can use this index to resolve citations like "Legea 50/1991 art. 7" → `legi/lege-50-1991.md#art-7` at line N.
Re-run this script after any import or anchor update.
## validate-citation-anchors.mjs
node scripts/validate-citation-anchors.mjs
Validates that:
- `citations/citation-index.json` exists and is non-empty
- All full-text acts have at least 1 `{#art-N}` anchor within their `OFFICIAL_TEXT` block
- Anchors match the `{#art-N}` format (`art-` followed by lowercase alphanumeric/hyphens)
- No duplicate anchors appear within the same file
Exits with code 1 if any check fails. Added to CI after `repository-health-report`.

## generate-manifest.mjs

```sh
node scripts/generate-manifest.mjs
```

Reads all `metadata/acts/*.json`, `citations/citation-index.json`, `cross-references/relationships-auto.json`, and `reports/repository-health.json` to produce:

- `ocki-manifest.json` — machine-readable repository entry point for AI agents and external tools. Contains content statistics (acts total, full-text vs metadata-only, article anchors, domains, act types), relationship counts, infrastructure inventory, per-act index, and AI guidance (citation format, read order, do-not list).
- `reports/manifest-summary.md` — human-readable one-pager with tables for content stats, acts index, and AI guidance.

Repository-level fields (name, owner, URL) are hardcoded — they don't change.
Idempotent. Exits 0 always. Integrated into the CI validate workflow (runs last).

## generate-graph.mjs

```sh
node scripts/generate-graph.mjs
```

Generates `graph/graph.json` and `graph/graph.mmd` from metadata relationship fields and
auto-detected cross-references. Confirmed metadata edges are marked `confirmed`;
auto-detected edges are marked `needs_review`. Run after updating metadata or cross-references.

- Nodes: one per act in `metadata/acts/*.json`
- Confirmed edges: from `related_acts` in each metadata JSON (human-verified)
- Auto-detected edges: from `cross-references/relationships-auto.json` where both source
  and target slugs resolve to known acts; unresolved references are skipped
- Deduplication: if the same source→target pair appears in both sources, the confirmed
  edge is kept and the auto-detected one is dropped
- Output is deterministic and idempotent — sort order is fixed, no timestamps in content

## Rules

Scripts must not scrape websites unless explicitly approved and legally permitted.
Scripts must not import or install third-party packages without a documented justification.
