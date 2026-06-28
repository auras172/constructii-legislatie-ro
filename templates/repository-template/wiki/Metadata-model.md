# Metadata model

See [docs/metadata-model.md](../docs/metadata-model.md) in the repository for the full reference.

## Quick reference

Every act has a JSON file at `metadata/acts/<slug>.json`.

**Required fields:** `title`, `type`, `domain`, `status`, `source_url`, `last_checked`, `tags`

**Validation:** `node scripts/validate-metadata.mjs`

**Schema:** `metadata/schema.json`

## Import methods

| Value | Meaning |
|-------|---------|
| `metadata-only` | Only JSON metadata, no full text |
| `printable HTML → Markdown` | Full text imported from HTML printable view |
| `PDF → Markdown` | Full text converted from PDF (note limitations) |

## Domain values

See `metadata/schema.json` for the full enum. Common values:

- `autorizatii` — construction authorization
- `urbanism` — spatial planning and urbanism
- `executie` — execution of works
- `receptie` — reception of works
- `calitate` — construction quality
- `isc` — ISC references
- `anre` — ANRE references
- `iscir` — ISCIR references
- `incendiu` — fire safety
- `nzeb` — nZEB/energy efficiency
- `fiscal` — fiscal/tax
- `munca` — labor
- `mediu` — environment
