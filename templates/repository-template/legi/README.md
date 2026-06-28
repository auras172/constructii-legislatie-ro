# Act index

This directory contains one Markdown file per imported act.

Files are named `<slug>.md` where slug is the act's identifier in `metadata/acts/<slug>.json`.

## File structure

Each file must follow this structure:

```markdown
---
title: "Full official title"
type: lege
domain: {{DOMAIN}}
status: active
source_url: "https://..."
last_checked: "YYYY-MM-DD"
tags: [tag1, tag2]
---

# Full official title

<!-- OFFICIAL_TEXT_START -->

[Official text here]

<!-- OFFICIAL_TEXT_END -->

## Notes

[Optional notes, separate from official text]
```

## Rules

- One act per file.
- Preserve official article numbering exactly.
- Run `node scripts/add-article-anchors.mjs` after importing new text.
- Create a corresponding `import-log/<slug>.md` for every full-text import.
- Metadata-only acts do NOT have a file here — only a `metadata/acts/<slug>.json`.
