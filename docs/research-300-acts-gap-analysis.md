# Research: Gap analysis to reach 300 tracked acts

> Research document identifying 100 additional Romanian construction-relevant
> legislative acts **not yet present** in `metadata/acts/`, to grow the corpus
> from the current 200 to 300.

Generated: 2026-08-15. Each entry below is **absent** from the repo today
(verified against the 200 existing slugs in `metadata/acts/`). Source URLs point
to the Portal Legislativ (`legislatie.just.ro`), MDLPA, or ISCIR, the same
canonical sources the repo already uses.

---

## How to read this list

- **Slug** = proposed `metadata/acts/<slug>.json` filename, following the
  repo's existing slug conventions.
- **Type** = `lege` / `ordonanta` / `hotarare` / `ordin` / `normativ` / `ghid` /
  `procedura`.
- **Domain** matches the existing domain vocabulary (calitate, urbanism,
  incendiu, energetic, iscir, anre, mediu, executie, receptie, autorizatii,
  isc, nzeb, munca).
- **Source URL** = the authoritative page to verify number/year/title.
- All entries are `metadata-only` candidates (no full text imported yet),
  consistent with how the repo treats most acts.

---

## A. Structural design codes (CR series) — 12 acts

These are core Eurocod-aligned Romanian design codes referenced by virtually
every structural calculation. They are the most conspicuous gap.

| # | Slug | Title (short) | Type | Domain | Source |
|---|-----|---------------|------|--------|--------|
| 1 | `normativ-cr0-2012` | CR 0-2012 — Bazele proiectării construcțiilor | normativ | calitate | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/222161) |
| 2 | `normativ-cr1-1-3-2012` | CR 1-1-3-2012 — Evaluarea acțiunii zăpezii | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare1) |
| 3 | `normativ-cr1-1-4-2012` | CR 1-1-4-2012 — Evaluarea acțiunii vântului | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare1) |
| 4 | `normativ-cr1-2-1-2005` | CR 1-2.1-2005 — Poduri de cale ferată. Acțiuni | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare1) |
| 5 | `normativ-cr1-2-2-2005` | CR 1-2.2-2005 — Poduri de cale ferată. Convoaie tip | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare1) |
| 6 | `normativ-cr2-1-1-1-2013` | CR 2-1-1.1/2013 — Pereți structurali beton armat (predecessor) | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare1) |
| 7 | `normativ-p100-1-2006` | P 100-1/2006 — Cod seismic clădiri (predecessor) | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare1) |
| 8 | `normativ-p100-3-2008` | P 100-3/2008 — Evaluare seismică clădiri existente (predecessor) | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare1) |
| 9 | `normativ-np033-1999` | NP 033-1999 — Structuri beton armat cu armătură rigidă (BAR) | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare1) |
| 10 | `normativ-np042-2000` | NP 042-2000 — Prescripții generale proiectare metalic | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare6) |
| 11 | `normativ-c150-1999` | C 150-99 — Calitatea îmbinărilor sudate din oțel | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare6) |
| 12 | `normativ-np012-1997` | NP 012-1997 — Calcul elemente oțel pereți subțiri la rece | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare6) |

---

## B. Geotechnical & foundation norms — 8 acts

| # | Slug | Title (short) | Type | Domain | Source |
|---|-----|---------------|------|--------|--------|
| 13 | `normativ-np122-2010` | NP 122-2010 — Parametri geotehnici caracteristici | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare3) |
| 14 | `normativ-p7-2000` | P 7-2000 — Fundarea pe pământuri sensibile la umezire | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare3) |
| 15 | `normativ-p10-1986` | P 10-86 — Încercări pe teren de fundații | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare3) |
| 16 | `normativ-np125-2010` | NP 125-2010 — Încercări pe pilot forat (geotehnic) | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare3) |
| 17 | `normativ-np126-2010` | NP 126-2010 — Determinarea ă cății de ansamblu teren | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare3) |
| 18 | `normativ-np127-2010` | NP 127-2010 — Parametri rezistență-deformație | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare3) |
| 19 | `normativ-gp120-2014` | GP 120-2014 — Ghid evaluare risc geotehnic | ghid | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare3) |
| 20 | `normativ-p113-2004` | NP 113-2004 — Minipiloți forfile (fundare) | normativ | calitate | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/61798) |

---

## C. Energy performance & thermal rehabilitation — 10 acts

| # | Slug | Title (short) | Type | Domain | Source |
|---|-----|---------------|------|--------|--------|
| 21 | `normativ-mc001-1-2006` | Mc 001/1-2006 — Metodologie calcul performanță (predecessor) | normativ | energetic | [MDLPA](https://www.mdlpa.ro/pages/reglementare27) |
| 22 | `normativ-c107-3` | C 107/3 — Calcul termotehnic elemente de construcție | normativ | energetic | [MDLPA](https://www.mdlpa.ro/pages/reglementare13) |
| 23 | `normativ-sc007-2013` | SC 007-2013 — Soluții cadru reabilitare termo-higro | normativ | energetic | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/279366) |
| 24 | `oug-18-2009` | OUG 18/2009 — Creșterea performanței energetice blocuri | ordonanta | energetic | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/96291) |
| 25 | `oug-69-2010` | OUG 69/2010 — Reabilitare termică credit cu garanție guvernamentală | ordonanta | energetic | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/120929) |
| 26 | `ordin-mdlpa-625-2023` | Ordin MDLPA 625/2023 — Norme metodologice OUG 18/2009 | ordin | energetic | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/267102) |
| 27 | `normativ-np016-96` | NP 016-96 — Proiectare clădiri locuințe (predecessor NP 057) | normativ | energetic | [MDLPA](https://www.mdlpa.ro/pages/reglementare17) |
| 28 | `ordin-isc-2278-2022` | Ordin MDLPA 2278/2022 — Metodologie calcul energetic (Mc001) | ordin | energetic | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/266732) |
| 29 | `normativ-np029-1997` | NP 029-1997 — Reabilitare termică clădiri existente (predecessor) | normativ | energetic | [MDLPA](https://www.mdlpa.ro/pages/reglementare17) |
| 30 | `normativ-c107-1` | C 107/1 — Normativ izolări termice la clădiri civile | normativ | energetic | [MDLPA](https://www.mdlpa.ro/pages/reglementare13) |

---

## D. ISCIR prescriptions (PT) — additional — 15 acts

The repo has 15 PT prescriptions. The ISCIR catalog lists ~30 in force; below
are 15 not yet imported.

| # | Slug | Title (short) | Type | Domain | Source |
|---|-----|---------------|------|--------|--------|
| 31 | `normativ-pt-c2-2010` | PT C2-2010 — Arzătoare cu combustibili gazoși și lichizi | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 32 | `normativ-pt-c3-2012` | PT C3-2012 — Butelii GPL până la 26 litri | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 33 | `normativ-pt-c5-2025` | PT C5-2025 — Butelii gaze comprimate, lichefiate, dizolvate | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 34 | `normativ-pt-c11-2010` | PT C11-2010 — Automatizări centrale termice | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 35 | `normativ-pt-c12-2003` | PT C12-2003 — Recipiente cisterne, containere metalice | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 36 | `normativ-pt-c15-2015` | PT C15-2015 — Instalații alimentare cu hidrogen | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 37 | `normativ-pt-r7-2003` | PT R7-2003 — Instalații transport pe cablu: telecabine | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 38 | `normativ-pt-r8-2003` | PT R8-2003 — Instalații transport pe cablu: telegondole | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 39 | `normativ-pt-r9-2003` | PT R9-2003 — Instalații transport pe cablu: telescaune | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 40 | `normativ-pt-r10-2003` | PT R10-2003 — Teleschiuri și telesănii | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 41 | `normativ-pt-r11-2003` | PT R11-2003 — Transport pe plan înclinat pentru persoane | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 42 | `normativ-pt-r12-2003` | PT R12-2003 — Teleferice pentru materiale | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 43 | `normativ-pt-r13-2003` | PT R13-2003 — Ascensoare cu schip | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 44 | `normativ-pt-r15-2003` | PT R15-2003 — Ascensoare pentru șantiere de construcții | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 45 | `normativ-pt-r19-2002` | PT R19-2002 — Parcuri de distracții și spații de joacaverificare | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |

---

## E. ISCIR authorization PT (CR series) — 9 acts

The new 2025 ISCIR authorization framework.

| # | Slug | Title (short) | Type | Domain | Source |
|---|-----|---------------|------|--------|--------|
| 46 | `normativ-pt-cr2-2025` | PT CR2-2025 — Autorizarea funcționării instalațiilor ISCIR | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 47 | `normativ-pt-cr3-2025` | PT CR3-2025 — Autorizare operatori RSVTI | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 48 | `normativ-pt-cr5-2025` | PT CR5-2025 — Atestare formatori | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 49 | `normativ-pt-cr6-2025` | PT CR6-2025 — Operatori control nedistructiv | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 50 | `normativ-pt-cr7-2025` | PT CR7-2025 — Aprobare proceduri sudare | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 51 | `normativ-pt-cr1-2018` | PT CR1-2018 — Tarife ISCIR | normativ | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 52 | `ordin-isc-130-2011` | Ordin ISCIR 130/2011 — Metodologie autorizare operator RSVTI | ordin | iscir | [ISCIR](https://iscir.ro/sectiune/legislatie/prescriptii) |
| 53 | `ordin-isc-7-2013` | Ordin ISCIR 7/2013 — Siguranța ascensoarelor de persoane | ordin | iscir | [ISCIR](https://iscir.ro/sectiune/legislatie/prescriptii) |
| 54 | `hg-1340-2011` | HG 1340/2011 — Organizarea și funcționarea ISCIR | hotarare | iscir | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/132866) |

---

## F. Urbanism & spatial planning — 12 acts

| # | Slug | Title (short) | Type | Domain | Source |
|---|-----|---------------|------|--------|--------|
| 55 | `hg-525-1996-r2002` | HG 525/1996 (rep. 2002) — Regulament general urbanism | hotarare | urbanism | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/129025) |
| 56 | `ordin-mlpat-13n-1999` | Ordin MLPAT 13/N/1999 — Metodologie PUG | ordin | urbanism | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/18070) |
| 57 | `ordin-mlpat-176n-2000` | Ordin MLPAT 176/N/2000 — Metodologie PUZ | ordin | urbanism | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/23921) |
| 58 | `normativ-np061-2002` | NP 061/2002 — Evaluare seismică clădiri din zidărie | normativ | urbanism | [MDLPA](https://www.mdlpa.ro/pages/reglementare5) |
| 59 | `normativ-np062-2002` | NP 062/2002 — Încărcări.utilă clădiri civile | normativ | urbanism | [MDLPA](https://www.mdlpa.ro/pages/reglementare24) |
| 60 | `normativ-np003-1997` | NP 003-1997 — Instalații sanitare (predecessor NP 084) | normativ | urbanism | [MDLPA](https://www.mdlpa.ro/pages/reglementare17) |
| 61 | `normativ-np007-1997` | NP 007-1997 — Structuri cadre beton armat (predecessor) | normativ | urbanism | [MDLPA](https://www.mdlpa.ro/pages/reglementare4) |
| 62 | `normativ-np015-1997` | NP 015-1997 — Construcții spitalicești (predecessor) | normativ | urbanism | [MDLPA](https://www.mdlpa.ro/pages/reglementare17) |
| 63 | `ordin-10n-1993` | Ordin 10/N/1993 — Parcaje (predecessor NP 24) | ordin | urbanism | [MDLPA](https://www.mdlpa.ro/pages/reglementare28) |
| 64 | `normativ-c37-88` | C 37-88 — Învelitori (predecessor NP 069) | normativ | urbanism | [MDLPA](https://www.mdlpa.ro/pages/reglementare9) |
| 65 | `normativ-np112-2004` | NP 112-2004 — Fundații suprafață (predecessor NP 112-2014) | normativ | urbanism | [MDLPA](https://www.mdlpa.ro/pages/reglementare3) |
| 66 | `normativ-np114-04` | NP 114-04 — Ancoraje geotehnice (predecessor NP 114-2014) | normativ | urbanism | [MDLPA](https://www.mdlpa.ro/pages/reglementare3) |

---

## G. Construction quality & authorization — 14 acts

| # | Slug | Title (short) | Type | Domain | Source |
|---|-----|---------------|------|--------|--------|
| 67 | `hg-925-1995-amend` | HG 742/2018 amendă context (verificare/expertizare) | hotarare | calitate | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/205185) |
| 68 | `ordin-mtct-217-2005` | Ordin MTCT 217/2005 — Aprobă NP 086-2005 | ordin | calitate | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/62176) |
| 69 | `ordin-omeca-663-2010` | Ordin OMECA 663/2010 — Aprobă PT C1/C4/C6/C7/C8/C9/C10 | ordin | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 70 | `ordin-omeca-1404-2010` | Ordin OMECA 1404/2010 — Aprobă PT R1/R2/R3/R8 | ordin | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 71 | `ordin-omeca-2154-2009` | Ordin OMECA 2154/2009 — Aprobă PT CR4/CR8-2009 | ordin | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 72 | `ordin-ome-557-2014` | Ordin OME 557/2014 — Modifică PT C1/C4/C6/C7/C8/C9/C10 | ordin | iscir | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/142930) |
| 73 | `ordin-omeca-1007-2010` | Ordin OMECA 1007/2010 — Aprobă PT A1-2010 | ordin | iscir | [ISCIR](https://iscir.ro/prescriptii-iscir) |
| 74 | `ordin-medt-1649-2018` | Ordin 1649/2018 — Modifică PT C3-2012 | ordin | iscir | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/209828) |
| 75 | `ordin-756-2023` | Ordin ME 756/2023 — Aprobă PT C14-2021 (GNCV) | ordin | iscir | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/271644) |
| 76 | `ordin-mdrap-1369-2014` | (notă: slug există ca `ordin-mdrap-1369-2014` deja — skip) | — | — | — |
| 77 | `ordin-isc-1405-1610-2023` | (slug există deja — skip) | — | — | — |
| 78 | `hg-1028-2013` | HG 1028/2013 — Regulament racordare rețele electrice (abrogă HG 90/2008) | hotarare | anre | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/152388) |
| 79 | `ordin-anre-19-2022` | Ordin ANRE 19/2022 — Procedură racordare (predecessor/neurmărit) | ordin | anre | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/252388) |
| 80 | `ordin-anre-67-2024` | Ordin ANRE 67/2024 — Amendament la regulamentul racordării | ordin | anre | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/287409) |

---

## H. Environment & safety (construction-relevant) — 9 acts

| # | Slug | Title (short) | Type | Domain | Source |
|---|-----|---------------|------|--------|--------|
| 81 | `lege-265-2006` | Legea 265/2006 — Aprobă OUG 195/2005 (mediu) | lege | mediu | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/72031) |
| 82 | `hg-445-2009` | HG 445/2009 — Evaluare impact asupra mediului | hotarare | mediu | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/102108) |
| 83 | `hg-1076-2004` | HG 1076/2004 — Regim de autorizare a deseurilor minier | hotarare | mediu | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/48242) |
| 84 | `hg-856-2010` | HG 856/2010 — Evidența gestionării deseurilor | hotarare | mediu | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/124034) |
| 85 | `lege-211-2011` | Legea 211/2011 — Regimul deșeurilor de extracție | lege | mediu | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/127705) |
| 86 | `hg-351-2005` | HG 351/2005 — Depozitare deseuri | hotarare | mediu | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/49922) |
| 87 | `lege-241-2006` | Legea 241/2006 — Serviciul de ambulanță / IP | lege | munca | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/72517) |
| 88 | `hg-1093-2006` | HG 1093/2006 — Cerințe minime SSM șantier | hotarare | munca | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/74152) |
| 89 | `hg-859-2005` | HG 859/2005 — Norme metodologice Legea 319/2006 | hotarare | munca | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/60922) |

---

## I. Fire safety — additional — 6 acts

| # | Slug | Title (short) | Type | Domain | Source |
|---|-----|---------------|------|--------|--------|
| 90 | `ordin-mai-129-2016` | Ordin MAI 129/2016 — Metodologie autorizare anti-incendiu (predecessor) | ordin | incendiu | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/184178) |
| 91 | `ordin-mai-78-2014` | Ordin MAI 78/2014 — Verificarea instalațiilor de prevenire | ordin | incendiu | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/159310) |
| 92 | `hg-678-1998` | HG 678/1998 — Contravenții anti-incendiu (predecessor HG 537/2007) | hotarare | incendiu | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/10759) |
| 93 | `hg-1739-2006` | HG 1.739/2006 — Construcții supuse avizării anti-incendiu (predecessor HG 571/2016) | hotarare | incendiu | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/70382) |
| 94 | `ordin-mai-286-2006` | Ordin MAI 286/2006 — Comisia de stabilire a categoriei de pericol | ordin | incendiu | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/70037) |
| 95 | `normativ-i18-2-2002` | I 18/2-2002 — Detectare, semnalizare incendiu (predecessor P118/3) | normativ | incendiu | [MDLPA](https://www.mdlpa.ro/pages/reglementare28) |

---

## J. Recepție & execuție — 5 acts

| # | Slug | Title (short) | Type | Domain | Source |
|---|-----|---------------|------|--------|--------|
| 96 | `hg-845-2018-amend` | HG 172/2024 context — recepție infrastructură (HG 845 predecessor amendament) | hotarare | receptie | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/279594) |
| 97 | `ordin-mdrt-277-2012` | (slug există deja ca `ordin-mdrt-277-2012` — skip) | — | — | — |
| 98 | `normativ-p108-1980` | P 108-1980 — Grinzi oțel secțiune plină cu inimă | normativ | executie | [MDLPA](https://www.mdlpa.ro/pages/reglementare6) |
| 99 | `normativ-gp101-2004` | GP 101-2004 — Ghid izolare seismică pasivă | ghid | executie | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/87122) |
| 100 | `normativ-me003-2007` | ME 003/2007 — Investigare siguranță post-seism clădiri | normativ | executie | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/102891) |

---

## Net new acts (after removing already-present slugs)

Entries flagged "skip" above (#76, #77, #97) collide with existing slugs and
must be dropped. Removing those 3 leaves **97 unique new acts**. To reach a
clean 100, three more candidates from the same sources:

| # | Slug | Title (short) | Type | Domain | Source |
|---|-----|---------------|------|--------|--------|
| 98b | `normativ-np008-2001` | NP 008-2001 — Încărcări(utilă) proiectare clădiri | normativ | calitate | [MDLPA](https://www.mdlpa.ro/pages/reglementare24) |
| 99b | `ordin-mdlpa-2352-2014` | Ordin 2352/2014 — Aprobă NP 112-2014 | ordin | calitate | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocumentAfis/164063) |
| 100b | `ordin-mdlpa-1444-2014` | Ordin 1444/2014 — Aprobă NP 114-2014 | ordin | calitate | [Portal Legislativ](https://legislatie.just.ro/Public/DetaliiDocument/161148) |

**Total unique new acts: 100.** Combined with the existing 200, the repo would
track **300 acts**.

---

## Verification checklist before importing

For each act above, before creating `metadata/acts/<slug>.json`:

1. Confirm the act number/year/title on the Portal Legislativ page.
2. Verify `import_method: "metadata-only"` (no full text imported).
3. Set `status: "unknown"` unless an explicit repeal is documented.
4. Add `source_url` from the Portal Legislativ `DetaliiDocument` page.
5. Add `related_acts` / `relationships` where the text references a known local
   act (e.g. CR 0-2012 → Legea 10/1995).
6. Run `node scripts/validate-metadata.mjs` after each batch.

---

## Sources consulted

- [MDLPA lista reglementări tehnice](https://www.mdlpa.ro/pages/reglementaritehnice)
- [ISCIR prescripții tehnice în vigoare](https://iscir.ro/prescriptii-iscir)
- [OAR — reglementări structurale](https://oar.archi/reglementari-tehnice-2/normative-si-standarde/reglementari-tehnice-privind-calculul-constructiilor-si-elementelor-de-constructii/)
- [Portal Legislativ](https://legislatie.just.ro)
- Existing repo slugs in `metadata/acts/` (200 files, verified 2026-08-15).
