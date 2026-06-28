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

## Rules

Scripts must not scrape websites unless explicitly approved and legally permitted.
Scripts must not import or install third-party packages without a documented justification.
