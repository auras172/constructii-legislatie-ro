# Open Construction Law Romania

See [INDEX.md](./INDEX.md) for the current legislation status matrix.

**Romanian Construction Knowledge Base** — open-source, versioned construction legislation for Romania, structured for humans, Git, search, and AI.

This repository tracks Romanian construction legislation, norms, procedures, and regulatory references in a Git-friendly format.

We invite developers, engineers, architects, legal researchers, AI builders, public-sector specialists, and construction professionals to contribute. If you want to help structure Romanian construction regulation for humans and machines, open an issue or contact us at contact@radarmeseriasi.ro.

This project is MIT-licensed. It is a technical documentation project, **not legal advice** and **not an official government source**.

## Purpose

The goal is to track construction-related Romanian legal acts, norms, procedures, and guidance in a structured Markdown format that works well with Git history, review workflows, search, and future retrieval systems.

Initial scope covers construction-related topics only:

- construction authorization
- urbanism
- execution of works
- reception of works
- construction quality
- ISC references
- ANRE references
- ISCIR references
- fire safety
- nZEB / energy efficiency

## Why Git for legislation?

Git is useful because legislation changes over time. A Git-friendly repository can make those changes easier to inspect:

- diffs show what changed between versions
- commit messages can cite official sources and dates
- small updates can be reviewed before merge
- metadata can be validated consistently
- history can preserve when a source was checked

This does not replace official legal sources. It is an open technical index that can help people organize references and notice changes.

## Intended users

This project is intended for:

- builders and contractors
- civil engineers
- architects and urbanism specialists
- construction founders and product teams
- technical due-diligence researchers
- legal researchers who want a Git-readable index

## How diffs help

When an act changes, a Markdown update can show:

- title or status changes
- source URL changes
- metadata updates
- newly added source links
- notes about verified amendments

The repository should prefer small commits so reviewers can inspect one legal act or one source update at a time.

## Future search / RAG use

A consistent Markdown and metadata structure can later support:

- full-text search
- filtered search by domain, year, type, status, or tag
- retrieval-augmented generation over verified excerpts
- change detection dashboards
- citation-aware assistants

Any future RAG or assistant workflow must cite sources and must not present generated output as legal advice.

### Verified Excerpts vs Generated Output

Future search, RAG, and assistant workflows must keep a strict boundary between verified source text and model-generated text.

**Verified Excerpt** means text extracted directly from an official or primary source, such as Monitorul Oficial, ANRE, ISCIR, MF, ANAF, or another source recorded in this repository's source policy. A verified excerpt must include complete metadata: source URL or file, publication date when available, article or paragraph reference, extraction timestamp, and content hash. Any citation in downstream output must point back to the exact original source reference and must be marked as verified.

**Generated Output** means text produced by an AI model, including classification, summarization, drafting, restructuring, or interpretation. Generated output must be marked explicitly as generated, must not be cited as a primary source, and must be grounded in at least one verified excerpt when it makes a factual claim.

Boundary rule: no generated output may be presented as verified. If a model cannot anchor its output in a verified excerpt, the system must return `unverified - manual review required` instead of generating unsourced content.

Audit trail: every output, whether verified or generated, should carry provenance metadata: source URL or file, extraction timestamp, model version when generated, confidence score, and human review status.

## Official sources remain authoritative

Always verify against official or primary sources before relying on any information here. Relevant official sources may include:

- legislatie.just.ro
- Monitorul Oficial
- ministries and authorities with legal publication duties
- ISC, ANRE, ISCIR, IGSU, MDRAP/MDLPA or successor authority pages when applicable

## Text reuse policy

Official legislative, administrative, and judicial texts may be included when sourced from official public sources and when the repository records the source URL, official source name, and date checked.

Do not import third-party annotations, commercial database content, private summaries, standards, commentary, or paid/legal publisher material unless reuse rights are explicit.

If reuse rights are unclear, keep only metadata, source links, relationships, and TODO placeholders until a contributor verifies the source policy.


## Project infrastructure

- [Vision](VISION.md) — why this project exists and what can be built on top.
- [Roadmap](ROADMAP.md) — phased work plan and priorities.
- [Contributing](CONTRIBUTING.md) — source-backed contribution rules.
- [Import log](import-log/README.md) — provenance records for official text imports.

## Repository layout

```text
metadata/   JSON schema and source-tracking notes
legi/       Candidate laws and government decisions, one act per file later
normative/  Technical norms and prescriptions, one document per file later
ghiduri/    Guidance notes, procedures, and source maps
scripts/    Future validation scripts; none implemented in MVP
examples/   Markdown and metadata templates
```

## MVP status

This MVP contains structure, templates, metadata schema, contribution rules, and initial source-backed metadata entries.

Full official legal text may be added act-by-act after source verification, preserving article numbering and avoiding third-party annotations or commentary.
