# Metadata model

Every act tracked in this repository has a corresponding JSON metadata file at `metadata/acts/<slug>.json`.

The schema is defined in `metadata/schema.json` and validated on every CI run.

## Required fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Full official title |
| `type` | enum | Act type: `lege`, `ordonanta`, `hotarare`, `ordin`, `normativ`, `ghid`, `procedura` |
| `domain` | enum | Primary domain (see schema for values) |
| `status` | enum | `active`, `repealed`, `partially_repealed`, `unknown` |
| `source_url` | string | URL to the official source |
| `last_checked` | date | Date the source was last verified (YYYY-MM-DD) |
| `tags` | array | Non-empty array of string tags |

## Optional fields (recommended)

| Field | Type | Description |
|-------|------|-------------|
| `short_title` | string | Short human-readable title |
| `canonical_citation` | string | Canonical citation, e.g. `Legea nr. 50/1991` |
| `number` | string/integer | Act number |
| `year` | string/integer | Year of issuance |
| `issuer` | string | Official issuing body |
| `issuing_body_kind` | enum | `parlament`, `guvern`, `minister`, `autoritate`, `other` |
| `topics` | array | Secondary classification topics |
| `issue_date` | date | Date the act was issued (YYYY-MM-DD) |
| `effective_date` | date | Date the act entered into force (YYYY-MM-DD) |
| `publication_date` | date | Date of official publication (YYYY-MM-DD) |
| `publication_medium` | enum | `monitorul-oficial`, `portal-legislativ`, `minister`, `other` |
| `official_source` | string | Name of the official source |
| `official_detail_url` | string | Direct URL to the official detail page |
| `version_kind` | enum | `original`, `republicat`, `consolidat`, `excerpt-only` |
| `consolidated_as_of` | date | Date of the consolidated form (YYYY-MM-DD) |
| `version` | string | Version identifier |
| `article_count` | integer | Number of articles |
| `annex_count` | integer | Number of annexes |
| `import_method` | string | How text was imported, e.g. `printable HTML → Markdown` or `metadata-only` |
| `rights_note` | string | Note on reuse rights for this specific act |
| `related_acts` | array | Slugs of related acts |
| `implements` | array | Slugs of acts this act implements |
| `amends` | array | Slugs of acts this act amends |
| `amended_by` | array | Slugs of acts that have amended this act |

## Slug convention

Slugs are kebab-case identifiers derived from the act's canonical citation:

```
Legea nr. 50/1991  →  lege-50-1991
HG 343/2017        →  hg-343-2017
Ordin MDRAP 839/2009  →  ordin-mdrap-839-2009
```

## Example

```json
{
  "title": "Legea nr. 50/1991 privind autorizarea executării lucrărilor de construcții",
  "short_title": "Legea autorizării construcțiilor",
  "canonical_citation": "Legea nr. 50/1991",
  "type": "lege",
  "number": "50",
  "year": "1991",
  "issuer": "Parlamentul României",
  "issuing_body_kind": "parlament",
  "domain": "autorizatii",
  "topics": ["autorizatie-de-construire", "urbanism"],
  "status": "active",
  "source_url": "https://legislatie.just.ro/Public/DetaliiDocument/1250",
  "official_source": "Portal Legislativ",
  "last_checked": "2024-01-15",
  "version_kind": "consolidat",
  "import_method": "metadata-only",
  "tags": ["autorizatii", "constructii", "urbanism"]
}
```
