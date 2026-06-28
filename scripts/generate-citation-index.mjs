#!/usr/bin/env node
/**
 * generate-citation-index.mjs
 *
 * Generates citations/citation-index.json — a machine-readable registry
 * mapping every anchored article to its canonical file + line number.
 *
 * Usage:
 *   node scripts/generate-citation-index.mjs
 *
 * Output: citations/citation-index.json
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const ACTS_META_DIR = join(ROOT, 'metadata', 'acts');
const LEGI_DIR = join(ROOT, 'legi');
const CITATIONS_DIR = join(ROOT, 'citations');
const OUTPUT_FILE = join(CITATIONS_DIR, 'citation-index.json');

const OFFICIAL_START = '<!-- OFFICIAL_TEXT_START -->';
const OFFICIAL_END = '<!-- OFFICIAL_TEXT_END -->';

// Matches {#art-N} or {#art-N-b} etc. at end of heading line
const ANCHOR_RE = /\{#(art-[^}]+)\}/;

function loadMeta(slug) {
  const metaPath = join(ACTS_META_DIR, `${slug}.json`);
  try {
    return JSON.parse(readFileSync(metaPath, 'utf8'));
  } catch {
    return null;
  }
}

function processFile(slug, filePath) {
  const meta = loadMeta(slug);
  if (!meta) return null;
  if (meta.import_method === 'metadata-only') return null;

  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const startIdx = lines.findIndex(l => l.includes(OFFICIAL_START));
  const endIdx = lines.findLastIndex(l => l.includes(OFFICIAL_END));

  if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) return null;

  const articles = [];

  for (let i = startIdx + 1; i < endIdx; i++) {
    const line = lines[i];
    const m = line.match(ANCHOR_RE);
    if (!m) continue;

    const anchorId = m[1]; // e.g. "art-7"
    articles.push({
      id: anchorId,
      anchor: `#${anchorId}`,
      url_fragment: `legi/${basename(filePath)}#${anchorId}`,
      line: i + 1, // 1-indexed
    });
  }

  return {
    title: meta.title || meta.short_title || slug,
    slug,
    file: `legi/${basename(filePath)}`,
    articles,
    article_count: articles.length,
  };
}

function main() {
  // Ensure citations dir exists
  try {
    mkdirSync(CITATIONS_DIR, { recursive: true });
  } catch {}

  const mdFiles = readdirSync(LEGI_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .sort();

  const acts = {};

  for (const f of mdFiles) {
    const slug = f.replace(/\.md$/, '');
    const filePath = join(LEGI_DIR, f);
    const result = processFile(slug, filePath);
    if (!result) {
      console.log(`  SKIP  ${slug}`);
      continue;
    }
    acts[slug] = result;
    console.log(`  INDEX ${slug} — ${result.article_count} articles`);
  }

  const index = {
    generated_at: new Date().toISOString(),
    acts,
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2) + '\n', 'utf8');
  console.log(`\nWrote ${OUTPUT_FILE}`);
  console.log(`Total acts indexed: ${Object.keys(acts).length}`);
}

main();
