# Roadmap

This roadmap keeps the project focused on infrastructure first. We do not start with OCR, chatbots, vector databases, or AI summaries. We first build a trustworthy Git-native base.

## Current status (2026-08-31)

- 300 acts tracked: 53 full-text and 247 metadata-only.
- 300 graph nodes and 569 confirmed relationships.
- 0 `needs_review`; repository health 100/100.
- PR #623 is merged; the next work should remain source-backed and scoped.

## Phase 0 — Foundation

Status: complete

- [x] Initial repository structure.
- [x] MIT license for repository structure, tooling, and original documentation.
- [x] Disclaimer and contribution rules.
- [x] Metadata schema.
- [x] First metadata-backed act entry: Legea 50/1991.
- [x] First official-source text import: Legea 50/1991.
- [x] Import log format and provenance records for every text import.
- [x] GitHub Actions validation for Markdown and metadata.
- [x] Issue templates and good-first-issue backlog.

## Phase 1 — Core construction legislation index

- [x] Legea 10/1995 — quality in construction.
- [x] Legea 350/2001 — spatial planning and urbanism.
- [x] Ordin MDRAP 839/2009 — application norms for Legea 50/1991.
- [x] HG 343/2017 — reception of construction works.
- [x] Fire safety authorization references.
- [x] ISC references and procedures.
- [x] ISCIR technical prescriptions index.
- [x] ANRE electrical authorization references.
- [x] nZEB / energy performance references.

Each act should start as metadata + source links, then receive official-source text only when source/reuse rules are satisfied.

## Phase 2 — Provenance and change tracking

- [x] One import-log file per official text import.
- [x] Optional checksums for raw official source captures.
- [x] Per-act changelog sections normalized across files.
- [x] Article-level anchors and stable citation conventions.
- [x] Relationship metadata between acts.

## Phase 3 — Contributor workflow

- [x] Good-first-issue list for metadata-only contributions.
- [x] Review checklist for legal-source imports.
- [ ] CODEOWNERS for metadata, docs, and act files.
- [x] Community contribution guide examples.

## Phase 4 — Automation

- [x] Metadata validation in CI.
- [x] Markdown hygiene validation in CI.
- [x] Source-link validation, initially manual or optional.
- [x] Import tooling prototypes for official pages, with no scraping by default.

## Current next steps

- Keep `README.md`, `INDEX.md`, and `docs/act-inventory.md` synchronized with the generated manifest and health reports.
- Keep the metadata backlog source-gated and deduplicated against `origin/main`.
- Continue full-text imports only when official text fidelity and anchor structure pass review.
- Keep the public wiki, project board and issue backlog aligned with repository snapshots.

## Not now

These are intentionally postponed until the base is trustworthy:

- OCR pipelines.
- PDF parser complexity.
- AI summaries.
- Vector databases.
- Chatbots.
- Automated legal interpretation.
