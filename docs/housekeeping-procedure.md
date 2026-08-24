# Housekeeping și handoff procedure

Aceasta este procedura operațională pentru menținerea repository-ului și a suprafețelor GitHub după importuri de legislație.

## Sursa de adevăr

Starea corpusului se citește din `origin/main`, apoi se verifică în:

- `ocki-manifest.json`;
- `reports/repository-health.json`;
- `INDEX.md`;
- `README.md`;
- import logs și metadata actelor.

Project board, Issues și eventualele Discussions sunt suprafețe de coordonare. Nu înlocuiesc fișierele comise și nu justifică singure afirmații juridice.

## Înainte de modificări

1. Verifică repository-ul și ramura implicită:

   ```bash
   gh repo view auras172/constructii-legislatie-ro
   git fetch --prune origin
   git show origin/main:ocki-manifest.json >/dev/null
   git show origin/main:reports/repository-health.json >/dev/null
   ```

2. Verifică workspace-ul local cu `git status --short --branch`. Nu șterge și nu suprascrie modificări preexistente.
3. Enumeră PR-urile și issue-urile deschise:

   ```bash
   gh pr list --repo auras172/constructii-legislatie-ro --state open
   gh issue list --repo auras172/constructii-legislatie-ro --state open
   ```

4. Dacă workspace-ul este murdar sau `origin/main` local este corupt, folosește un clone temporar curat în `/private/tmp` și păstrează checkout-ul utilizatorului neatins.

## Reconciliere locală

După un merge de import:

1. Compară snapshotul din README cu `reports/repository-health.json`.
2. Verifică faptul că INDEX-ul nu are numărări sau lacune depășite.
3. Rulează generatorii standard numai din branchul de housekeeping și inspectează diff-ul:

   ```bash
   node scripts/repository-health-report.mjs
   node scripts/generate-manifest.mjs
   node scripts/generate-changelog.mjs
   node scripts/generate-graph.mjs
   git diff --check
   ```

4. Nu comite timestamp drift sau artefacte fără legătură cu schimbarea documentată.

## Reconciliere GitHub

- Actualizează Project README cu snapshotul din `origin/main`, linkul către INDEX, health report și procedură.
- Închide issue-urile finalizate numai după ce PR-ul/commitul este verificat pe GitHub; lasă un comentariu cu dovada și linkul rezultatului.
- Nu reutiliza branchuri sau PR-uri închise/superseded.
- Nu pretinde că Wiki-ul este actualizat dacă API-ul repository-ului răspunde `404`; păstrează procedura în `docs/`.
- Verifică PR-urile cu `gh pr view`, `gh pr checks` și `mergeStateStatus` înainte de orice `merge-l`.

## Import handoff

Fiecare import rămâne un singur act, un branch și un PR. Handoff-ul trebuie să includă:

- sursele oficiale și auditul HTTP/browser separat;
- baseline/final pentru acte, full-text, metadata-only, noduri și relații;
- health, warnings și `needs_review`;
- relațiile confirmate și dovezile lor;
- lista exactă a fișierelor;
- validările locale și remote;
- review threads, merge state și limitările;
- PR Evidence Footer cu rollback concret.

## Condiții de oprire

Oprește-te și raportează `HOLD` dacă există duplicate, surse insuficiente, conflicte nerezolvate, check-uri critice roșii, PR concurent pentru același act sau risc de suprascriere a muncii locale. Nu compensa lipsa dovezilor prin relații speculative, noduri pentru anexe sau date calculate neverificate.

## Snapshot housekeeping 2026-08-24

La ultima reconciliere verificată, `origin/main` conținea 276 acte, 50 full-text, 226 metadata-only, 526 relații confirmate și health 100/100. Acest snapshot este informativ și trebuie recalculat după fiecare merge.
