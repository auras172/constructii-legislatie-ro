# English Overview

`constructii-legislatie-ro` is an open, Git-based knowledge repository for Romanian construction-related legislation and technical regulation.

The repository is built for humans, Git review, search systems, and AI agents. It stores structured metadata, provenance records, relationship data, validation artifacts, and selected official-text imports with clear boundaries.

## What This Project Does

This project helps contributors and downstream tools inspect Romanian construction regulation without relying on conversational memory or unverified summaries.

It provides:

- metadata for tracked laws, decisions, orders, norms, and technical prescriptions;
- Markdown files for each tracked act;
- import logs that record source provenance and verification caveats;
- relationship metadata between acts where evidence supports the link;
- generated graph, health, and manifest artifacts;
- validation scripts for metadata, Markdown hygiene, citation anchors, official-text markers, and source URLs.

## What This Project Is Not

This repository is not an official legal source and does not provide legal advice.

Official sources such as Portal Legislativ, Monitorul Oficial, ministries, regulators, and public authorities remain authoritative. Repository metadata, generated artifacts, contributor notes, and AI-generated output must not be treated as official legal text or legal interpretation.

## How Contributions Work

Contributions should be small, source-backed, and reviewable.

Good contributions include:

- checking official source URLs;
- improving metadata records;
- documenting provenance in import logs;
- adding metadata-only entries for confirmed official acts;
- reviewing relationships between acts;
- improving documentation and validation scripts.

Contributors should avoid:

- copying text from unofficial mirrors or commercial legal databases;
- importing full legal text without explicit scope and review;
- adding legal interpretation as fact;
- adding weak relationships based only on topic similarity;
- mixing unrelated changes in one pull request.

## AI-Assisted Contributions

AI agents are welcome when they follow the repository rules.

Agents should:

- start from the current `origin/main`;
- verify sources before editing;
- keep one task per branch and pull request;
- use official sources only for provenance claims;
- run the relevant validation scripts before opening a pull request;
- clearly state any remaining uncertainty.

AI output is assistance, not authority. If a claim cannot be grounded in repository files or official sources, it should be marked as unverified.

## Start Here

- [README.md](../README.md) - main project overview.
- [CONTRIBUTING.md](../CONTRIBUTING.md) - contribution workflow and source-backed rules.
- [AGENTS.md](../AGENTS.md) - rules for AI-assisted work.
- [VISION.md](../VISION.md) - long-term project direction.
- [ROADMAP.md](../ROADMAP.md) - current roadmap.
- [INDEX.md](../INDEX.md) - tracked legislation status matrix.
- [docs/source-audit-workflow.md](./source-audit-workflow.md) - official source URL audit workflow.
- [docs/ai-contract.md](./ai-contract.md) - AI behavior contract.
