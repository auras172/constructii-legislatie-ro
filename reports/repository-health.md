# Repository Health Report

Generated: 2026-06-29T20:28:14.877Z

## Summary

| Metric | Value |
| --- | --- |
| Total metadata entries | 25 |
| Full-text acts | 13 |
| Metadata-only acts | 12 |
| Import log files | 25 |
| Total relationship links | 53 |
| Unique domains | 8 |
| Unique issuers | 3 |

## Coverage Matrix

| slug | full text | metadata | import log | markers | relationships | provenance |
| --- | --- | --- | --- | --- | --- | --- |
| hg-300-2006 | ✓ | ✓ | ✓ | ✓ | 3 | ✓ |
| hg-343-2017 | ✓ | ✓ | ✓ | ✓ | 4 | ✓ |
| lege-10-1995 | ✓ | ✓ | ✓ | ✓ | 1 | ✓ |
| lege-292-2018 | ✓ | ✓ | ✓ | ✓ | 2 | ✓ |
| lege-307-2006 | ✓ | ✓ | ✓ | ✓ | 3 | ✓ |
| lege-319-2006 | ✓ | ✓ | ✓ | ✓ | 2 | ✓ |
| lege-350-2001 | ✓ | ✓ | ✓ | ✓ | 1 | ✓ |
| lege-372-2005 | ✓ | ✓ | ✓ | ✓ | 2 | ✓ |
| lege-481-2004 | ✓ | ✓ | ✓ | ✓ | 2 | ✓ |
| lege-50-1991 | ✓ | ✓ | ✓ | ✓ | 4 | ✓ |
| metodologie-mc001-2022 | ✗ | ✓ | ✓ | — | 2 | ✓ |
| normativ-i7-2011 | ✗ | ✓ | ✓ | — | 1 | ✓ |
| normativ-i9-2022 | ✗ | ✓ | ✓ | — | 1 | ✓ |
| normativ-np005-2022 | ✗ | ✓ | ✓ | — | 1 | ✓ |
| normativ-np007-2025 | ✗ | ✓ | ✓ | — | 2 | ✓ |
| normativ-np015-2022 | ✗ | ✓ | ✓ | — | 1 | ✓ |
| normativ-np051-2012 | ✗ | ✓ | ✓ | — | 1 | ✓ |
| normativ-np133-2022 | ✗ | ✓ | ✓ | — | 2 | ✓ |
| normativ-p100-1-2013 | ✗ | ✓ | ✓ | — | 3 | ✓ |
| normativ-p100-3-2019 | ✗ | ✓ | ✓ | — | 2 | ✓ |
| normativ-p118-1-2025 | ✗ | ✓ | ✗ | — | 3 | ✗ |
| normativ-p130-2025 | ✗ | ✓ | ✓ | — | 2 | ✓ |
| ordin-839-2009 | ✓ | ✓ | ✓ | ✓ | 4 | ✓ |
| oug-195-2005 | ✓ | ✓ | ✓ | ✓ | 2 | ✓ |
| oug-21-2004 | ✓ | ✓ | ✓ | ✓ | 2 | ✓ |

## Statistics

### Domains

| Value | Count |
| --- | --- |
| calitate | 11 |
| incendiu | 4 |
| munca | 2 |
| mediu | 2 |
| nzeb | 2 |
| autorizatii | 2 |
| receptie | 1 |
| urbanism | 1 |

### Issuers

| Value | Count |
| --- | --- |
| minister | 13 |
| parlament | 8 |
| guvern | 4 |

### Publication Years

| Value | Count |
| --- | --- |
| 2006 | 3 |
| 2023 | 3 |
| 2025 | 3 |
| 2004 | 2 |
| 2005 | 2 |
| 2013 | 2 |
| 2022 | 2 |
| 1991 | 1 |
| 1995 | 1 |
| 2001 | 1 |
| 2009 | 1 |
| 2011 | 1 |
| 2017 | 1 |
| 2018 | 1 |
| 2019 | 1 |

### Import Methods

| Value | Count |
| --- | --- |
| metadata-only | 12 |
| Portal Legislativ forma printabila (LEGE A) → text extract via curl + Python HTML strip → Markdown cu headings structurale | 4 |
| Portal Legislativ forma printabila → text extract via curl → Markdown | 2 |
| Portal Legislativ forma printabila (HG A) → text extract via curl + Python HTML strip → Markdown cu headings structurale | 1 |
| Portal Legislativ forma printabila → text extract via curl + Python HTML strip (br/p/div → newlines) → Markdown cu headings structurale | 1 |
| Portal Legislativ forma printabila (LEGE R) → text extract via curl + Python HTML strip → Markdown cu headings structurale | 1 |
| printable HTML → Markdown | 1 |
| Portal Legislativ forma printabila (ORDIN + NORMA separate) → text extract via curl → Markdown combinat | 1 |
| Portal Legislativ forma printabila (ORD DE URGENTA A) → text extract via curl + Python HTML strip → Markdown cu headings structurale | 1 |
| full-text | 1 |

## Health Score

**Score: 98.4 / 100**

| Dimension | Score (%) | Weight |
| --- | --- | --- |
| Metadata completeness | 100 | 20 |
| Import logs | 96 | 20 |
| Relationships | 100 | 15 |
| Official markers | 100 | 25 |
| Provenance | 96 | 20 |
| **Total** | **98.4** | **100** |

### Formula

```
score = dim_metadata_completeness*0.20 + dim_import_logs*0.20 + dim_relationships*0.15 + dim_official_markers*0.25 + dim_provenance*0.20
```

Each dimension is computed as `(qualifying_acts / relevant_total) * 100`.
The denominator for **official_markers** is full-text acts only.
If a denominator is zero the dimension scores 100 (no acts → no failures).

## Warnings

No warnings — repository is clean.
