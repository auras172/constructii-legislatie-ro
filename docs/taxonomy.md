# Construction Legislation Taxonomy

This document explains the first-level taxonomy used to classify acts in `metadata/acts/*.json`.

It is contributor guidance, not a legal interpretation. The canonical allowed values are still defined in `metadata/schema.json`. Do not add a new domain to metadata unless the schema is intentionally updated in a separate, reviewed pull request.

## How To Use This Taxonomy

Each act has one primary `domain`. Choose the domain that best describes why the act is tracked in this repository.

Use `topics` and `tags` for secondary concepts. Do not force one act into multiple domains by duplicating metadata entries.

When uncertain:

- prefer the domain already used by similar tracked acts;
- document uncertainty in the import log or PR body;
- avoid changing existing classifications as part of unrelated work.

## Domains

| Domain | Use for | Examples in repository |
|---|---|---|
| `autorizatii` | Building permits, authorization procedures, and administrative rules for construction works. | `lege-50-1991`, `ordin-839-2009` |
| `urbanism` | Spatial planning, urbanism, territorial planning, and planning documentation frameworks. | `lege-350-2001` |
| `executie` | Construction execution rules that are not better classified under a narrower technical domain. | Use only when no more specific domain fits. |
| `receptie` | Reception of construction works, completion checks, and post-construction handover procedures. | `hg-343-2017`, `lege-141-2026` |
| `calitate` | Construction quality, design/execution technical norms, structural or installation norms, and general technical performance requirements. | `lege-10-1995`, `normativ-cr6-2013`, `normativ-i7-2011`, `normativ-i9-2022`, `normativ-ne012-1-2007` |
| `isc` | State Construction Inspectorate organization, inspection, and control framework. | `og-63-2001`, `hg-525-2013` |
| `anre` | Energy regulator acts, grid connection, prosumer, authorization, and energy-sector construction dependencies. | `ordin-anre-59-2013`, `ordin-anre-66-2023`, `ordin-anre-60-2024` |
| `iscir` | ISCIR technical prescriptions, pressure equipment, lifting equipment, boilers, and related safety prescriptions. | `lege-64-2008`, `normativ-pt-c1-2010`, `normativ-pt-r2-2010` |
| `incendiu` | Fire safety, civil protection, emergency management, and P118-family fire-safety norms. | `lege-307-2006`, `oug-21-2004`, `normativ-p118-1-2025`, `normativ-p118-2-2013` |
| `nzeb` | Energy performance of buildings and near-zero energy building methodology. | `lege-372-2005`, `metodologie-mc001-2022`, `ghid-rtc3-2022` |
| `fiscal` | Taxes, fees, fiscal treatment, and fiscal obligations tied to construction activity. | No current primary examples; use only with source-backed need. |
| `munca` | Occupational health and safety, labor safety, and construction-site workplace rules. | `lege-319-2006`, `hg-300-2006` |
| `mediu` | Environmental permitting, environmental impact assessment, and environmental protection rules relevant to construction projects. | `oug-195-2005`, `lege-292-2018` |

## Choosing Between Nearby Domains

### `calitate` vs `executie`

Use `calitate` for technical norms and laws tied to construction quality, design verification, technical performance, materials, or building systems.

Use `executie` only for execution-focused acts that are not better classified as `calitate`, `munca`, `iscir`, `incendiu`, or another narrower domain.

### `isc` vs `iscir`

Use `isc` for the State Construction Inspectorate and construction quality control institutions.

Use `iscir` for ISCIR prescriptions and the regulated safety regime for pressure equipment, lifting equipment, boilers, and similar technical equipment.

### `incendiu` vs `calitate`

Use `incendiu` when the primary reason for tracking the act is fire safety, civil protection, emergency management, or fire-safety technical norms.

Use `calitate` when fire safety is only one quality requirement among many and the act is primarily a general technical or construction-quality norm.

### `anre` vs `calitate`

Use `anre` for ANRE-issued regulatory acts and electricity/gas regulatory dependencies, even when they affect construction projects.

Use `calitate` for building technical norms issued through construction ministries or technical regulation channels.

## Topics And Tags

Use `topics` for secondary classification and `tags` for search keywords.

Examples:

- A primary `domain` of `anre` may have topics such as `racordare`, `energie-electrica`, `prosumeri`.
- A primary `domain` of `calitate` may have topics such as `structura`, `beton`, `lemn`, `instalatii`.
- A primary `domain` of `incendiu` may have topics such as `p118`, `securitate-la-incendiu`, `stingere`.

Tags should stay short, lowercase, and reusable. Prefer existing vocabulary over one-off phrases.

## Relationship To Graph Data

Domains are not graph relationships.

Do not add `related_acts`, `amends`, or `amended_by` only because two acts share the same domain. Graph-visible relationships require source-backed evidence, as described in `docs/relationship-specification.md`.

## Maintenance Rules

- Keep `metadata/schema.json` as the canonical enum source.
- Update this document when the schema adds or removes a domain.
- Do not reclassify existing acts in a taxonomy-only PR.
- Keep examples current but small; this is guidance, not a full index.
