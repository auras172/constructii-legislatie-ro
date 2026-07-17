# Contributor Examples

This guide shows what a good contribution looks like in `constructii-legislatie-ro`.

The repository prefers small, source-backed pull requests. A small contribution is easier to review, easier to revert, and safer for both human contributors and AI-assisted workflows.

## Core Rule

One issue means one pull request.

If a change touches unrelated areas, split it. For example, do not mix a metadata import, a README rewrite, and a graph-generation change in the same pull request unless the issue explicitly asks for all of them.

## Good Examples

### 1. Metadata-only act entry

Good scope:

- add one `metadata/acts/<slug>.json`;
- add one `legi/<slug>.md` placeholder;
- add one `import-log/<date>-<slug>.md`;
- update `INDEX.md` and `legi/README.md`;
- regenerate graph, health, and then manifest artifacts only if metadata changed.

Why this is good:

- one official act is reviewed at a time;
- provenance is visible;
- no full legal text is imported accidentally;
- graph changes are tied to a specific metadata change.

### 2. Source URL verification

Good scope:

- run `node scripts/audit-source-url.mjs <slug>`;
- record fetch date, HTTP status, source authority, byte size, and SHA-256 in a short report or import log;
- leave metadata unchanged unless the source URL is actually wrong.

Why this is good:

- fetch-level evidence is preserved;
- reviewers can distinguish URL availability from legal accuracy;
- official links are not replaced with mirrors.

### 3. Import-log improvement

Good scope:

- clarify one import log;
- add a dated note explaining what was verified;
- preserve the original provenance trail;
- do not change legal text.

Why this is good:

- future reviewers understand the audit trail;
- uncertainty is documented instead of hidden;
- the official text block remains stable.

### 4. Documentation fix

Good scope:

- fix one unclear section in one documentation file;
- add links to existing rules or scripts;
- keep wording neutral and non-legal.

Why this is good:

- contributor guidance improves without changing the corpus;
- the diff stays easy to review;
- documentation stays aligned with existing repository behavior.

### 5. Relationship promotion

Good scope:

- promote one or a small set of explicit relationships;
- cite the official evidence in the import log or PR body;
- regenerate graph, health, and then manifest artifacts;
- leave unrelated relationships untouched.

Why this is good:

- graph edges remain evidence-backed;
- reviewers can check the exact source;
- weak topic-similarity links do not enter canonical metadata.

## Anti-Patterns

### 1. Mixing unrelated work

Poor scope:

- add a new act;
- rewrite README;
- fix site styling;
- update unrelated metadata;
- regenerate every artifact without explaining why.

Why this is a problem:

- reviewers cannot tell which change caused which diff;
- rollback becomes harder;
- unrelated files may hide mistakes.

### 2. Importing full text without approval

Poor scope:

- copy a PDF or web page into `legi/`;
- add `OFFICIAL_TEXT_START` markers;
- claim it is the current official version without source review.

Why this is a problem:

- full-text imports require stronger provenance and review;
- source formatting and consolidation status can be tricky;
- the repository must not become a blind document dump.

### 3. Adding relationships by similarity

Poor scope:

- link two acts because they are both about fire safety, energy, concrete, or urbanism;
- add `related_acts` without explicit source evidence;
- promote auto-detected references without checking the text.

Why this is a problem:

- graph edges can mislead search and AI systems;
- topic similarity is not legal evidence;
- weak links reduce trust in the corpus.

### 4. Replacing official sources with unofficial mirrors

Poor scope:

- use legal blogs, copied PDFs, or commercial database snippets as primary evidence;
- replace Portal Legislativ, Monitorul Oficial, MDLPA, ISCIR, ANRE, or other official URLs without documenting why.

Why this is a problem:

- official sources remain authoritative;
- mirrors may be stale, edited, or incomplete;
- provenance becomes harder to audit.

### 5. Large AI-generated rewrites

Poor scope:

- ask an AI agent to "clean up the docs";
- accept broad rewrites without file-by-file evidence;
- let the agent change metadata, legal text, generated artifacts, and prose in one PR.

Why this is a problem:

- broad AI edits are difficult to audit;
- generated prose can introduce unsupported claims;
- small verified changes are safer than sweeping cleanup.

## Pull Request Checklist

Before opening a pull request:

- confirm the branch starts from the canonical upstream branch;
- keep the file list narrow;
- cite official sources for provenance claims;
- run the relevant validation scripts;
- include the six-field PR Evidence Footer defined in `docs/ocki-repository-specification-v1.md`;
- explain any uncertainty or skipped validation.

## Useful Commands

```bash
git diff --check
node scripts/check-markdown-hygiene.mjs
node scripts/validate-metadata.mjs
node scripts/check-metadata-parity.mjs
```

For metadata changes, also run the graph and health scripts documented in `scripts/README.md`.
