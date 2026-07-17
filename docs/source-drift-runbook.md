# Source Drift And Compromise Runbook

This runbook defines how to detect and handle **source drift** (the same URL serving different content over time) and possible **compromise or defacement** scenarios for external sources used by:

- `constructii-legislatie-ro`;
- `constructii-authorities-ro`;
- Radar workflows that verify authorizations, professional registers, or authority records.

Principle: **URL is not truth.** Trust requires source identity, retrieval time, snapshot hash, and document identity metadata.

## Implementation Status

**Status:** policy target / operational runbook.

This document defines the behavior the source-drift system must enforce before
it is treated as an active blocking gate. The current `scripts/audit-source-url.mjs`
and `.github/workflows/source-audit.yml` provide fetch-level source evidence,
but they do not yet implement the full drift/compromise workflow described here.

Before this runbook is treated as an active gate, the implementation must add:

- persistent baseline storage for `snapshot_hash_prev`;
- hash metadata storage: algorithm, raw-versus-canonical basis, and canonicalization version;
- final response URL and redirect-chain capture;
- allowlist validation of the final response URL, not only the original metadata URL;
- separate auditing for changed `source_url` and changed `official_detail_url`;
- blocking `ROT` handling for active Tier 0 and Tier 1 sources;
- raw-response compromise checks in addition to canonical document-hash checks.

Until those pieces exist, this document is the policy target and incident-response
guide. The existing source-audit workflow remains a fetch-level pre-merge check,
not a complete drift detector.

## Definitions

| Term | Meaning |
|---|---|
| Source snapshot | The captured source content at `retrieved_at` time, such as exact HTML/PDF bytes or extracted canonical text. |
| `snapshot_hash` | Deterministic hash of the snapshot, either exact bytes or documented canonicalized text. |
| Drift | `snapshot_hash` changes for the same `source_url` without an expected or explained update. |
| Compromise signal | Indicators such as defacement, malware, suspicious redirect, unrelated content, or unexpected domain change. A compromise signal can exist even when the canonical document hash is stable. |

## Minimum Data Model

Every source URL used as evidence should record:

- `source_type`, for example `ASRO_BS`, `ASRO_CATALOG`, `MDLPA`, `MO`, `EUR_LEX`, `INSTITUTION_SITE`, or `REGISTER`;
- `retrieved_at`;
- `snapshot_hash`.

Recommended additional fields:

- `http_status`;
- `content_type`;
- `content_length`;
- `canonical_title` or `doc_id`, when available.
- `hash_algorithm`, such as `sha256`;
- `hash_basis`, such as `raw-bytes` or `canonical-text`;
- `canonicalization_version`, when `hash_basis` is not raw bytes.

Rule: evidence without `retrieved_at` and `snapshot_hash` is `NEEDS_MORE_EVIDENCE`.
Evidence with incomparable hash basis or canonicalization metadata is also
`NEEDS_MORE_EVIDENCE` for drift comparison.

## Trust Tiers

### Tier 0: hard authoritative

Examples:

- Portal Legislativ;
- Monitorul Oficial / e-monitor;
- EUR-Lex / Official Journal of the European Union;
- ASRO for standards metadata;
- official public registers.

Trust tiers classify source risk only. They do not override each repository's
approved source allowlist, licensing rules, or human-approval process. A Tier 0
source that is outside a repository's allowlist still requires explicit approval
before it can be used as evidence.

### Tier 1: stable but drift-prone

Examples:

- ministry pages;
- public authority pages;
- professional board pages;
- official PDFs hosted on institution websites.

### Tier 2: fallback only

Examples:

- aggregators;
- mirrors;
- copied PDFs;
- third-party indexes.

Radar rule: do not issue a `valid` or `invalid` verdict from Tier 2 evidence alone. Return `needs manual verification`.

## Cadence

- **Weekly:** run automated source checks for Tier 0 and Tier 1 sources used in the last 90 days, unless a repository-specific configuration overrides the window.
- **Critical active sources:** audit every week regardless of the 90-day window. This includes active public registers, primary act sources, and any source currently used by Radar for a user-facing verification path.
- **Before merge:** audit every new or modified `source_url` or `official_detail_url` introduced by a pull request. The current workflow partially covers this as a fetch-level check; full drift-gate behavior requires the implementation prerequisites above.
- **After merge:** optionally repeat the audit for monitoring and reporting, but do not rely on a post-merge audit as the first check for a new source URL.

## Source Drift Check

### Input

The active URL list from metadata and evidence records, including both
`source_url` and `official_detail_url` when present.

### Output artifacts

- `drift_report.json` for machines;
- `drift_report.md` for human review.

### Behavior

For each URL:

1. refetch with retry and backoff;
2. record the final response URL and redirect chain;
3. validate the final URL against the approved source allowlist;
4. capture a source snapshot;
5. canonicalize the snapshot when the source is known to include dynamic page chrome or request-specific bytes;
6. compute `snapshot_hash_new`;
7. compare with `snapshot_hash_prev`.

For newly introduced URLs, or replaced URL values, there is no previous hash.
The first reviewed capture is classified as `BASELINE`, not `OK` or `DRIFT`.

For dynamic pages such as Portal Legislativ detail pages, do not classify a raw
body hash change as `DRIFT` until a documented stable canonicalization or
document-identity comparison confirms that the underlying document identity has
changed.

### Result classification

| Result | Meaning |
|---|---|
| `BASELINE` | First reviewed snapshot for a new or replaced URL; store the initial hash for future comparisons. |
| `OK` | Hash unchanged. |
| `ROT` | The source returns 404/410, times out, or is otherwise unavailable. |
| `DRIFT` | Canonicalized snapshot hash or document identity changed. |
| `SUSPECT` | Compromise indicators are present, with or without canonical document drift. |

## PASS / FAIL Gates

### PASS

- No Tier 0 or Tier 1 source is `SUSPECT`.
- No Tier 0 or Tier 1 source is `ROT`, unless the affected evidence has already been marked inactive or replaced with reviewed fallback evidence.
- New or replaced URLs are `BASELINE` with reviewer-accepted identity fields and hash.
- Any `DRIFT` is explained by a source-backed update, such as a new document version, and evidence includes the new source, timestamp, and hash.

### FAIL / QUARANTINE

Any of these conditions is a hard failure:

- `SUSPECT` on a Tier 0 or Tier 1 source;
- `ROT` on Tier 0 or Tier 1 evidence that is still active;
- unexplained `DRIFT` on a critical source such as an authorization register or primary act;
- redirect to a new unauthorized domain;
- obviously defaced or unrelated content.

Effects:

- block auto-fix and auto-import for the affected domain;
- mark affected evidence `needs_review`;
- degrade Radar responses to: "Cannot confirm; the source changed and needs human verification."

## Incident Workflow

### 1. Triage, target 15 minutes

- Identify the affected domain and surface: legislation, register, or authority record.
- Classify the source tier.
- Confirm drift with two independent fetches when possible, ideally from two networks.

### 2. Containment

- Put the affected domain on a temporary denylist for ingest and refresh.
- Stop any automated task that would repair links for that domain.

### 3. Safe fallback

Temporarily use an equivalent Tier 0 source only when proof fields are available:

- title;
- number/year;
- issuer;
- Monitorul Oficial reference, when applicable;
- `retrieved_at`;
- `snapshot_hash`.

### 4. Recovery

After the domain becomes stable:

- capture a new snapshot;
- document why the change is accepted;
- record a reviewed stabilization decision;
- release the domain from quarantine or denylist explicitly;
- re-enable paused automation explicitly;
- run backfill on affected sources;
- update reports and changelog notes.

## Link Repair Policy

Agents may propose link repairs only when they can produce source-appropriate
identity fields.

For legal acts and regulations:

- `act_title`;
- `number_year`;
- issuer;
- Monitorul Oficial reference, when applicable;
- `retrieved_at`;
- `snapshot_hash`.

For registers and authority records:

- register name;
- license number, registration number, CUI, or equivalent stable identifier;
- issuing or maintaining authority;
- validity interval, when applicable;
- `retrieved_at`;
- `snapshot_hash`.

If identity cannot be proven, the correct outcome is `STOPPED / NEEDS_MORE_EVIDENCE` with no repository change.

## Radar Register Guardrails

For authorization and register checks:

- do not validate from a single page alone;
- require identity fields such as license number, CUI, issuing authority, and validity interval;
- if drift or compromise is suspected, degrade the response and escalate to human review.

## Closeout Note After `SUSPECT`

Every `SUSPECT` incident requires a closeout note with:

- affected domain and time interval;
- quarantined artifacts;
- fallback source used, if any;
- repaired links, if any;
- proof of stabilization, including new hashes and timestamps.
