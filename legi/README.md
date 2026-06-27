# Legi si acte candidate

Index for construction-related Romanian legal acts tracked in this repository.

Each act starts as a metadata-only entry. Official text is imported only after source verification and with a provenance record in `import-log/`.

## Initial candidate list

- [Legea 50/1991](./lege-50-1991.md)
  - Domain: autorizatii
  - Official source checked: Portal Legislativ (`/Public/DetaliiDocument/1515`)
  - Status: active · full official consolidated text imported 2026-06-27 · 64 articles · 3 annexes
  - Import log: [import-log/2026-06-27-lege-50-1991.md](../import-log/2026-06-27-lege-50-1991.md)
- Legea 10/1995 — metadata entry in `metadata/acts/lege-10-1995.json`
  - Domain: calitate · Related: Legea 50/1991
  - Official source: Portal Legislativ (`/Public/DetaliiDocument/1723`) — TODO: verify consolidated form
- Legea 350/2001 — metadata entry in `metadata/acts/lege-350-2001.json`
  - Domain: urbanism · Related: Legea 50/1991
  - Official source: Portal Legislativ (`/Public/DetaliiDocument/27584`) — TODO: verify consolidated form
- Ordin MDRAP 839/2009 — metadata entry in `metadata/acts/ordin-839-2009.json`
  - Domain: autorizatii · Implements: Legea 50/1991
  - Official source: Portal Legislativ (`/Public/DetaliiDocument/109776`) — TODO: verify consolidated form
- HG 343/2017 — metadata entry in `metadata/acts/hg-343-2017.json`
  - Domain: receptie · Related: Legea 50/1991
  - Official source: Portal Legislativ (`/Public/DetaliiDocument/188419`) — TODO: verify
- Normativ P118
  - Domain: incendiu
  - TODO: verify official title/source and applicable version(s)
- ISCIR relevant prescriptions
  - Domain: iscir
  - TODO: identify relevant prescriptions and official sources
- ANRE electric authorization references
  - Domain: anre
  - TODO: identify relevant authorization references and official sources
- nZEB / energy performance references
  - Domain: nzeb
  - TODO: identify relevant laws, norms, and official sources

## Naming convention proposal

Use lowercase, ASCII-safe slugs until a better convention is adopted:

```text
legi/lege-50-1991.md
legi/lege-10-1995.md
legi/lege-350-2001.md
```
