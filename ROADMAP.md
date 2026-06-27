# Roadmap

This roadmap keeps the project focused on infrastructure first. We do not start with OCR, chatbots, vector databases, or AI summaries. We first build a trustworthy Git-native base.

## Phase 0 — Foundation

Status: in progress

- [x] Initial repository structure.
- [x] MIT license for repository structure, tooling, and original documentation.
- [x] Disclaimer and contribution rules.
- [x] Metadata schema.
- [x] First metadata-backed act entry: Legea 50/1991.
- [x] First official-source text import: Legea 50/1991.
- [ ] Import log format and provenance records for every text import.
- [ ] GitHub Actions validation for Markdown and metadata.
- [ ] Issue templates and good-first-issue backlog.

## Phase 1 — Core construction legislation index

- [ ] Legea 10/1995 — quality in construction.
- [ ] Legea 350/2001 — spatial planning and urbanism.
- [ ] Ordin MDRAP 839/2009 — application norms for Legea 50/1991.
- [ ] HG 343/2017 — reception of construction works.
- [ ] Fire safety authorization references.
- [ ] ISC references and procedures.
- [ ] ISCIR technical prescriptions index.
- [ ] ANRE electrical authorization references.
- [ ] nZEB / energy performance references.

Each act should start as metadata + source links, then receive official-source text only when source/reuse rules are satisfied.

## Phase 2 — Provenance and change tracking

- [ ] One import-log file per official text import.
- [ ] Optional checksums for raw official source captures.
- [ ] Per-act changelog sections normalized across files.
- [ ] Article-level anchors and stable citation conventions.
- [ ] Relationship metadata between acts.

## Phase 3 — Contributor workflow

- [ ] Good-first-issue list for metadata-only contributions.
- [ ] Review checklist for legal-source imports.
- [ ] CODEOWNERS for metadata, docs, and act files.
- [ ] Community contribution guide examples.

## Phase 4 — Automation

- [ ] Metadata validation in CI.
- [ ] Markdown hygiene validation in CI.
- [ ] Source-link validation, initially manual or optional.
- [ ] Import tooling prototypes for official pages, with no scraping by default.

## Not now

These are intentionally postponed until the base is trustworthy:

- OCR pipelines.
- PDF parser complexity.
- AI summaries.
- Vector databases.
- Chatbots.
- Automated legal interpretation.
