# OCKI Repository Specification v1

**Open Construction Knowledge Infrastructure — Repository Standard**

Version: 1.0.0
Status: Active
Applies to: All OCKI repositories

---

## Table of Contents

1. [Purpose and Scope](#1-purpose-and-scope)
2. [Required Directory Structure](#2-required-directory-structure)
3. [Required Root Files](#3-required-root-files)
4. [AGENTS.md Contract](#4-agentsmd-contract)
5. [PROMPTS.md Contract](#5-promptsmd-contract)
6. [Metadata Conventions](#6-metadata-conventions)
7. [Provenance Rules](#7-provenance-rules)
8. [Official Text Handling](#8-official-text-handling)
9. [Validation Scripts](#9-validation-scripts)
10. [CI Requirements](#10-ci-requirements)
11. [Wiki Structure](#11-wiki-structure)
12. [Issue Templates](#12-issue-templates)
13. [Pull Request Template](#13-pull-request-template)
14. [Health Reporting](#14-health-reporting)
15. [Citation and Cross-Reference Model](#15-citation-and-cross-reference-model)
16. [Relationship Model](#16-relationship-model)
17. [Repository Versioning Policy](#17-repository-versioning-policy)
18. [Repository Lifecycle](#18-repository-lifecycle)
19. [Human vs AI Responsibilities](#19-human-vs-ai-responsibilities)
20. [Definition of Done](#20-definition-of-done)

---

## 1. Purpose and Scope

### What OCKI Is

The **Open Construction Knowledge Infrastructure (OCKI)** is a family of open-source repositories that structure official legal, regulatory, normative, and technical texts for the Romanian construction sector in a machine-readable, Git-versioned, AI-ready format.

OCKI repositories are not legal publishers, not official government sources, and not legal-advice platforms. They are technical knowledge-structuring projects built on top of official public-domain sources.

### What Problem OCKI Solves

Romanian construction regulation is scattered across hundreds of official sources — Portal Legislativ, Monitorul Oficial, ministry websites, technical norm publishers — with no unified, structured, programmatically queryable format. Finding the current consolidated version of a regulation, understanding which acts modify which, or citing a specific article in a machine-readable way requires manual effort that scales poorly.

OCKI repositories solve this by:

- Structuring each act in one Markdown file with consistent formatting
- Attaching machine-readable JSON metadata to every act
- Recording full import provenance in a traceable import log
- Generating stable article-level anchors for citation
- Detecting and recording cross-act relationships
- Producing health reports and change logs through automated scripts
- Making all of the above available to humans, AI agents, and downstream systems through a predictable file layout

### Who Uses OCKI Repositories

| Consumer | How they use it |
|---|---|
| **Human contributors** (engineers, architects, lawyers, researchers) | Browse acts, verify sources, contribute improvements |
| **AI coding agents** (Claude, ChatGPT, Codex, Gemini, Jules, Cursor, Windsurf) | Read AGENTS.md, follow contribution workflow, open PRs |
| **RAG pipelines** | Consume Markdown act files within OFFICIAL_TEXT markers, cite article anchors |
| **Compliance tools** | Query metadata JSON, cross-reference relationships, check status fields |
| **Static site generators** | Read Markdown and metadata to build searchable public-facing sites |
| **Change-detection systems** | Diff Git history to detect regulatory updates |

### What Makes a Repository an OCKI Repository

A repository is an OCKI repository if and only if it satisfies all of the following:

1. It contains only official-source or metadata-only content — no invented or fabricated text.
2. Every imported text block is surrounded by `OFFICIAL_TEXT_START` / `OFFICIAL_TEXT_END` markers.
3. Every act has a JSON metadata file that validates against the OCKI metadata schema.
4. Every full-text import has a corresponding import-log entry.
5. It has a valid `AGENTS.md` file that follows the OCKI AGENTS.md contract (Section 4).
6. It passes all required CI checks defined in Section 10 on every PR.
7. It has a `DISCLAIMER.md` that clearly states the repository is not an official source and not legal advice.
8. Human review is required before any merge to `main`.

---

## 2. Required Directory Structure

```text
REPOSITORY ROOT
│
├── README.md                          REQUIRED — project identity and entry point
├── AGENTS.md                          REQUIRED — AI and human contributor contract
├── CONTRIBUTING.md                    REQUIRED — contribution workflow
├── DISCLAIMER.md                      REQUIRED — not legal advice, not official source
├── COPYRIGHT_NOTES.md                 REQUIRED — reuse rights and text-origin notes
├── LICENSE                            REQUIRED — project license (MIT recommended)
├── INDEX.md                           REQUIRED — status matrix of all tracked acts
├── ROADMAP.md                         REQUIRED — phased work plan
├── VISION.md                          RECOMMENDED — long-term project direction
├── PROMPTS.md                         REQUIRED — reusable task prompts for AI agents
├── CHANGELOG.md                       RECOMMENDED — human-readable project changelog
│
├── metadata/                          REQUIRED — machine-readable metadata
│   ├── schema.json                    REQUIRED — JSON Schema for act metadata
│   ├── acts/                          REQUIRED — one JSON file per tracked act
│   │   └── <slug>.json                REQUIRED — named by act slug
│   └── sources.md                     RECOMMENDED — policy on accepted official sources
│
├── legi/                              REQUIRED — Markdown act files (or equivalent domain dir)
│   ├── README.md                      REQUIRED — annotated act list with import status
│   └── <slug>.md                      REQUIRED — one file per act
│
├── normative/                         RECOMMENDED — technical norms (separate from laws)
├── ghiduri/                           RECOMMENDED — procedural guides and source maps
│
├── import-log/                        REQUIRED — provenance records for all text imports
│   ├── README.md                      REQUIRED — import-log format instructions
│   └── YYYY-MM-DD-<short-name>.md     REQUIRED — one file per import event
│
├── citations/                         REQUIRED — citation index
│   └── citation-index.json            REQUIRED — generated; maps slug → article anchors
│
├── cross-references/                  REQUIRED — relationship detection output
│   ├── README.md                      REQUIRED — explains auto-detection rules
│   ├── cross-references-raw.json      REQUIRED — generated; every raw match
│   ├── relationships-auto.json        REQUIRED — generated; aggregated per act
│   └── relationships-diff.md          REQUIRED — generated; human-readable diff
│
├── scripts/                           REQUIRED — validation and generation scripts
│   └── README.md                      REQUIRED — script inventory and usage
│
├── reports/                           REQUIRED — generated health and changelog outputs
│   ├── repository-health.json         REQUIRED — generated; machine-readable health
│   ├── repository-health.md           REQUIRED — generated; human-readable health
│   └── changelog.json                 REQUIRED — generated; act-level change history
│
├── examples/                          RECOMMENDED — templates for contributors
│   ├── lege-template.md               RECOMMENDED — Markdown act file template
│   └── act-metadata.example.json      RECOMMENDED — JSON metadata example
│
├── assets/                            OPTIONAL — images, logos, static resources
├── docs/                              REQUIRED — specification and documentation
│   └── ocki-repository-specification-v1.md  REQUIRED — this document
│
├── .github/                           REQUIRED — GitHub configuration
│   ├── workflows/
│   │   └── validate.yml               REQUIRED — CI validation workflow
│   ├── PULL_REQUEST_TEMPLATE.md       REQUIRED — PR template
│   └── ISSUE_TEMPLATE/                REQUIRED — issue templates directory
│
└── site/                              OPTIONAL — static site output (do not commit generated)
```

**Legend:** REQUIRED = must be present for the repo to be OCKI-compliant. RECOMMENDED = strongly advised. OPTIONAL = useful but not required.

---

## 3. Required Root Files

### 3.1 README.md

**Purpose:** Entry point for all contributors and consumers. Describes what the repository is, who it is for, and how to navigate it.

**Required sections:**

| Section | Content |
|---|---|
| Project title and one-line description | Name and purpose |
| Disclaimer statement | "Not legal advice. Not an official source." |
| Purpose | What problem this repo solves |
| Intended users | Who benefits from this repo |
| Why Git for this content | Version control rationale |
| Scope | What domain/acts are in scope |
| Repository layout | Brief directory map |
| Verified Excerpts vs Generated Output | Boundary rule for RAG consumers |
| Official sources remain authoritative | List primary sources |
| Text reuse policy | When full text may be imported |
| Project infrastructure links | Links to VISION, ROADMAP, CONTRIBUTING, import-log |

**Example structure:**

```markdown
# <Project Name>

See [INDEX.md](./INDEX.md) for the current status matrix.

**<One-line description>**

> This project is <LICENSE>-licensed. It is a technical documentation project,
> **not legal advice** and **not an official government source**.

## Purpose
...

## Intended users
...

## Official sources remain authoritative
...
```

### 3.2 AGENTS.md

**Purpose:** Operating contract for AI agents and human contributors. See Section 4 for the full contract specification.

### 3.3 LICENSE

**Purpose:** Legal terms under which the repository content is shared.

**Requirements:**
- MUST be present at root
- MUST use an OSI-approved open-source license (MIT recommended for documentation projects)
- MUST be consistent with the text reuse policy in `COPYRIGHT_NOTES.md`

### 3.4 DISCLAIMER.md

**Purpose:** Explicitly state that the repository is not an official source and not legal advice.

**Required content:**

```markdown
# Disclaimer

This repository is a technical documentation project. It is not an official
government source, not a legal publisher, and not legal advice.

Official legal texts remain authoritative as published in:
- Monitorul Oficial al României
- Portal Legislativ (legislatie.just.ro)
- Relevant ministry and authority websites

Always verify against official sources before relying on any information here.
```

### 3.5 COPYRIGHT_NOTES.md

**Purpose:** Record the reuse-rights status of imported text sources. Not a legal opinion; a technical provenance note.

**Required content:**
- Statement of which source categories are accepted (official public-domain texts)
- Statement of what is excluded (commercial databases, paid publishers, annotated editions, private documents)
- Policy on unclear reuse rights: use `TODO: verify reuse rights` placeholder; do not import until verified
- Per-act rights notes, if any specific acts have unusual terms

### 3.6 ROADMAP.md

**Purpose:** Phased work plan that makes current priorities and future scope visible to all contributors.

**Required sections:**
- Current phase and its goals
- Completed milestones
- Next milestones (with priority labels)
- Known gaps and deferred scope

### 3.7 INDEX.md

**Purpose:** The single authoritative status matrix of all tracked acts. AI agents MUST read this before claiming knowledge of what the repository contains.

**Required content:**
- Status matrix table (one row per act, columns: act name, domain, type, repo status, article count, annex count, consolidated-as-of date, source, Markdown file, metadata file, notes)
- AI-agent usage rules (how AI agents should use the index)
- Known gaps section

**Column definitions for status matrix:**

| Column | Type | Required |
|---|---|---|
| Act name (canonical citation) | string | Yes |
| Domain | enum from metadata schema | Yes |
| Type | enum from metadata schema | Yes |
| Repo status (`full-text importat` / `metadata-only` / `in progress`) | string | Yes |
| Article count | integer or `—` | Yes |
| Annex count | integer or `—` | Yes |
| Consolidated-as-of date | YYYY-MM-DD or `—` | Yes |
| Source URL | link | Yes |
| Markdown file path | link | Yes |
| Metadata file path | link | Yes |
| Notes | string | No |

---

## 4. AGENTS.md Contract

Every OCKI repository MUST have an `AGENTS.md` file that covers all sections in this contract.

### 4.1 Who Can Contribute

`AGENTS.md` MUST explicitly state that both humans and AI agents may contribute, and list specific AI agents that are expected to work in the repository (e.g., Claude, ChatGPT, Codex, Gemini, Jules, Cursor, Windsurf).

### 4.2 Required Reading Before Any Action

`AGENTS.md` MUST list the files an agent MUST read before making any change. Minimum required reading list:

1. `README.md`
2. `CONTRIBUTING.md`
3. `DISCLAIMER.md`
4. `AGENTS.md` (itself)
5. `PROMPTS.md` (if using a reusable prompt)
6. The specific GitHub issue being implemented
7. The specific files the issue mentions

### 4.3 Workflow

`AGENTS.md` MUST describe the contribution workflow:

```
Issue → branch → implementation → validation → pull request → human review → merge
```

The one-issue-one-PR rule MUST be stated explicitly.

### 4.4 Source Verification Requirements

`AGENTS.md` MUST state:
- Only official or primary sources are accepted (Portal Legislativ, Monitorul Oficial, official ministry/authority pages)
- Commercial databases, paid publishers, third-party annotations, and unclear sources are not accepted
- When a source or reuse right is uncertain, write `TODO: verify` — do not guess

### 4.5 What AI Agents MAY Do

AI agents MAY:
- Read any file in the repository
- Create or update metadata JSON files when backed by official sources
- Create or update Markdown act files when text is imported from an official source
- Add import log entries
- Update INDEX.md
- Run validation scripts
- Open pull requests
- Suggest relationship updates in `cross-references/`

### 4.6 What AI Agents MUST NOT Do

AI agents MUST NOT:
- Invent legal text or article content
- Fabricate source URLs, issue dates, or status values
- Silently change legal meaning in any imported text
- Claim official status for the repository or its content
- Approve or merge their own pull requests
- Hide failing validation output
- Modify `metadata/schema.json` without explicit human approval
- Import text from sources whose reuse rights are unclear
- Expose secrets, tokens, or private data
- Work on `main` directly
- Mix multiple issues in one PR

### 4.7 Stop Conditions

An AI agent MUST stop and leave a comment in the PR or issue when:
- The requested scope is ambiguous
- A source URL does not resolve or returns unexpected content
- Reuse rights for a text are unclear
- Validation scripts fail for non-trivial reasons
- The issue asks for something that conflicts with repository rules

### 4.8 Escalation Path

When an agent stops, it MUST:
1. State clearly what it could and could not do
2. List what remains unresolved and why
3. Tag the issue or PR with a `needs-human-review` label if labels are available
4. Not guess or fabricate content to fill the gap

### 4.9 Legal Text Rules

`AGENTS.md` MUST include legal text rules:
- Preserve official article numbering exactly
- One act per file
- Record `source_url`, `official_source`, and `last_checked` for every act
- No commentary inside the `OFFICIAL_TEXT_START` / `OFFICIAL_TEXT_END` block
- Notes and interpretation go outside the markers

### 4.10 Definition of Done

`AGENTS.md` MUST include or link to a definition of done. At minimum: source-backed change, narrow scope, validation run, docs updated if needed, no unrelated edits, human review pending or completed.

---

## 5. PROMPTS.md Contract

### 5.1 Purpose

`PROMPTS.md` provides reusable, copy-paste task prompts that constrain AI agents to the repository's rules before they begin work. A prompt is a small contract, not a magic instruction.

### 5.2 Required Sections

Each OCKI `PROMPTS.md` MUST include prompts for at least the following task types:

| Prompt name | Task it covers |
|---|---|
| Add new act metadata | Create a new metadata JSON and Markdown stub for a tracked act |
| Improve metadata | Update metadata fields with better source evidence |
| Import official text | Add full text of an act from an official source |
| Improve import provenance | Update or add import log entries |
| Verify a pull request | Review PR scope, sources, and validation (read-only) |

### 5.3 Prompt Structure

Each prompt MUST include:
- **Role statement:** what the agent is doing in this repo
- **Task:** what specifically is being asked
- **Read first:** list of files to read before acting
- **Scope:** what may be changed
- **Rules:** what constraints apply (sources, formatting, etc.)
- **Validation:** commands to run before opening a PR
- **Output:** what the agent should produce (summary, files changed, source URL, verification results, remaining TODOs)

### 5.4 Optional Prompts

RECOMMENDED additional prompts:
- Design or update article anchors
- Generate or update cross-references
- Update repository health report
- Draft a changelog entry

---

## 6. Metadata Conventions

### 6.1 Schema Location

The canonical schema MUST be at `metadata/schema.json` and MUST be a valid JSON Schema (draft 2020-12 or later).

### 6.2 Required Fields

Every metadata file MUST include all of the following fields:

| Field | Type | Constraint |
|---|---|---|
| `title` | string | minLength: 1; exact official title |
| `type` | string | enum (see 6.4) |
| `domain` | string | enum (see 6.5) |
| `status` | string | enum: `active`, `repealed`, `partially_repealed`, `unknown` |
| `source_url` | string | minLength: 1; official source URL only |
| `last_checked` | string | format: date (YYYY-MM-DD) |
| `tags` | array of strings | at least one element; uniqueItems: true |

### 6.3 Optional Fields (with semantics)

| Field | Type | Description |
|---|---|---|
| `short_title` | string | Common short-form title |
| `canonical_citation` | string | Human-readable citation (e.g. "Legea nr. 50/1991") |
| `number` | string or integer | Official act number |
| `year` | string or integer | Year of issue |
| `issuer` | string | Full official name of issuing body |
| `issuing_body_kind` | string | enum: `parlament`, `guvern`, `minister`, `autoritate`, `other` |
| `topics` | array of strings | Secondary classification topics |
| `issue_date` | string (date) | Date signed or issued |
| `effective_date` | string (date) | Date entered into force |
| `publication_medium` | string | enum: `monitorul-oficial`, `portal-legislativ`, `minister`, `other` |
| `publication_date` | string (date) | Date of official publication |
| `official_source` | string | Human-readable source name |
| `official_detail_url` | string | Direct URL to official detail page |
| `version_kind` | string | enum: `original`, `republicat`, `consolidat`, `excerpt-only` |
| `consolidated_as_of` | string (date) | Date of consolidated form |
| `version` | string | Free-text version note |
| `article_count` | integer ≥ 0 | Number of articles in imported text |
| `annex_count` | integer ≥ 0 | Number of annexes in imported text |
| `import_method` | string | How text was imported (e.g. "printable HTML → Markdown") |
| `rights_note` | string | Reuse rights note for this specific act |
| `related_acts` | array of slugs | General relationship to other acts |
| `implements` | array of slugs | Acts this act implements or applies |
| `amends` | array of slugs | Acts this act amends |
| `amended_by` | array of slugs | Acts that have amended this act |

### 6.4 Enum Values for `type`

| Value | Meaning |
|---|---|
| `lege` | Law passed by Parliament |
| `ordonanta` | Government ordinance (OUG or OG) |
| `hotarare` | Government decision (HG) |
| `ordin` | Ministerial order |
| `normativ` | Technical normative (P, NP, GT, MC, etc.) |
| `ghid` | Technical or procedural guide |
| `procedura` | Formal procedure document |

### 6.5 Enum Values for `domain`

| Value | Domain |
|---|---|
| `autorizatii` | Building permits and authorization |
| `urbanism` | Spatial planning and urbanism |
| `executie` | Construction execution |
| `receptie` | Works reception |
| `calitate` | Construction quality |
| `isc` | State Construction Inspectorate |
| `anre` | Energy regulatory authority |
| `iscir` | Pressure equipment and lifts authority |
| `incendiu` | Fire safety |
| `nzeb` | Near-zero energy buildings |
| `fiscal` | Fiscal and tax aspects |
| `munca` | Labour and workplace safety |
| `mediu` | Environmental requirements |

### 6.6 Enum Values for `import_method`

Examples (not exhaustive; use a consistent short description):

- `printable HTML → Markdown`
- `PDF → text → Markdown`
- `manual transcription`
- `metadata-only` (no text imported)

### 6.7 Enum Values for `status`

| Value | Meaning |
|---|---|
| `active` | Currently in force |
| `repealed` | Fully repealed |
| `partially_repealed` | Some provisions repealed |
| `unknown` | Status could not be verified at last check |

### 6.8 Slug Naming Convention

Slugs MUST follow the pattern: `<type-abbrev>-<number>-<year>`

Examples: `lege-50-1991`, `hg-343-2017`, `oug-195-2005`, `ordin-839-2009`

For acts without a number, use a short descriptive identifier: `normativ-p118-1-2025`, `metodologie-mc001-2022`

Rules:
- Lowercase only
- Hyphens as separators, no underscores
- ASCII only, no diacritics
- Stable: do not rename a slug after it has been merged to `main`

### 6.9 Handling Missing or Uncertain Values

- MUST NOT guess or invent values for required fields
- For uncertain string values, use `"TODO: verify <field>"` as the value
- For uncertain dates, omit the field entirely rather than guessing
- For uncertain status, use `"unknown"`
- Record what is missing and why in the import log

### 6.10 Schema Versioning Policy

- The schema file MUST include a `$id` URI that encodes the repository name
- Breaking changes to the schema (removing required fields, changing enum values) MUST be announced in `ROADMAP.md` and MUST NOT be made without human approval
- Additive changes (new optional fields) SHOULD be noted in CHANGELOG.md
- Scripts MUST validate against the current schema before every PR

---

## 7. Provenance Rules

### 7.1 Import Log Requirement

Every imported official text MUST have a corresponding import log file in `import-log/`.

The import log file MUST be named: `YYYY-MM-DD-<short-act-name>.md`

The date is the date of the import event (when the text was captured from the source), not the date of the act.

### 7.2 Import Log Required Fields

Each import log entry MUST contain:

| Field | Description |
|---|---|
| Source URL | Exact URL from which text was retrieved |
| Official source name | Human-readable name (e.g. "Portal Legislativ — legislatie.just.ro") |
| Date accessed | YYYY-MM-DD |
| Import method | How text was captured (e.g. "printable HTML → Markdown") |
| Source form | Nature of the source (e.g. "printable consolidated form", "original version") |
| Article count | Number of article headings detected in imported text |
| Annex count | Number of annex headings detected |
| Validation commands | Commands run to verify the import (copy-paste exact output) |
| Known limitations | Any defects, encoding issues, formatting losses, or incomplete sections |

RECOMMENDED optional fields:
- Raw source checksum (SHA-256 of captured text before conversion)
- Notes on article numbering anomalies

### 7.3 What "Metadata-Only" Means

An act is `metadata-only` when:
- The official text is not imported into the repository (e.g., text is a paid normative, a PDF of hundreds of pages, or reuse rights are unclear)
- The repository tracks only the act's metadata fields (title, type, domain, status, source_url, etc.) and a stub Markdown file

For `metadata-only` acts:
- `import_method` MUST be `metadata-only` in the JSON metadata
- The Markdown file MUST contain a clear stub with the metadata YAML frontmatter and a note that full text is not imported
- An import log entry is NOT required, but a note in the Markdown file SHOULD explain why text was not imported

### 7.4 Source Verification Minimum Bar

Before recording any metadata or importing any text, a contributor MUST:

1. Confirm the act exists and is accessible at the recorded `source_url`
2. Confirm the title matches the official source exactly
3. Confirm the status (`active` / `repealed` / etc.) from the official source
4. Record the `last_checked` date as the date of this verification

A source is acceptable if it is one of:
- Portal Legislativ (legislatie.just.ro)
- Monitorul Oficial
- An official ministry or regulatory authority page (MDLPA, ISC, ANRE, ISCIR, IGSU, etc.)

A source is NOT acceptable if it is:
- A commercial legal database
- A paid legal publisher
- A third-party annotation or commentary
- A private document or internal circular
- A source whose origin cannot be verified

### 7.5 When Source Is Uncertain

If a source cannot be verified:
- Write `TODO: verify official title/source` in the relevant fields
- Do not import text
- Open an issue or add a note in the Markdown stub explaining the gap
- Do not present uncertain information as verified

---

## 8. Official Text Handling

### 8.1 OFFICIAL_TEXT_START / OFFICIAL_TEXT_END Markers

Every imported official text block MUST be wrapped in these markers on their own lines:

```
OFFICIAL_TEXT_START
...imported text...
OFFICIAL_TEXT_END
```

These markers MUST appear as plain text lines (not inside code blocks, not as HTML comments). The `check-official-text-integrity.mjs` script validates their presence and pairing.

### 8.2 What MAY Appear Inside the Markers

Inside the markers:
- The official text as imported from the official source
- Article headings with citation anchors (see Section 8.4)
- Empty lines that appeared in the original text
- HTML anchor tags added for citation (e.g. `<a id="art-1"></a>`)

### 8.3 What MUST NOT Appear Inside the Markers

Inside the markers, the following are strictly forbidden:
- Editorial commentary or annotation
- Summary paragraphs
- Legal interpretation
- Translator's notes
- Repository-specific formatting additions beyond anchors
- TODO comments
- Any text not present in the official source

All notes, interpretations, summaries, and editorial commentary MUST appear outside the markers, before `OFFICIAL_TEXT_START` or after `OFFICIAL_TEXT_END`.

### 8.4 Citation Anchor Format

Citation anchors MUST follow the format defined in `docs/anchor-convention.md`. The canonical format is:

| Structure | Anchor |
|---|---|
| Article N | `#art-N` |
| Article N, paragraph P | `#art-N-alin-P` |
| Article N, paragraph P, letter L | `#art-N-alin-P-lit-L` |
| Article N, point K | `#art-N-pct-K` |
| Annex N | `#anexa-N` |
| Annex N, article M | `#anexa-N-art-M` |

Anchors are applied as Markdown heading identifiers:

```markdown
### Art. 1 {#art-1}
```

Or, when the renderer does not support heading IDs:

```markdown
<a id="art-1"></a>

### Art. 1
```

### 8.5 No Modification Rule

Text inside `OFFICIAL_TEXT_START` / `OFFICIAL_TEXT_END` markers MUST NOT be modified for any reason other than:
- Correcting a mechanical conversion defect (misread character, broken paragraph join) — which MUST be noted in the import log
- Adding citation anchors

Corrections of substance (e.g., if the official source contains a typo) MUST NOT be made. The imported text must reflect the official source exactly. If the source contains an error, note it outside the markers.

---

## 9. Validation Scripts

All scripts MUST be located in `scripts/` and MUST be executable with Node.js 20 or later. Each script exits with code `0` on pass and non-zero on failure.

### 9.1 validate-metadata.mjs

**Purpose:** Validate every JSON file in `metadata/acts/` against `metadata/schema.json`.

**Pass criteria:**
- All required fields present
- All enum values match schema
- All date fields match YYYY-MM-DD format
- No unknown additional properties (if `additionalProperties: false` in schema)

**Fail criteria:** Any file has missing required fields, invalid enum, invalid date, or unknown properties.

**When to run:** Before every PR, in CI on every push and pull_request event.

### 9.2 check-markdown-hygiene.mjs

**Purpose:** Detect common Markdown formatting problems in act files.

**Pass criteria:**
- No trailing whitespace on lines
- No Windows-style line endings (CRLF)
- No HTML/CSS residue from web capture (e.g., `<style>`, `<script>`, inline `style=` attributes)
- No blank heading lines (`##` with no text)

**Fail criteria:** Any hygiene issue found in any file under `legi/`, `normative/`, or `ghiduri/`.

**When to run:** Before every PR, in CI.

### 9.3 check-metadata-parity.mjs

**Purpose:** Verify that every Markdown act file under `legi/` has a corresponding JSON metadata file under `metadata/acts/`, and vice versa.

**Pass criteria:** One-to-one correspondence between `legi/<slug>.md` and `metadata/acts/<slug>.json` for every slug.

**Fail criteria:** Any Markdown file without a metadata JSON, or any metadata JSON without a Markdown file.

**When to run:** Before every PR, in CI.

### 9.4 check-official-text-integrity.mjs

**Purpose:** Verify that every `OFFICIAL_TEXT_START` marker has a matching `OFFICIAL_TEXT_END` marker in the same file, and that no marker appears unpaired.

**Pass criteria:** Every `OFFICIAL_TEXT_START` is followed by exactly one `OFFICIAL_TEXT_END` with no nesting.

**Fail criteria:** Unpaired marker, nested markers, or markers in wrong order.

**When to run:** Before every PR, in CI.

### 9.5 validate-citation-anchors.mjs

**Purpose:** Verify that every article heading inside an `OFFICIAL_TEXT_START` / `OFFICIAL_TEXT_END` block has a citation anchor in the correct format.

**Pass criteria:** All article headings matching `Art. N` inside text blocks have an `{#art-N}` anchor or a preceding `<a id="art-N">` tag.

**Fail criteria:** Any article heading inside a text block is missing its anchor.

**When to run:** Before every PR, in CI.

### 9.6 generate-changelog.mjs

**Purpose:** Generate or update `reports/changelog.json` by comparing metadata files with Git history to detect additions, status changes, and source URL changes.

**Pass criteria:** Script completes and writes a valid JSON file to `reports/changelog.json`.

**Fail criteria:** Script errors out or produces invalid JSON.

**When to run:** In CI on every push to `main`.

### 9.7 repository-health-report.mjs

**Purpose:** Generate `reports/repository-health.json` and `reports/repository-health.md` with coverage metrics, score components, and warnings.

**Pass criteria:** Script completes and writes valid output files.

**Fail criteria:** Script errors out or produces invalid output.

**When to run:** In CI on every push to `main`.

### 9.8 detect-cross-references.mjs (RECOMMENDED)

**Purpose:** Scan text inside `OFFICIAL_TEXT_START` / `OFFICIAL_TEXT_END` blocks for references to other acts in the repository, and generate `cross-references/` output files.

**Pass criteria:** Script completes and writes `cross-references-raw.json`, `relationships-auto.json`, and `relationships-diff.md`.

**Fail criteria:** Script errors out.

**Output is suggestive only:** This script MUST NOT modify metadata files. Its output requires human review before any metadata relationship is recorded.

**When to run:** RECOMMENDED on every push to `main`.

### 9.9 generate-citation-index.mjs (RECOMMENDED)

**Purpose:** Generate `citations/citation-index.json` mapping every act slug to its article anchors with line numbers and URL fragments.

**Pass criteria:** Script completes and writes valid JSON.

**When to run:** RECOMMENDED on every push to `main`.

---

## 10. CI Requirements

### 10.1 Required Workflow File

Every OCKI repository MUST have `.github/workflows/validate.yml` that runs on both `pull_request` and `push` to `main`.

Minimum required workflow:

```yaml
name: Validate repository

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Check whitespace
        run: git diff --check

      - name: Validate metadata
        run: node scripts/validate-metadata.mjs

      - name: Check Markdown hygiene
        run: node scripts/check-markdown-hygiene.mjs

      - name: Check metadata/frontmatter parity
        run: node scripts/check-metadata-parity.mjs

      - name: Check official text integrity
        run: node scripts/check-official-text-integrity.mjs

      - name: Validate citation anchors
        run: node scripts/validate-citation-anchors.mjs

      - name: Generate changelog
        run: node scripts/generate-changelog.mjs

      - name: Generate repository health report
        run: node scripts/repository-health-report.mjs
```

### 10.2 Required Checks

All of the following MUST pass before a PR can be merged:

| Check | Script / command |
|---|---|
| Whitespace | `git diff --check` |
| Metadata validation | `validate-metadata.mjs` |
| Markdown hygiene | `check-markdown-hygiene.mjs` |
| Metadata/file parity | `check-metadata-parity.mjs` |
| Official text integrity | `check-official-text-integrity.mjs` |
| Citation anchor validation | `validate-citation-anchors.mjs` |
| Changelog generation | `generate-changelog.mjs` |
| Health report generation | `repository-health-report.mjs` |

### 10.3 CodeQL Requirement

OCKI repositories that contain any executable JavaScript (scripts, site code) SHOULD enable GitHub CodeQL analysis via `.github/workflows/codeql.yml`. If the repository contains only Markdown, JSON, and documentation, CodeQL is OPTIONAL.

### 10.4 Merge Requirements

Before any PR may be merged to `main`:

1. All required CI checks MUST pass (green)
2. At least one human reviewer MUST approve the PR
3. The PR author (human or AI agent) MUST NOT approve their own PR
4. If CI fails for infrastructure reasons (billing, runner quota), that MUST be stated in the PR with local verification evidence — it does not exempt the PR from passing all checks

---

## 11. Wiki Structure

OCKI repositories SHOULD maintain a GitHub wiki with the following pages. Wiki pages provide human-navigable documentation that complements the repository files.

### Required Wiki Pages

| Page | Content |
|---|---|
| **Home** | Project overview, quick links to INDEX.md, AGENTS.md, CONTRIBUTING.md |
| **Getting Started** | How to clone, run validation scripts, open a first PR |
| **Contribution Guide** | Source requirements, workflow, PR checklist |
| **Metadata Schema Reference** | All fields, types, enums — mirrors `docs/metadata-model.md` |
| **Import Workflow** | Step-by-step guide for importing an official text |
| **Citation Convention** | Anchor format rules — mirrors `docs/anchor-convention.md` |
| **Known Gaps** | Acts in scope but not yet imported or partially imported |
| **Official Sources** | Accepted and rejected source categories with rationale |

### Recommended Wiki Pages

| Page | Content |
|---|---|
| **AI Agent Onboarding** | First PR walkthrough for AI agents |
| **Relationship Model** | How cross-references and relationship types work |
| **Health Report Interpretation** | What the health score components mean |

---

## 12. Issue Templates

Every OCKI repository MUST have the following issue templates in `.github/ISSUE_TEMPLATE/`.

### 12.1 add-act-metadata.yml — Add new act metadata

**Fields:**
- Act name (text, required)
- Act type (dropdown: lege, ordonanta, hotarare, ordin, normativ, ghid, procedura)
- Domain (dropdown: enum values)
- Official source URL (text, required)
- Date source verified (text, required: YYYY-MM-DD)
- Notes or limitations (textarea)
- Checklist: [ ] Source URL resolves, [ ] Title verified, [ ] Status verified, [ ] No full text import required

### 12.2 import-official-text.yml — Import official text

**Fields:**
- Act slug (text, required — must match existing metadata file)
- Official source URL (text, required)
- Source form (dropdown: printable consolidated, original, excerpt)
- Date accessed (text, required: YYYY-MM-DD)
- Import method (text)
- Reuse rights confirmed (checkbox, required)
- Notes or known limitations (textarea)

### 12.3 update-metadata.yml — Update or correct metadata

**Fields:**
- Act slug (text, required)
- Field(s) to update (text)
- New value(s) (text)
- Official source evidence (text, required)
- Date verified (text, required)

### 12.4 report-gap.yml — Report a gap or missing act

**Fields:**
- Act name (text, required)
- Domain (dropdown)
- Why this act matters for the repository scope (textarea)
- Official source if known (text)
- Suggested priority (dropdown: high, medium, low)

### 12.5 tooling.yml — Scripts or validation improvement

**Fields:**
- Script name or new script (text)
- Problem or improvement (textarea)
- Proposed solution (textarea)
- Does this change schema or file structure? (checkbox)

---

## 13. Pull Request Template

Every OCKI repository MUST have `.github/PULL_REQUEST_TEMPLATE.md` with the following sections.

```markdown
## Summary

What changed, in one paragraph.

## Issue

Closes #

## Scope

- [ ] One issue only
- [ ] No unrelated files changed
- [ ] No architectural changes outside scope

## Files changed

List the files and why each changed.

## Source evidence

- Official source:
- Source URL:
- Date checked:
- Source form (e.g. consolidated printable, metadata-only):
- Rights / reuse note, if relevant:

## Validation

Paste exact results:

\```sh
git diff --check
node scripts/validate-metadata.mjs
node scripts/check-markdown-hygiene.mjs
node scripts/check-metadata-parity.mjs
node scripts/check-official-text-integrity.mjs
node scripts/validate-citation-anchors.mjs
\```

## Provenance

- [ ] Import log added or updated (required for any official text import)
- [ ] Article count recorded
- [ ] Annex count recorded

## Risks

What could still be wrong or incomplete?

## Rollback plan

How this PR can be safely reverted.

---

## PR Evidence Footer

| Area | Change? | Detail |
|---|---|---|
| **Architectural decisions** | Yes / No | If yes, explain |
| **Security boundary changes** | Yes / No | If yes, explain |
| **Data ownership changes** | Yes / No | If yes, explain |
| **Async/sync execution changes** | Yes / No | If yes, explain |
| **Cost changes** | Yes / No | If yes, explain |
| **Rollback plan** | | How to revert this PR safely |
```

### 13.1 PR Evidence Footer — Field Definitions

| Field | What to record |
|---|---|
| **Architectural decisions** | Any change to directory structure, schema, script contracts, or workflow |
| **Security boundary changes** | Any change that affects what data is public, how secrets are handled, or access control |
| **Data ownership changes** | Any change to which source owns the canonical data for a field or act |
| **Async/sync execution changes** | Any change to how scripts run (order, dependencies, parallelism) |
| **Cost changes** | Any change to CI runner cost, storage, or external API usage |
| **Rollback plan** | Concrete steps to revert (e.g., `git revert <sha>`, what to manually clean up) |

---

## 14. Health Reporting

### 14.1 What the Health Report Must Cover

The `repository-health-report.mjs` script MUST generate a health report that covers:

- Total number of tracked acts (metadata entries)
- Number of full-text acts (have `OFFICIAL_TEXT_START` / `OFFICIAL_TEXT_END` markers)
- Number of metadata-only acts
- Number of acts with import log entries
- Number of acts with at least one recorded relationship
- Coverage matrix: one row per act, columns for full-text, metadata, import log, markers, relationship count, provenance flag
- Domain distribution (count per domain enum value)
- Issuer distribution (count per issuing_body_kind value)

### 14.2 Score Components

Health score is a percentage (0–100) computed as:

| Component | Weight | Measured as |
|---|---|---|
| Metadata completeness | 30% | % of acts with all optional high-value fields (`canonical_citation`, `issue_date`, `version_kind`) |
| Full-text coverage | 25% | % of acts with official text imported |
| Import log coverage | 20% | % of full-text acts with import log |
| Relationship coverage | 15% | % of acts with at least one relationship field populated |
| Anchor coverage | 10% | % of full-text acts with at least one citation anchor |

### 14.3 Warning Thresholds

The health report MUST emit warnings when:

- Any full-text act is missing an import log entry
- Any act has `last_checked` older than 180 days
- Any `metadata-only` act has no note explaining why text was not imported
- Overall health score drops below 70%
- Any act has `status: unknown` and `last_checked` older than 90 days

### 14.4 Report Storage

Health report output MUST be committed to:
- `reports/repository-health.json` — machine-readable
- `reports/repository-health.md` — human-readable Markdown

These files MUST be regenerated on every push to `main` and committed by the CI workflow or by the contributor as part of the PR.

---

## 15. Citation and Cross-Reference Model

### 15.1 Canonical Anchor Format

Citation anchors follow the convention in Section 8.4. They are:
- Structural (follow official numbering, not content)
- Lowercase ASCII with hyphens
- Stable for the lifetime of an act version (do not renumber when text is updated)
- Applied inside `OFFICIAL_TEXT_START` / `OFFICIAL_TEXT_END` blocks only

### 15.2 Citation Index Format

`citations/citation-index.json` MUST be generated by `generate-citation-index.mjs`. Structure:

```json
{
  "generated_at": "<ISO-8601 datetime>",
  "acts": {
    "<slug>": {
      "title": "<full official title>",
      "slug": "<slug>",
      "file": "legi/<slug>.md",
      "articles": [
        {
          "id": "art-N",
          "anchor": "#art-N",
          "url_fragment": "legi/<slug>.md#art-N",
          "line": <line number in file>
        }
      ]
    }
  }
}
```

### 15.3 Cross-Reference Detection Requirements

The `detect-cross-references.mjs` script MUST:
- Scan only inside `OFFICIAL_TEXT_START` / `OFFICIAL_TEXT_END` blocks
- Match references to Romanian act types (Legea, HG, OUG, Ordin, Normativ, etc.)
- Attempt to resolve each match to a slug in `metadata/acts/`
- Record the line number, matched text, act type, number, year, and `suggested_target_slug` (or `null`)
- Set `status: "resolved"` when a target slug exists, `status: "unknown"` otherwise
- MUST NOT modify any metadata file

### 15.4 Suggestion vs Confirmed Relationship

| State | Definition |
|---|---|
| **Suggested** | Auto-detected by `detect-cross-references.mjs`; appears in `cross-references/` only |
| **Confirmed** | Recorded in `metadata/acts/<slug>.json` under a relationship field after human review |

A relationship MUST NOT be promoted from suggested to confirmed by an AI agent alone. Human review is required.

---

## 16. Relationship Model

### 16.1 Supported Relationship Types

| Field in metadata | Meaning | Direction |
|---|---|---|
| `related_acts` | General relationship; does not imply direction | Bidirectional (both acts should reference each other) |
| `implements` | This act implements or applies the referenced act | This act → referenced act |
| `amends` | This act explicitly amends the referenced act | This act → referenced act |
| `amended_by` | The referenced act has amended this act | Referenced act → this act |

### 16.2 Recording Relationships

Relationships are recorded in `metadata/acts/<slug>.json` as arrays of slug strings:

```json
{
  "related_acts": ["lege-50-1991", "hg-343-2017"],
  "amends": ["lege-10-1995"],
  "amended_by": ["lege-177-2015"]
}
```

Every slug in a relationship array MUST correspond to an existing file in `metadata/acts/`.

### 16.3 Evidence Requirement by Relationship Type

| Relationship | Required evidence |
|---|---|
| `related_acts` | Text reference in one or both acts, OR domain overlap documented in import log |
| `implements` | Explicit implementing clause in the act text ("în aplicarea Legii nr. ...") |
| `amends` | Official amendment title or article in the amending act ("se modifică Legea ...") |
| `amended_by` | `amends` relationship in the amending act confirms this |

Evidence MUST be recorded in the import log or in a comment in the PR when the relationship is first added.

---

## 17. Repository Versioning Policy

### 17.1 How Schema Versions Work

The metadata schema version is tracked in the `$id` URI of `metadata/schema.json`. A separate `version` field in the schema root MAY be added for human readability.

Schema version numbers follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version: breaking change (removed field, changed enum, changed required set)
- **MINOR** version: additive change (new optional field, new enum value)
- **PATCH** version: clarification, description update, no structural change

### 17.2 Backward Compatibility Rules

- Removing a required field is a **breaking change** (MAJOR version bump)
- Adding a new required field is a **breaking change** (MAJOR version bump) — all existing files must be updated before the change is merged
- Adding a new optional field is **backward-compatible** (MINOR version bump)
- Removing an enum value is a **breaking change** if any existing file uses that value
- Adding an enum value is **backward-compatible** (MINOR version bump)

### 17.3 When to Increment Version

Version MUST be incremented in `metadata/schema.json` whenever a structural change is merged. The change MUST be documented in:
- A comment in the PR description
- An entry in `CHANGELOG.md`
- A note in `ROADMAP.md` under the completed milestone

---

## 18. Repository Lifecycle

### 18.1 Lifecycle Stages

| Stage | Description |
|---|---|
| **bootstrap** | Repository created; structure set up; no or minimal content |
| **active** | Ongoing imports, metadata improvements, relationship work |
| **stable** | Core scope fully imported; changes are maintenance only |
| **archived** | No longer maintained; marked read-only |

### 18.2 Entry and Exit Criteria

#### bootstrap

**Entry:** Repository initialized with required root files and directory structure.

**Exit criteria (to move to active):**
- All required root files present and valid
- `metadata/schema.json` passes self-validation
- `validate.yml` CI workflow passes on the repository
- At least one act metadata file imported and validated

#### active

**Entry:** All bootstrap exit criteria met.

**Exit criteria (to move to stable):**
- All acts in the defined scope have at least `metadata-only` entries
- At least 80% of in-scope acts have full text imported (or documented reason why not)
- Health report score ≥ 80%
- All required scripts implemented and passing in CI
- Wiki structure complete

#### stable

**Entry:** All active exit criteria met.

**Exit criteria (to move to archived):**
- Maintainers decide the domain is no longer actively changing, OR
- A successor repository replaces this one

**In stable stage:**
- New act additions are welcome but not required
- Amendment tracking (updating `consolidated_as_of`, `amended_by`) continues
- Health score must remain ≥ 75%

#### archived

**Entry:** Explicit decision by maintainers documented in `ROADMAP.md`.

**Requirements:**
- Repository MUST be set to read-only (GitHub archive)
- `README.md` MUST include an archived notice and link to successor if one exists
- No further PRs accepted

---

## 19. Human vs AI Responsibilities

### 19.1 What Only Humans Can Do

| Task | Rationale |
|---|---|
| Approve and merge pull requests | AI must not self-approve; final gatekeeping is human |
| Decide whether a source's reuse rights are clear | Legal judgment required |
| Confirm act status when official source is ambiguous | Legal judgment required |
| Modify `metadata/schema.json` in a breaking way | Architectural decision; affects all downstream consumers |
| Archive the repository | Strategic decision |
| Resolve conflicts between auto-detected and recorded relationships | Judgment call on relationship semantics |
| Verify that an import correctly reflects the official source text | Legal accuracy check |
| Set issue priorities and milestone scope | Project management |

### 19.2 What AI Can Assist With (Human Decision Required)

| Task | AI role | Human role |
|---|---|---|
| Draft metadata JSON from official source page | AI drafts, cites URL | Human verifies accuracy |
| Draft import log entry | AI drafts with source data | Human verifies provenance |
| Suggest relationships from cross-reference output | AI generates `relationships-diff.md` | Human confirms each suggestion |
| Update INDEX.md after a new import | AI drafts update | Human reviews for accuracy |
| Run validation scripts and report results | AI runs and pastes output | Human interprets failures |
| Write PR description and evidence footer | AI drafts | Human confirms before submit |

### 19.3 What AI Can Do Autonomously

| Task | Conditions |
|---|---|
| Read any file in the repository | No conditions |
| Run validation scripts and report output | Scripts must be present; AI reports output verbatim |
| Open a pull request | On a feature branch; following all PR template sections |
| Generate citation index and health report | These are generated files; AI runs the scripts |
| Add article anchors via `add-article-anchors.mjs` | Script must exist; output validated before commit |
| Update README.md cross-links | No change to metadata schema or act content |

---

## 20. Definition of Done

An act import is **Done** when all of the following items are checked:

### Source and Provenance

- [ ] Source URL recorded in `metadata/acts/<slug>.json` (`source_url` field)
- [ ] Official source name recorded (`official_source` field)
- [ ] Date checked recorded (`last_checked` field in YYYY-MM-DD)
- [ ] Import method recorded (`import_method` field)
- [ ] Import log file created in `import-log/YYYY-MM-DD-<name>.md`
- [ ] Import log includes source URL, date, method, article count, annex count, validation commands, known limitations
- [ ] Reuse rights confirmed (official public-domain source) or documented limitation noted

### Metadata

- [ ] All required metadata fields present and valid (`title`, `type`, `domain`, `status`, `source_url`, `last_checked`, `tags`)
- [ ] No invented or guessed values — only verified facts or `TODO:` placeholders
- [ ] `metadata/acts/<slug>.json` validates against `metadata/schema.json` with zero errors
- [ ] Article count and annex count recorded if text was imported

### Markdown Act File

- [ ] File created at `legi/<slug>.md` (or appropriate directory)
- [ ] Markdown frontmatter matches metadata JSON fields (for portability)
- [ ] If full text imported: surrounded by `OFFICIAL_TEXT_START` / `OFFICIAL_TEXT_END` markers
- [ ] If metadata-only: clear stub with note explaining why text was not imported
- [ ] No commentary or interpretation inside the official text block
- [ ] Citation anchors added to article headings (`{#art-N}` format)

### Index and Changelog

- [ ] Row added or updated in `INDEX.md` status matrix
- [ ] `reports/changelog.json` regenerated (script run)
- [ ] `reports/repository-health.json` and `reports/repository-health.md` regenerated

### Validation

- [ ] `git diff --check` passes (no trailing whitespace)
- [ ] `node scripts/validate-metadata.mjs` passes with zero errors
- [ ] `node scripts/check-markdown-hygiene.mjs` passes with zero errors
- [ ] `node scripts/check-metadata-parity.mjs` passes with zero errors
- [ ] `node scripts/check-official-text-integrity.mjs` passes with zero errors
- [ ] `node scripts/validate-citation-anchors.mjs` passes with zero errors

### Pull Request

- [ ] PR solves one issue only
- [ ] PR description includes source evidence section
- [ ] PR description includes validation output (copy-pasted, not summarized)
- [ ] PR Evidence Footer completed (all 6 fields)
- [ ] No unrelated files changed
- [ ] Rollback plan stated

### Human Review

- [ ] At least one human reviewer approved the PR
- [ ] PR author did not self-approve
- [ ] All CI checks green at time of merge

---

*This specification is maintained in the `docs/` directory of the lead OCKI repository. Proposed changes to this specification require a PR with human review, a completed PR Evidence Footer, and a version increment in Section 17.*
