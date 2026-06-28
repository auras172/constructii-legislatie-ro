# Legi si acte candidate

Index for construction-related Romanian legal acts tracked in this repository.

Each act starts as a metadata-only entry. Official text is imported only after source verification and with a provenance record in `import-log/`.

## Initial candidate list

- [Legea 50/1991](./lege-50-1991.md)
  - Domain: autorizatii
  - Official source checked: Portal Legislativ (`/Public/DetaliiDocument/1515`)
  - Status: active · full official consolidated text imported 2026-06-27 · 64 articles · 3 annexes
  - Import log: [import-log/2026-06-27-lege-50-1991.md](../import-log/2026-06-27-lege-50-1991.md)
- [Legea 10/1995](./lege-10-1995.md)
  - Domain: calitate · Related: Legea 50/1991
  - Official source checked: Portal Legislativ (`/Public/DetaliiDocumentAfis/182108`)
  - Status: active · full official republished text imported 2026-06-27 · 44 articles · 0 annexe
  - Import log: [import-log/2026-06-27-lege-10-1995.md](../import-log/2026-06-27-lege-10-1995.md)
- [Legea 350/2001](./lege-350-2001.md)
  - Domain: urbanism · Related: Legea 50/1991
  - Official source checked: Portal Legislativ (`/Public/DetaliiDocument/184772`)
  - Status: active · full official actualizata text imported 2026-06-27 · 68 articles · 2 annexe
  - Import log: [import-log/2026-06-27-lege-350-2001.md](../import-log/2026-06-27-lege-350-2001.md)
- [Ordin MDRAP 839/2009](./ordin-839-2009.md)
  - Domain: autorizatii · Implements: Legea 50/1991
  - Official source checked: Portal Legislativ — ORDIN (A) [`/Public/DetaliiDocument/156617`](https://legislatie.just.ro/Public/DetaliiDocument/156617) + NORMA (A) [`/Public/DetaliiDocument/259096`](https://legislatie.just.ro/Public/DetaliiDocument/259096)
  - Status: active · full official actualizata text imported 2026-06-27 · 85 articles (3 ORDIN + 82 NORMA) · NORMA actualizata la 05.10.2022
  - Import log: [import-log/2026-06-27-ordin-839-2009.md](../import-log/2026-06-27-ordin-839-2009.md)
- [HG 343/2017](./hg-343-2017.md)
  - Domain: receptie · Related: Legea 50/1991, Legea 10/1995 · Amends: HG 273/1994
  - Official source checked: Portal Legislativ ([`/Public/DetaliiDocumentAfis/189596`](https://legislatie.just.ro/Public/DetaliiDocumentAfis/189596))
  - Status: active · full official text imported 2026-06-28 · 43 articles (3 HG + 40 Regulament) · 6 annexes
  - Import log: [import-log/2026-06-28-hg-343-2017.md](../import-log/2026-06-28-hg-343-2017.md)
- [Legea 372/2005](./lege-372-2005.md)
  - Domain: nzeb · Related: Legea 50/1991, Legea 10/1995
  - Official source checked: Portal Legislativ ([`/Public/DetaliiDocument/265880`](https://legislatie.just.ro/Public/DetaliiDocument/265880))
  - Status: active · full official actualizata text imported 2026-06-28 · 43 articles · 0 annexes · consolidated 25.07.2024
  - Import log: [import-log/2026-06-28-lege-372-2005.md](../import-log/2026-06-28-lege-372-2005.md)
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
