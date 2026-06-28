#!/usr/bin/env node
/**
 * add-article-anchors.mjs
 *
 * Adds {#art-N} anchors to article headings within OFFICIAL_TEXT_START/END blocks
 * in all full-text imported legi/*.md files.
 *
 * Usage:
 *   node scripts/add-article-anchors.mjs
 *
 * Rules:
 * - Only modifies lines between <!-- OFFICIAL_TEXT_START --> and <!-- OFFICIAL_TEXT_END -->
 * - Never modifies the markers themselves
 * - Skips acts with import_method: "metadata-only"
 * - Idempotent: running twice produces the same result
 * - Detects "### Articolul N" headings (numeric and roman numeral)
 * - Does NOT touch annex articles (inconsistent numbering across acts)
 * - For acts with duplicate article numbers (e.g. ORDIN+NORMA), appends -b, -c, etc.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const ACTS_META_DIR = join(ROOT, 'metadata', 'acts');
const LEGI_DIR = join(ROOT, 'legi');

const OFFICIAL_START = '<!-- OFFICIAL_TEXT_START -->';
const OFFICIAL_END = '<!-- OFFICIAL_TEXT_END -->';

// Matches "### Articolul N" or "### Articolul N^1" (numeric only, not Roman numerals)
// Roman numerals (Articolul I, II, III) in HG headers are treated separately
const ARTICLE_HEADING_NUMERIC = /^(#{1,4})\s+Articolul\s+(\d[\d^]*)\s*$/;

// Roman numeral pattern for HG-style articles (Articolul I, II, III, IV, V)
const ROMAN_NUMERALS = { I: 'i', II: 'ii', III: 'iii', IV: 'iv', V: 'v', VI: 'vi', VII: 'vii', VIII: 'viii', IX: 'ix', X: 'x' };
const ARTICLE_HEADING_ROMAN = /^(#{1,4})\s+Articolul\s+(I{1,3}|IV|VI{0,3}|IX|X)\s*$/;

// Anchor already present
const ANCHOR_PRESENT = /\{#[^}]+\}$/;

function slugifyNum(n) {
  // "1^1" → "1-1", "10" → "10"
  return n.replace('^', '-');
}

function loadMetadataOnly() {
  const metaOnlySlugs = new Set();
  const files = readdirSync(ACTS_META_DIR).filter(f => f.endsWith('.json'));
  for (const f of files) {
    const raw = readFileSync(join(ACTS_META_DIR, f), 'utf8');
    const meta = JSON.parse(raw);
    if (meta.import_method === 'metadata-only') {
      const slug = f.replace(/\.json$/, '');
      metaOnlySlugs.add(slug);
    }
  }
  return metaOnlySlugs;
}

function processFile(filePath) {
  const slug = basename(filePath, '.md');
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const startIdx = lines.findIndex(l => l.includes(OFFICIAL_START));
  const endIdx = lines.findLastIndex(l => l.includes(OFFICIAL_END));

  if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
    return { slug, modified: false, anchorsAdded: 0, reason: 'no markers' };
  }

  // Track article numbers seen so far to handle duplicates
  const seenArticles = new Map(); // art-N → count
  let anchorsAdded = 0;
  let modified = false;

  for (let i = startIdx + 1; i < endIdx; i++) {
    const line = lines[i];

    // Skip if anchor already present
    if (ANCHOR_PRESENT.test(line)) continue;

    let anchorId = null;

    // Check numeric article
    const numMatch = line.match(ARTICLE_HEADING_NUMERIC);
    if (numMatch) {
      const num = slugifyNum(numMatch[2]);
      anchorId = `art-${num}`;
    }

    // Check roman numeral article (only if no numeric match)
    if (!anchorId) {
      const romMatch = line.match(ARTICLE_HEADING_ROMAN);
      if (romMatch) {
        const romSlug = ROMAN_NUMERALS[romMatch[2]];
        if (romSlug) {
          anchorId = `art-${romSlug}`;
        }
      }
    }

    if (!anchorId) continue;

    // Handle duplicates: first occurrence = art-N, second = art-N-b, third = art-N-c, ...
    const count = seenArticles.get(anchorId) || 0;
    seenArticles.set(anchorId, count + 1);

    let finalAnchor = anchorId;
    if (count > 0) {
      // b for second, c for third, etc.
      const suffix = String.fromCharCode(98 + count - 1); // 98='b'
      finalAnchor = `${anchorId}-${suffix}`;
    }

    lines[i] = `${line} {#${finalAnchor}}`;
    anchorsAdded++;
    modified = true;
  }

  if (modified) {
    writeFileSync(filePath, lines.join('\n'), 'utf8');
  }

  return { slug, modified, anchorsAdded };
}

function main() {
  const metaOnly = loadMetadataOnly();

  const mdFiles = readdirSync(LEGI_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .sort();

  let totalModified = 0;
  let totalAnchors = 0;

  for (const f of mdFiles) {
    const slug = f.replace(/\.md$/, '');
    if (metaOnly.has(slug)) {
      console.log(`  SKIP  ${slug} (metadata-only)`);
      continue;
    }

    const filePath = join(LEGI_DIR, f);
    const result = processFile(filePath);

    if (result.reason === 'no markers') {
      console.log(`  WARN  ${result.slug} — no OFFICIAL_TEXT markers found`);
    } else if (result.modified) {
      console.log(`  ADD   ${result.slug} — +${result.anchorsAdded} anchors`);
      totalModified++;
      totalAnchors += result.anchorsAdded;
    } else {
      console.log(`  OK    ${result.slug} — already anchored`);
    }
  }

  console.log(`\nDone: ${totalModified} files modified, ${totalAnchors} anchors added.`);
}

main();
