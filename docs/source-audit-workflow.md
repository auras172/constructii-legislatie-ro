# Source Audit Workflow

**Status:** Active
**Applies to:** `scripts/audit-source-url.mjs`
**Last updated:** 2026-07-02

---

## What this document is

This document explains when and how contributors and AI agents should use
`scripts/audit-source-url.mjs` before source-backed import work — metadata-only
or full-text — in this repository.

It does not replace [`docs/ai-contract.md`](ai-contract.md) or
[`CONTRIBUTING.md`](../CONTRIBUTING.md). Those documents govern what may be
imported and when human review is required. This document only covers the
audit step that should happen before that work, and the boundaries of the
helper that performs it.

## What the helper is

`audit-source-url.mjs` is an **audit helper**, not an importer.

It fetches one act's `source_url` (or `official_detail_url`, with
`--official-detail`) from `metadata/acts/<slug>.json`, records fetch-level
evidence about that single request, and stops. It does not read the response
body as legal text, does not write Markdown, and does not touch any file this
repository treats as content of record.

## Command usage

```sh
node scripts/audit-source-url.mjs <slug>
node scripts/audit-source-url.mjs <slug> --official-detail
```

`<slug>` must match an existing file at `metadata/acts/<slug>.json`. Use
`--official-detail` to audit `official_detail_url` instead of `source_url`.

## Expected output

Running the helper prints one audit record to stdout:

| Field | Meaning |
| --- | --- |
| `slug` | The act slug passed on the command line |
| `title` | `title` from the act's metadata file |
| `source_url` / `official_detail_url` / `fetched_url` | The URLs recorded in metadata, and which one was actually fetched |
| `authority` | Source classification: `Portal Legislativ`, `MDLPA`, `ISCIR`, `ANRE`, or `other` |
| `http_status` | HTTP status code returned by the fetch |
| `content_type` | The response's `content-type` header |
| `byte_size` | Size in bytes of the fetched response body |
| `sha256` | SHA-256 hash of the fetched response body |
| `saved_body` | Path where the fetched body was written, under `/tmp/constructii-source-audit/<slug>/` |

The first line of output is always a warning that the helper does not import
official text and does not certify legal accuracy — this is printed on every
run, success or failure, as a reminder that the record below is fetch-level
evidence only.

If the HTTP response is not successful (non-2xx), the script prints the audit
record and then exits with a non-zero status.

## Workflow guidance

1. **Run the audit helper before any source-backed metadata import** —
   metadata-only or full-text. This applies whether the act metadata already
   exists (auditing an existing `source_url`) or is being drafted as part of
   the same change (audit the URL before writing it into the metadata file).
2. **Record the relevant evidence in the PR body and/or import-log entry** —
   at minimum the HTTP status, `sha256`, and fetch date. This gives reviewers
   a fetch-level provenance trail independent of what the contributor
   describes.
3. **Do not treat a successful fetch as proof of legal accuracy.** HTTP 200
   and a stable hash only confirm that a URL currently resolves and returned
   specific bytes. They say nothing about whether the content is the correct,
   current, or authoritative version of the act.
4. **Human review is still required before importing text.** The audit
   helper does not substitute for the human review requirements in
   [`docs/ai-contract.md`](ai-contract.md) — in particular, any full-text
   import still requires a reviewer to spot-check article text against the
   official source.

## Boundaries

`audit-source-url.mjs`:

- does **not** write to `legi/`
- does **not** write to `metadata/`
- does **not** write to `import-log/`
- does **not** insert `OFFICIAL_TEXT_START` / `OFFICIAL_TEXT_END` markers
- does **not** certify source correctness

Fetched response bodies are written only under
`/tmp/constructii-source-audit/<slug>/` — outside the repository tree.

## Acceptable use cases

- Verify that an official source URL is currently reachable before citing it
  in metadata.
- Capture a SHA-256 hash as provenance evidence for a PR or import-log entry.
- Compare a source's hash or byte size over time to detect drift (e.g. a
  Portal Legislativ page has been updated since it was last cited).
- Debug a broken or redirecting source URL before deciding whether to update
  metadata.

## Non-goals

- No automatic legal-text import.
- No OCR.
- No article parsing.
- No relationship inference.

---

> This helper produces evidence, not conclusions. Provenance and human
> review remain the authoritative gate for anything that enters `legi/`,
> `metadata/`, or `import-log/`.
