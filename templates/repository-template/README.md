# {{REPO_NAME}}

See [INDEX.md](./INDEX.md) for the current legislation status matrix.

**{{DESCRIPTION}}** — open-source, versioned legislation structured for humans, Git, search, and AI.

This repository tracks {{DOMAIN}} legal acts, norms, procedures, and regulatory references in a Git-friendly format.

We invite developers, engineers, architects, legal researchers, AI builders, and domain professionals to contribute. If you want to help structure this regulation for humans and machines, open an issue or contact us at {{CONTACT_EMAIL}}.

This project is MIT-licensed. It is a technical documentation project, **not legal advice** and **not an official government source**.

## Purpose

The goal is to track {{DOMAIN}}-related legal acts, norms, procedures, and guidance in a structured Markdown format that works well with Git history, review workflows, search, and future retrieval systems.

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

- practitioners in the {{DOMAIN}} field
- researchers who need a Git-readable index
- AI builders who need structured, provenance-tracked legal content
- technical due-diligence researchers

## Repository layout

```text
metadata/       JSON schema and per-act metadata files
legi/           Candidate laws and decisions, one act per file
import-log/     Provenance records for official text imports
citations/      Generated citation indexes
cross-references/ Detected cross-act relationships
reports/        Generated health and changelog reports
docs/           Conventions, metadata model, contributor guides
scripts/        Validation and generation scripts
wiki/           Contributor wiki pages
```

## How to use

1. Browse the [INDEX.md](./INDEX.md) status matrix.
2. Read [DISCLAIMER.md](./DISCLAIMER.md) — this is not legal advice.
3. For contributing, see [AGENTS.md](./AGENTS.md) and [CONTRIBUTING.md](./CONTRIBUTING.md) if present.
4. Run local validation: `node scripts/validate-metadata.mjs` and `node scripts/check-markdown-hygiene.mjs`.

## Official sources remain authoritative

Always verify against official or primary sources before relying on any information here.

## Future search / RAG use

A consistent Markdown and metadata structure can later support full-text search, RAG, citation-aware assistants, and change detection. Any such workflow must cite sources and must not present generated output as legal advice.

## Project infrastructure

- [Vision](VISION.md) — why this project exists.
- [Roadmap](ROADMAP.md) — phased work plan and priorities.
- [Disclaimer](DISCLAIMER.md) — not legal advice, not official source.
- [Import log](import-log/) — provenance records for official text imports.
