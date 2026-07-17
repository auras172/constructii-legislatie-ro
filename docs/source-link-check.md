# Source Link Verification Report

**Date checked:** 2026-07-17
**Related issue:** [#22 — Good first issue: verify official source links](https://github.com/auras172/constructii-legislatie-ro/issues/22)

## Purpose

This report records a small, human-readable source-link verification pass over
existing official source URLs in `metadata/acts/*.json`.

It complements:

- [`scripts/audit-source-url.mjs`](../scripts/audit-source-url.mjs)
- [`docs/source-audit-workflow.md`](source-audit-workflow.md)
- [`.github/workflows/source-audit.yml`](../.github/workflows/source-audit.yml)

This is fetch-level evidence only. A successful HTTP fetch confirms that a URL
resolved and returned bytes at the time checked. It does not certify legal
accuracy, current legal status, completeness, or suitability for full-text
import.

## Methodology

The audit used `scripts/audit-source-url.mjs`, which reads one existing
metadata file, fetches its `source_url`, prints authority classification,
HTTP status, content type, byte size, SHA-256 hash, and writes the fetched body
outside the repository under `/tmp/constructii-source-audit/<slug>/`.

The sample was selected to cover:

- Portal Legislativ sources
- MDLPA technical regulation pages
- ISCIR technical prescription pages
- an ANRE-domain act hosted on Portal Legislativ
- both full-text and metadata-only entries

This was a representative sample, not a full-corpus audit of all 70 acts.

## Sample Commands Run

```sh
node scripts/audit-source-url.mjs lege-50-1991
node scripts/audit-source-url.mjs lege-350-2001
node scripts/audit-source-url.mjs lege-141-2026
node scripts/audit-source-url.mjs normativ-p118-1-2025
node scripts/audit-source-url.mjs normativ-pt-c1-2010
node scripts/audit-source-url.mjs ordin-anre-59-2013
node scripts/audit-source-url.mjs hg-525-2013
```

## Summary

Sample passed: all sampled source URLs returned HTTP 200.

| Slug | Import type | Source category | URL checked | HTTP | Content type | Bytes | SHA-256 |
| --- | --- | --- | --- | ---: | --- | ---: | --- |
| `lege-50-1991` | full-text | Portal Legislativ | `https://legislatie.just.ro/Public/DetaliiDocument/1515` | 200 | `text/html; charset=utf-8` | 888419 | `62ad8aa4a3f45d4b329ee728a54a0a00604bf698d9785fa283cb4f91221ce6bc` |
| `lege-350-2001` | full-text | Portal Legislativ | `https://legislatie.just.ro/Public/DetaliiDocument/307036` | 200 | `text/html; charset=utf-8` | 723968 | `8d4fac0e863b17f7fb2e4981eb0bbf8c292c5604a250cf664ba2d463f10b5768` |
| `lege-141-2026` | metadata-only | Portal Legislativ | `https://legislatie.just.ro/Public/DetaliiDocument/312240` | 200 | `text/html; charset=utf-8` | 198765 | `38d5c74f5e5e116d24fbc9ec68faa7ced84212823ca117f0831624bcd6868336` |
| `normativ-p118-1-2025` | metadata-only | MDLPA | `https://www.mdlpa.ro/pages/reglementare28` | 200 | `text/html; charset=UTF-8` | 81948 | `71627058f4a3794ea77216eb5ac6e7c5600179480598c92aea8de1190cdc501d` |
| `normativ-pt-c1-2010` | metadata-only | ISCIR | `https://iscir.ro/prescriptii-iscir` | 200 | `text/html; charset=UTF-8` | 82613 | `0baae86adb99f5afe2477f1a9398c42ce03e2489246fe5bb2e61301e47ad0527` |
| `ordin-anre-59-2013` | metadata-only | ANRE-domain act via Portal Legislativ | `https://legislatie.just.ro/Public/DetaliiDocumentAfis/150711` | 200 | `text/html; charset=utf-8` | 58796 | `b6412945cf681679d9abb2a56a7bec62ffba5e2e1682d54a662d794d31b80790` |
| `hg-525-2013` | metadata-only | Portal Legislativ | `https://legislatie.just.ro/Public/DetaliiDocument/150407` | 200 | `text/html; charset=utf-8` | 134769 | `ebac796e2e3950997c4e55f47f29d48ddea9bac259b0debb86f03b71dd80dfae` |

## Source Authority Coverage

| Category | Sampled slug(s) | Result |
| --- | --- | --- |
| Portal Legislativ | `lege-50-1991`, `lege-350-2001`, `lege-141-2026`, `ordin-anre-59-2013`, `hg-525-2013` | Passed |
| MDLPA | `normativ-p118-1-2025` | Passed |
| ISCIR | `normativ-pt-c1-2010` | Passed |
| ANRE domain | `ordin-anre-59-2013` | Passed via Portal Legislativ source URL |

## Known Limitations

- This report audited a sample only. It does not claim that every one of the
  70 tracked acts was checked on 2026-07-17.
- Portal Legislativ pages can be dynamic. Byte size and SHA-256 may drift even
  when the stable document URL remains valid.
- MDLPA and ISCIR sample URLs are index or listing pages for technical
  regulations, not proof that any linked PDF is the correct text for import.
- The source audit helper does not parse legal text, compare articles, or
  verify consolidation currency.
- The source audit helper does not replace human review before metadata
  changes or full-text import.

## TODOs

- Run a full-corpus audit if issue #22 should be closed as completely resolved.
- For acts whose `source_url` points to an index page, optionally audit
  `official_detail_url` as a second pass when that field points to a stable
  act-specific document.
- Continue recording audit evidence in PR bodies and import logs whenever a
  source URL is added or changed.

No broken links were found in this sampled pass.
