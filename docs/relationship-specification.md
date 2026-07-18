# OCKI Relationship Type Specification

**Status:** Authoritative
**Version:** 1.0.0
**Date:** 2026-06-28
**Scope:** All OCKI repositories containing Romanian legislative corpora

---

## Table of Contents

1. [Overview](#1-overview)
2. [Relationship Taxonomy](#2-relationship-taxonomy)
3. [Relationship Type Definitions](#3-relationship-type-definitions)
   - [3.1 Legislative Hierarchy](#31-legislative-hierarchy)
   - [3.2 Amendments and Lifecycle](#32-amendments-and-lifecycle)
   - [3.3 References and Citations](#33-references-and-citations)
   - [3.4 Subject Matter](#34-subject-matter)
   - [3.5 Institutional](#35-institutional)
   - [3.6 Derivations (Future)](#36-derivations-future)
4. [Current Schema Mapping](#4-current-schema-mapping)
5. [Schema Extension Plan](#5-schema-extension-plan)
6. [Confidence and Evidence Recording](#6-confidence-and-evidence-recording)
7. [Auto-Detection Rules](#7-auto-detection-rules)
8. [Validation Rules](#8-validation-rules)
9. [Romanian Legal Context](#9-romanian-legal-context)

---

## 1. Overview

### Why relationships matter

A flat list of legislative acts is a catalogue. A graph of typed, directed relationships is a knowledge base. OCKI relationship metadata serves four concrete purposes:

**Knowledge Graph traversal.** Traversing `implements` edges from a *normativ* backward to its enabling *lege* gives an AI agent or practitioner the complete legal chain without manual search. Traversing `amended_by` forward from a *lege* surfaces every modifying act that must be read together.

**Impact analysis.** When a primary act changes, the corpus MUST answer: *"what else is affected?"* Only typed relationships make this computable. An `implements` edge means the implementing act's substance may need re-checking; an `amends` edge means a text diff is required.

**Grounded RAG citations.** Retrieval-Augmented Generation answers citing a chunk from *Ordin nr. 839/2009* MUST be able to trace the chain: Ordin 839 `implements` Legea 50/1991, which `authorized_by` the Romanian Parliament. Without these edges, citations cannot be grounded in legal hierarchy and MUST NOT be presented as authoritative.

**Machine-queryable corpus.** Future tooling — checklists, permit wizards, compliance dashboards — MUST be able to query: *"give me all acts that regulate `autorizatii` and their implementing orders."* This is only possible when relationship types are explicit and typed in metadata.

### Relationship model

Every relationship is a directed edge:

```
source_act  --[relationship_type]-->  target_act
```

The source act is the one whose metadata JSON records the relationship. The target act is referenced by its slug (e.g., `lege-50-1991`). Some relationships are denormalized: both the forward and inverse edge are recorded in the respective act's metadata for query convenience.

---

## 2. Relationship Taxonomy

The relationship types are organized into six categories:

| Category | Types |
|---|---|
| **Legislative hierarchy** | `implements`, `authorized_by`, `derived_from` |
| **Amendments and lifecycle** | `amends`, `amended_by`, `repeals`, `repealed_by`, `supersedes`, `superseded_by` |
| **References and citations** | `cites`, `references`, `requires`, `depends_on` |
| **Subject matter** | `related_to`, `defined_by`, `regulates` |
| **Institutional** | `issued_by`, `enforced_by`, `approves` |
| **Derivations (future)** | `basis_for`, `operationalizes` |

**Strength ordering (informative, not normative):** `implements` > `authorized_by` > `derived_from` > `amends` > `requires` > `cites` > `references` > `depends_on` > `related_to`.

When two relationship types could both apply, record the stronger one. Do NOT record both unless the semantics genuinely differ.

---

## 3. Relationship Type Definitions

### 3.1 Legislative Hierarchy

These relationships describe the formal hierarchy through which Romanian law delegates authority and substance from primary legislation downward to implementing acts.

---

#### `implements`

| Property | Value |
|---|---|
| **Identifier** | `implements` |
| **Direction** | source (implementing act) → target (primary act) |
| **Node types** | Act → Act |
| **Cardinality** | many-to-many |
| **Inverse** | *(unnamed; recorded via `implemented_by` — see Schema Extension)* |
| **Schema field** | `implements` (existing) |

**Definition.** The source act gives legal effect to provisions of the target act. The source act's purpose is to operationalize, specify procedure for, or lay down norms pursuant to the target act. The enabling clause in the source act's preamble will typically cite the target act explicitly using phrases such as *"în aplicarea"*, *"în temeiul"*, or *"pentru punerea în aplicare a"*.

**Evidence requirement:** `explicit` — the target act MUST be named in the source act's legal basis (*temei legal*) or preamble.

**Confidence levels:**

| Confidence | Meaning |
|---|---|
| `confirmed` | Target act named in preamble or Art. 1 with standard enabling phrase |
| `suggested` | Target act named in title or first article without explicit "în aplicarea" formula |
| `inferred` | Domain and subject matter strongly match but enabling clause is absent |

**Example.** `ordin-839-2009` implements `lege-50-1991`. The Ordin's title states: *"pentru aprobarea Normelor metodologice de aplicare a Legii nr. 50/1991 privind autorizarea executării lucrărilor de construcții"*. Art. 1 of the Norma confirms *"în aplicarea Legii nr. 50/1991"*.

**Anti-patterns:**
- Do NOT use `implements` when an act merely cites another in passing. Use `references` instead.
- Do NOT use `implements` for an amending act. An amending act uses `amends`.
- Do NOT record `implements` without a named target slug. If the target is not yet in the corpus, leave the relationship unrecorded until the act is imported.

---

#### `authorized_by`

| Property | Value |
|---|---|
| **Identifier** | `authorized_by` |
| **Direction** | source (subordinate act) → target (authorizing act) |
| **Node types** | Act → Act |
| **Cardinality** | many-to-many |
| **Inverse** | `authorizes` |
| **Schema field** | `authorized_by` (new — see §5) |

**Definition.** The target act explicitly grants the source act's issuing body the power to issue acts of this type in this domain. `authorized_by` is narrower than `implements`: it captures the delegation of norm-making authority, not the act of exercising that authority to create implementing rules. An *ordin* that approves a *normativ* is typically both `authorized_by` its enabling *lege* and `implements` it; record both if both conditions are met.

**Evidence requirement:** `explicit` — the target act MUST contain a provision delegating authority to the issuing body (e.g., *"Ministerul ... va elabora norme metodologice..."*).

**Confidence levels:** same as `implements`.

**Example.** *Ordin nr. 839/2009* is `authorized_by` *Legea 50/1991* Art. 43 which empowers the ministry to issue implementing norms.

**Anti-patterns:**
- Do NOT conflate `authorized_by` with `implements`. A ministerial order may be authorized by one law but implement another.
- Do NOT use for general constitutional delegation (e.g., Government authorized by Constitution). Only record when a specific legislative act delegates specific authority.

---

#### `derived_from`

| Property | Value |
|---|---|
| **Identifier** | `derived_from` |
| **Direction** | source → target (parent act) |
| **Node types** | Act → Act |
| **Cardinality** | many-to-many |
| **Inverse** | `origin_of` |
| **Schema field** | `derived_from` (new — see §5) |

**Definition.** The source act draws its subject matter, definitions, or conceptual framework from the target act without being a formal implementation of it. This captures intellectual and substantive lineage that does not rise to formal legal delegation. Weaker than `implements`; stronger than `related_to`.

**Evidence requirement:** `structural` or `inferred` — derivation is established by analyzing subject matter overlap and shared definitions, not necessarily by explicit citation.

**Confidence levels:** `suggested` or `inferred` only. A `confirmed` `derived_from` should be promoted to `implements`.

**Example.** A technical *normativ* on seismic design *derived_from* *Legea nr. 10/1995* on construction quality, where the normativ's scope clause references the quality law's requirements without being issued pursuant to a specific delegating article.

**Anti-patterns:**
- Do NOT use `derived_from` when a formal enabling clause exists — use `implements`.
- Do NOT use as a catch-all for "similar topic." Use `related_to` for weak subject matter overlap.

---

### 3.2 Amendments and Lifecycle

These relationships track the modification and lifecycle of acts over time. They are essential for computing the current in-force state of any provision.

---

#### `amends`

| Property | Value |
|---|---|
| **Identifier** | `amends` |
| **Direction** | source (amending act) → target (amended act) |
| **Node types** | Act → Act |
| **Cardinality** | many-to-many |
| **Inverse** | `amended_by` |
| **Schema field** | `amends` (existing) |

**Definition.** The source act modifies text, adds provisions to, or deletes provisions from the target act. The source act contains explicit amendment articles (*"Articolul N se modifică și va avea următorul cuprins"*, *"După articolul N se introduce un nou articol"*, *"Articolul N se abrogă"*).

**Evidence requirement:** `explicit` — amendment articles MUST be present in the source act's text and name the target act.

**Confidence levels:**

| Confidence | Meaning |
|---|---|
| `confirmed` | Amendment articles present and target act named |
| `suggested` | Title indicates amendment but text not verified |

**Example.** `hg-343-2017` amends `hg-273-1994`. HG 343/2017's title: *"pentru modificarea Hotărârii Guvernului nr. 273/1994 privind aprobarea Regulamentului de recepție..."*.

**Anti-patterns:**
- Do NOT record `amends` without also recording the inverse `amended_by` in the target act's metadata (symmetry requirement — see §8).
- Do NOT use for acts that merely "interpret" or "clarify" without changing text. Use `references` or `related_to`.
- Do NOT record `amends` for acts that formally repeal and re-enact — use `repeals` + `supersedes`.

---

#### `amended_by`

| Property | Value |
|---|---|
| **Identifier** | `amended_by` |
| **Direction** | source (amended act) → target (amending act) |
| **Node types** | Act → Act |
| **Cardinality** | many-to-many |
| **Inverse** | `amends` |
| **Schema field** | `amended_by` (existing) |

**Definition.** The inverse of `amends`. Denormalized for query convenience: instead of reversing every `amends` edge at query time, the amended act records all acts that have modified it. This field answers the question *"what acts have changed this act?"*

**Evidence requirement:** Same as `amends` — symmetry is enforced by validation.

**Example.** `lege-50-1991` has `amended_by: [...]` listing all modifying acts. As of the 2026-03-27 consolidation, this list is populated from the Portal Legislativ consolidation history.

**Anti-patterns:**
- Do NOT populate `amended_by` with acts that merely cite or reference the act without modifying text.
- Do NOT leave `amended_by` empty when `amends` edges pointing to this act exist in other metadata files. Symmetry is required.

---

#### `repeals`

| Property | Value |
|---|---|
| **Identifier** | `repeals` |
| **Direction** | source (repealing act) → target (repealed act) |
| **Node types** | Act → Act |
| **Cardinality** | many-to-one (typically) |
| **Inverse** | `repealed_by` |
| **Schema field** | `repeals` (new — see §5) |

**Definition.** The source act contains an explicit *abrogare* provision removing the target act from the legal order in whole or in part. An act subject to partial repeal retains the `status: "partially_repealed"` designation in its metadata.

**Evidence requirement:** `explicit` — the source act MUST contain an abrogation article (*"Se abrogă Legea/HG/Ordinul nr. X/YYYY"*).

**Confidence levels:** `confirmed` only. If the abrogation is conditional or partial, record it with a note in the structured `relationships` object (see §6) rather than the simple array field.

**Example.** A future *lege* that explicitly abrogates *Legea nr. 50/1991* would record `"repeals": ["lege-50-1991"]`.

**Anti-patterns:**
- Do NOT infer repeal from supersession alone. Implicit repeal (*abrogare tacită*) is NOT recorded as `repeals`; use `supersedes` instead.
- Do NOT record partial repeal of individual articles as `repeals` of the whole act. Use the structured `relationships` format with a `scope` note.

---

#### `repealed_by`

| Property | Value |
|---|---|
| **Identifier** | `repealed_by` |
| **Direction** | source (repealed act) → target (repealing act) |
| **Node types** | Act → Act |
| **Cardinality** | one-to-many |
| **Inverse** | `repeals` |
| **Schema field** | `repealed_by` (new — see §5) |

**Definition.** Inverse of `repeals`. The source act has been explicitly repealed by the target act. An act with a non-empty `repealed_by` MUST have `status: "repealed"` or `status: "partially_repealed"`.

**Evidence requirement:** Same as `repeals` — symmetry enforced.

---

#### `supersedes`

| Property | Value |
|---|---|
| **Identifier** | `supersedes` |
| **Direction** | source (new act) → target (old act) |
| **Node types** | Act → Act |
| **Cardinality** | many-to-many |
| **Inverse** | `superseded_by` |
| **Schema field** | `supersedes` (new — see §5) |

**Definition.** The source act replaces the target act in practice without a formal explicit *abrogare* provision. Supersession may be: (a) *abrogare tacită* under Romanian legal doctrine where a later act on the same subject implicitly supersedes an earlier incompatible one; (b) *republicare* replacing an earlier version of the same act; or (c) a new implementing order replacing a previous one on the same matter.

**Evidence requirement:** `structural` or `inferred`. Explicit supersession (where the source act states *"înlocuiește"*) may be recorded as `confirmed`.

**Confidence levels:**

| Confidence | Meaning |
|---|---|
| `confirmed` | Source act explicitly states it replaces the target |
| `suggested` | Same domain, same issuing body, later date, substantially identical scope |
| `inferred` | Analyst judgment based on reading both acts |

**Example.** When a ministry issues a new *Ordin* approving revised implementing norms on the same subject as a previous Ordin, the new Ordin `supersedes` the old one even if no explicit abrogation article is included.

**Anti-patterns:**
- Do NOT use `supersedes` when an explicit repeal article exists — use `repeals`.
- Do NOT record `supersedes` at `inferred` confidence without a human reviewer sign-off.

---

#### `superseded_by`

| Property | Value |
|---|---|
| **Identifier** | `superseded_by` |
| **Direction** | source (old act) → target (new act) |
| **Node types** | Act → Act |
| **Cardinality** | many-to-many |
| **Inverse** | `supersedes` |
| **Schema field** | `superseded_by` (new — see §5) |

**Definition.** Inverse of `supersedes`. The source act has been replaced in practice by the target act.

---

### 3.3 References and Citations

These relationships capture intellectual dependencies and textual cross-references between acts.

---

#### `cites`

| Property | Value |
|---|---|
| **Identifier** | `cites` |
| **Direction** | source → target (cited provision) |
| **Node types** | Act → Act anchor (`act-slug#art-N`) |
| **Cardinality** | many-to-many |
| **Inverse** | `cited_by` |
| **Schema field** | `cites` (new — see §5) |

**Definition.** A specific article or provision in the source act explicitly references a specific article or provision in the target act. The target is identified at article level using the anchor convention defined in `docs/anchor-convention.md`. This is the most precise reference relationship.

**Evidence requirement:** `auto-detected` (pending human review) or `explicit` (confirmed after review). The reference pattern in text is: an act citation (e.g., *"Legea nr. 50/1991"*) followed within the same sentence or clause by an article reference (*"art. 7"*, *"alin. (2)"*).

**Confidence levels:**

| Confidence | Meaning |
|---|---|
| `confirmed` | Article-level citation manually verified |
| `suggested` | Auto-detected: act name + article reference in same clause |

**Target format:** `"lege-50-1991#art-7"` — slug followed by `#` and the anchor identifier per `docs/anchor-convention.md`. If the target article is not yet indexed in `citation-index.json`, record only the act-level slug and use `references` instead.

**Example.** An article in *Ordin 839/2009* stating *"în sensul art. 7 din Legea nr. 50/1991"* produces `"cites": ["lege-50-1991#art-7"]`.

**Auto-detection pattern:** `(Legea|HG|OUG|Ordin)\s+nr\.\s+\d+/\d{4}[^.]*?\bart\.\s*\d+` — act reference followed within 60 characters by an article reference.

**Anti-patterns:**
- Do NOT use `cites` for act-level references without article specificity — use `references`.
- Do NOT record `cites` targets pointing to anchors not present in `citation-index.json` — validation will fail.

---

#### `references`

| Property | Value |
|---|---|
| **Identifier** | `references` |
| **Direction** | source → target (referenced act) |
| **Node types** | Act → Act |
| **Cardinality** | many-to-many |
| **Inverse** | `referenced_by` |
| **Schema field** | `references` (new — see §5); current equivalent: `related_acts` with auto-detected origin |

**Definition.** The source act's text names the target act without modifying, implementing, or citing a specific article of it. This is the weakest textual relationship — it records that Act A mentions Act B. The `references_in_text` field in `cross-references/relationships-auto.json` is the auto-detection output for this type.

**Evidence requirement:** `auto-detected` — the target act's canonical citation pattern appears in the source act's text.

**Confidence levels:** `suggested` (auto-detected) or `confirmed` (human verified).

**Example.** *HG 343/2017* references `lege-10-1995`, `lege-307-2006`, and `lege-50-1991` as detected in `relationships-auto.json`.

**Anti-patterns:**
- Do NOT escalate `references` to `implements` or `amends` without verifying the legal relationship in the text.
- Do NOT record `references` for acts cited only in preamble boilerplate (standard constitutional/organic law citations) unless subject-matter relevance is confirmed.

---

#### `requires`

| Property | Value |
|---|---|
| **Identifier** | `requires` |
| **Direction** | source → target (prerequisite act) |
| **Node types** | Act → Act |
| **Cardinality** | many-to-many |
| **Inverse** | `required_by` |
| **Schema field** | `requires` (new — see §5) |

**Definition.** The source act cannot be applied in practice without the target act. This is a hard dependency: if the target act were repealed, the source act would become inapplicable or create a legal vacuum. Typically arises when the source act's operative provisions cross-reference definitions, procedures, or forms established exclusively by the target act.

**Evidence requirement:** `explicit` or `structural`. Must be based on a reading of both acts demonstrating that source act provisions would be inoperable without the target.

**Confidence levels:** `confirmed` or `suggested`.

**Example.** *Ordin 839/2009* requires `lege-50-1991` — the norme metodologice are entirely structured around the authorization procedure created by the law; without it, the Ordin has no operative domain.

**Anti-patterns:**
- Do NOT use `requires` for general legislative context dependencies (e.g., most acts implicitly "require" the Civil Code or Constitution). Reserve for functional, domain-specific hard dependencies.

---

#### `depends_on`

| Property | Value |
|---|---|
| **Identifier** | `depends_on` |
| **Direction** | source → target (soft dependency) |
| **Node types** | Act → Act |
| **Cardinality** | many-to-many |
| **Inverse** | `depended_on_by` |
| **Schema field** | `depends_on` (new — see §5) |

**Definition.** Softer version of `requires`. The source act's provisions assume the target act exists and functions normally, but the source act retains some meaningful operative content even if the target changes. Typically: shared definitions, cross-referenced forms, or referenced standards that are not exclusively established by the target act.

**Evidence requirement:** `structural` or `inferred`.

**Confidence levels:** `suggested` or `inferred`.

**Anti-patterns:**
- Do NOT use `depends_on` for relationships that qualify as `requires`. When in doubt about the strength, use `requires`.

---

### 3.4 Subject Matter

---

#### `related_to`

| Property | Value |
|---|---|
| **Identifier** | `related_to` |
| **Direction** | bidirectional (record in both acts' metadata) |
| **Node types** | Act ↔ Act |
| **Cardinality** | many-to-many |
| **Inverse** | self (symmetric) |
| **Schema field** | `related_acts` (existing confirmed-only array); `relationships[]` for confidence/evidence annotation |

**Definition.** The weakest relationship type. Acts share significant subject matter, domain, or practical applicability context such that a practitioner researching one would benefit from knowing about the other. Does not imply any legal hierarchy, dependency, or textual cross-reference.

**Evidence requirement:** `structural` or reviewed `inferred` evidence — same `domain` enumeration value plus shared `tags`, with documented rationale. Analyst judgment alone is insufficient for a confirmed metadata edge; keep judgment-only associations as `suggested`/needs-review until documented evidence supports confirmation.

**Confidence levels:** `suggested`, `inferred`, or `confirmed` in structured `relationships[]`. The simple `related_acts` array remains unannotated and `scripts/generate-graph.mjs` emits every entry as `relationship: "related"` with `review_status: "confirmed"`; therefore, do not store `suggested` or `inferred` edges in `related_acts`. Confirmed `related_to` edges recorded in `related_acts` require the documented evidence above and the symmetric inverse edge.

**Example.** `lege-50-1991` is `related_to` `lege-350-2001` (urbanism and spatial planning law) and `hg-343-2017` (construction reception). These acts are used together in construction practice but have no formal hierarchy between them.

**Anti-patterns:**
- Do NOT use `related_to` as a fallback when a more specific type applies.
- Do NOT record `related_to` without recording the symmetric edge in the other act's metadata.

---

#### `defined_by`

| Property | Value |
|---|---|
| **Identifier** | `defined_by` |
| **Direction** | source (term or concept) → target (defining act) |
| **Node types** | Term → Act |
| **Cardinality** | many-to-one |
| **Inverse** | `defines` |
| **Schema field** | Future: ontology layer (not in current Act metadata JSON) |

**Definition.** A term or concept used across the corpus has its authoritative definition in the target act. Primarily useful for ontology construction and glossary generation. Not recorded in Act-level metadata in the current schema — reserved for a future term/concept node type.

**Evidence requirement:** `explicit` — a *"Definiții"* or *"Termeni și expresii"* article in the target act contains the definition.

**Example.** The term *"autorizație de construire"* is `defined_by` *Legea nr. 50/1991* Art. 2.

---

#### `regulates`

| Property | Value |
|---|---|
| **Identifier** | `regulates` |
| **Direction** | source (act) → target (domain or activity, string) |
| **Node types** | Act → Domain string |
| **Cardinality** | many-to-many |
| **Inverse** | N/A |
| **Schema field** | `domain` and `topics` (existing, approximate) |

**Definition.** The act creates enforceable rules for a specified domain or activity. Captured approximately in existing schema by `domain` and `topics` enumerated values. No new field is needed in the current schema iteration; a future graph layer may create explicit `regulates` edges to domain nodes.

---

### 3.5 Institutional

These relationships link acts to the bodies that issue, enforce, or approve them.

---

#### `issued_by`

| Property | Value |
|---|---|
| **Identifier** | `issued_by` |
| **Direction** | source (act) → target (issuing authority slug or name) |
| **Node types** | Act → Authority |
| **Cardinality** | many-to-one |
| **Inverse** | `has_issued` |
| **Schema field** | `issuer` (existing, string); `issuing_body_kind` (existing, enum); `issued_by` (new, authority slug — see §5) |

**Definition.** The authority that formally issued, signed, or promulgated the act. In Romanian law: Parliament (*Parlamentul României*), Government (*Guvernul României*), or a ministry/autoritate.

**Evidence requirement:** `explicit` — stated in the act's header or preamble.

**Confidence levels:** `confirmed` only (always determinable from the act).

**Example.** `ordin-839-2009` is `issued_by` `mdlpa` (Ministerul Dezvoltării Regionale și Locuinței, later reorganized as MDLPA).

**Note on authority identity.** Ministries in Romania are frequently reorganized and renamed. The `issued_by` slug should reference the authority as it existed at the time of issuance, with a note if the authority has since been renamed or merged.

---

#### `enforced_by`

| Property | Value |
|---|---|
| **Identifier** | `enforced_by` |
| **Direction** | source (act) → target (enforcing authority) |
| **Node types** | Act → Authority |
| **Cardinality** | many-to-many |
| **Inverse** | `enforces` |
| **Schema field** | `enforced_by` (new — see §5) |

**Definition.** The authority responsible for supervising compliance with and sanctioning violations of the source act. Distinct from `issued_by` — the issuing body and enforcing body are often different (e.g., Parliament issues a *lege*, but ISC — *Inspectoratul de Stat în Construcții* — enforces it on construction sites).

**Evidence requirement:** `explicit` — the act's enforcement chapter or a subsequent act delegating enforcement responsibility.

**Example.** `lege-50-1991` is `enforced_by` `isc` (Inspectoratul de Stat în Construcții) per its inspection and sanctions provisions.

---

#### `approves`

| Property | Value |
|---|---|
| **Identifier** | `approves` |
| **Direction** | source (approving act) → target (approved act or annex) |
| **Node types** | Act → Act (often Normativ/Ghid) |
| **Cardinality** | many-to-many |
| **Inverse** | `approved_by` |
| **Schema field** | `approves` (new — see §5) |

**Definition.** The source act (typically an *Ordin*) formally approves and gives legal force to a technical document attached as an annex — such as a *normativ*, *ghid*, or *regulament*. The approved document (annex) acquires normative force through the approving act. This is a structural pattern specific to MDLPA technical regulations.

**Evidence requirement:** `structural` — the approving act's title contains *"pentru aprobarea"* followed by the approved document's name, and the approved document is attached as an annex.

**Confidence levels:** `confirmed` (the pattern is unambiguous).

**Example.** `ordin-839-2009` approves the *Normele metodologice de aplicare a Legii nr. 50/1991* (annexed as Annex 1). The Ordin is the legal vehicle; the Norma is the substantive content.

**Anti-patterns:**
- Do NOT confuse `approves` with `implements`. The *Ordin* both `approves` the Norma AND `implements` Legea 50/1991. Both edges SHOULD be recorded.

---

### 3.6 Derivations (Future)

These types are reserved for future use when the corpus is extended with template and checklist documents. They are defined here to reserve the identifiers and prevent naming conflicts.

---

#### `basis_for`

| Property | Value |
|---|---|
| **Identifier** | `basis_for` |
| **Direction** | source (act) → target (template or checklist) |
| **Node types** | Act → Template/Checklist |
| **Cardinality** | many-to-many |
| **Inverse** | `legal_basis` |
| **Schema field** | `basis_for` (future) |
| **Status** | **Reserved. Not implemented.** |

**Definition.** The source act provides the legal basis from which a practical template, form, or checklist is derived. The template has no normative force of its own but embodies the requirements of the source act in an actionable format.

---

#### `operationalizes`

| Property | Value |
|---|---|
| **Identifier** | `operationalizes` |
| **Direction** | source (template/checklist) → target (act) |
| **Node types** | Template/Checklist → Act |
| **Cardinality** | many-to-many |
| **Inverse** | `basis_for` |
| **Schema field** | `operationalizes` (future) |
| **Status** | **Reserved. Not implemented.** |

**Definition.** Inverse of `basis_for`. The source template or checklist operationalizes — translates into actionable steps — the requirements of the target act.

---

## 4. Current Schema Mapping

The table below maps the simple relationship fields present in the current `metadata/schema.json` to their canonical types in this specification. Simple arrays are backward-compatible and confirmed-only where graph-visible.

| Current field | Relationship type | Direction | Notes |
|---|---|---|---|
| `related_acts` | `related_to` | bidirectional | Must be symmetric — each act listed SHOULD have the other in its own `related_acts`. `generate-graph.mjs` emits these as `relationship: "related"` and `review_status: "confirmed"`. |
| `implements` | `implements` | source → target | Well-typed simple array. Current `generate-graph.mjs` does not emit simple `implements[]` edges unless they are also represented in structured `relationships[]`. |
| `amends` | `amends` | source → target | Well-typed simple array. Inverse MUST be symmetric via `amended_by`. Current `generate-graph.mjs` does not emit simple `amends[]` edges unless they are also represented in structured `relationships[]`. |
| `amended_by` | `amended_by` | source → target | Denormalized inverse of `amends`. Current `generate-graph.mjs` does not emit simple `amended_by[]` edges unless they are also represented in structured `relationships[]`. |

**Gaps in current schema:**

The following relationship types are currently captured only approximately or not at all:

| Relationship type | Current approximation | Gap |
|---|---|---|
| `references` | structured `relationships[]` or auto-detected `cross-references/relationships-auto.json` | Do not place suggested textual references in simple arrays |
| `authorized_by` | Implied by `implements` | Not separately recorded |
| `repeals` / `repealed_by` | `status: "repealed"` only | Repealing act not identified |
| `issued_by` | `issuer` (string name) | No slug-based authority reference |
| `enforced_by` | Not recorded | Absent |
| `cites` | Not recorded | Absent |
| `requires` / `depends_on` | Not recorded | Absent |

---

## 5. Schema Extension Plan

### 5.1 Proposed new fields

The following fields SHOULD be added to `metadata/schema.json` as optional properties:

```json
{
  "authorized_by": {
    "type": "array",
    "items": { "type": "string", "minLength": 1 },
    "uniqueItems": true,
    "description": "Slugs of acts that grant authority to issue this act"
  },
  "derived_from": {
    "type": "array",
    "items": { "type": "string", "minLength": 1 },
    "uniqueItems": true,
    "description": "Slugs of acts from which this act's subject matter is derived (without formal implementation)"
  },
  "repeals": {
    "type": "array",
    "items": { "type": "string", "minLength": 1 },
    "uniqueItems": true,
    "description": "Slugs of acts explicitly repealed by this act"
  },
  "repealed_by": {
    "type": "array",
    "items": { "type": "string", "minLength": 1 },
    "uniqueItems": true,
    "description": "Slugs of acts that have explicitly repealed this act"
  },
  "supersedes": {
    "type": "array",
    "items": { "type": "string", "minLength": 1 },
    "uniqueItems": true,
    "description": "Slugs of acts replaced in practice by this act without formal repeal"
  },
  "superseded_by": {
    "type": "array",
    "items": { "type": "string", "minLength": 1 },
    "uniqueItems": true,
    "description": "Slugs of acts that have replaced this act in practice without formal repeal"
  },
  "cites": {
    "type": "array",
    "items": { "type": "string", "pattern": "^[a-z0-9-]+(#[a-z0-9-]+)?$" },
    "uniqueItems": true,
    "description": "Article-level citations: 'act-slug#art-N' or 'act-slug' if article not pinpointed"
  },
  "references": {
    "type": "array",
    "items": { "type": "string", "minLength": 1 },
    "uniqueItems": true,
    "description": "Slugs of acts mentioned in text without specific article citation (auto-detected)"
  },
  "requires": {
    "type": "array",
    "items": { "type": "string", "minLength": 1 },
    "uniqueItems": true,
    "description": "Slugs of acts without which this act cannot be applied (hard dependency)"
  },
  "depends_on": {
    "type": "array",
    "items": { "type": "string", "minLength": 1 },
    "uniqueItems": true,
    "description": "Slugs of acts whose provisions are assumed by this act (soft dependency)"
  },
  "issued_by": {
    "type": "string",
    "description": "Authority slug of the issuing body (complements string 'issuer' field)"
  },
  "enforced_by": {
    "type": "array",
    "items": { "type": "string", "minLength": 1 },
    "uniqueItems": true,
    "description": "Authority slugs of bodies responsible for enforcing this act"
  },
  "approves": {
    "type": "array",
    "items": { "type": "string", "minLength": 1 },
    "uniqueItems": true,
    "description": "Slugs of normative documents (normative, ghiduri) approved by this act as annexes"
  },
  "relationships": {
    "type": "array",
    "description": "Structured relationship records with evidence, confidence, and scope annotation",
    "items": {
      "type": "object",
      "required": ["target", "confidence"],
      "additionalProperties": false,
      "oneOf": [
        {
          "required": ["type"],
          "not": { "required": ["relationship"] }
        },
        {
          "required": ["relationship"],
          "not": { "required": ["type"] }
        }
      ],
      "properties": {
        "type": {
          "type": "string",
          "enum": ["related_to", "implements", "amends", "amended_by", "references", "cites"]
        },
        "relationship": {
          "type": "string",
          "description": "Backward-compatible alias for type; prefer type in new records",
          "enum": ["related_to", "implements", "amends", "amended_by", "references", "cites"]
        },
        "target": { "type": "string" },
        "confidence": {
          "type": "string",
          "enum": ["confirmed", "suggested", "inferred"]
        },
        "evidence_type": {
          "type": "string",
          "enum": ["explicit_text", "portal_action", "cross_reference", "structural", "inferred", "manual_review"]
        },
        "evidence": { "type": "string" },
        "source_article": { "type": "string" },
        "scope": { "type": "string" },
        "reviewed_by": { "type": "string" },
        "reviewed_at": { "type": "string", "format": "date" },
        "source_url": { "type": "string" },
        "evidence_path": { "type": "string" },
        "notes": { "type": "string" }
      }
    }
  }
}
```

### 5.2 Backward compatibility rules

1. All new fields are **optional**. Existing metadata files without them remain valid.
2. The `$schema` `additionalProperties: false` constraint means new fields MUST be added to `schema.json` before being used in any act metadata file, or schema validation will fail.
3. The existing `related_acts`, `implements`, `amends`, `amended_by` fields are NOT removed. They remain simple-array fields for confirmed relationships only. The new `relationships` array provides richer annotation for the same edges when evidence or confidence annotation is needed.
4. When both a simple array field and a `relationships` entry exist for the same edge, the simple array field preserves backward compatibility and the structured record provides annotation metadata. The structured record SHOULD use `confidence: "confirmed"` for every same-type edge already present in a confirmed simple array. Otherwise contributors create contradictory representations. Current validation enforces this only for `related_acts`; for `implements`, `amends`, and `amended_by`, avoid dual representation unless the structured record is also confirmed.

### 5.3 Migration path

**Phase 1 — Schema update:** Complete. Optional structured `relationships[]` support exists in `metadata/schema.json`; no existing metadata migration has happened yet.

**Phase 2 — Pilot structured metadata:** Migrate one small reviewed edge into `relationships[]` only when the extra confidence/evidence annotation is useful. Do not automatically migrate existing simple arrays.

**Phase 3 — Auto-detection review:** Future scope. Keep auto-detected `references_in_text` candidates in `cross-references/relationships-auto.json` and `relationships-diff.md` until review confirms a metadata edge. If review cannot confirm the edge, keep it in the external review artifacts rather than promoting it into act metadata as `suggested`.

**Phase 4 — Lifecycle edges:** Future scope. Populate `repeals`, `repealed_by`, `supersedes`, `superseded_by` only after the schema and generator support those relationship values.

**Phase 5 — Institutional edges:** Future scope. Populate `issued_by` (authority slugs) and `enforced_by` only after schema and graph support authority nodes.

**Phase 6 — Citation edges:** Future scope. Keep article-level citations in citation/cross-reference artifacts until the schema and graph generator support article targets. The current structured `relationships[]` model only targets act slugs, so it cannot preserve a source-article to target-article citation edge.

---

## 6. Confidence and Evidence Recording

### 6.1 Confidence levels

All relationship edges MUST be assigned one of three confidence levels:

| Level | Meaning | When to use |
|---|---|---|
| `confirmed` | The relationship is definitively established by primary source evidence. | Explicit enabling clause, amendment article, abrogation article, or structural pattern is unambiguous. |
| `suggested` | The relationship is strongly indicated by text patterns or structural analysis, but has not been human-reviewed against the full act text. | Auto-detected references; title-based inference; structural patterns awaiting review. |
| `inferred` | The relationship is derived by transitive reasoning or analyst judgment without direct textual evidence. | Subject matter overlap, implicit supersession, domain-based derivation. |

Only `confirmed` relationships SHOULD be used in production RAG grounding and legal citations. `suggested` and `inferred` relationships MAY be used for discovery, graph traversal for non-authoritative queries, and auto-detection pipeline review.

### 6.2 Simple array fields (current pattern)

The simple array fields (`implements`, `amends`, `amended_by`, and `related_acts`) SHOULD be used only for confirmed relationships. Suggested or inferred relationships MUST use structured records or generated review artifacts so their confidence is not lost.

Current graph behavior is intentionally conservative: `related_acts[]` entries are emitted to `graph/graph.json` as confirmed `relationship: "related"` edges. Simple `implements[]`, `amends[]`, and `amended_by[]` remain validated metadata fields but are not emitted by `scripts/generate-graph.mjs` unless represented by a structured `relationships[]` record.

### 6.3 Structured relationship records

When any of the following conditions apply, use the `relationships` array instead of (or in addition to) the simple array field:

- Confidence is `inferred` and you want to preserve the reasoning.
- Confidence is `suggested` and the edge should appear in graph output as `needs_review`.
- The relationship is partial (scoped to specific articles or provisions).
- The evidence text is worth preserving for audit or review.
- The relationship has been reviewed and the reviewer identity matters.

Use `type` for new records. The schema also accepts `relationship` as a backward-compatible alias, but a record MUST NOT contain both. Current validation requires at least one non-empty provenance field: `evidence`, `source_url`, `evidence_path`, or `notes`. For confirmed relationships, contributor policy is stricter: `notes` alone is not source evidence, so provide `evidence`, `source_url`, or `evidence_path`. Annotation-only fields such as `reviewed_by`, `reviewed_at`, `source_article`, and `scope` are useful context but do not prove the relationship by themselves.

`confidence: "confirmed"` maps to graph `review_status: "confirmed"`. `confidence: "suggested"` and `confidence: "inferred"` map to `review_status: "needs_review"`. `confidence: "confirmed"` with `evidence_type: "inferred"` is invalid.

**Schema:**

```json
"relationships": [
  {
    "type": "references",
    "target": "example-act-2000",
    "confidence": "suggested",
    "evidence_type": "cross_reference",
    "evidence": "Illustrative example: act text names Example Act 2000, pending human review.",
    "source_article": "art-3",
    "evidence_path": "cross-references/relationships-diff.md"
  },
  {
    "type": "related_to",
    "target": "example-related-act-2001",
    "confidence": "confirmed",
    "evidence_type": "structural",
    "evidence": "Illustrative example: official text explicitly names Example Related Act 2001 in a relationship context.",
    "notes": "Illustrative confirmed subject-matter relationship with reviewed rationale.",
    "reviewed_by": "contributor-handle",
    "reviewed_at": "2026-06-28"
  }
]
```

### 6.4 Marking auto-detected relationships

Auto-detected relationships (output of `cross-references/relationships-auto.json`) MUST remain in that file and MUST NOT be directly copied into act metadata without human review. The review workflow is:

1. Reviewer reads `cross-references/relationships-diff.md`.
2. For each suggested relationship, reviewer verifies in the act text.
3. If confirmed and a simple array can represent the relationship without losing needed evidence/confidence annotation, reviewer adds the slug to the appropriate simple array field in the act's metadata JSON.
4. If the relationship type is more specific than `references` (e.g., it is actually `implements`), reviewer records the more specific type.
5. If the edge remains `suggested` or `inferred`, reviewer records it only as a structured `relationships[]` record or leaves it in generated review artifacts.
6. If not confirmed, reviewer notes the reason in a comment or leaves it in the diff for future review.

---

## 7. Auto-Detection Rules

The following relationship types MAY be auto-detected from act text by pattern matching. All auto-detected results have confidence `suggested` and MUST be human-reviewed before being recorded in metadata.

### 7.1 `references` — Act-level mention detection

**Trigger:** The canonical citation pattern of a known act appears in the source act's text.

**Patterns:**

```
Legea nr\. \d+/\d{4}
Hotărârea Guvernului nr\. \d+/\d{4}
Ordonanța Guvernului nr\. \d+/\d{4}
Ordonanța de urgență a Guvernului nr\. \d+/\d{4}
Ordinul? (?:ministrului [\w\s]+? )?nr\. \d+/\d{4}
```

**Resolution:** Match the detected citation against the corpus slug index. If matched → record as `references` (suggested). If unmatched → record in `unresolved_references` for future import.

**Current implementation:** `scripts/` directory; output in `cross-references/relationships-auto.json`.

### 7.2 `cites` — Article-level citation detection

**Trigger:** An act citation is followed within the same clause (≤ 80 characters) by an article reference.

**Patterns:**

```
(Legea|Hotărârea Guvernului|Ordonanța|Ordinul?)\s+nr\.\s*\d+/\d{4}[^.;]{0,80}art\.\s*\d+
art\.\s*\d+\s+(?:alin\.\s*\(\d+\)\s*)?(?:din|al)\s+(Legii|Hotărârii|Ordonanței|Ordinului)
```

**Resolution:** Match the act citation to a slug; resolve the article reference to an anchor per `docs/anchor-convention.md`. If anchor exists in `citation-index.json` → record as `cites: ["slug#anchor"]` (suggested). If anchor not resolved → record as `references` (suggested) pending anchor index completion.

### 7.3 `implements` — Enabling clause detection

**Trigger:** The source act's preamble or first article contains a standard Romanian enabling clause.

**Patterns:**

```
în aplicarea (Legii|Hotărârii|Ordonanței|Ordinului)\s+nr\.\s*\d+/\d{4}
în temeiul (Legii|Hotărârii|Ordonanței)\s+nr\.\s*\d+/\d{4}
în baza (Legii|Hotărârii|Ordonanței)\s+nr\.\s*\d+/\d{4}
pentru punerea în aplicare a (Legii|Hotărârii)\s+nr\.\s*\d+/\d{4}
```

**Confidence:** `suggested`. A human reviewer MUST confirm the relationship constitutes formal implementation before recording as `confirmed`.

**Scope:** Restrict detection to the first 50 lines of the act text (preamble and first article zone). Enabling clauses appearing later in the body are more likely `references`.

### 7.4 `amends` — Amendment act detection

**Trigger:** The source act's title or first article contains a standard Romanian amendment phrase targeting a known act.

**Patterns:**

```
pentru modificarea (și completarea)? (Legii|Hotărârii|Ordonanței|Ordinului)\s+nr\.\s*\d+/\d{4}
se modifică și va avea următorul cuprins
se introduce (?:un nou articol|o nouă literă)
se abrogă
```

**Confidence:** Title-match → `suggested`. Body match (amendment articles) without title → `suggested`. Requires human review to confirm the acted-upon provision and promote to `confirmed`.

### 7.5 Non-detectable types (manual only)

The following relationships MUST be recorded manually by a human reviewer and cannot be reliably auto-detected:

- `authorized_by` — requires understanding of delegation doctrine, not just text patterns
- `requires` / `depends_on` — requires functional analysis of both acts
- `supersedes` — requires knowledge of legislative history and intent
- `enforced_by` — requires reading enforcement/sanctions chapters
- `derived_from` — requires subject matter expertise

---

## 8. Validation Rules

The following rules define repository policy. Rules marked as current validation
are enforced by CI; rules marked as policy target still require future validator
coverage. Where acts are within the same corpus, both sides of a symmetric
relationship MUST be present.

### 8.1 Target existence

**Policy target:** For every slug appearing in `implements`, `amends`,
`amended_by`, `related_acts`, or structured `relationships[].target`: the slug
MUST correspond to a file in `metadata/acts/`.

**Current validation:** `scripts/validate-metadata.mjs` validates structured
`relationships[].target` slugs. Simple-array target existence is not yet
validated by that script; an invalid simple `related_acts` target is skipped by
the graph generator rather than reported as a validation error.

**Error:** `RELATIONSHIP_TARGET_NOT_FOUND: {source} → {type} → {target}`

**Exception:** `references` entries populated from `relationships-auto.json` at `suggested` confidence MAY reference unresolved slugs during the auto-detection review phase, provided they are not yet recorded in metadata.

### 8.2 Symmetry — amends / amended_by

**Rule:** If `metadata/acts/A.json` contains `"amends": ["B"]`, then `metadata/acts/B.json` MUST contain `"amended_by": ["A"]`, and vice versa.

**Error:** `SYMMETRY_VIOLATION: {A}.amends.{B} requires {B}.amended_by.{A}`

### 8.3 Symmetry — repeals / repealed_by

**Rule:** Same symmetry requirement as `amends`/`amended_by`.

**Error:** `SYMMETRY_VIOLATION: {A}.repeals.{B} requires {B}.repealed_by.{A}`

### 8.4 Symmetry — supersedes / superseded_by

**Rule:** Same symmetry requirement.

**Error:** `SYMMETRY_VIOLATION: {A}.supersedes.{B} requires {B}.superseded_by.{A}`

### 8.5 Status consistency — repealed acts

**Rule:** If an act has a non-empty `repealed_by` array, its `status` MUST be `"repealed"` or `"partially_repealed"`.

**Error:** `STATUS_INCONSISTENCY: {act} has repealed_by but status={status}`

### 8.6 Cites anchor resolution

**Rule:** For every entry in `cites` of the form `"slug#anchor"`, the `anchor` MUST exist as a key in `citations/citation-index.json` under the entry for `slug`.

**Error:** `UNRESOLVED_ANCHOR: {source}.cites.{slug#anchor} — anchor not in citation-index`

**Exception:** Entries of the form `"slug"` (without anchor) are validated only for slug existence (rule 8.1).

### 8.7 No self-references

**Rule:** No act MAY appear in any of its own relationship arrays.

**Error:** `SELF_REFERENCE: {act}.{field} contains {act}`

### 8.8 Confidence in structured relationships

**Rule:** Every object in the `relationships` array MUST have `confidence` set to one of `confirmed`, `suggested`, `inferred`.

**Error:** `INVALID_CONFIDENCE: {act}.relationships[N].confidence = {value}`

### 8.9 Structured relationship evidence

**Current validation:** Every object in the `relationships` array MUST use
either `type` or `relationship`, not both. `type` is preferred for new records.
Relationship values are currently limited by `metadata/schema.json` to
`related_to`, `implements`, `amends`, `amended_by`, `references`, and `cites`.

**Current validation:** A structured relationship MUST include at least one
non-empty provenance field: `evidence`, `source_url`, `evidence_path`, or
`notes`. If present, every evidence/annotation field must be a string.
`reviewed_at` must use `YYYY-MM-DD`.

**Contributor policy:** For `confidence: "confirmed"`, `notes` alone is not
source evidence. Use `evidence`, `source_url`, or `evidence_path` to preserve
the source-backed basis for the confirmed edge.

**Rule:** `confidence: "confirmed"` is incompatible with `evidence_type: "inferred"`.

**Current validation:** A structured annotation for an existing `related_acts[]`
edge with `type: "related_to"` or `relationship: "related_to"` must use
`confidence: "confirmed"`.

**Policy target:** The same no-downgrade rule should apply to
`implements[]`, `amends[]`, and `amended_by[]` dual representations. Until that
is validated, do not add a structured record for the same simple-array edge with
`confidence: "suggested"` or `confidence: "inferred"`.

**Error examples:** `MISSING_RELATIONSHIP_EVIDENCE`, `INVALID_RELATIONSHIP_EVIDENCE_TYPE`, `INVALID_RELATIONSHIP_CONFIDENCE_COMBINATION`.

### 8.10 Schema validation

**Rule:** Every `metadata/acts/*.json` file MUST validate against `metadata/schema.json`. This is a pre-existing rule; it automatically covers all new optional fields once they are added to the schema.

---

## 9. Romanian Legal Context

Understanding Romanian legislative structure is prerequisite to correctly typing relationships. This section records distinctions that regularly cause classification errors.

### 9.1 Primary legislation hierarchy

Romanian acts rank in the following hierarchy (highest authority first):

1. **Constituția României** — not in corpus, but is the ultimate source of all authority
2. **Legi organice** (*legi*) — Parliament; regulate fundamental domains; require absolute majority
3. **Legi ordinare** (*legi*) — Parliament; all other domains; simple majority
4. **Ordonanțe de urgență** (*OUG*) — Government in urgent cases; same force as *lege* pending parliamentary ratification
5. **Ordonanțe** (*OG*) — Government under legislative delegation; lower than *lege*
6. **Hotărâri de Guvern** (*HG*) — Government; implement laws; MUST NOT contradict *lege*
7. **Ordine** (*Ordin*) — Ministers/autorități; implement HG and legi at operational level

**Implication for `implements`:** An *Ordin* implements a *lege* or *HG*. An *HG* implements a *lege*. An *OUG* does NOT implement a *lege* — it has the same normative rank. Do NOT record `implements` between acts of equal or near-equal rank.

### 9.2 OUG vs OG distinction

| Type | Romanian abbreviation | Issuing procedure | Parliamentary ratification |
|---|---|---|---|
| *Ordonanță de urgență* | OUG | Government, urgent cases, Art. 115 alin. (4) Constitution | Required; takes effect immediately |
| *Ordonanță* | OG | Government under delegation law (*lege de abilitare*), Art. 115 alin. (1) Constitution | Must be approved or rejected by Parliament by deadline |

**Implication for relationships:** An *OUG* typically `references` the constitutional provision and the domain *legi* it relates to, but does NOT `implement` them — it operates at the same normative level. An *OG* `authorized_by` its specific *lege de abilitare*.

### 9.3 Republicare — republished acts

When an act has been significantly amended, the official bodies may issue a *republicare* (republication). The republished text:
- Has the **same legal identity** as the original act (same number and year)
- Contains the **new consolidated text** replacing the original
- Is published in *Monitorul Oficial* with a new MO issue reference
- Does NOT create a new act — it is a new version of the same act

**Implication for relationships:** A *republicare* is NOT a new act and MUST NOT receive its own slug. The existing act's metadata SHOULD record `version_kind: "republicat"` and update `consolidated_as_of`. There is NO `supersedes` or `amends` relationship between the original and republished form of the same act.

### 9.4 Consolidare vs. republicare

| | *Consolidare* | *Republicare* |
|---|---|---|
| Official status | Unofficial (working text) | Official publication in MO |
| Legal force | The consolidated text itself has no additional legal force | The republished text is the authoritative text |
| Identity | Same act | Same act, new official text |
| OCKI handling | `version_kind: "consolidat"`, `consolidated_as_of` date | `version_kind: "republicat"` |

The Portal Legislativ provides both *forma consolidată* (consolidated form) and *forma republicată* (republished form) for many acts. When both exist, prefer the *republicată* form if it is more recent; fall back to *consolidată*. Note this in `version` field.

### 9.5 MDLPA normative structure

The Ministry of Regional Development and Public Administration (MDLPA, formerly MDRAP, formerly MLPAT) issues two distinct types of instruments:

**Ordin** — The ministerial act that has normative force. It is issued by the minister and published in *Monitorul Oficial*.

**Normativ / Ghid / Procedură** — The technical document attached as an annex to the *Ordin*. The *Normativ* itself has no independent normative force; it acquires force through the *Ordin* that approves it.

**Implication for relationships:**
- The *Ordin* `approves` the *Normativ* (or *Ghid*).
- The *Ordin* `implements` the *Lege* or *HG* that authorized the technical regulation.
- The *Normativ* itself does NOT appear as an independent act — it is an annex of the *Ordin*.
- In the OCKI corpus, the *Normativ* text is typically stored as part of the *Ordin*'s text file, not as a separate act. If a *Normativ* is significant enough to be indexed separately, it receives its own metadata entry with `type: "normativ"` and `approved_by: ["ordin-slug"]`.

### 9.6 Abrogare tacită (implicit repeal)

Romanian doctrine recognizes *abrogare tacită*: a later act on the same subject implicitly repeals incompatible provisions of an earlier act even without an explicit abrogation article. This is:

- NOT recorded as `repeals` (which requires explicit abrogation text)
- Recorded as `supersedes` at confidence `suggested` or `inferred`
- Noted in the `relationships` structured record with an evidence field explaining the analyst's reasoning

**Rule:** Do NOT mark an act's `status` as `"repealed"` based on inferred supersession alone. `status: "repealed"` requires either an explicit abrogation or a definitive official source confirmation.

---

## Appendix A: Relationship Quick Reference

| Type | Direction | Evidence | Symmetric? | Current field |
|---|---|---|---|---|
| `implements` | source → target | explicit | No | `implements` |
| `authorized_by` | source → target | explicit | No | *(new)* |
| `derived_from` | source → target | structural/inferred | No | *(new)* |
| `amends` | source → target | explicit | Via `amended_by` | `amends` |
| `amended_by` | source → target | explicit | Via `amends` | `amended_by` |
| `repeals` | source → target | explicit | Via `repealed_by` | *(new)* |
| `repealed_by` | source → target | explicit | Via `repeals` | *(new)* |
| `supersedes` | source → target | structural/inferred | Via `superseded_by` | *(new)* |
| `superseded_by` | source → target | structural/inferred | Via `supersedes` | *(new)* |
| `cites` | source → target anchor | auto-detected | No | *(new)* |
| `references` | source → target | auto-detected or reviewed text mention | No | structured `relationships[]`; auto-detected review artifacts |
| `requires` | source → target | explicit/structural | No | *(new)* |
| `depends_on` | source → target | structural/inferred | No | *(new)* |
| `related_to` | bidirectional | structural/inferred | Yes | `related_acts` |
| `defined_by` | term → act | explicit | No | *(future ontology)* |
| `issued_by` | act → authority | explicit | No | `issuer` (string) |
| `enforced_by` | act → authority | explicit | No | *(new)* |
| `approves` | act → annex | structural | No | *(new)* |
| `basis_for` | act → template | structural | Via `operationalizes` | *(reserved)* |
| `operationalizes` | template → act | structural | Via `basis_for` | *(reserved)* |

---

## Appendix B: Key Terms (Glossary)

**abrogare** — Formal repeal of an act or provision.
**abrogare tacită** — Implicit repeal by incompatible later legislation.
**consolidare** — Unofficial compilation of an act's text incorporating all amendments.
**forma actualizată** — Updated form; equivalent to *consolidată* in Portal Legislativ usage.
**ghid** — *Guide*; technical guidance document; lower normative weight than *normativ*.
**hotărâre de Guvern (HG)** — Government decision; implementing act below *lege*.
**lege** — Law enacted by Parliament.
**normativ** — *Standard* or *normative document*; technical regulation with normative force via approving *Ordin*.
**ordin** — Ministerial order; lowest general normative act in hierarchy.
**ordonanță (OG)** — Government ordinance issued under legislative delegation.
**ordonanță de urgență (OUG)** — Emergency ordinance; same normative rank as *lege*; requires subsequent parliamentary ratification.
**publicare** — Publication in *Monitorul Oficial al României* (*MO*).
**republicare** — Official republication of an act's consolidated text in MO; same legal identity.
**slug** — URL-safe identifier for an act in the OCKI corpus, e.g., `lege-50-1991`.
**temei legal** — Legal basis clause in a subordinate act's preamble identifying the enabling act.
