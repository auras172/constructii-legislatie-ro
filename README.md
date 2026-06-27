# Open Construction Law Romania

**Romanian Construction Knowledge Base** — a Git-friendly, open-source knowledge base for Romanian construction legislation, norms, procedures, and regulatory references.

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

## Official sources remain authoritative

Always verify against official or primary sources before relying on any information here. Relevant official sources may include:

- legislatie.just.ro
- Monitorul Oficial
- ministries and authorities with legal publication duties
- ISC, ANRE, ISCIR, IGSU, MDRAP/MDLPA or successor authority pages when applicable

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

This MVP contains structure, templates, metadata schema, contribution rules, and placeholder candidate lists only.

It intentionally does **not** include full legal text. Current text / excerpts are TODO placeholders until reuse rights and official source references are verified.
