# Construction Legislation Taxonomy

This document defines the first practical taxonomy used by
`constructii-legislatie-ro` to classify Romanian construction-related acts.

It is a contributor and AI-agent guide. It does not change the metadata schema
and does not reclassify existing acts by itself.

## Classification Rules

Each act has one primary `domain` in `metadata/acts/<slug>.json`.

Use the primary `domain` for the act's main legal or technical function. Use
`topics` and `tags` for secondary themes, materials, authorities, procedures, or
subdomains.

Good pattern:

```json
{
  "domain": "calitate",
  "topics": ["beton", "executare-lucrari-beton"],
  "tags": ["mdlpa", "normativ-tehnic", "ne012"]
}
```

Avoid:

- choosing a domain only because an act mentions that topic once;
- creating graph relationships from domain similarity;
- changing schema enum values in a metadata-only PR;
- using tags as legal evidence.

When an act spans multiple areas, choose the domain that best describes why the
act is tracked in this repository, then record the secondary areas in `topics`
or `tags`.

## Primary Domains

| Domain | Use For | Examples |
|---|---|---|
| `autorizatii` | Building permit and authorization framework, permit procedures, documentation for authorizing construction works. | Legea 50/1991; Ordin MDRAP 839/2009 |
| `urbanism` | Spatial planning, urban planning, territorial planning, urbanism documentation and planning frameworks. | Legea 350/2001 |
| `executie` | Construction execution rules when the act is mainly about execution as a standalone domain. Use sparingly; many execution norms currently sit under `calitate` with execution topics. | Future execution-specific acts where `calitate` is too broad |
| `receptie` | Reception of construction works, completion/acceptance procedures, handover rules, reception commissions. | HG 343/2017; Legea 141/2026 |
| `calitate` | Construction quality system, technical design/execution norms, structural design, materials, accessibility, concrete, timber, sanitary/electrical installations when tracked as MDLPA technical construction norms. | Legea 10/1995; P 100-1/2013; NE 012/1-2022; I 7-2011; NP 005-2022 |
| `isc` | State Construction Inspectorate organization, mandate, control role, ISC authority records. | OG 63/2001; HG 525/2013 |
| `anre` | ANRE energy regulations relevant to construction, electrical connection, grid capacity allocation, electrician authorization, and energy-sector procedures. | Ordin ANRE 59/2013; Ordin ANRE 66/2023; Ordin ANRE 53/2024 |
| `iscir` | ISCIR technical prescriptions for pressure equipment, boilers, installations under pressure, lifting equipment, and related technical safety prescriptions. | PT C1-2010; PT C10-2010; PT R1-2010; Legea 64/2008 |
| `incendiu` | Fire safety, civil protection, emergency management, fire detection/suppression norms, fire prevention and response framework. | Legea 307/2006; P 118-1/2025; P 118/2-2013; P 118/3-2015 |
| `nzeb` | Energy performance of buildings, near-zero energy buildings, building energy methodology, energy performance guides. | Legea 372/2005; Mc 001-2022; RTC 3-2022 |
| `fiscal` | Fiscal, tax, fees, charges, or public-finance acts relevant to construction when that is the primary reason for tracking. | Future fiscal construction acts |
| `munca` | Labour safety, workplace health and safety, construction-site occupational safety. | Legea 319/2006; HG 300/2006 |
| `mediu` | Environmental permitting, environmental impact assessment, environmental protection obligations affecting construction projects. | OUG 195/2005; Legea 292/2018 |

## Topics And Tags

Use `topics` for structured secondary classification. Use `tags` for search and
agent retrieval. They may overlap, but they should stay factual and short.

Recommended topic families:

| Topic Family | Example Values | Notes |
|---|---|---|
| Authority | `mdlpa`, `anre`, `iscir`, `isc` | Usually tags; use topics when the authority is also a meaningful subdomain. |
| Procedure | `autorizare-constructii`, `receptie-constructii`, `racordare`, `evaluare-impact` | Helps group workflows. |
| Technical system | `instalatii-electrice`, `instalatii-sanitare`, `instalatii-sub-presiune`, `retele-electrice` | Useful for Radar-style practical checks. |
| Material/structure | `beton`, `beton-armat`, `zidarie`, `lemn`, `seismic` | Prefer specific terms over broad synonyms. |
| Safety | `securitate-incendiu`, `securitate-munca`, `securitate-tehnica`, `protectie-civila` | Do not infer legal relationships from shared safety tags. |
| Import status | `metadata-only`, `text-oficial`, `forma-actualizata`, `forma-republicata` | These help search but do not replace `import_method` or `version_kind`. |

Tags should be lowercase, hyphenated, and stable. Prefer existing tags before
creating new ones.

## Choosing A Domain

Use this order of questions:

1. What is the main official purpose of the act?
2. Why is this act tracked in this repository?
3. Which existing domain would a contributor most likely search first?
4. Are secondary themes better represented as `topics` or `tags`?

Examples:

- A technical norm for concrete execution should usually be `calitate`, with
  topics such as `beton` and `executare-lucrari-beton`.
- An ANRE order amending the electrical connection regulation should be `anre`,
  even if it affects construction projects.
- A fire-detection norm should be `incendiu`, not `calitate`, when its main
  purpose is fire safety.
- A labour-safety act for temporary construction sites should be `munca`, with
  tags for `santiere-temporare-mobile`.
- A law about environmental impact assessment should be `mediu`, even if it is
  often needed before construction authorization.

## Relationship Boundary

Taxonomy is not relationship evidence.

Do not add `related_acts`, `amends`, `amended_by`, or `implements` because two
acts share a domain, tag, authority, material, or technical family. Relationships
require source-backed evidence documented in metadata, import logs, official
text, or reviewed cross-reference artifacts.

Examples:

- Two P 118 norms can share `incendiu` and `p118` tags without being linked.
- PT C prescriptions can share `iscir` and `securitate-tehnica` tags without
  sibling graph edges.
- ANRE amendment orders can link to `ordin-anre-59-2013` only when the official
  act or Portal Legislativ action chain confirms the amendment.

## Extension Policy

Add a new domain only when the current enum cannot classify a recurring class of
acts without distortion. A new domain requires a separate schema/documentation
PR and should not be bundled with an act import.

For one-off nuance, prefer `topics`, `tags`, and `rights_note`.

## AI Agent Checklist

Before choosing or changing a domain:

- read `metadata/schema.json`;
- inspect similar existing metadata files;
- verify the official source and title;
- choose one primary domain;
- use `topics` or `tags` for secondary ideas;
- document uncertainty in the import log instead of guessing;
- run metadata and Markdown validation before opening a PR.

