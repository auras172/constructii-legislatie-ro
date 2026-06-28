# Contribution guide

How to contribute to {{REPO_NAME}}.

## Before you start

1. Read `README.md`.
2. Read `DISCLAIMER.md` — this is not legal advice.
3. Read `AGENTS.md` if you are an AI contributor.
4. Check open issues to avoid duplicating work.

## Workflow

1. Pick or create an issue.
2. Create a feature branch: `git checkout -b feature/add-<act-slug>`.
3. Make your changes.
4. Run local validation (see below).
5. Open a pull request with all required fields filled in.
6. Wait for human review before merge.

## Local validation

Run these before opening a PR:

```sh
node scripts/validate-metadata.mjs
node scripts/check-markdown-hygiene.mjs
node scripts/check-metadata-parity.mjs
node scripts/check-official-text-integrity.mjs
```

For full-text imports, also run:

```sh
node scripts/add-article-anchors.mjs
node scripts/generate-citation-index.mjs
node scripts/validate-citation-anchors.mjs
```

## Metadata-only contribution

1. Create `metadata/acts/<slug>.json` following `metadata/schema.json`.
2. Set `import_method: "metadata-only"`.
3. Add a row to `INDEX.md`.
4. Run `node scripts/validate-metadata.mjs`.

## Full-text import contribution

1. Verify the act has an existing metadata entry.
2. Verify the source URL is from an official government source.
3. Create `legi/<slug>.md` with `OFFICIAL_TEXT_START` and `OFFICIAL_TEXT_END` markers.
4. Create `import-log/<slug>.md` with full provenance.
5. Run `node scripts/add-article-anchors.mjs`.
6. Run all validators.

## Source rules

- Only import from official government sources.
- Record source URL, official source name, and date accessed.
- Never fabricate legal text.
- If reuse rights are unclear, import metadata only.

## PR requirements

- One issue per PR.
- Fill in the PR Evidence Footer completely.
- Paste exact validation output.
- For any official text: fill in all six source evidence fields.

## AI contributors

Follow all rules in `AGENTS.md`. Use prompts from `PROMPTS.md` as a starting point.
