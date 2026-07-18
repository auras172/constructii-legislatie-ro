# Metadata model

This document explains every field in `metadata/schema.json` — what it means, what values it accepts, and whether it is required.

The canonical source for each act is the JSON file under `metadata/acts/<slug>.json`. The Markdown frontmatter in `legi/<slug>.md` mirrors a subset of these fields for portability.

## Required fields

### `title`

Full official title of the act, exactly as it appears in the official source.

Example: `"Legea nr. 50 din 29 iulie 1991 privind autorizarea executării lucrărilor de construcții"`

### `type`

Act type. Allowed values:

| Value | Meaning |
|---|---|
| `lege` | Law passed by Parliament |
| `ordonanta` | Government ordinance |
| `hotarare` | Government decision (HG) |
| `ordin` | Ministerial order |
| `normativ` | Technical normative (P, NP, GT, etc.) |
| `ghid` | Technical or procedural guide |
| `procedura` | Formal procedure document |

### `domain`

Primary construction domain. One value per act. Allowed values:

| Value | Domain |
|---|---|
| `autorizatii` | Building permits and authorization |
| `urbanism` | Spatial planning and urbanism |
| `executie` | Construction execution |
| `receptie` | Works reception |
| `calitate` | Construction quality |
| `isc` | State Construction Inspectorate |
| `anre` | Energy regulatory authority |
| `iscir` | Pressure equipment and lifts authority |
| `incendiu` | Fire safety |
| `nzeb` | Near-zero energy buildings |
| `fiscal` | Fiscal and tax aspects |
| `munca` | Labour and workplace safety |
| `mediu` | Environmental requirements |

### `status`

Current legal status. Allowed values: `active`, `repealed`, `partially_repealed`, `unknown`.

### `source_url`

URL of the official source page for this act. Required. Use Portal Legislativ, Monitorul Oficial, or relevant authority pages. Do not use third-party sources.

### `last_checked`

Date the source was last verified, in `YYYY-MM-DD` format. Update this when you re-verify the source.

### `tags`

Array of lowercase keyword strings. At least one required. Use consistent terms across acts (e.g. `constructii`, `autorizatii`, `urbanism`).

---

## Optional fields

### `short_title`

Short, commonly used title. Example: `"Legea 50/1991"`.

### `canonical_citation`

Standard human-readable citation. Example: `"Legea nr. 50/1991"`.

### `number`

Official act number. Example: `"50"`. String to accommodate acts without a number.

### `year`

Year the act was issued. Example: `"1991"`.

### `issuer`

Full official name of the issuing body. Example: `"Parlamentul României"`.

### `issuing_body_kind`

Category of the issuing body. Allowed values: `parlament`, `guvern`, `minister`, `autoritate`, `other`.

### `topics`

Secondary classification topics that supplement `domain`. Array of strings. Use for cross-domain acts or specific sub-topics.

Example: `["autorizare-constructii", "urbanism", "locuinte"]`

### `issue_date`

Date the act was signed or issued, `YYYY-MM-DD`. Example: `"1991-07-29"`.

### `effective_date`

Date the act entered into force, `YYYY-MM-DD`. May differ from `issue_date`.

### `publication_medium`

Where the act was officially published. Allowed values: `monitorul-oficial`, `portal-legislativ`, `minister`, `other`.

### `publication_date`

Date of official publication, `YYYY-MM-DD`.

### `official_source`

Human-readable name of the official source. Example: `"Portal Legislativ — legislatie.just.ro"`.

### `official_detail_url`

Direct URL to the official detail page. May be the same as `source_url` or more specific.

### `version_kind`

Nature of the text version tracked. Allowed values:

| Value | Meaning |
|---|---|
| `original` | Original text as first published |
| `republicat` | Officially republished version |
| `consolidat` | Consolidated form incorporating all amendments |
| `excerpt-only` | Partial excerpt, not the full text |

### `consolidated_as_of`

Date of the consolidated form, `YYYY-MM-DD`. Use when `version_kind` is `consolidat`.

### `version`

Free-text version note. Use for nuance not captured by structured fields.

### `article_count`

Number of articles in the imported text. Integer.

### `annex_count`

Number of annexes in the imported text. Integer.

### `import_method`

Short description of how the text was imported. Example: `"printable HTML → Markdown"`.

### `rights_note`

Note on reuse rights or uncertainty for this specific act. See also `COPYRIGHT_NOTES.md`.

### Relationship fields

The simple relationship arrays remain backward-compatible and confirmed-only:

- `related_acts`: graph-visible confirmed weak relationships. The generator
  emits these as `relationship: "related"` and `review_status: "confirmed"`.
- `implements`, `amends`, `amended_by`: confirmed simple metadata fields. They
  remain supported and validated, but the current graph generator emits them
  only when the same edge is also represented in structured `relationships[]`.

Use optional `relationships[]` records when an edge needs confidence or evidence
annotation. New records should use `type`; `relationship` is accepted as a
backward-compatible alias, but a record must not use both. Supported values are
currently `related_to`, `implements`, `amends`, `amended_by`, `references`, and
`cites`.

Structured records preserve `confidence`:

- `confirmed` becomes graph `review_status: "confirmed"`;
- `suggested` and `inferred` become graph `review_status: "needs_review"`;
- `confirmed` with `evidence_type: "inferred"` is invalid.

Current validation requires at least one non-empty provenance field: `evidence`,
`source_url`, `evidence_path`, or `notes`. For confirmed relationships, use
`evidence`, `source_url`, or `evidence_path`; `notes` alone is annotation, not
source evidence. Fields such as `reviewed_by`, `reviewed_at`, `source_article`,
and `scope` are annotations; they do not prove the relationship by themselves.

Illustrative schema-valid example:

```json
{
  "relationships": [
    {
      "type": "references",
      "target": "example-act-2000",
      "confidence": "suggested",
      "evidence_type": "cross_reference",
      "evidence": "Illustrative example: source act names Example Act 2000, pending review.",
      "evidence_path": "cross-references/relationships-diff.md"
    }
  ]
}
```

---

## Example — Legea 50/1991

See `metadata/acts/lege-50-1991.json` for a complete example using all available fields.

---

## Validation

Run locally before every PR:

```sh
node scripts/validate-metadata.mjs
```

This checks required fields, enum values, date format, unknown fields, and
structured relationship target/evidence rules against the schema.
