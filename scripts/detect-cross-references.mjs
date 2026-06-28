#!/usr/bin/env node
/**
 * detect-cross-references.mjs
 *
 * Scans all full-text legi/<slug>.md files (between OFFICIAL_TEXT_START and
 * OFFICIAL_TEXT_END markers) for references to other Romanian legal acts.
 * Outputs three files under cross-references/:
 *   - cross-references-raw.json      raw per-reference list
 *   - relationships-auto.json        aggregated per-source-act view
 *   - relationships-diff.md          human-readable diff vs existing metadata
 *
 * Does NOT modify any metadata or text files.
 * Node.js stdlib only — no external packages.
 */

import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const LEGI_DIR = join(ROOT, 'legi');
const METADATA_DIR = join(ROOT, 'metadata', 'acts');
const OUT_DIR = join(ROOT, 'cross-references');

mkdirSync(OUT_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// 1. Build slug lookup: { "lege|50|1991" -> "lege-50-1991" }
// ---------------------------------------------------------------------------

/** Normalize act type string to a canonical key used in slug resolution */
function canonicalType(raw) {
  const s = raw.toLowerCase().trim();
  if (s === 'lege') return 'lege';
  if (s === 'hotarare' || s === 'hg' || s === 'hgr') return 'hotarare';
  if (s === 'ordonanta' || s === 'oug' || s === 'og') return 'ordonanta';
  if (s === 'ordin') return 'ordin';
  if (s === 'normativ') return 'normativ';
  return s;
}

const slugLookup = new Map(); // "canonical_type|number|year" -> slug

const metaFiles = readdirSync(METADATA_DIR).filter(f => f.endsWith('.json') && !f.includes(' '));
const metaBySlug = new Map(); // slug -> metadata object

for (const mf of metaFiles) {
  const slug = mf.replace(/\.json$/, '');
  let meta;
  try {
    meta = JSON.parse(readFileSync(join(METADATA_DIR, mf), 'utf8'));
  } catch {
    continue;
  }
  metaBySlug.set(slug, meta);

  if (meta.type && meta.number && meta.year) {
    const key = `${canonicalType(meta.type)}|${meta.number}|${meta.year}`;
    slugLookup.set(key, slug);
  }
}

// ---------------------------------------------------------------------------
// 2. Regex patterns for Romanian act references
// ---------------------------------------------------------------------------

/**
 * Named capture groups:
 *   act_word  — Legea / HG / Hotărârea / OUG / Ordonanța / Ordinul / Norma / Normativul
 *   nr        — optional "nr." / "nr" part
 *   number    — the act number
 *   year      — 4-digit year
 *
 * We want to match variations like:
 *   Legea nr. 50/1991
 *   Legea 50/1991
 *   HG nr. 343/2017
 *   Hotărârea Guvernului nr. 343/2017
 *   OUG nr. 195/2005
 *   Ordonanța de urgență nr. 195/2005
 *   Ordinul nr. 839/2009
 *   Ordinul ministrului nr. 839/2009
 */
const ACT_PATTERN = new RegExp(
  '(Legea?|HGR?|Hotărârea?(?:\\s+Guvernului)?|O\\.?U\\.?G\\.?|Ordonanța(?:\\s+de\\s+urgență)?(?:\\s+a\\s+Guvernului)?|' +
  'Ordonanța?\\s+Guvernului|OG|Ordinul?(?:\\s+ministrului)?(?:\\s+nr\\.?)?|' +
  'Normativ(?:ul)?|Normei?|Norma?)' +          // act word(s)
  '(?:\\s+(?:nr\\.?|nr))?' +                   // optional nr.
  '\\s*(\\d{1,4})' +                           // number
  '[/\\-](\\d{4})',                             // /year or -year
  'gi'
);

/**
 * Article reference pattern — matches text like:
 *   art. 7   art. 7 alin. (1)   articolul 7   Art. 22
 */
const ART_PATTERN = /\bart\.?\s*(\d+)(?:\s+alin\.?\s*\((\d+)\))?/gi;

// ---------------------------------------------------------------------------
// 3. Map matched text → canonical type key
// ---------------------------------------------------------------------------
function matchedTextToType(actWord) {
  const s = actWord.toLowerCase().replace(/\s+/g, ' ').trim();
  if (s.startsWith('lege') || s === 'legea') return 'lege';
  if (s.startsWith('hg') || s.startsWith('hotărâ')) return 'hotarare';
  if (s.startsWith('o.u.g') || s.startsWith('oug') || s.startsWith('ordonanța de urgență') || s.startsWith('ordonanta de urgenta')) return 'ordonanta';
  if (s.startsWith('og') || s.startsWith('ordonanța guvernului') || s.startsWith('ordonanța g') || s.startsWith('ordonanța')) return 'ordonanta';
  if (s.startsWith('ordin')) return 'ordin';
  if (s.startsWith('normativ') || s.startsWith('norma') || s.startsWith('normei')) return 'normativ';
  return 'unknown';
}

// ---------------------------------------------------------------------------
// 4. Scan each legi/*.md file
// ---------------------------------------------------------------------------

const legiFiles = readdirSync(LEGI_DIR)
  .filter(f => f.endsWith('.md'))
  .sort();

const references = [];

for (const lf of legiFiles) {
  const sourceSlug = lf.replace(/\.md$/, '');
  const meta = metaBySlug.get(sourceSlug);
  if (meta && meta.import_method === 'metadata-only') continue;

  const content = readFileSync(join(LEGI_DIR, lf), 'utf8');

  // Extract official text block
  const startIdx = content.indexOf('<!-- OFFICIAL_TEXT_START -->');
  const endIdx = content.indexOf('<!-- OFFICIAL_TEXT_END -->');
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) continue;

  const officialText = content.slice(startIdx + '<!-- OFFICIAL_TEXT_START -->'.length, endIdx);
  const lines = officialText.split('\n');

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const lineNumber = lineIdx + 1; // 1-based within official block

    // Find act references on this line
    ACT_PATTERN.lastIndex = 0;
    let actMatch;
    while ((actMatch = ACT_PATTERN.exec(line)) !== null) {
      const actWord = actMatch[1];
      const number = actMatch[2];
      const year = actMatch[3];
      const matchedText = actMatch[0].trim();

      const type = matchedTextToType(actWord);
      const lookupKey = `${type}|${number}|${year}`;
      const suggestedTargetSlug = slugLookup.get(lookupKey) ?? null;

      // Skip self-references
      if (suggestedTargetSlug === sourceSlug) continue;

      // Find article reference on same line (after the act match position)
      let articleRef = null;
      const afterMatch = line.slice(actMatch.index + actMatch[0].length, actMatch.index + actMatch[0].length + 60);
      ART_PATTERN.lastIndex = 0;
      const artMatch = ART_PATTERN.exec(afterMatch);
      if (artMatch) {
        const artNum = artMatch[1];
        const alinNum = artMatch[2];
        articleRef = alinNum ? `art-${artNum}-alin-${alinNum}` : `art-${artNum}`;
      }

      references.push({
        source_slug: sourceSlug,
        source_line: lineNumber,
        matched_text: matchedText,
        act_type: type,
        number,
        year,
        article_ref: articleRef,
        suggested_target_slug: suggestedTargetSlug,
        status: suggestedTargetSlug ? 'resolved' : 'unknown',
      });
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Build summary
// ---------------------------------------------------------------------------
const totalFound = references.length;
const resolved = references.filter(r => r.status === 'resolved').length;
const unresolved = totalFound - resolved;
const sourceActsScanned = new Set(references.map(r => r.source_slug)).size;

const summary = {
  total_references_found: totalFound,
  resolved_to_known_acts: resolved,
  unresolved,
  source_acts_scanned: sourceActsScanned,
};

// ---------------------------------------------------------------------------
// 6. Write cross-references-raw.json
// ---------------------------------------------------------------------------
const rawOutput = {
  generated_at: new Date().toISOString(),
  summary,
  references,
};

writeFileSync(
  join(OUT_DIR, 'cross-references-raw.json'),
  JSON.stringify(rawOutput, null, 2) + '\n'
);
console.log(`cross-references-raw.json written — ${totalFound} references (${resolved} resolved, ${unresolved} unknown)`);

// ---------------------------------------------------------------------------
// 7. Build relationships-auto.json
// ---------------------------------------------------------------------------

/** @type {Map<string, { refs: Set<string>, unresolved: Set<string>, artLevel: Array }>} */
const bySource = new Map();

for (const ref of references) {
  if (!bySource.has(ref.source_slug)) {
    bySource.set(ref.source_slug, { refs: new Set(), unresolved: new Set(), artLevel: [] });
  }
  const entry = bySource.get(ref.source_slug);

  if (ref.status === 'resolved') {
    entry.refs.add(ref.suggested_target_slug);
    if (ref.article_ref) {
      entry.artLevel.push({
        target: ref.suggested_target_slug,
        article: ref.article_ref,
        source_line: ref.source_line,
      });
    }
  } else {
    entry.unresolved.add(ref.matched_text);
  }
}

const suggestedRelationships = {};
for (const [slug, entry] of bySource.entries()) {
  suggestedRelationships[slug] = {
    references_in_text: [...entry.refs].sort(),
    unresolved_references: [...entry.unresolved].sort(),
    article_level_refs: entry.artLevel,
  };
}

const autoOutput = {
  generated_at: new Date().toISOString(),
  note: 'Auto-detected suggestions only. Human review required before merging into metadata.',
  suggested_relationships: suggestedRelationships,
};

writeFileSync(
  join(OUT_DIR, 'relationships-auto.json'),
  JSON.stringify(autoOutput, null, 2) + '\n'
);
console.log('relationships-auto.json written');

// ---------------------------------------------------------------------------
// 8. Build relationships-diff.md
// ---------------------------------------------------------------------------

const now = new Date().toISOString();
const diffLines = [
  '# Cross-Reference Suggestions',
  '',
  `Generated: ${now}`,
  '',
  '> Auto-detected only. Review and manually update `metadata/acts/*.json` if confirmed.',
  '',
];

// Collect all source slugs that appeared in scan
const allSourceSlugs = [...new Set(legiFiles.map(f => f.replace(/\.md$/, '')))].sort();

for (const slug of allSourceSlugs) {
  const meta = metaBySlug.get(slug);
  if (meta && meta.import_method === 'metadata-only') continue;

  const existingRelated = new Set((meta?.related_acts ?? []));
  const detected = bySource.get(slug);
  const detectedResolved = detected ? detected.refs : new Set();
  const detectedUnresolved = detected ? detected.unresolved : new Set();

  // Compute sets
  const alreadyIn = [...detectedResolved].filter(s => existingRelated.has(s)).sort();
  const suggestedAdditions = [...detectedResolved].filter(s => !existingRelated.has(s)).sort();
  const inMetaNotDetected = [...existingRelated].filter(s => !detectedResolved.has(s)).sort();

  diffLines.push(`## ${slug}`, '');

  if (alreadyIn.length) {
    diffLines.push('### Already in related_acts');
    for (const s of alreadyIn) diffLines.push(`- ${s} ✓`);
    diffLines.push('');
  }

  if (suggestedAdditions.length) {
    diffLines.push('### Detected in text but NOT in related_acts (suggested additions)');
    for (const target of suggestedAdditions) {
      // Find a representative line reference
      const rep = references.find(r => r.source_slug === slug && r.suggested_target_slug === target);
      const lineNote = rep ? ` — line ${rep.source_line}: "${rep.matched_text}"` : '';
      diffLines.push(`- ${target}${lineNote}`);
    }
    diffLines.push('');
  }

  if (inMetaNotDetected.length) {
    diffLines.push('### In related_acts but NOT detected in text');
    for (const s of inMetaNotDetected) diffLines.push(`- ${s}`);
    diffLines.push('');
  }

  if (detectedUnresolved.size) {
    diffLines.push('### References detected but not matched to any known act (unresolved)');
    for (const u of [...detectedUnresolved].sort()) diffLines.push(`- ${u}`);
    diffLines.push('');
  }

  if (!alreadyIn.length && !suggestedAdditions.length && !inMetaNotDetected.length && !detectedUnresolved.size) {
    diffLines.push('*(no cross-references detected in official text)*', '');
  }
}

writeFileSync(
  join(OUT_DIR, 'relationships-diff.md'),
  diffLines.join('\n') + '\n'
);
console.log('relationships-diff.md written');

// ---------------------------------------------------------------------------
// 9. Final summary to stdout
// ---------------------------------------------------------------------------
console.log('\nSummary:');
console.log(`  Source acts scanned:    ${sourceActsScanned}`);
console.log(`  Total references found: ${totalFound}`);
console.log(`  Resolved to known acts: ${resolved}`);
console.log(`  Unresolved (unknown):   ${unresolved}`);

// Top referenced acts
const targetCounts = new Map();
for (const ref of references) {
  if (ref.suggested_target_slug) {
    targetCounts.set(ref.suggested_target_slug, (targetCounts.get(ref.suggested_target_slug) ?? 0) + 1);
  }
}
const topTargets = [...targetCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
if (topTargets.length) {
  console.log('\nTop referenced acts:');
  for (const [slug, count] of topTargets) {
    console.log(`  ${count}x  ${slug}`);
  }
}
