# ANRE Track B Readiness — Ordin ANRE 59/2013 (racordare utilizatori)

**Research date:** 2026-06-30
**Status:** Documentation only — NO metadata import has been performed for this act.
**Primary sources used:** legislatie.just.ro (browser-assisted, dynamic sections inspected directly), Monitorul Oficial references as displayed by Portal Legislativ.
**Researcher note:** No secondary sources (DSO mirror PDFs, professional service websites) were treated as proof for any fact in this document. A DSO mirror (Distribuție Oltenia) was consulted only to cross-check the "în vigoare de la" framing and is cited explicitly where used — it was not used as a primary source for any date or legal fact; every claim below traces to a legislatie.just.ro document ID.

---

## 1. Base act identification

| Field | Value |
|---|---|
| Title | Regulamentul privind racordarea utilizatorilor la rețelele electrice de interes public |
| Approving act | Ordinul ANRE nr. 59 din 2 august 2013 |
| Issuer | Autoritatea Națională de Reglementare în Domeniul Energiei (ANRE) |
| Portal Legislativ ID | **150711** — `https://legislatie.just.ro/Public/DetaliiDocumentAfis/150711` |
| Publication | Monitorul Oficial al României, Partea I, nr. 517 din 19 august 2013 (anexa: nr. 517 bis) |

**Important correction recorded in this session:** an earlier discovery pass used Portal Legislativ ID `150033` for this act. That ID was independently re-verified by direct navigation and found to point to an unrelated document (OUG nr. 18/04.03.2009, privind creșterea performanței energetice a blocurilor de locuințe). The correct ID — **150711** — was located via a targeted Google site-search (`site:legislatie.just.ro "ORDIN 59" 2013 ANRE racordare`) and confirmed by loading the document directly and reading its title, EMITENT, and Monitorul Oficial fields. Any future implementer must use ID 150711, not 150033.

---

## 2. Effective-date chain (verified, not assumed)

Ordin ANRE 59/2013 does not enter into force on its own publication date. Its own Art. 3 makes entry into force conditional on a separate event:

1. **Ordin ANRE 59/2013, Art. 3** (ID 150711): *"Prezentul ordin se publică în Monitorul Oficial al României, Partea I, și intră în vigoare la data abrogării Hotărârii Guvernului nr. 90/2008 ..."*
2. **HG 90/2008** (ID 89489) — verified via its own "Acțiuni suferite" dynamic section on Portal Legislativ: **ABROGAT DE HG 1028 din 11/12/2013**.
3. **HG 1028/2013** (ID 153753): Articolul UNIC abrogă HG 90/2008, fără nicio clauză de întârziere proprie (nu specifică "intră în vigoare la X zile"). Publicat în **Monitorul Oficial al României, Partea I, nr. 799 din 18 decembrie 2013**.
4. Conform regulii standard (abrogare fără clauză explicită de întârziere → efect de la data publicării), HG 90/2008 a fost efectiv abrogată la **18 decembrie 2013**.

**Conclusion:** Ordin ANRE 59/2013 has been in force since **2013-12-18**, not from its own publication date of 2013-08-19.

This chain was cross-checked against a DSO secondary source (Distribuție Oltenia, RACC consolidated PDF mirror), which independently states *"În vigoare de la 18 decembrie 2013"* — consistent with the primary-source chain above, but the secondary source was used only as a sanity check, not as proof. The proof is the three-document chain on legislatie.just.ro (150711 → 89489 → 153753).

If this act is imported later, `publication_date` and `effective_date` must NOT be set to the same value — they diverge by four months and the divergence is load-bearing for anyone relying on this metadata to determine applicability.

---

## 3. Final Amendment Matrix (2023–2026 Audit)

Major amendments identified and verified via Portal Legislativ (ID 150711 consolidation history):

| Act | Portal ID | M.Of. Ref | Changes / Construction Relevance | Recommendation |
|---|---|---|---|---|
| **Ordin 15/2026** | [310639](https://legislatie.just.ro/Public/DetaliiDocument/310639) | 436 / 21.05.2026 | Final alignment of connection procedures. | include in `rights_note` |
| **Ordin 20/2025** | [297329](https://legislatie.just.ro/Public/DetaliiDocument/297329) | 498 / 29.05.2025 | Power injection limits in ATR (operational constraints); Solution study rules. | include in `rights_note` |
| **Ordin 60/2024** | [288588](https://legislatie.just.ro/Public/DetaliiDocument/288588) | 863 / 28.08.2024 | Synchronization with new capacity allocation rules. | include in `rights_note` |
| **Ordin 53/2024** | [286055](https://legislatie.just.ro/Public/DetaliiDocument/286055) | 750 / 31.07.2024 | Auction-based grid capacity allocation; 5% guarantee for >1MW projects. | **Separate Metadata** |
| **Ordin 70/2023** | [267850](https://legislatie.just.ro/Public/DetaliiDocument/267850) | 477 / 30.05.2023 | Refined connection workflow for public networks. | include in `rights_note` |
| **Ordin 4/2023** | [264185](https://legislatie.just.ro/Public/DetaliiDocument/264185) | 88 / 01.02.2023 | User-purchased meters if DSO is in default; Financial guarantee timing. | include in `rights_note` |

**Total: 18 amendment events** (15 base + 3 annex) confirmed spanning 2014–2026. This is the single largest amendment chain encountered so far.

---

## 4. 2024 amendment candidates — status of each claim

| Claimed act | Verified? | Evidence |
|---|---|---|
| **Ordin ANRE 53/30.07.2024** | ✅ CONFIRMED | Listed directly in "Acțiuni suferite" of ID 150711, targeting ANEXA 1 |
| **Ordin ANRE 60/28.08.2024** | ✅ CONFIRMED | Listed directly in "Acțiuni suferite" of ID 150711, targeting ANEXA 1 |
| **Ordin ANRE 67/2024** | ✅ OUT-OF-SCOPE | Identified as "Metodologia de stabilire a tarifelor pentru serviciul de distribuţie". Does not modify 59/2013. |

---

## 5. Unresolved items (must be closed before any metadata import)

1. **Effective date of each individual amendment.** Only the base act's own effective-date chain (Section 2) has been fully traced. The 15 base-act amendments and 3 annex amendments each have their own publication/effective dates that have not yet been individually verified — a metadata-only import does not strictly require this (no full text is imported), but `consolidated_as_of` cannot be set responsibly without knowing the date of the *last* confirmed amendment in force.
2. **Most recent amendment currency check.** ORDIN 15/21.05.2026 is the most recent entry in "Acțiuni suferite" — given the system date context of this research (2026-06-30), this amendment is very recent and its content/scope has not been reviewed at all. Any `consolidated_as_of` value set during import must reflect a re-check done at import time, not the date in this readiness document.
3. **Ordin 67/2024 negative result.** Confirmed absent from this act's records, but no broader search was performed to determine if this act number exists at all under a different ANRE regulation. Out of scope for Track B — noted here only so a future agent does not re-attempt the same fruitless search against ID 150711.
4. **Annex/base-act amendment overlap.** ORDIN 63/14.07.2014 appears three times in the "Acțiuni suferite" table (MODIFICAT, COMPLETAT, ABROGAT PARȚIAL — all against ANEXA 1, all same date). This indicates a single amending act performed multiple distinct operations on the annex in one event; this pattern must be modeled correctly (one external reference, multiple operation types) if/when amendment-level tracking is added.

---

## 6. Why this should be metadata-only first

- **18 confirmed amendment events** make this the most complex act considered for import in this repository to date. A full-text import would require either (a) sourcing and reconciling 18 separate amending documents into one canonical consolidated text, or (b) importing a third-party consolidation (e.g. a DSO mirror) whose currency and accuracy relative to the official Monitorul Oficial cannot be independently guaranteed without re-verification against every individual amendment.
- The repository's evidence-first convention requires only directly-cited facts; a full-text import of a heavily-amended act without first establishing a clean metadata record risks baking unverified consolidation choices into the canonical text.
- A metadata-only entry lets the repository index the act, its current status (active, heavily amended), and its provenance chain immediately, while deferring the higher-effort, higher-risk full-text consolidation work to a separate, explicitly scoped task.
- This mirrors the precedent set by Ordin ANRE 66/2023 (Track A, PR #126) and the ISCIR PT imports (PR #124, #125): metadata-only first, full text only after a dedicated review.

---

## 7. Why no graph relationship should be added yet

**No relationship to `lege-50-1991` should be added** unless the act's own text (Ordin 59/2013 or its Regulament annex) explicitly cites Legea 50/1991. Nothing reviewed so far — the order's preamble (Legea energiei electrice nr. 123/2012, OUG 33/2007, Legea 160/2012) — cites it. Racordarea la rețea is operationally adjacent to construction authorization, but operational adjacency is not evidence under this repository's convention.

**No relationship to `normativ-i7-2011`** (instalații electrice aferente clădirilor) should be added for the same reason: no direct citation has been found connecting the two acts. Both concern electrical installations in a general sense, but that is domain similarity, not citation — explicitly excluded by repository policy (see CLAUDE.md task instructions used throughout this ANRE research thread).

If a future full-text or deeper-citation review of the Regulament annex (ID to be determined at import time) surfaces an explicit citation to either act, the relationship can be added then, with the citing article number recorded in `rights_note`.

---

## 8. Implementer checklist (for the future metadata import PR)

When a metadata-only import of Ordin ANRE 59/2013 is undertaken:

- [ ] Use Portal Legislativ ID **150711** (NOT 150033 — confirmed wrong, points to an unrelated OUG)
- [ ] Slug: follow existing `ordin-` convention used for `ordin-anre-66-2023` (e.g. `ordin-anre-59-2013`), per `type: "ordin"` naming rule
- [ ] `publication_date`: 2013-08-19 (M.Of. 517/19.08.2013)
- [ ] `effective_date`: 2013-12-18 — NOT the publication date; cite the three-document chain in `rights_note` (Art. 3 → HG 90/2008 abrogation → HG 1028/2013 → M.Of. 799/18.12.2013)
- [ ] `version_kind`: `consolidat`
- [ ] `consolidated_as_of`: must be re-verified at import time against the live "Acțiuni suferite" table — do not reuse the snapshot date from this document without re-checking, since ORDIN 15/2026 is very recent relative to this research date
- [ ] `related_acts`: `[]` — no relationship to `lege-50-1991` or `normativ-i7-2011` unless an explicit citation is found in the Regulament annex text itself
- [ ] `rights_note` must document: the 18 confirmed amendment events (count + date range), the negative result for "Ordin 67/2024" (explicitly checked, not found), and the effective-date chain
- [ ] Import as metadata-only — do not attempt full-text import in the same PR
- [ ] One act per PR — do not bundle with any other ANRE or ISCIR import
- [ ] Run full validation suite (`validate-metadata.mjs`, `check-markdown-hygiene.mjs`, `check-metadata-parity.mjs`, `check-official-text-integrity.mjs`, `validate-citation-anchors.mjs`) and confirm graph regeneration is idempotent before opening the PR

---

## 9. Source index

| ID | Title | Role in this analysis |
|---|---|---|
| 150711 | ORDIN 59 02/08/2013 | Base act under review |
| 89489 | HG 90 23/01/2008 | Predecessor regulation; its abrogation triggers Art. 3 of Ordin 59/2013 |
| 153753 | HG 1028 11/12/2013 | Abrogates HG 90/2008; its publication date (18.12.2013) is the true effective date of Ordin 59/2013 |
