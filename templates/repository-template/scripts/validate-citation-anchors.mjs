#!/usr/bin/env node
/**
 * validate-citation-anchors.mjs
 *
 * Validates that all full-text imported acts have article anchors.
 *
 * Checks:
 * - All full-text acts have at least 1 {#art-N} anchor
 * - Anchors follow the {#art-N} format
 * - No duplicate anchors within the same file
 * - citations/citation-index.json exists and contains at least 1 act
 *
 * Exit 0 if all checks pass, exit 1 if any failure.
 *
 * Usage:
 *   node scripts/validate-citation-anchors.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const ACTS_META_DIR = join(ROOT, 'metadata', 'acts');
const LEGI_DIR = join(ROOT, 'legi');
const CITATION_INDEX = join(ROOT, 'citations', 'citation-index.json');

const OFFICIAL_START = '<!-- OFFICIAL_TEXT_START -->';
const OFFICIAL_END = '<!-- OFFICIAL_TEXT_END -->';
const ANCHOR_RE = /\{#(art-[^}]+)\}/;

let failures = 0;

function fail(msg) {
  console.error(`  FAIL  ${msg}`);
  failures++;
}

function ok(msg) {
  console.log(`  OK    ${msg}`);
}

function loadMetadataOnly() {
  const metaOnlySlugs = new Set();
  const files = readdirSync(ACTS_META_DIR).filter(f => f.endsWith('.json'));
  for (const f of files) {
    const raw = readFileSync(join(ACTS_META_DIR, f), 'utf8');
    const meta = JSON.parse(raw);
    if (meta.import_method === 'metadata-only') {
      metaOnlySlugs.add(f.replace(/\.json$/, ''));
    }
  }
  return metaOnlySlugs;
}

function validateFile(slug, filePath) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const startIdx = lines.findIndex(l => l.includes(OFFICIAL_START));
  const endIdx = lines.findLastIndex(l => l.includes(OFFICIAL_END));

  if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
    fail(`${slug} — missing OFFICIAL_TEXT markers`);
    return;
  }

  const anchorsFound = [];
  const seenAnchors = new Set();
  let hasDuplicate = false;

  for (let i = startIdx + 1; i < endIdx; i++) {
    const line = lines[i];
    const m = line.match(ANCHOR_RE);
    if (!m) continue;

    const anchorId = m[1];

    // Validate format: must be art- followed by digits/hyphens/letters
    if (!/^art-[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(anchorId)) {
      fail(`${slug}:${i + 1} — malformed anchor {#${anchorId}}`);
    }

    // Check for duplicates
    if (seenAnchors.has(anchorId)) {
      fail(`${slug}:${i + 1} — duplicate anchor {#${anchorId}}`);
      hasDuplicate = true;
    }
    seenAnchors.add(anchorId);
    anchorsFound.push(anchorId);
  }

  if (anchorsFound.length === 0) {
    fail(`${slug} — no {#art-N} anchors found within OFFICIAL_TEXT block`);
    return;
  }

  if (!hasDuplicate) {
    ok(`${slug} — ${anchorsFound.length} anchors, no duplicates`);
  }
}

function validateCitationIndex() {
  if (!existsSync(CITATION_INDEX)) {
    fail('citations/citation-index.json does not exist');
    return;
  }

  let index;
  try {
    index = JSON.parse(readFileSync(CITATION_INDEX, 'utf8'));
  } catch (e) {
    fail(`citations/citation-index.json is not valid JSON: ${e.message}`);
    return;
  }

  if (!index.acts || typeof index.acts !== 'object') {
    fail('citations/citation-index.json missing "acts" object');
    return;
  }

  const actCount = Object.keys(index.acts).length;
  if (actCount === 0) {
    fail('citations/citation-index.json has 0 acts');
    return;
  }

  if (!index.generated_at) {
    fail('citations/citation-index.json missing "generated_at"');
    return;
  }

  ok(`citations/citation-index.json — ${actCount} acts indexed, generated_at present`);
}

function main() {
  console.log('Validating citation anchors...\n');

  // 1. Check citation index
  validateCitationIndex();

  // 2. Check each full-text act
  const metaOnly = loadMetadataOnly();

  const mdFiles = readdirSync(LEGI_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .sort();

  for (const f of mdFiles) {
    const slug = f.replace(/\.md$/, '');
    if (metaOnly.has(slug)) {
      console.log(`  SKIP  ${slug} (metadata-only)`);
      continue;
    }
    validateFile(slug, join(LEGI_DIR, f));
  }

  console.log(`\n${failures === 0 ? 'All checks passed.' : `${failures} check(s) failed.`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
