# Roadmap

This roadmap keeps the project focused on infrastructure first. We do not start with OCR, chatbots, vector databases, or AI summaries. We first build a trustworthy Git-native base.

## Phase 0 — Bootstrap

Status: in progress

- [ ] Initial repository structure from OCKI template.
- [ ] MIT license for structure, tooling, and original documentation.
- [ ] Disclaimer and contribution rules.
- [ ] Metadata schema validated in CI.
- [ ] First metadata-backed act entry.
- [ ] GitHub Actions validation workflow.
- [ ] Issue templates and good-first-issue backlog.

## Phase 1 — First imports

- [ ] Priority acts identified and listed in INDEX.md.
- [ ] Metadata entries created for all priority acts.
- [ ] First official-source text import with complete provenance record.
- [ ] Import log format established.

## Phase 2 — Validation engine

- [ ] All CI validators passing.
- [ ] Per-act import logs for every full-text import.
- [ ] Optional checksums for raw official source captures.
- [ ] Article-level anchors in all full-text files.

## Phase 3 — Citation engine

- [ ] Citation index generated: `citations/citation-index.json`.
- [ ] Cross-references detected and reviewed.
- [ ] Relationship metadata (`related_acts`, `implements`, `amends`, `amended_by`) populated for priority acts.

## Phase 4 — Knowledge graph

- [ ] Cross-act relationship graph complete for core domain.
- [ ] Changelog generated and kept current.
- [ ] Repository health score consistently above 80.

## Phase 5 — Federation

- [ ] Repository listed in OCKI registry (when available).
- [ ] Schema version pinned and documented.
- [ ] Federation metadata added for cross-repository citation.

## Not now

These are intentionally postponed until the base is trustworthy:

- OCR pipelines.
- PDF parser complexity.
- Vector databases or embedding generation.
- AI-generated summaries (only verified excerpts are in scope).
- Scraping without explicit approval and legal permission.
