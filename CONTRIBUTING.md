# Contributing

Thank you for helping build a Git-friendly Romanian construction legislation index.

## Ground rules

- Cite an official or primary source for every legal act update.
- Every change must include a source URL and the date the source was checked.
- Do not present legal interpretation as fact.
- Do not add fake legal articles, invented summaries, or unverified amendments.
- Do not mass-import unverified text.
- Official legislative, administrative, and judicial texts may be included only when sourced from official public sources and when source metadata is recorded.
- Do not include standards, third-party annotations, commentary, commercial database content, or paid/legal publisher material unless reuse rights are explicit.
- If an act number, title, status, source, or reuse right is uncertain, mark it as `TODO: verify official title/source` or `TODO: verify reuse rights`.

## File rules

- Keep one act per file.
- Preserve article numbering when excerpts are later allowed and verified.
- Use Markdown headings consistently.
- Keep metadata in YAML frontmatter for Markdown files.
- Keep machine-readable metadata aligned with `metadata/schema.json`.
- Prefer small commits focused on one act, one source, or one metadata change.

## Source evidence

Each contribution should include:

- official source URL
- official source name
- date checked
- contributor note explaining what changed
- whether the change is metadata-only, excerpt-only, or full official text

Preferred sources are official or primary sources such as legislatie.just.ro, Monitorul Oficial, and relevant authority pages.

## Review expectations

Reviewers should check:

- source URL is reachable and relevant
- metadata fields are complete
- status is not guessed
- text excerpts or full text are official-source-backed and reuse is permitted or clearly outside copyright protection
- notes are factual and not legal advice

## Prohibited content

Do not add:

- legal advice
- client-specific recommendations
- fake article text
- copied full text from non-official, commercial, annotated, or unclear sources
- private documents or paid database content
- personal data
