# {{REPO_NAME}} — Act Index

This table tracks the current status of all acts in scope.

<!-- Add rows below. One row per act. -->
<!-- Columns: Act | Type | Status | Full text | Metadata | Last checked -->

| Act | Type | Status | Full text | Metadata | Last checked |
|-----|------|--------|-----------|----------|--------------|
| _No acts imported yet_ | — | — | — | — | — |

## Status key

| Value | Meaning |
|-------|---------|
| `active` | Currently in force |
| `repealed` | Fully repealed |
| `partially_repealed` | Some provisions repealed |
| `unknown` | Status not yet verified |

## Full text key

| Value | Meaning |
|-------|---------|
| ✅ | Full official text imported with provenance record |
| 📋 | Metadata and source link only |
| ⬜ | Not yet started |

## How to add an act

1. Create `metadata/acts/<slug>.json` following `metadata/schema.json`.
2. Add a row to this table.
3. For full text: create `legi/<slug>.md` and `import-log/<slug>.md`.
4. Run `node scripts/validate-metadata.mjs` before opening a PR.
