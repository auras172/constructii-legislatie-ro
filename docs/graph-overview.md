# OCKI Graph Overview

Verified from generated graph artifacts on 2026-07-15.

This page is a human-readable view over the existing repository graph. It does
not define legal relationships and does not replace the generated artifacts.

## Current Counts

Counts are read from the generated artifacts:

- `graph/graph.json`: 68 nodes, 107 confirmed edges, 0 auto-detected edges,
  0 unresolved skipped references.
- `reports/repository-health.json`: health 100/100, 68 metadata entries,
  13 full-text acts, 55 metadata-only acts.
- `ocki-manifest.json`: 68 acts total, 13 full-text acts, 55 metadata-only
  acts.

Canonical generated graph files:

- [graph/graph.json](../graph/graph.json)
- [graph/graph.mmd](../graph/graph.mmd)

For the full graph, open [graph/graph.mmd](../graph/graph.mmd) in a
Mermaid-compatible viewer. The embedded sections below are smaller slices
derived from confirmed edges in [graph/graph.json](../graph/graph.json).

## Edge Status

Confirmed edges come from reviewed metadata relationships. They are suitable
for graph traversal and documentation because they already exist in generated
graph data.

`needs_review` edges are suggestions that still require human review before
they become canonical metadata. The current generated graph reports 0
auto-detected edges and 0 unresolved skipped references.

The graph is provenance metadata, not legal advice. Official sources remain
authoritative. A missing edge does not mean that no legal relationship exists;
it means the repository has not recorded that relationship as confirmed graph
metadata.

## ANRE Subgraph

```mermaid
flowchart LR
  hg_90_2008["HG 90/2008"] -->|related| ordin_anre_59_2013["Ordin ANRE 59/2013"]
  ordin_anre_133_2022["Ordin ANRE 133/2022"] -->|related| ordin_anre_59_2013
  ordin_anre_15_2026["Ordin ANRE 15/2026"] -->|related| ordin_anre_53_2024["Ordin ANRE 53/2024"]
  ordin_anre_15_2026 -->|related| ordin_anre_59_2013
  ordin_anre_160_2020["Ordin ANRE 160/2020"] -->|related| ordin_anre_59_2013
  ordin_anre_17_2022["Ordin ANRE 17/2022"] -->|related| ordin_anre_59_2013
  ordin_anre_20_2025["Ordin ANRE 20/2025"] -->|related| ordin_anre_59_2013
  ordin_anre_22_2020["Ordin ANRE 22/2020"] -->|related| ordin_anre_59_2013
  ordin_anre_4_2023["Ordin ANRE 4/2023"] -->|related| ordin_anre_59_2013
  ordin_anre_53_2024 -->|related| ordin_anre_59_2013
  ordin_anre_59_2013 -->|related| hg_90_2008
  ordin_anre_60_2024["Ordin ANRE 60/2024"] -->|related| ordin_anre_59_2013
  ordin_anre_65_2024["Ordin ANRE 65/2024"] -->|related| ordin_anre_66_2023["Ordin ANRE 66/2023"]
  ordin_anre_68_2020["Ordin ANRE 68/2020"] -->|related| ordin_anre_59_2013
  ordin_anre_70_2023["Ordin ANRE 70/2023"] -->|related| ordin_anre_59_2013
  ordin_anre_81_2022["Ordin ANRE 81/2022"] -->|related| ordin_anre_59_2013
```

## ISCIR Subgraph

```mermaid
flowchart LR
  lege_64_2008["Legea 64/2008"] -->|related| normativ_pt_c1_2010["PT C 1-2010"]
  lege_64_2008 -->|related| normativ_pt_c4_2010["PT C 4-2010"]
  lege_64_2008 -->|related| normativ_pt_c6_2010["PT C 6-2010"]
  lege_64_2008 -->|related| normativ_pt_cr4_2009["PT CR 4-2009"]
  lege_64_2008 -->|related| normativ_pt_cr8_2009["PT CR 8-2009"]
  normativ_pt_c1_2010 -->|related| lege_64_2008
  normativ_pt_c10_2010["PT C 10-2010"] -->|related| lege_64_2008
  normativ_pt_c4_2010 -->|related| lege_64_2008
  normativ_pt_c6_2010 -->|related| lege_64_2008
  normativ_pt_c7_2010["PT C 7-2010"] -->|related| lege_64_2008
  normativ_pt_c8_2010["PT C 8-2010"] -->|related| lege_64_2008
  normativ_pt_c9_2010["PT C 9-2010"] -->|related| lege_64_2008
  normativ_pt_cr4_2009 -->|related| lege_64_2008
  normativ_pt_cr8_2009 -->|related| lege_64_2008
  normativ_pt_r1_2010["PT R 1-2010"] -->|related| lege_64_2008
  normativ_pt_r3_2010["PT R 3-2010"] -->|related| lege_64_2008
  normativ_pt_r8_2010["PT R 8-2010"] -->|related| lege_64_2008
```

## Fire-Safety / P118 Subgraph

```mermaid
flowchart LR
  lege_307_2006["Legea 307/2006"] -->|related| normativ_p118_1_2025["Normativ P 118-1/2025"]
  lege_307_2006 -->|related| normativ_p118_3_2015["Normativ P 118/3-2015"]
  lege_307_2006 -->|related| oug_21_2004["OUG 21/2004"]
  lege_481_2004["Legea 481/2004"] -->|related| lege_307_2006
  lege_481_2004 -->|related| oug_21_2004
  normativ_p118_1_2025 -->|related| lege_307_2006
  normativ_p118_1_2025 -->|related| lege_481_2004
  normativ_p118_1_2025 -->|related| oug_21_2004
  normativ_p118_2_2013["Normativ P 118/2-2013"] -->|related| normativ_np086_2005["NP 086-2005"]
  normativ_p118_3_2015 -->|related| lege_307_2006
  oug_21_2004 -->|related| lege_307_2006
  oug_21_2004 -->|related| lege_481_2004
```

## Core Laws Subgraph

```mermaid
flowchart LR
  lege_10_1995["Legea 10/1995"] -->|related| lege_50_1991["Legea 50/1991"]
  lege_292_2018["Legea 292/2018"] -->|related| lege_50_1991
  lege_292_2018 -->|related| oug_195_2005["OUG 195/2005"]
  lege_307_2006["Legea 307/2006"] -->|related| lege_10_1995
  lege_307_2006 -->|related| lege_50_1991
  lege_307_2006 -->|related| oug_21_2004["OUG 21/2004"]
  lege_319_2006["Legea 319/2006"] -->|related| lege_10_1995
  lege_319_2006 -->|related| lege_50_1991
  lege_350_2001["Legea 350/2001"] -->|related| lege_50_1991
  lege_372_2005["Legea 372/2005"] -->|related| lege_10_1995
  lege_372_2005 -->|related| lege_50_1991
  lege_481_2004["Legea 481/2004"] -->|related| lege_307_2006
  lege_481_2004 -->|related| oug_21_2004
  lege_50_1991 -->|related| lege_10_1995
  lege_50_1991 -->|related| lege_292_2018
  lege_50_1991 -->|related| lege_350_2001
  ordin_839_2009["Ordin MDRAP 839/2009"] -->|related| lege_10_1995
  ordin_839_2009 -->|related| lege_350_2001
  ordin_839_2009 -->|related| lege_50_1991
  oug_195_2005 -->|related| lege_10_1995
  oug_195_2005 -->|related| lege_50_1991
  oug_21_2004 -->|related| lege_307_2006
  oug_21_2004 -->|related| lege_481_2004
```
