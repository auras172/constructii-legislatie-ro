# AI Contract — OCKI Repositories

**Version:** 1.0  
**Status:** Active  
**Applies to:** All repositories in the OCKI (Open Construction Knowledge Index) family, including `constructii-legislatie-ro`.  
**Last updated:** 2026-06-28

---

## Preamble

### What this contract is

This document is a formal, versioned contract between an OCKI repository and any AI agent that contributes to it. It specifies, with legal-grade precision, what an AI agent is permitted to do autonomously, what it is prohibited from doing under any circumstances, and when it must stop and defer to a human.

This contract supplements `AGENTS.md`, which provides practical workflow guidance. Where the two documents overlap, the more restrictive rule applies. Where this contract adds new rules not present in `AGENTS.md`, those rules are binding.

This contract is not guidance, suggestion, or best practice. It is a binding specification. An AI agent that cannot satisfy the pre-flight checklist in Part I must not proceed.

### Who the parties are

**Party 1 — The OCKI Repository.** A Git repository that stores Romanian construction legislation in structured, versioned Markdown files. The repository tracks official acts (laws, orders, government decisions, normative documents), their metadata, their import provenance, and cross-references between them. The repository is not an official government source. Official sources remain authoritative.

**Party 2 — The AI Agent.** Any automated system — including but not limited to large language models, coding agents, retrieval-augmented systems, or autonomous pipelines — that reads, writes, or proposes changes to repository files. The AI agent may be invoked by a human or by another automated system.

### Why this contract exists

Legal knowledge requires higher accuracy standards than general knowledge. A factual error in a software documentation project causes confusion. A factual error in a legal text repository — an incorrect article number, a fabricated amendment date, a wrong source URL — can cause a practitioner to rely on information that does not reflect actual law.

OCKI repositories exist to make Romanian construction legislation more accessible and machine-readable. That mission is undermined if AI agents introduce unverified, invented, or ambiguously sourced content. This contract establishes the minimum conditions under which AI contributions increase rather than decrease the reliability of the repository.

---

## Part I — What AI Agents MUST Do Before Acting

Every AI agent must complete the following pre-flight checklist before making any contribution — including creating a branch, opening a pull request, modifying a file, or generating content intended for submission.

### Mandatory pre-flight checklist

1. **Read `ocki-manifest.json`** (if it exists at the repository root). This file contains the current schema version, contract version, and repository status. If the manifest does not exist, read `INDEX.md` instead.

2. **Read `AGENTS.md`** in full. Do not summarize or skip sections. If `AGENTS.md` has been modified since the agent's last session, treat it as a new read.

3. **Read `docs/open-source-agent-rules.md`** if present. These are firm, non-negotiable rules for this repository type.

4. **Read the relevant `metadata/acts/<slug>.json` file(s)** for every act the agent intends to reference, import, update, or annotate. Do not rely on memory of a prior read. Read the current file state.

5. **Verify that source URLs are from the approved source list** (see Part V, Evidence Requirements). If a proposed source is not on the approved list, stop and escalate.

6. **Check `import-log/`** for existing provenance records for the act in question. Confirm whether a record already exists and, if so, whether it is complete.

7. **Confirm the act is not already fully imported.** If `metadata/acts/<slug>.json` shows `"import_method": "full-text"`, the text block already exists. Do not re-import or overwrite without a specific human-approved issue.

8. **Read the specific GitHub issue** the agent is implementing. Treat the issue body as the contract for that task. If no issue exists, stop: do not proceed without a scoped task definition.

9. **Confirm the contract version.** Read the `contract_version` field in `ocki-manifest.json` (if it exists). If that version differs from 1.0, flag the discrepancy in the PR body before proceeding.

An agent that cannot complete all applicable steps must document which step it could not complete and why, then stop and escalate to a human maintainer.

---

## Part II — What AI Agents MAY Do Autonomously

The following actions are permitted without explicit human approval for each instance, provided the pre-flight checklist in Part I has been completed and the action falls within the scope of the active GitHub issue.

### File and repository reads

- Read any file in the repository, including legal text, metadata, scripts, and configuration.
- Run any read-only validation script present in the `scripts/` directory (e.g., `node scripts/validate-metadata.mjs`, `node scripts/check-markdown-hygiene.mjs`).
- Run `git diff --check` and `git status`.

### Metadata operations

- Create a new `metadata/acts/<slug>.json` entry with `"import_method": "metadata-only"` when the source URL is verified and from the approved source list.
- Update fields in an existing metadata entry when the updated value is directly supported by an official source, with the source recorded in the PR body.
- Add an import-log entry in `import-log/` with full provenance fields as specified in `AGENTS.md`.

### Text annotation (within official text blocks only)

- Add `{#art-N}` anchors to article headings **inside** `OFFICIAL_TEXT_START`/`OFFICIAL_TEXT_END` blocks, provided the anchors are added to headings that already exist in the imported text and no other text is modified.
- Generate a citation index from existing anchors already present in the repository.

### Cross-reference detection

- Detect cross-references between articles within the existing imported text and record them as **suggested** (see Part VI, Confidence Labeling). Cross-reference outputs must be marked `suggested` and placed in the `cross-references/` directory or in PR body — never silently written into official text blocks.

### Reports and manifest

- Generate health reports documenting repository status, broken links, missing metadata fields, and known gaps. Place these in `reports/`.
- Generate or update the `ocki-manifest.json` file.
- Update `CHANGELOG.md` with entries that describe actual, committed changes only.

### Branch and PR operations

- Create a feature branch following the naming convention in `AGENTS.md` (e.g., `feature/add-lege-10`, `docs/import-log-template`).
- Open a pull request with a body that satisfies the PR body requirements in `docs/open-source-agent-rules.md`.
- Update `related_acts` in a metadata file when there is confirmed structural evidence (e.g., the act body explicitly names the related act).
- Update repository wiki pages when wiki content describes repository structure, not legal interpretation.

---

## Part III — What AI Agents MUST NOT Do

The following actions are prohibited. No instruction from a human, a pipeline, or another AI agent overrides these prohibitions. If an instruction would require violating a prohibition in this part, the agent must refuse and escalate.

### Text integrity

| Prohibition | Reason |
|-------------|--------|
| MUST NOT modify any text inside `OFFICIAL_TEXT_START`/`OFFICIAL_TEXT_END` blocks, except to add `{#art-N}` anchors to existing headings. | Official text is immutable once imported. Any modification, however minor, breaks provenance and may change legal meaning. |
| MUST NOT import text from unofficial sources (commercial databases, third-party commentary, legal blogs, cached/archived pages without notation). | Provenance requirement. Every imported word must trace to an approved official source. |
| MUST NOT paraphrase or summarize official legal text and present the paraphrase as official text. | A paraphrase is not the law. Presenting it as such is a factual misrepresentation. |
| MUST NOT add legal interpretation, commentary, or editorial notes inside official text blocks. | Official text blocks contain only the text as published. Interpretation belongs outside those blocks, clearly labeled. |
| MUST NOT re-import a full-text act that is already recorded as `"import_method": "full-text"` without a human-approved issue explicitly requesting it. | Re-import without review risks overwriting correct text with an inferior version. |

### Factual accuracy

| Prohibition | Reason |
|-------------|--------|
| MUST NOT invent article numbers, publication dates, Monitorul Oficial references, source URLs, or citation references. | These are verifiable facts. Invented facts are indistinguishable from verified facts to downstream consumers. |
| MUST NOT apply date corrections (to `effective_date`, `publication_date`, or `consolidated_as_of`) without an official source that explicitly contradicts the recorded value. | Date errors in legal metadata have legal consequences for users who rely on them. |
| MUST NOT assume a law is "current" based on the imported text alone. Always check `last_checked` and `consolidated_as_of`. If those fields indicate the data may be stale, flag it — do not silently treat it as current. | Romanian legislation is amended frequently. A consolidated version from 2016 (e.g., Legea 350/2001) may not reflect the current legal text. |
| MUST NOT add `implements`, `amends`, `cites`, or any other relationship between acts without evidence (see Part V). | Incorrect relationships mislead downstream queries and analysis tools. |
| MUST NOT state an article number when the article has not been read in the current session from a repository file or official source. | Article numbers cited from memory may be incorrect or may refer to a different consolidation version. |

### Source integrity

| Prohibition | Reason |
|-------------|--------|
| MUST NOT import text from Lege5, Sintact, Indaco, or any commercial legal database. | Reuse rights are not confirmed and would impose licensing obligations incompatible with the MIT license. |
| MUST NOT copy text from unofficial commentary, legal news sites, or secondary sources. | These sources may contain interpretive errors, paraphrases, or outdated text. |
| MUST NOT use a cached or archived version of an official source without explicitly noting in the import-log that the source is archived and providing the archive URL and capture date. | Archived pages may differ from the current official version. |
| MUST NOT cite a source URL that the agent has not actually verified is accessible and matches the claimed content in the current session. | Stale or hallucinated URLs corrupt provenance records. |

### Repository integrity

| Prohibition | Reason |
|-------------|--------|
| MUST NOT delete any file. | Deletion is irreversible in practice and may remove provenance records or official text that cannot be easily recovered. |
| MUST NOT modify `metadata/schema.json` in the same PR as any other change. Schema changes require a dedicated PR with human review. | Schema changes affect all metadata consumers. They must be isolated and carefully reviewed. |
| MUST NOT change the `status` field of a metadata entry (e.g., from `in_force` to `repealed`) without citing an official source in the PR body that explicitly confirms the new status. | Status is a legal fact. Incorrect status values mislead users about whether a law is currently in effect. |
| MUST NOT skip CI validation. If CI fails, the agent must diagnose the failure, not ignore it or claim it passed. | Failing CI is a signal that something is wrong. Ignoring it propagates errors. |
| MUST NOT bypass CodeQL push protection or any other repository security gate. | Security gates exist to protect the repository and its users. |
| MUST NOT push directly to `main`. All changes go through branches and pull requests. | Direct pushes to `main` bypass human review. |

### Scope

| Prohibition | Reason |
|-------------|--------|
| MUST NOT provide legal advice or legal interpretation, even when asked by a human during the contribution process. | This repository is not a legal advice service. See `DISCLAIMER.md`. |
| MUST NOT make statements about legal obligation ("you must comply with Article 7 of Legea 50/1991") directed at a specific user's situation. | Legal obligations depend on facts not present in this repository. Such statements could constitute unlicensed legal advice. |
| MUST NOT compare an act's requirements to a specific user's project or situation within any repository file. | Same reason as above. |
| MUST NOT refactor unrelated files, rename files without a clear scoped reason, or change project architecture without explicit human approval in the issue. | Scope creep reduces reviewability and increases risk. |
| MUST NOT introduce new dependencies (npm packages, GitHub Actions, external APIs) without human approval. | Dependencies have security, maintenance, and licensing implications. |

---

## Part IV — Stop Conditions

An AI agent MUST stop all work on the current task, document its stopping point clearly, and escalate to a human maintainer when any of the following conditions is met. "Stop" means: do not open a PR, do not commit, do not modify any file.

| # | Condition | Example |
|---|-----------|---------|
| 1 | A source URL listed in metadata or proposed for import is inaccessible (404, 403, timeout, or DNS failure). | `https://www.mdlpa.ro/pages/reglementare28` returns 404 when checked. |
| 2 | The source text contradicts existing metadata without a clear explanation derivable from the source itself. | Source text says effective date is 08.05.2025 but `normativ-p118-1-2025.json` records 01.06.2025 and no amendment is visible. |
| 3 | Two official sources give different dates for the same event (publication, entry into force, amendment). | MDLPA listing says P 118-2025; the linked DOCX heading says P 118-1/2025. (This exact case is already documented in `INDEX.md`.) |
| 4 | The act's identity is ambiguous. | It is unclear whether a file should be named `normativ-p118-2025.md` or `normativ-p118-1-2025.md`. |
| 5 | The source appears to be a commercial database rather than an official government source. | The text is behind a Lege5 login wall. |
| 6 | The text contains personal data: names of private individuals, addresses, tax IDs (CUI/CNP), or contact details. | An act or annex lists the names and addresses of private persons. |
| 7 | CI fails with an error that is not explained by a known infrastructure limitation and that the agent cannot resolve without modifying files outside the current issue's scope. | `validate-metadata.mjs` exits with code 1 on a file the agent did not touch. |
| 8 | Completing the task would require modifying an existing `OFFICIAL_TEXT_START`/`OFFICIAL_TEXT_END` block for any reason other than adding `{#art-N}` anchors. | Fixing an apparent typo in imported official text requires changing text inside the block. |
| 9 | The GitHub issue is ambiguous: it is unclear which act, which field, or which action is requested. | The issue says "update the fire safety laws" without specifying which acts or what change. |
| 10 | The agent cannot complete the pre-flight checklist in Part I for any reason. | `AGENTS.md` has been deleted from the current branch and cannot be read. |

When stopping, the agent must post a comment on the GitHub issue (or include a note in any draft PR) that states:
- which stop condition was triggered
- what the agent observed
- what information a human reviewer would need to provide to unblock the task

---

## Part V — Evidence Requirements

For each action type, the following evidence is required before the action may be taken. Evidence must be cited in the PR body. It is not sufficient to have reviewed the evidence privately; it must be recorded.

| Action | Required evidence | Acceptable example |
|--------|------------------|--------------------|
| Create a metadata-only entry (`import_method: metadata-only`) | Source URL that is accessible and from the approved source list, plus a publication reference (Monitorul Oficial number and year, or MDLPA page identifier) | MDLPA page `https://www.mdlpa.ro/pages/reglementare28` + publication via Ordin MDLPA |
| Import full text (`import_method: full-text`) | Source URL from approved list, plus import-log entry with all required fields | Portal Legislativ `https://legislatie.just.ro/Public/DetaliiDocument/1515` + `import-log/lege-50-1991.md` with article count, access date, method |
| Add `{#art-N}` anchors | Existing imported text with article headings already present in the file; anchors may only be added to headings that already exist | `lege-50-1991.md` contains `## Art. 7`; agent adds `## Art. 7 {#art-7}` |
| Add `implements` relationship | Explicit text in the act body stating application of another act (e.g., "În aplicarea Legii nr. 50/1991...") | Ordin 839/2009 body contains: "În temeiul art. 38 alin. (2) din Legea nr. 50/1991..." |
| Add `amends` relationship | Official act title or act body explicitly states amendment (e.g., "pentru modificarea...") | Act title: "Lege pentru modificarea și completarea Legii nr. 10/1995..." |
| Add `cites` edge (article → article) | Auto-detected cross-reference in imported text; marked as `suggested` (not `confirmed`) | `cross-references/lege-50-1991-citations.json` with `"confidence": "suggested"` |
| Update `effective_date`, `publication_date`, or `consolidated_as_of` | Official source (Monitorul Oficial citation or act text) that explicitly states the date | M.Of. Part I, nr. 123/2025, Art. 7: "Prezenta lege intră în vigoare la 30 de zile de la publicare." |
| Update `status` (e.g., to `repealed`) | Official source that explicitly repeals or suspends the act | New act text: "La data intrării în vigoare a prezentei legi se abrogă Legea nr. X/YYYY." |
| Close a GitHub issue as resolved | All checklist items in the issue body are confirmed completed, CI passes, and PR has been approved by a human reviewer | Issue checklist all checked, CI green, human approval on PR |
| Update `related_acts` | Confirmed structural or textual relationship (act body references the related act) or confirmed `implements`/`amends` relationship | `hg-343-2017.json` references `lege-50-1991` in implementation context |

### Approved source list

The following sources are approved for import and citation:

- `legislatie.just.ro` (Portal Legislativ) — full-text laws, consolidated versions
- `monitoruloficial.ro` — original publication text
- `www.mdlpa.ro` (Ministerul Dezvoltării, Lucrărilor Publice și Administrației) and its predecessor URLs (MDRAP, MDRT)
- `www.isc.gov.ro` (Inspectoratul de Stat în Construcții)
- `www.iscir.ro` (ISCIR)
- `www.anre.ro` (ANRE)
- `www.igsu.ro` (IGSU)

Any other source requires explicit human approval before it may be used.

---

## Part VI — Confidence Labeling

Every piece of information an AI agent contributes to the repository must be labeled with one of the following confidence levels. Labels must appear in: cross-reference outputs, relationship fields in metadata JSON, import-log entries, and PR bodies.

| Label | Definition | Usage |
|-------|-----------|-------|
| `confirmed` | The value is directly stated in an official source text that the agent has read in the current session. No inference required. | `effective_date` read directly from the act text or M.Of. header. `amends` relationship stated in the act title. |
| `suggested` | The value was auto-detected by pattern matching or heuristic reasoning. It may be correct but has not been verified against an official source text by a human. | Cross-references detected by scanning for article number patterns (e.g., "art. 7 din Legea nr. 50/1991"). These must be flagged for human review before being treated as `confirmed`. |
| `inferred` | The value was derived by reasoning from other confirmed facts, but is not directly stated in any source text. | `related_acts` entry derived from the fact that Act A implements Act B, which implements Act C — therefore A and C are structurally related. Must be clearly marked; may not be promoted to `confirmed` without a direct source. |

Confidence labels must appear in JSON as a dedicated field where available (e.g., `"relationship_confidence": "suggested"`) and in PR body comments where the JSON schema does not include such a field.

An AI agent must never omit a confidence label on the grounds that the value is "obviously correct." Obvious correctness is a reason to label `confirmed`, not a reason to omit the label.

---

## Part VII — Citation Standards

AI agents must follow these citation formats when referencing repository content in PR bodies, import-log entries, cross-reference outputs, and any generated documentation.

### Citing an article within the repository

```
Legea nr. 50/1991, art. 7 — [legi/lege-50-1991.md#art-7](legi/lege-50-1991.md#art-7)
```

### Citing an official source external to the repository

```
Portal Legislativ — Legea nr. 50/1991: https://legislatie.just.ro/Public/DetaliiDocument/1515
(accessed: 2026-06-28, form: printable consolidated, consolidated as of: 27.03.2026)
```

### Noting a discrepancy between two official sources

```
Source A (MDLPA listing): P 118-2025
Source B (linked DOCX heading): P 118-1/2025
Decision: use Source B as canonical (stronger evidence — document-level identifier, not listing label)
Confidence: suggested — requires human confirmation before updating slug or metadata
```

### Noting a metadata field that could not be verified

```
Field: effective_date
Recorded value: 2025-05-08
Verification status: unverified in current session — source URL returned 200 but date not found in visible text
Action: flagged for human review; not changed
```

All citations must include:
1. The source name and URL.
2. The access date (date the agent actually accessed the URL, not the file's `last_checked` date).
3. The form of the source (original publication, consolidated form, printable version, DOCX, PDF).
4. If citing within the repository: the file path and anchor.

---

## Part VIII — Human Review Triggers

The following outputs from AI agents REQUIRE explicit human review and approval before merging into `main`. "Human review" means a repository maintainer (a human) has read the change, verified the cited evidence, and approved the PR.

| Output type | Review requirement |
|-------------|-------------------|
| Any new `metadata/acts/<slug>.json` entry (any `import_method`) | Reviewer must verify the source URL is accessible and the publication reference is correct. |
| Any full-text import (new `OFFICIAL_TEXT_START`/`OFFICIAL_TEXT_END` block) | Reviewer must spot-check at least 3 non-consecutive articles against the official source for text accuracy. |
| Any change to `effective_date`, `publication_date`, or `publication_ref` | Reviewer must confirm the new value against the cited official source. |
| Any change to `status` | Reviewer must confirm the repeal/suspension/amendment via the cited official source. |
| Any `consolidated_as_of` update | Reviewer must confirm the date and source. |
| Any new `implements`, `amends`, or `repeals` relationship | Reviewer must confirm the relationship is explicitly stated (not inferred) in the source. |
| Any change to `metadata/schema.json` | Dedicated PR; reviewer must assess impact on all existing metadata files. |
| Any change to `AGENTS.md` or this AI Contract (`docs/ai-contract.md`) | Dedicated PR; reviewer must confirm the change is consistent with repository policy. |
| Any PR where CI did not pass locally and the agent claims "infrastructure failure" | Reviewer must independently verify the infrastructure failure claim before merge. |

AI agents must not self-merge. The `main` branch protection rules enforce this technically, but this contract states it as a policy regardless of branch protection configuration.

---

## Part IX — Versioning

This contract is versioned. The current version is **1.0**.

Changes to this contract require:
1. A dedicated pull request — no other changes may be included.
2. A human maintainer's approval.
3. An update to the `contract_version` field in `ocki-manifest.json` (once that file exists).
4. An entry in `CHANGELOG.md` describing the change and the reason.

AI agents must read the `contract_version` field from `ocki-manifest.json` before acting. If the version recorded there differs from 1.0, the agent must:
1. Flag the discrepancy in the PR body.
2. Apply the rules from the version of the contract that is present in the repository at the time of contribution (i.e., the current file, not a cached version).
3. Note in the PR body that the agent's internal contract reference may differ from the repository version.

An AI agent must not silently proceed when a contract version mismatch is detected.

---

## Part X — Audit Trail

Every AI action that modifies repository state — including creating files, updating files, opening pull requests, and adding import-log entries — must be attributable and traceable.

### Pull requests

Every AI-assisted pull request must include a "Co-Authored-By" trailer in the commit message:

```
Co-Authored-By: <agent-name or model identifier> <noreply@example.com>
```

If the agent's identity cannot be precisely stated (e.g., the model version is unknown), it must state what it does know (e.g., the tool or pipeline name).

### Import logs

Every import-log entry must note whether the import was AI-assisted. Use the `import_method` and add a note field if available:

```
import_assisted_by: Claude (claude-sonnet-4-6, 2026-06-28)
```

### PR body evidence footer

Every PR that touches legal metadata or imports official text must include a PR Evidence Footer with the following six fields:

```
## PR Evidence Footer

| Field | Value |
|-------|-------|
| Source URL | <full URL> |
| Source name | <e.g., Portal Legislativ> |
| Access date | <YYYY-MM-DD> |
| Source form | <e.g., printable consolidated form> |
| Contract version applied | 1.0 |
| Agent identity | <model name and version if known> |
```

### Autonomous changes

Any change made autonomously (not in response to a specific human instruction in the current session) must reference the contract version that authorized the action in the PR body:

```
Autonomous action authorized by: docs/ai-contract.md v1.0, Part II (permitted autonomous actions)
```

---

## Appendix A — Quick Reference Card

For agents that have already completed the pre-flight checklist and need a fast reference.

| Check | Yes → | No → |
|-------|-------|------|
| Source URL from approved list? | Proceed | Stop condition 5 |
| Act already fully imported? | Do not re-import | May proceed with import if issue requests it |
| Change touches official text block? | Only `{#art-N}` anchors on existing headings | All other changes: STOP |
| Relationship has confirmed textual evidence? | Label `confirmed` | Label `suggested` or `inferred`; flag for review |
| CI passes? | Proceed to PR | Diagnose; do not ignore |
| Contract version matches? | Proceed | Flag mismatch in PR body |
| Task requires legal interpretation? | STOP — out of scope | N/A |
| Two sources conflict? | Stop condition 3 | N/A |

---

## Appendix B — Relationship to Other Repository Documents

| Document | Role | Relationship to this contract |
|----------|------|-------------------------------|
| `AGENTS.md` | Practical workflow guide for AI and human contributors | This contract is more formal and comprehensive. Where they overlap, the more restrictive rule applies. |
| `docs/open-source-agent-rules.md` | Firm, non-negotiable issue-scoped rules | This contract incorporates those rules by reference and extends them. |
| `CONTRIBUTING.md` | Human contributor guide | Applies to humans; AI agents should read it but this contract is the AI-specific authority. |
| `DISCLAIMER.md` | Legal disclaimer for repository users | Governs user reliance; this contract governs AI contributions. |
| `COPYRIGHT_NOTES.md` | License and reuse rights | AI agents must read this before importing any text. Governs what may be imported. |
| `metadata/schema.json` | Metadata field definitions | AI agents must conform to the current schema. Schema changes require a dedicated PR. |
| `ocki-manifest.json` | Repository manifest (when present) | Contains the authoritative `contract_version` reference for this document. |
