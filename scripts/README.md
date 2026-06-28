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

## add-article-anchors.mjs

```sh
node scripts/add-article-anchors.mjs
```

One-time modification script. Adds `{#art-N}` anchors to article headings within `<!-- OFFICIAL_TEXT_START -->`/`<!-- OFFICIAL_TEXT_END -->` blocks in all full-text `legi/*.md` files. Skips metadata-only acts. Idempotent — running it twice produces the same result. Handles duplicate article numbers (e.g. acts with two document sections) by appending `-b`, `-c`, etc.

Do **not** add this to CI — it is a one-time modifier, not a validator.

## generate-citation-index.mjs

```sh
node scripts/generate-citation-index.mjs
```

Reads all anchored full-text `legi/*.md` files and produces `citations/citation-index.json` — a machine-readable registry mapping every act's articles to their canonical anchors and line numbers. AI agents and RAG systems can use this index to resolve citations like "Legea 50/1991 art. 7" → `legi/lege-50-1991.md#art-7` at line N.

Re-run this script after any import or anchor update.

## validate-citation-anchors.mjs

```sh
node scripts/validate-citation-anchors.mjs
```

Validates that:

- `citations/citation-index.json` exists and is non-empty
- All full-text acts have at least 1 `{#art-N}` anchor within their `OFFICIAL_TEXT` block
- Anchors match the `{#art-N}` format (`art-` followed by lowercase alphanumeric/hyphens)
- No duplicate anchors appear within the same file

Exits with code 1 if any check fails. Added to CI after `repository-health-report`.

## Rules

Scripts must not scrape websites unless explicitly approved and legally permitted.
Scripts must not import or install third-party packages without a documented justification.
