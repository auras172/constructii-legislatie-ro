# Import log — Metodologia reglementărilor tehnice în construcții (2020)

## Verdict

PASS — metadata-only import using the schema-supported `procedura` type for the official source labelled `METODOLOGIE`.

## Schema decision

The repository schema supports `procedura` but not `metodologie`. The source itself identifies the document as “METODOLOGIE din 1 iulie 2020”; `type: procedura` is therefore an explicit conservative schema mapping, without modifying `metadata/schema.json` or inventing a new type.

## Identity and publication evidence

- **Canonical source:** https://legislatie.just.ro/Public/DetaliiDocument/227872
- **Title:** Metodologie din 1 iulie 2020 privind inițierea, programarea, achiziția, elaborarea, avizarea, aprobarea și valorificarea reglementărilor tehnice și a rezultatelor activităților specifice în construcții, precum și pentru aprobarea cuantumului indemnizației de participare a membrilor în comitetele tehnice de specialitate și în comitetul tehnic de coordonare generală
- **Issuer:** Ministerul Lucrărilor Publice, Dezvoltării și Administrației
- **Issue date:** 2020-07-01
- **Publication:** Monitorul Oficial al României, Partea I, nr. 624/16.07.2020
- **Approval:** Ordinul nr. 3.363 din 1 iulie 2020, external because the approving act is absent from the repository
- **Structure:** 32 articles and 13 annex headings counted mechanically from the official HTML structure
- **Status:** `unknown`; the Portal source does not expose an explicit current status
- **Effective date:** omitted; no single calendar entry-into-force clause is declared by the methodology source

## Source audit

Final fetch from the official Portal detail page:

- URL: https://legislatie.just.ro/Public/DetaliiDocument/227872
- HTTP status: 200
- Content-Type: `text/html; charset=utf-8`
- Byte size: 616,393
- SHA-256: `b38791389caf963ea456171b16aa0ddba4bef4e8db186cf692b625f9f841d0c1`
- Retrieved: 2026-08-15T11:04:13Z UTC; response Date header: Sat, 15 Aug 2026 11:04:14 GMT
- Browser fallback: not required; complete official HTML was retrieved directly
- Portal variation: the audit recorded the dynamic Portal response as fetched; no conflicting identity was observed

## Confirmed relationships

- `implements -> lege-10-1995`: Art. 1 explicitly provides that the regulatory activity in construction is carried out according to Legea nr. 10/1995. The target exists locally.
- `implements -> hg-203-2003`: Art. 1 explicitly names the Regulation approved by HG nr. 203/2003. The target exists locally.

## External and rejected relationships

- Ordinul nr. 3.363/2020 is the approving act named by the official methodology, but it is absent from the repository; no external node or unsupported approval edge is created.
- Other acts cited in the methodology, including procurement and administrative references, are not added unless they are explicit and local targets under repository policy.
- No thematic relationships to other technical regulations are added.

## Metadata-only limitation

This import adds methodology metadata and provenance only. The methodology and its 13 annex structures are not copied as full text. The current status remains `unknown`, and no effective date is asserted.
