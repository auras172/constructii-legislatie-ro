# Standard Prompts for Contributors and AI Agents

Reusable task prompts for humans working with AI agents.

These prompts are not magic instructions. They are small contracts that keep contributions focused, source-backed, and reviewable.

Use them with ChatGPT, Claude, Codex, Gemini, Jules, Cursor, Windsurf, or any similar coding agent.

## Prompt: Add new law metadata

```text
You are contributing to constructii-legislatie-ro.

Task: Add metadata for <ACT_NAME>.

Read first:
- README.md
- CONTRIBUTING.md
- DISCLAIMER.md
- AGENTS.md
- metadata/schema.json
- examples/lege-template.md
- examples/act-metadata.example.json

Scope:
- Add one Markdown file for the act.
- Add one JSON metadata file under metadata/acts/.
- Update the relevant index README if needed.

Rules:
- Use official or primary sources only.
- Do not import full legal text.
- Do not add legal interpretation.
- If title/status/source is uncertain, write TODO instead of guessing.
- Keep one act per file.

Validation:
- git diff --check
- node scripts/validate-metadata.mjs, if available
- node scripts/check-markdown-hygiene.mjs, if available

Output:
- Summary
- Files changed
- Source URL and date checked
- Verification results
- Remaining TODOs
```

## Prompt: Improve metadata

```text
You are contributing to constructii-legislatie-ro.

Task: Improve metadata for <ACT_FILE_OR_METADATA_FILE>.

Read first:
- metadata/schema.json
- CONTRIBUTING.md
- AGENTS.md

Scope:
- Update metadata only.
- Do not modify legal text.
- Do not reformat unrelated files.

Rules:
- Cite the official source used.
- Preserve existing source fields unless the source is being corrected.
- Do not guess status, title, year, or domain.

Validation:
- git diff --check
- node scripts/validate-metadata.mjs, if available

Output:
- Summary
- Metadata fields changed
- Source evidence
- Verification results
```

## Prompt: Import official text

```text
You are contributing to constructii-legislatie-ro.

Task: Import official text for <ACT_NAME> from an official source.

Read first:
- README.md
- CONTRIBUTING.md
- DISCLAIMER.md
- AGENTS.md
- metadata/sources.md
- import-log/README.md, if present

Scope:
- Update the existing act Markdown file.
- Update metadata only if needed.
- Add or update one import log.

Rules:
- Use official sources such as Portal Legislativ / legislatie.just.ro.
- Do not summarize.
- Do not paraphrase.
- Do not add legal interpretation inside the official text block.
- Preserve article numbering.
- Use OFFICIAL_TEXT_START and OFFICIAL_TEXT_END markers.
- Record provenance: source URL, official source, date accessed, import method, article count, annex count, validation commands.

Validation:
- git diff --check
- metadata JSON parse, if metadata changed
- grep for HTML/CSS residue if converting from HTML
- count article and annex headings when possible

Output:
- Summary
- Files changed
- Source and access date
- Import method
- Verification results
- Known limitations
```

## Prompt: Improve import provenance

```text
You are contributing to constructii-legislatie-ro.

Task: Improve import provenance for <ACT_NAME_OR_IMPORT_LOG>.

Read first:
- import-log/README.md
- AGENTS.md
- CONTRIBUTING.md

Scope:
- Update import-log files or provenance documentation.
- Do not change legal text unless explicitly requested.

Rules:
- Record technical provenance, not legal commentary.
- Keep logs factual.
- Include verification commands and known limitations.

Validation:
- git diff --check
- node scripts/check-markdown-hygiene.mjs, if available
```

## Prompt: Design article anchors

```text
You are contributing to constructii-legislatie-ro.

Task: Propose an article-anchor convention.

Read first:
- README.md
- VISION.md
- AGENTS.md
- legi/lege-50-1991.md

Scope:
- Add or update documentation only.
- Do not rewrite imported legal text.

Rules:
- Preserve official article numbering.
- Make anchors stable for search, RAG, and citations.
- Avoid legal interpretation.

Output:
- Proposed convention
- Examples
- Migration path
- Risks / tradeoffs
```

## Prompt: Verify a pull request

```text
You are verifying a pull request in constructii-legislatie-ro.

Do not edit files.

Check:
- Does the PR solve one issue only?
- Are official sources cited where required?
- Is legal text preserved without invented content?
- Are provenance records present for imports?
- Do validation commands pass?
- Is the rollback plan concrete?

Output:
- PASS / FAIL / UNVERIFIED
- Findings
- Verification evidence
- Remaining risks
```
