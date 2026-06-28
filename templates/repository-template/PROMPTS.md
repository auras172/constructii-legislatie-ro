# AI-Assisted Contribution Prompts

Standard prompts for AI agents contributing to {{REPO_NAME}}.

Copy the relevant prompt, fill in the bracketed fields, and use it with your AI assistant. The AI agent must follow `AGENTS.md` rules.

---

## 1. Metadata Import Prompt

Use this when you want to import metadata for a new act (no full text yet).

```
You are contributing to {{REPO_NAME}}, an open-source versioned legislation knowledge base.

Your task: create a metadata-only entry for the following act.

Act: [FULL OFFICIAL TITLE, e.g. "Legea nr. 50/1991 privind autorizarea executării lucrărilor de construcții"]
Slug: [slug, e.g. "lege-50-1991"]
Official source URL: [URL from legislatie.just.ro or official authority page]
Date you checked the source: [YYYY-MM-DD]

Steps:
1. Read README.md, AGENTS.md, DISCLAIMER.md, and metadata/schema.json.
2. Create metadata/acts/<slug>.json following schema.json exactly.
3. Set import_method to "metadata-only".
4. Do NOT import any full text — only metadata and source URL.
5. Verify your JSON validates against the schema.
6. Add a row to INDEX.md for this act.
7. Run: node scripts/validate-metadata.mjs
8. Run: node scripts/check-markdown-hygiene.mjs
9. Open a pull request with the PR Evidence Footer filled in.

Do not invent fields. Do not hallucinate legal text. Do not cite unofficial sources.
```

---

## 2. Full-Text Import Prompt

Use this when you want to import official text for an act that already has metadata, from a verified official source.

```
You are contributing to {{REPO_NAME}}, an open-source versioned legislation knowledge base.

Your task: import the official text for an act that already has a metadata entry.

Act slug: [slug, e.g. "lege-50-1991"]
Metadata file: metadata/acts/<slug>.json
Official source URL: [URL]
Source form: [e.g. "printable consolidated form from Portal Legislativ"]
Date accessed: [YYYY-MM-DD]
Article count: [N]
Annex count: [N]

Steps:
1. Read README.md, AGENTS.md, DISCLAIMER.md, docs/anchor-convention.md, and the existing metadata file.
2. Create legi/<slug>.md with:
   - YAML frontmatter matching the metadata file fields
   - <!-- OFFICIAL_TEXT_START --> marker
   - Full official text, preserving official article numbering
   - <!-- OFFICIAL_TEXT_END --> marker
3. Run: node scripts/add-article-anchors.mjs
4. Create import-log/<slug>.md recording full provenance (source URL, official source name, date, import method, article count, annex count, known limitations).
5. Run all validators:
   node scripts/validate-metadata.mjs
   node scripts/check-markdown-hygiene.mjs
   node scripts/check-metadata-parity.mjs
   node scripts/check-official-text-integrity.mjs
   node scripts/validate-citation-anchors.mjs
6. Open a pull request with the PR Evidence Footer filled in.

Do not fabricate legal text. Preserve official numbering exactly. Cite only the official source.
```

---

## 3. Provenance Verification Prompt

Use this when you want to verify that an existing import is traceable and complete.

```
You are a reviewer for {{REPO_NAME}}, an open-source versioned legislation knowledge base.

Your task: verify the provenance and integrity of an existing import.

Act slug: [slug]

Steps:
1. Read metadata/acts/<slug>.json — check source_url, official_source, last_checked, rights_note.
2. Read legi/<slug>.md — confirm OFFICIAL_TEXT_START and OFFICIAL_TEXT_END markers exist and enclose text.
3. Read import-log/<slug>.md — confirm source URL, date, method, article count, and annex count are recorded.
4. Run: node scripts/check-official-text-integrity.mjs
5. Run: node scripts/validate-citation-anchors.mjs
6. Run: node scripts/repository-health-report.mjs
7. Open a PR or issue reporting:
   - What passes
   - What is missing or incomplete
   - Whether the source URL is still accessible
   - Whether the rights note is present

Do not attempt to re-import or re-verify legal accuracy — flag anything uncertain for human review.
```

---

## 4. Cross-Reference Detection Prompt

Use this when you want to map relationships between acts.

```
You are contributing to {{REPO_NAME}}.

Your task: detect and record cross-act references.

Steps:
1. Run: node scripts/detect-cross-references.mjs
2. Review cross-references/relationships-diff.md
3. For each confirmed relationship, update the relevant metadata/acts/<slug>.json file:
   - Add slugs to "related_acts", "implements", "amends", or "amended_by" as appropriate.
4. Run: node scripts/validate-metadata.mjs
5. Open a PR for the metadata updates only. Do not modify legal text files in the same PR.

Do not add relationships you cannot confirm from the official text or official metadata.
```
