#!/usr/bin/env node
/**
 * generate-citation-index.mjs
 *
 * Generates citations/citation-index.json — a machine-readable registry
 * mapping every anchored article, provision, or annex to its canonical file + line number.
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

// Supported repository anchor families. Keep this narrower than arbitrary
// Markdown heading IDs so malformed/unknown anchors cannot enter the index.
const ANCHOR_RE = /\{#([^}\s]+)\}/g;
const ANCHOR_FORMATS = [
  /^art-[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
  /^pct-[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
  /^anexa-[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
];

function readGeneratedAt() {
  try {
    const existing = JSON.parse(readFileSync(OUTPUT_FILE, 'utf8'));
    if (typeof existing.generated_at === 'string' && existing.generated_at.length > 0) {
      return existing.generated_at;
    }
  } catch {}
  return new Date().toISOString();
}

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
  const provisions = [];
  const annexes = [];

  for (let i = startIdx + 1; i < endIdx; i++) {
    const line = lines[i];
    for (const m of line.matchAll(ANCHOR_RE)) {
      const anchorId = m[1];
      if (!ANCHOR_FORMATS.some(format => format.test(anchorId))) {
        throw new Error(`${slug}:${i + 1} — malformed or unsupported anchor {#${anchorId}}`);
      }

      const entry = {
        id: anchorId,
        anchor: `#${anchorId}`,
        url_fragment: `legi/${basename(filePath)}#${anchorId}`,
        line: i + 1, // 1-indexed
      };

      if (anchorId.startsWith('art-')) articles.push(entry);
      else if (anchorId.startsWith('pct-')) provisions.push(entry);
      else if (anchorId.startsWith('anexa-')) annexes.push(entry);
    }
  }

  const result = {
    title: meta.title || meta.short_title || slug,
    slug,
    file: `legi/${basename(filePath)}`,
    articles,
    article_count: articles.length,
  };

  if (provisions.length > 0) {
    result.provisions = provisions;
    result.provision_count = provisions.length;
  }
  if (annexes.length > 0) {
    result.annexes = annexes;
    result.annex_count = annexes.length;
  }

  return result;
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
    generated_at: readGeneratedAt(),
    acts,
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2) + '\n', 'utf8');
  console.log(`\nWrote ${OUTPUT_FILE}`);
  console.log(`Total acts indexed: ${Object.keys(acts).length}`);
}

main();
