# Source Drift And Compromise Runbook

This runbook defines how to detect and handle **source drift** (the same URL serving different content over time) and possible **compromise or defacement** scenarios for external sources used by:

- `constructii-legislatie-ro`;
- `constructii-authorities-ro`;
- Radar workflows that verify authorizations, professional registers, or authority records.

Principle: **URL is not truth.** Trust requires source identity, retrieval time, snapshot hash, and document identity metadata.

## Definitions

| Term | Meaning |
|---|---|
| Source snapshot | The captured source content at `retrieved_at` time, such as exact HTML/PDF bytes or extracted canonical text. |
| `snapshot_hash` | Deterministic hash of the snapshot, either exact bytes or documented canonicalized text. |
| Drift | `snapshot_hash` changes for the same `source_url` without an expected or explained update. |
| Compromise signal | Drift plus indicators such as defacement, malware, suspicious redirect, unrelated content, or unexpected domain change. |

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

Rule: evidence without `retrieved_at` and `snapshot_hash` is `NEEDS_MORE_EVIDENCE`.

## Trust Tiers

### Tier 0: hard authoritative

Examples:

- Portal Legislativ;
- Monitorul Oficial / e-monitor;
- EUR-Lex / Official Journal of the European Union;
- ASRO for standards metadata;
- official public registers.

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

- **Weekly:** run automated source checks for Tier 0 and Tier 1 sources used in the last N days.
- **Before merge:** audit every new or modified `source_url` introduced by a pull request. This is the gate that can block the merge.
- **After merge:** optionally repeat the audit for monitoring and reporting, but do not rely on a post-merge audit as the first check for a new source URL.

## Source Drift Check

### Input

The active `source_url` list from metadata and evidence records.

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
| `SUSPECT` | Drift plus compromise indicators. |

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
- run backfill on affected sources;
- update reports and changelog notes.

## Link Repair Policy

Agents may propose link repairs only when they can produce:

- `act_title`;
- `number_year`;
- issuer;
- Monitorul Oficial reference, when applicable;
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
