# GitHub for AI Contributors

A practical collaboration contract for humans and AI agents contributing to open-source projects.

This file explains how to contribute to `constructii-legislatie-ro` safely, consistently, and without inventing legal facts.

It is written for both:

- Human contributors
- AI coding agents such as ChatGPT, Claude, Codex, Gemini, Jules, Cursor, Windsurf, and similar tools

## Purpose

This repository is an open-source, versioned construction-legislation knowledge base for Romania.

It is not legal advice and not an official government source. Official sources remain authoritative.

This document helps contributors and AI agents work in the same predictable workflow: small issues, small branches, source-backed changes, validation, and human review.

## Core Principle

**One issue = one pull request.**

Do not solve multiple issues in the same PR.

A good contribution is small enough that the next reviewer can understand it quickly.

## Workflow

Use this flow for every contribution:

1. Pick or create an issue.
2. Read the project documentation.
3. Understand the requested task.
4. Create a feature branch.
5. Implement only the requested changes.
6. Run validation.
7. Open a pull request.
8. Wait for human review.
9. Merge only after approval and passing checks.

## Repository First

Before writing or editing anything, read:

1. `README.md`
2. `CONTRIBUTING.md`
3. `DISCLAIMER.md`
4. `VISION.md`, if present
5. `ROADMAP.md`, if present
6. `AGENTS.md`

Never assume project conventions from another repository.

If documentation conflicts with existing repository files, inspect the repository and ask for clarification instead of guessing.

## Branch Rules

Always create a feature branch.

Good branch names:

```text
feature/add-lege-10
fix/metadata-schema
docs/import-log-template
```

Bad branch names:

```text
main
master
changes
stuff
```

Do not push directly to `main`.

## Commit Rules

Good commit messages are specific:

```text
Add metadata for Legea 10/1995
Improve import log validation
Add article anchor convention
```

Bad commit messages are vague:

```text
update
fix
changes
misc
```

Prefer small commits that map to one clear change.

## Pull Requests

Each pull request should:

- solve one problem
- explain what changed
- explain why it changed
- cite official sources when legal metadata or text is touched
- include validation steps
- include a rollback plan if applicable

A pull request should not mix unrelated tasks such as metadata import, formatting cleanup, roadmap changes, and tooling changes unless explicitly approved.

## Human Review

AI does not approve its own work.

Every pull request requires human review before merge.

AI-generated changes must be treated as drafts until a human reviewer confirms that:

- the scope is correct
- the sources are real
- the text is not fabricated
- validation passes
- the contribution follows repository rules

## Validation

Before opening a pull request, run the available checks.

Current repository checks may include:

```sh
git diff --check
node scripts/validate-metadata.mjs
node scripts/check-markdown-hygiene.mjs
```

If a script does not exist on the current branch, say so in the PR instead of pretending it was run.

Never ignore failing CI.

If CI fails for infrastructure reasons, say that explicitly and provide local verification evidence.

## Scope Discipline

Implement only what the issue requests.

Do not:

- refactor unrelated files
- rename files without a clear reason
- change project architecture without approval
- introduce new dependencies without approval
- mass-import unverified text
- mix multiple legal acts into one PR unless the issue explicitly asks for that

Small, understandable contributions beat large, risky ones.

## Documentation

Documentation is part of the product.

Every meaningful change should update documentation when needed.

For this repository, documentation includes:

- source notes
- import logs
- metadata examples
- roadmap notes
- contributor instructions
- provenance records

Generated documentation must be factual and clearly source-backed.

## Source Integrity

Never invent facts.

Never fabricate legal text.

Never add legal interpretation as fact.

Always cite official or primary sources for legal acts, metadata, status, and source links.

Preferred source types include:

- Portal Legislativ / `legislatie.just.ro`
- Monitorul Oficial references
- official ministry or authority pages
- official ISC, ANRE, ISCIR, IGSU, MDLPA/MDRAP or successor authority pages where applicable

Do not copy from commercial legal databases, third-party annotations, commentary, paid publishers, private documents, or unclear sources unless reuse rights are explicit.

If a source or reuse right is uncertain, mark it as:

```text
TODO: verify official title/source
TODO: verify reuse rights
```

## Provenance

Every legal text import should record provenance.

Use `import-log/` when available.

A good import log records:

- source URL
- official source name
- date accessed
- import method
- source form, such as printable consolidated form
- article count
- annex count
- validation commands
- optional checksum of raw source text
- known limitations of mechanical conversion

The goal is not only to store text. The goal is to make text traceable.

## AI Agent Rules

AI agents must:

- respect repository conventions
- read relevant files before editing
- preserve formatting
- avoid unnecessary edits
- keep pull requests small
- explain assumptions
- cite official sources
- stop when requirements are ambiguous
- report unverified items honestly
- avoid broad rewrites unless explicitly requested

AI agents must not:

- hallucinate legal content
- invent article text
- silently change legal meaning
- claim official status for this repository
- approve or merge their own work
- hide failing validation
- expose secrets, tokens, or private data

## Legal Text Rules

When adding or updating legal text:

- preserve official article numbering
- keep one act per file
- record `source_url`, `official_source`, and `last_checked`
- avoid commentary inside the official text block
- use clear markers such as `OFFICIAL_TEXT_START` and `OFFICIAL_TEXT_END`
- keep notes and interpretation separate from imported official text

This repository may structure official-source text for Git and search, but it does not replace official sources.

## Reusable Prompts and Specification

- Use `PROMPTS.md` for standard AI-agent task prompts.
- See `docs/agents-md-specification-v1.md` for a reusable `AGENTS.md` structure that other repositories can adapt.
- See `docs/ai-contributor-onboarding.md` for a first AI-assisted pull request walkthrough.

## Philosophy

Open source is not about writing the most code.

It is about making it easy for the next contributor to continue the work.

Small, understandable contributions beat large, risky ones.

Predictable collaboration beats heroic coding.

A good AI-assisted contribution should leave the repository easier to trust, easier to review, and easier to extend.
