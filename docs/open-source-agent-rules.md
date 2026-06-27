# Open-source Agent Rules

Firm rules for AI agents working on this open-source repository.

This repository is public. Every change must be understandable, reviewable, and safe for future contributors.

## Why this document exists

The repository now has multiple `good first issue` tasks for documentation, metadata, taxonomy, indexing, provenance, and AI-ready structure.

These issues are intentionally small. AI agents must not turn them into broad rewrites.

## Non-negotiable rules

1. **One issue = one pull request.**
2. **Do not work on `main` directly.**
3. **Read repository rules before editing.**
4. **Use repo evidence, not assumptions.**
5. **Do not invent legal facts.**
6. **Do not fabricate legal text.**
7. **Do not import new official text unless the issue explicitly asks for text import.**
8. **Do not reclassify the whole repository unless the issue explicitly asks for it.**
9. **Do not introduce dependencies without human approval.**
10. **Do not approve or merge your own work.**

## Required reading order

Before editing files, agents must read:

1. `README.md`
2. `CONTRIBUTING.md`
3. `DISCLAIMER.md`
4. `AGENTS.md`
5. `PROMPTS.md`, if using a reusable task prompt
6. The GitHub issue being implemented
7. The specific files the issue mentions

If a file mentioned above is absent on the current branch, say so in the PR. Do not pretend it was read.

## Issue discipline

Treat the issue body as the contract.

If the issue says:

```text
Do not import new text.
```

then do not import new text.

If the issue says:

```text
Use only information already present in the repository.
```

then do not browse, infer, or add new source claims.

If the issue says:

```text
Do not change metadata schema unless absolutely necessary.
```

then do not touch `metadata/schema.json` unless the PR explicitly explains why the issue cannot be solved otherwise.

## Good behavior by issue type

### Repository index issues

For issues such as “build repository index”:

- Use only files already present in the repository.
- Mark missing data as `TODO` or `Unverified`.
- Link existing Markdown and JSON files.
- Do not add new legal acts.
- Do not browse for missing metadata unless the issue explicitly asks for source research.

### Contributor examples issues

For issues such as “add contributor examples”:

- Keep examples generic and constructive.
- Do not criticize real contributors.
- Include good examples and anti-patterns.
- Reinforce small PRs and source-backed changes.
- Do not change legal content.

### Taxonomy issues

For issues such as “design construction legislation taxonomy”:

- Propose a simple first version.
- Use examples as examples, not confirmed classifications unless repo evidence supports them.
- Do not reclassify every act.
- Do not change the metadata schema unless required and justified.
- Mark uncertain categories as `TODO`.

### Source verification issues

For issues such as “verify official source links”:

- Prefer official or primary sources.
- Record source URL and date checked.
- Do not copy third-party commentary.
- Do not make legal status claims beyond source evidence.

### Metadata issues

For act metadata issues:

- Add or update one act at a time.
- Keep one act per file.
- Preserve `source_url`, `official_source`, and `last_checked`.
- Validate metadata before opening the PR.
- Do not import full text unless explicitly requested.

## Validation before PR

Run what exists on the current branch:

```sh
git diff --check
node scripts/validate-metadata.mjs
node scripts/check-markdown-hygiene.mjs
```

If a command is unavailable, report it clearly.

Never write “tests passed” unless the command actually ran and passed.

## PR body requirements

Every AI-assisted PR should include:

- Summary
- Files changed
- What was implemented
- Source evidence, if legal/source claims changed
- Verification results
- Risks / follow-ups
- Rollback plan

For documentation-only changes, the rollback plan can be:

```text
Revert this PR to remove the documentation changes.
```

## Stop conditions

Stop and ask for human direction if:

- the issue is ambiguous
- the task requires broad architecture changes
- the task requires importing text from unclear sources
- official source evidence conflicts with repo metadata
- validation fails and the fix would broaden scope
- solving the issue requires touching unrelated files

## Open-source posture

This repository should remain welcoming to humans and predictable for agents.

A good AI contribution should be:

- small
- source-backed
- easy to review
- easy to revert
- respectful of legal-source constraints
- useful to the next contributor

Do less, but do it clearly.
