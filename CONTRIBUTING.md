# Contributing

Thank you for helping build a Git-friendly Romanian construction legislation index.

## Ground rules

- Cite an official or primary source for every legal act update.
- Every change must include a source URL and the date the source was checked.
- Do not present legal interpretation as fact.
- Do not add fake legal articles, invented summaries, or unverified amendments.
- Do not mass-import unverified text.
- Do not include copyrighted full text unless the license or official source permits reuse.
- If an act number, title, status, or source is uncertain, mark it as `TODO: verify official title/source`.

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

Preferred sources are official or primary sources such as legislatie.just.ro, Monitorul Oficial, and relevant authority pages.

## Review expectations

Reviewers should check:

- source URL is reachable and relevant
- metadata fields are complete
- status is not guessed
- text excerpts are licensed or otherwise permitted
- notes are factual and not legal advice

## Prohibited content

Do not add:

- legal advice
- client-specific recommendations
- fake article text
- copied full legal text without permission
- private documents or paid database content
- personal data
