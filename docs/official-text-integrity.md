# Official Text Integrity

This repository distinguishes between source provenance and repository-local
text integrity. The first checksum rollout is intentionally backward compatible:
existing full-text acts without recorded hashes warn, but do not fail CI.

## Layers

### 1. Source body hash

The source body hash is the SHA-256 of an HTTP response body fetched from an
official source such as Portal Legislativ, MDLPA, ISCIR, ANRE, or Monitorul
Oficial. It is produced by `scripts/audit-source-url.mjs` and is useful for
showing that a source URL returned a stable byte sequence at audit time.

This hash does not prove that the repository text is equivalent to the source.
It only identifies the fetched source body.

### 2. Normalized extracted text hash

The normalized extracted text hash is the SHA-256 of text after extraction from
HTML, PDF, DOC, or DOCX and before conversion or editorial structuring into
Markdown. This layer is not implemented by this PR. It is reserved for future
import tooling that can preserve intermediate extraction artifacts.

This layer will help distinguish source drift from extraction drift.

### 3. Markdown official block hash

The Markdown official block hash is the SHA-256 of the content between:

```md
<!-- OFFICIAL_TEXT_START -->
<!-- OFFICIAL_TEXT_END -->
```

Line endings are normalized to LF before hashing. The marker lines themselves
are not included in the hash.

This is the layer implemented now. It proves that the imported official block
inside `legi/<slug>.md` has not changed since its hash was recorded.

## Commands

Print hashes for all full-text acts:

```sh
node scripts/hash-official-text.mjs --report
```

Print the hash for one act:

```sh
node scripts/hash-official-text.mjs --report lege-50-1991
```

Run the integrity checker:

```sh
node scripts/check-official-text-integrity.mjs
```

During the initial rollout, missing recorded hashes produce warnings only.
If a hash is recorded and does not match the current Markdown official block,
the checker fails.

## Recording Hashes

Until `metadata/schema.json` grows a dedicated checksum field, record hashes in
the matching import log:

```text
official_text_sha256: <64 lowercase hex characters>
```

The checker also recognizes future metadata names such as
`official_text_sha256`, `official_text_block_sha256`, and
`markdown_official_block_sha256` if the schema later permits them.

## Migration Plan

1. Keep this PR warning-only for missing hashes so existing imports keep passing.
2. Generate hashes for all current full-text imports with
   `node scripts/hash-official-text.mjs --report`.
3. Add `official_text_sha256` to the 13 full-text import logs in a dedicated
   provenance-only PR. Do not edit `legi/*.md` official text blocks.
4. After every full-text import log has a recorded hash, tighten
   `check-official-text-integrity.mjs` so missing hashes fail CI.
5. Optionally extend `metadata/schema.json` with an explicit checksum field and
   migrate the recorded values from import logs into metadata.

## Non-goals

- This mechanism does not fetch official sources.
- It does not certify legal accuracy.
- It does not prove equivalence between source HTML/PDF/DOCX and Markdown.
- It does not permit edits inside official text blocks.
