# Import full-text — Ordin ANRE 59/2013

## Verdict

PASS — forma consolidată oficială a fost identificată și importată ca text integral, fără modificarea relațiilor existente.

## Source evidence

| Field | Evidence |
|---|---|
| Base act | [Portal Legislativ ID 150711](https://legislatie.just.ro/Public/DetaliiDocument/150711) |
| Current order form | [Portal Legislativ ID 310639](https://legislatie.just.ro/Public/DetaliiDocument/310639) |
| Current regulation form | [Portal Legislativ ID 310640](https://legislatie.just.ro/Public/DetaliiDocument/310640) |
| Printable regulation | [Portal Legislativ printable](https://legislatie.just.ro/Public/FormaPrintabila/00000G11NVYMWHTZ2XB26VQVA5TS8ZQE) |
| Printable order | [Portal Legislativ printable](https://legislatie.just.ro/Public/FormaPrintabila/00000G1G9299EI5OHER1Q9IG6ATL8A2E) |
| Identity | Ordin nr. 59 din 2 august 2013 pentru aprobarea Regulamentului privind racordarea utilizatorilor la rețelele electrice de interes public |
| Issuer | Autoritatea Națională de Reglementare în Domeniul Energiei |
| Original publication | M.Of. nr. 517 și nr. 517 bis / 19 august 2013 |
| Consolidated as of | 2026-05-21, matching the existing source-backed metadata snapshot and the latest amendment shown in the current Portal form |
| Retrieval timestamp | 2026-08-04T19:37:48Z audit; browser-rendered extraction completed in the same verification session |

## Structure and integrity

- Ordin: 3 articles and 1 annex reference.
- Regulation: 77 articles, including Articolul 64^1, and 7 annexes.
- Imported citation anchors: 80 unique anchors: `art-1` through `art-3`, plus the regulation anchors `art-1-b` through `art-75-b` and `art-64-1-b`.
- official_text_sha256: `af92ceceb803daba53a45ed53032c75a7c3de7d97e4743112c8d1799f4427e9b` (official Markdown block SHA-256).
- Base act audit: HTTP 200, `text/html; charset=utf-8`, 58,796 bytes, SHA-256 `a6563cefe2ab497d32324428ea9e914bb70039ef9ff7311756e45153430f00cb`.
- Order detail audit: HTTP 200, `text/html; charset=utf-8`, 58,585 bytes, SHA-256 `7bc503caf958b59578c5b9c9b06df8ddffbdb01110cf5242dfb867c118879e21`.
- Regulation detail capture: HTTP 200, `text/html; charset=utf-8`, 909,548 bytes, SHA-256 `76f35610ac93105274bc2c48683d62bdbca2cdb7b1ef9eb176109e54ea035950`.
- Regulation printable capture: HTTP 200, `text/html; charset=utf-8`, 822,731 bytes, SHA-256 `307994a61ef42029c5e4839c58d02fd8d5991132a84a667659eb28d26a9d7d2f`.
- Portal HTML includes dynamic response markup, so raw HTML hashes can vary between fetches; the extracted rendered official text was checked twice and was identical: 302,647 characters and SHA-256 `6a4d870b529c718d50cff6359efb13cb2903a910673acc225e12122e64cf81ba` on both captures. The repository Markdown block hash above is the deterministic provenance hash used by repository validation.

The Markdown text was generated mechanically from the rendered official Portal structures. No unofficial commentary, inferred relationship, or amendment-only page was imported.

## Relationship preservation

- Existing `related_acts`: `hg-90-2008`, `normativ-i7-2011` — unchanged.
- Existing `amended_by`: 14 entries — unchanged and not reordered.
- No new graph relationship was added from text detection.

## Validation evidence

The requested repository validations were run after the import. Generated graph, citation, manifest, health and changelog outputs are included only where the repository generators changed them.

## PR Evidence Footer

Architectural decisions:
- Upgrades one central metadata-only act to full-text using the existing official-text and citation-anchor conventions.

Security boundary changes:
- None.

Data ownership changes:
- Adds the official consolidated text and provenance for Ordin ANRE 59/2013; Portal Legislativ remains the authoritative source.

Async/sync execution changes:
- None.

Cost changes:
- None beyond source retrieval, hashing, citation indexing, and CI validation.

Rollback plan:
- Revert this PR to restore `ordin-anre-59-2013` metadata-only state and remove this imported official text, this dated import log, citation artifacts, and regenerated reports.
