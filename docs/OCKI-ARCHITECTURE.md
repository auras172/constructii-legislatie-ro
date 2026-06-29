# OCKI Architecture

> Open Construction Knowledge Infrastructure — Ecosystem Architecture Reference

<!-- version: 1.0 | date: 2026-06-29 | status: draft -->

---

## 1. Purpose

OCKI (Open Construction Knowledge Infrastructure) is a federated, open-source knowledge infrastructure for the Romanian construction sector. It is not a single repository. It is an ecosystem of typed repositories linked by a shared graph and ontology, each holding a distinct layer of construction knowledge — legislation, authority profiles, guides, templates, reference data, and the cross-repo knowledge graph that connects them. The goal is to make construction knowledge machine-readable, provenance-first, and reusable across applications without reimporting or re-scraping official sources. Primary consumers are human contributors (engineers, architects, lawyers, researchers), AI coding agents, RAG pipelines, compliance tools, and end-user applications such as Radar Meseriași.

---

## 2. The Six-Layer Model

Each layer is a logical tier of the ecosystem. A single layer may span multiple repositories or, in the case of the consumption layer, no OCKI repository at all.

| Layer | Name | Description | Primary repo(s) |
|-------|------|-------------|-----------------|
| 1 | Legislation & Regulation | Laws, government decisions, ministerial orders, technical normatives published in Monitorul Oficial or equivalent official gazette | `constructii-legislatie-ro` |
| 2 | Authorities | Structured profiles of organizations that produce, publish, or enforce construction knowledge | `constructii-authorities-ro` |
| 3 | Guides & Methodologies | Official guides, best practices, and methodologies from public bodies and professional associations | `constructii-guides-ro`, `constructii-guides-oar-ro` |
| 4 | Templates & Forms | Contract models, official forms, regulatory checklists | `constructii-templates-ro` |
| 5 | Ontology & Knowledge Graph | Taxonomy, entity types, typed relationships, cross-repo aggregated graph | `constructii-knowledge-graph-ro` |
| 6 | Consumer Applications | End-user applications that consume the OCKI graph — no OCKI repo needed for this layer | Radar Meseriași, RAG systems, AI agents, semantic search tools |

**Layer 1** is the foundation: enacted law and regulation with full provenance and cross-reference metadata. Every other layer connects back to it via typed relationships.

**Layer 2** provides the institutional context. Without knowing which authority issued a normative, relationships between documents are opaque. Authority profiles turn authorities from plain text strings into queryable graph nodes.

**Layer 3** captures the interpretive and applied layer: guides explain how practitioners should apply legislation. They are not law, but they shape how the law is understood. They must be modelled as a distinct, typed layer.

**Layer 4** holds operational artifacts — the forms, contracts, and checklists that practitioners actually fill in. Many are published by the same authorities that publish guides, but their structure and reuse constraints differ.

**Layer 5** is the integration layer. It does not store source documents. It aggregates nodes and edges from all other layers into a unified, traversable graph. Queries that cross layer boundaries — "which authorities publish templates that reference Legea 50/1991?" — require this layer.

**Layer 6** is consumption only. Applications use the graph as a read-only knowledge source. They do not contribute back to the graph directly; contributions flow through the appropriate typed repository.

---

## 3. Repository Map

### 3.1 `constructii-legislatie-ro` (existing)

The foundation layer of OCKI. Contains enacted law and formal regulation: laws (`lege`), government decisions (`hotarare`), ministerial orders (`ordin`), and technical normatives (`normativ`) from bodies such as MDLPA, ISCIR, and ANRE, where those normatives are published as annexes to legislation or in the Monitorul Oficial.

**Contains:**
- Full-text Markdown files for acts where official text is public domain
- Metadata-only JSON entries for acts where text rights are unclear
- Import log entries with full provenance for every imported act
- Relationship metadata (implements, amends, cites, requires, supersedes, repeals)
- Cross-reference graph edges between acts in this repository

**Does NOT contain:**
- Guides and methodologies published by professional bodies (OAR, ARACO, etc.)
- Contract templates or form templates
- Professional standards not enacted as legislation
- Authority profile documents
- Any content not traceable to an official source

### 3.2 `constructii-authorities-ro` (planned)

Structured profiles for organizations that produce, publish, or enforce Romanian construction knowledge. Each profile is a machine-readable JSON document following the Authority Profile Model defined in Section 5.

**Contains:**
- One JSON file per authority
- Metadata covering roles, jurisdiction, topics, legal basis, known publications
- Typed relationships between authorities (supervises, reports_to, collaborates_with)
- Links from authority publications to their corresponding entries in other OCKI repos

**Does NOT contain:**
- The full text of any document published by an authority
- Opinions or commentary on an authority's decisions
- Any content not sourced from the authority's own official channels or its legal basis in legislation

Example authorities: OAR, ISC, MDLPA, ANRE, ISCIR, ANCPI, IGSU, INCD-URBAN-INCERC.

### 3.3 `constructii-guides-ro` / `constructii-guides-oar-ro` (planned)

Official guides, methodologies, and best practices from public bodies. Content is metadata-only by default unless explicit reuse rights are confirmed in writing (see Section 8).

The split into a generic repo and an OAR-specific repo is intentional: OAR alone has 60+ public documents spanning 2021–2026, across distinct series (rural architecture, professional practice, competition procedures, digital tools). Mixing OAR output into a generic guides repo would make the generic repo OAR-dominated and harder to navigate. A dedicated `constructii-guides-oar-ro` repo keeps each collection bounded and auditable.

**Contains:**
- Metadata-only entries (title, publisher, date, URL, series, relationships) for guides where full text cannot be confirmed as freely reusable
- Full-text entries only where explicit reuse rights are confirmed and recorded
- Series/collection metadata linking related guides (see Section 6)

**Does NOT contain:**
- Enacted legislation (belongs in Layer 1)
- Authority profile documents (belongs in Layer 2)
- Contract templates (belongs in Layer 4)

### 3.4 `constructii-templates-ro` (planned)

Contract models, official forms, and regulatory templates. OAR publishes three publicly accessible contract models (DOC/DOCX format). MDLPA publishes forms covering the construction authorization workflow.

**Contains:**
- Metadata-only entries for templates where reuse rights are unconfirmed
- Full-text or structured entries for templates confirmed as public domain or explicitly licensed
- Relationships linking templates to the legislation that mandates or references them

**Does NOT contain:**
- Filled-in or completed forms
- Any form derived from a private source

### 3.5 `constructii-reference-data-ro` (planned)

Classification data, code lists, and reference tables used across the construction sector.

**Contains:**
- Building use categories
- Construction work type codes
- Risk class classifications (Legea 10/1995 framework)
- Official zone designations
- Any stable enumeration referenced by multiple acts

**Does NOT contain:**
- Full legislative text (belongs in Layer 1)
- Statistical outputs (not reference data)

### 3.6 `constructii-knowledge-graph-ro` (planned)

The cross-repo knowledge graph. Aggregates nodes and edges from all other OCKI repositories into a unified, traversable graph. This repository is not a source-of-truth repository. It is a derived artifact — its content is generated from the other layers, not authored directly. All edits to the graph must be made in the source repositories; the knowledge graph repo is rebuilt from those sources.

**Contains:**
- Aggregated node files (Act, Authority, Guide, Template, Collection)
- Aggregated edge files (all relationship types from all repos)
- Graph export artifacts (JSON-LD, Cypher-compatible, SPARQL-compatible)
- Ontology definition (entity types, relationship types, schema)

**Does NOT contain:**
- Source documents
- Any content not derivable from another OCKI repository

---

## 4. Why `constructii-legislatie-ro` Stays Focused

The OAR discovery audit surfaced 60+ valuable public documents across guides, methodologies, contract templates, statistics, and professional standards. None of these belong in `constructii-legislatie-ro`. This section states the boundary explicitly so it does not drift.

The boundary is type-based, not quality-based:

- `constructii-legislatie-ro` contains **enacted law and formal regulation** — acts published in the Monitorul Oficial, government decisions, ministerial orders, and technical normatives with a legislative basis.
- OAR guides are **professional body publications** — important, interpretive, practitioner-facing, but not law. They explain how architects should apply legislation. They are not the legislation itself.

Mixing the two creates an ambiguous repository. An AI agent reading `constructii-legislatie-ro` to understand the legal framework for construction authorization should not encounter professional guidelines from OAR alongside laws enacted by Parliament. The presence of mixed content forces the agent to do type inference that a properly layered structure makes unnecessary.

The analogy is direct: the Romanian Parliament enacts laws. OAR publishes guidance on how architects should comply with them. Both are authoritative within their respective domains. They should live in separate, typed layers so consumers can choose exactly which layers they need.

This is not a statement about the value of OAR publications. It is a statement about architecture hygiene. OAR publications belong in `constructii-guides-oar-ro`, authority-specific metadata in `constructii-authorities-ro`, and contract templates in `constructii-templates-ro`.

---

## 5. Authority Profile Model

The authority profile is the proposed schema for Layer 2 entries in `constructii-authorities-ro`. It is not yet implemented; this section defines the target state.

```yaml
authority:
  id: oar
  name: Ordinul Arhitecților din România
  abbreviation: OAR
  type: professional_body
  roles:
    - regulator
    - professional_body
    - standards_publisher
    - template_provider
    - education_provider
    - statistics_provider
  jurisdiction: Romania
  legal_basis: Legea 184/2001
  website: https://oar.archi
  topics:
    - architecture
    - urbanism
    - professional_practice
    - construction_permits
  publishes:
    - guides
    - contracts
    - methodologies
    - professional_standards
    - statistics
  references_legislation:
    - lege-184-2001
    - lege-50-1991
    - hg-907-2016
```

The `roles` field is a controlled vocabulary. An authority may hold multiple roles simultaneously — OAR is both a professional body and a statistics publisher (via the SiOAR platform).

The `references_legislation` field uses OCKI slugs, enabling graph traversal in both directions: from an authority to the laws that govern it, and from a law to the authorities it created or regulates.

This model enables queries such as:

- "Which authorities publish templates?" — filter on `roles` containing `template_provider`
- "Which authorities reference Legea 50/1991?" — traverse `references_legislation` edges
- "What does OAR publish that relates to construction authorization?" — traverse from OAR authority node via `published_by` edges, filtered by topic `construction_permits`

---

## 6. Document Family Model

Individual documents within a series are not independently navigable without knowing they belong to a series. The 50-volume OAR rural architecture guide series is the clearest example: each volume covers a distinct architectural zone. A consumer searching for guidance on construction in Maramureș needs to know this is volume N of a 50-volume series, not a standalone document.

The Collection entity type captures this:

```yaml
collection:
  id: ghiduri-arhitectura-rurala-oar
  name: Ghiduri de Arhitectură Rurală
  publisher: oar
  type: series
  status: active
  started: 2021
  updated: 2026
  member_count: ~50
  geographic_scope:
    level: zone
    coverage: Romania (all major architectural zones)
  members:
    - ghid-arhitectura-zona-vrancea
    - ghid-arhitectura-zona-maramures
    - ghid-arhitectura-zona-dobrogea
    # ... all zone volumes
```

The Knowledge Graph must model the series as an entity in its own right, not merely as a tag on individual documents. This enables:

- "How many zones does the OAR rural architecture series cover?" — query `member_count` on the collection node
- "Is there a guide for my zone?" — traverse `member_of_series` edges from the collection to its members, filtered by geographic scope
- "When was this series last updated?" — query `updated` on the collection node, without reading every member

A document's `series_id` and `series_position` fields in the Document Passport (Section 9) link it back to its Collection node.

---

## 7. Relationship Types

The existing relationship vocabulary defined in `docs/relationship-specification.md` covers legislative hierarchy and lifecycle: `implements`, `amends`, `cites`, `requires`, `supersedes`, `repeals`. Cross-layer connections require additional relationship types.

The following types are proposed for use across OCKI layers. All relationships must be evidence-backed. No edge is added to the graph without a source citation.

| Relationship | Direction | Example |
|---|---|---|
| `published_by` | document → authority | Misiunile Arhitectului → OAR |
| `maintained_by` | document → authority | Ghid BIA → OAR |
| `member_of_series` | document → collection | Ghid Vrancea → Ghiduri Rurale OAR |
| `derived_from` | document → document | Raport SiOAR 2024 → sioar.ro dataset |
| `uses_template` | document → template | Contract Misiunile Arhitectului → OAR model contract |
| `references_professional_standard` | legislation → standard | Legea 50/1991 → OAR norme profesionale |
| `based_on_methodology` | guide → methodology | Ghid concursuri → OAR Misiunile Arhitectului |
| `supervised_by` | authority → authority | ISC → MDLPA |
| `collaborates_with` | authority → authority | OAR ↔ ISC |
| `legal_basis_of` | legislation → authority | Legea 184/2001 → OAR |
| `authorized_to_publish` | authority → document type | OAR → professional standards |

These types extend, not replace, the existing relationship vocabulary. The combined set covers the full range of connections from Layer 1 (legislation) through Layer 5 (knowledge graph).

---

## 8. Metadata-Only Rule for Non-Legislative Sources

This section states OCKI's default policy for content from professional bodies, associations, and non-legislative authorities.

**Default: metadata-only.**

For documents from professional bodies (OAR, ARACO, etc.) and non-legislative technical bodies (ISCIR prescripții tehnice full text, ANRE technical norms full text):

- Import as metadata-only unless explicit written reuse rights are confirmed.
- Metadata (title, publisher, date, URL, series, relationships) is not subject to copyright and may always be imported.
- Full-text import requires either: (a) confirmed public domain status, or (b) an explicit license from the publisher permitting reuse, recorded in the metadata.
- Record `reuse_rights: confirmed | unconfirmed | restricted` in every non-legislative metadata entry.

**Applies to:**
- OAR guides, methodologies, contract models
- ISCIR prescripții tehnice (full text)
- ANRE technical norms (full text, unless published as Monitorul Oficial annexes)
- Any document not published as an annex to a law in the Monitorul Oficial

**Does not apply to:**
- Acts published in the Monitorul Oficial — these are public domain by Romanian law
- Metadata fields of any document regardless of source

This rule protects OCKI repositories from copyright exposure and maintains the trust model established in `docs/ai-contract.md`: every piece of content must be traceable to a legitimate source with verified reuse rights.

---

## 9. Document Passport

The Document Passport is the complete metadata profile for any OCKI document regardless of which repository it lives in. It extends the current metadata schema with fields that become necessary when documents span multiple layers and series.

Fields beyond the current schema:

| Field | Type | Description |
|-------|------|-------------|
| `geographic_scope` | object | `level` (Romania / zone / county / municipality) + `coverage` (specific zones or counties) |
| `series_id` | string | Slug of the Collection this document belongs to, if any |
| `series_position` | integer | Position within the series (1-indexed) |
| `access_level` | enum | `public` / `members-only` / `restricted` |
| `update_frequency` | enum | `annual` / `irregular` / `once` |
| `regulatory_basis` | array | Slugs of OCKI acts cited inline as the legal basis |
| `language` | enum | `ro` / `en` / `bilingual` |
| `file_format` | enum | `pdf` / `docx` / `html` / `markdown` |
| `reuse_rights` | enum | `confirmed` / `unconfirmed` / `restricted` |
| `checksum` | string | SHA-256 of the source file, optional, for integrity verification |
| `replaces` | string | Slug of the previous edition this document supersedes |
| `replaced_by` | string | Slug of the newer edition, when known |

Not all fields are required for every document. The schema is additive: a metadata entry is valid if it satisfies the required fields for its document type. Fields listed here are optional unless the document type definition specifies otherwise.

---

## 10. Pilot Plan

Four phases, in order. Each phase is a prerequisite for the next.

### Phase 1 — Document architecture (current)

Create this document. Define layer boundaries, naming conventions, authority profile model, document family model, relationship types, metadata-only policy, and document passport. No code changes. No schema changes. No new repositories created. No imports.

**Deliverable:** `docs/OCKI-ARCHITECTURE.md` in `constructii-legislatie-ro`.

### Phase 2 — Authority profile schema

Create the `constructii-authorities-ro` repository following the OCKI repository specification (`docs/ocki-repository-specification-v1.md`). Define the authority profile JSON schema. Add three pilot authority profiles: OAR, ISC, MDLPA.

**Deliverable:** `constructii-authorities-ro` repo with schema definition and three pilot profiles.

### Phase 3 — OAR metadata-only pilot

Create the `constructii-guides-oar-ro` repository. Import five metadata-only entries using the same import patterns established in `constructii-legislatie-ro`:

1. Misiunile Arhitectului (OAR, professional practice guide)
2. Ghid organizare concursuri de arhitectură 2025
3. Model contract prestări servicii arhitectură
4. Raport SiOAR 2024 (annual statistics report)
5. OAR TNA Web (electronic signature guidance)

All five as metadata-only with `reuse_rights: unconfirmed`. No full-text import until rights are confirmed.

**Deliverable:** `constructii-guides-oar-ro` repo with five metadata-only entries and cross-repo relationship edges.

### Phase 4 — Cross-repo graph links

Add relationship edges from OAR documents (in `constructii-guides-oar-ro`) to legislation (in `constructii-legislatie-ro`). Specifically:

- Misiunile Arhitectului → `cites` → `lege-184-2001`
- Misiunile Arhitectului → `cites` → `lege-50-1991`
- OAR TNA Web → `implements` → `oug-140-2020` (electronic signature framework)
- Model contract prestări servicii → `references_professional_standard` → OAR norme deontologice

These edges validate that the cross-repo graph traversal works and that the relationship types defined in Section 7 are sufficient for real content.

**Deliverable:** Graph edges in both source repos; verification that a traversal from `lege-50-1991` reaches OAR publications via the graph.

---

## 11. Discovery Queue

The following authority audits are queued for research. Research means: identify what an authority publishes, how it is structured, and whether it warrants its own OCKI repo. No imports until architecture is in place.

1. **ISC** — Inspectoratul de Stat în Construcții: inspection circulars, technical guidance, enforcement decisions
2. **ANRE** — full document catalog: technical norms, authorization procedures, tariff regulations
3. **ISCIR** — all prescripții tehnice (PT series): boilers, pressure vessels, lifting equipment, gas installations
4. **ANCPI** — cadastre and land registration: norms, circulars, forms
5. **IGSU** — fire safety: normative P118 series, authorization procedures
6. **INCD-URBAN-INCERC** — research publications: technical reports, seismic design guidance
7. **ARACO** — contractor association: guides, contract models, position papers
8. **APM** (county environmental agencies) — environmental permits: procedures, forms, applicable legislation

Each audit produces a structured report covering: what the authority publishes, document count estimate, access level (public / restricted), reuse rights status, and recommended OCKI repo placement.

---

## 12. Naming Conventions

All OCKI repositories follow a two-pattern naming scheme:

**General collections:**
```
constructii-{type}-ro
```
Examples: `constructii-guides-ro`, `constructii-templates-ro`, `constructii-reference-data-ro`

**Authority-specific collections (high volume):**
```
constructii-{type}-{authority}-ro
```
Examples: `constructii-guides-oar-ro`, `constructii-templates-mdlpa-ro`

Use the authority-specific pattern when a single authority's output in a given type would dominate a generic repo. The threshold is judgement-based; the OAR guide corpus (60+ documents) clearly warrants its own repo. A body with two published guides does not.

All OCKI repositories apply the conventions established in `docs/ocki-repository-specification-v1.md`:

- **Metadata-first:** structured JSON metadata for every document before any full text
- **Provenance-explicit:** every import has a traceable log entry with source URL and access date
- **Graph-aware:** every document has relationship fields linking it to the graph
- **AI-readable:** `AGENTS.md` and `PROMPTS.md` contracts in every repo
- **CI-validated:** automated checks on metadata schema, relationship consistency, and markdown hygiene on every PR

---

## Cross-References

- `docs/ocki-repository-specification-v1.md` — repository-level conventions all OCKI repos must follow
- `docs/knowledge-graph-specification.md` — node types, edge types, graph serialization, multi-repo federation
- `docs/relationship-specification.md` — authoritative relationship type definitions (Layer 1 vocabulary)
- `docs/ai-contract.md` — binding rules for AI agent contributions across all OCKI repositories
- `ocki-manifest.json` — machine-readable manifest of the current repository's content and schema version
