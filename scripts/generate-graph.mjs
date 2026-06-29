#!/usr/bin/env node
/**
 * generate-graph.mjs
 *
 * Generates graph/graph.json and graph/graph.mmd from:
 *   - metadata/acts/*.json  → nodes + confirmed edges (related_acts)
 *   - cross-references/relationships-auto.json → auto-detected edges (needs_review)
 *
 * Auto-detected edges are only included when BOTH source and target slugs
 * exist in metadata. Unresolved references are skipped entirely.
 *
 * Output is deterministic: same input → same bytes (all lists sorted).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

// ── helpers ─────────────────────────────────────────────────────────────────

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function slugFromFile(filePath) {
  return path.basename(filePath, '.json');
}

// ── 1. Load metadata acts → nodes ───────────────────────────────────────────

const actsDir = path.join(repoRoot, 'metadata', 'acts');
const actFiles = fs.readdirSync(actsDir)
  .filter(f => f.endsWith('.json'))
  .sort();

const metaSlugs = new Set();
const actMeta = {};

for (const file of actFiles) {
  const slug = slugFromFile(file);
  const data = readJson(path.join(actsDir, file));
  metaSlugs.add(slug);
  actMeta[slug] = data;
}

const nodes = Object.keys(actMeta).sort().map(slug => {
  const d = actMeta[slug];
  return {
    id: slug,
    label: d.short_title || d.canonical_citation || slug,
    type: d.type || 'unknown',
    domain: d.domain || 'unknown',
    status: d.status || 'unknown',
    import_method: (d.import_method || '').toLowerCase().includes('metadata-only')
      ? 'metadata-only'
      : 'full-text',
  };
});

// ── 2. Confirmed edges from related_acts ────────────────────────────────────

const confirmedEdges = [];

for (const slug of Object.keys(actMeta).sort()) {
  const related = actMeta[slug].related_acts;
  if (!Array.isArray(related)) continue;

  for (const target of [...related].sort()) {
    if (!metaSlugs.has(target)) continue; // skip if target not in metadata
    confirmedEdges.push({
      source: slug,
      target,
      relationship: 'related',
      review_status: 'confirmed',
      evidence: `metadata/acts/${slug}.json`,
    });
  }
}

// ── 3. Auto-detected edges from relationships-auto.json ─────────────────────

const autoFile = path.join(repoRoot, 'cross-references', 'relationships-auto.json');
const autoData = readJson(autoFile);
const suggested = autoData.suggested_relationships || {};

const autoEdges = [];
let unresolvedSkipped = 0;

for (const source of Object.keys(suggested).sort()) {
  if (!metaSlugs.has(source)) {
    // source itself not in metadata — skip all its refs
    unresolvedSkipped += (suggested[source].references_in_text || []).length;
    continue;
  }
  const refs = [...(suggested[source].references_in_text || [])].sort();
  for (const target of refs) {
    if (!metaSlugs.has(target)) {
      unresolvedSkipped++;
      continue;
    }
    autoEdges.push({
      source,
      target,
      relationship: 'cites',
      review_status: 'needs_review',
      evidence: 'cross-references/relationships-auto.json',
    });
  }
}

// ── 4. Deduplicate: confirmed wins over auto for same source+target ──────────

const edgeKey = e => `${e.source}||${e.target}||${e.relationship}`;
const confirmedKeys = new Set(confirmedEdges.map(edgeKey));

const filteredAutoEdges = autoEdges.filter(e => {
  // Deduplicate on source+target regardless of relationship label
  const simpleKey = `${e.source}||${e.target}`;
  const confirmedSameNodes = confirmedEdges.some(
    c => c.source === e.source && c.target === e.target
  );
  return !confirmedSameNodes;
});

// ── 5. Merge and sort all edges ──────────────────────────────────────────────

const allEdges = [...confirmedEdges, ...filteredAutoEdges].sort((a, b) => {
  if (a.source !== b.source) return a.source.localeCompare(b.source);
  if (a.target !== b.target) return a.target.localeCompare(b.target);
  return a.relationship.localeCompare(b.relationship);
});

// ── 6. Build graph.json ──────────────────────────────────────────────────────

const graph = {
  ocki_graph_version: '1.0',
  generated_from: [
    'metadata/acts/',
    'cross-references/relationships-auto.json',
  ],
  nodes,
  edges: allEdges,
  stats: {
    total_nodes: nodes.length,
    confirmed_edges: confirmedEdges.length,
    auto_detected_edges: filteredAutoEdges.length,
    unresolved_skipped: unresolvedSkipped,
  },
};

const graphDir = path.join(repoRoot, 'graph');
fs.mkdirSync(graphDir, { recursive: true });

fs.writeFileSync(
  path.join(graphDir, 'graph.json'),
  JSON.stringify(graph, null, 2) + '\n',
  'utf8'
);

// ── 7. Build graph.mmd ───────────────────────────────────────────────────────

function mmdLabel(node) {
  // Short label: use label field, truncate to 38 chars
  const label = node.label.length > 38 ? node.label.slice(0, 35) + '...' : node.label;
  return `${node.id}["${label}\\n[${node.type} · ${node.domain}]"]`;
}

const nodeDefLines = nodes.map(n => `  ${mmdLabel(n)}`);

const confirmedLines = confirmedEdges.map(
  e => `  ${e.source} -->|${e.relationship}| ${e.target}`
);

const autoLines = filteredAutoEdges.map(
  e => `  ${e.source} -.->|${e.relationship} - needs_review| ${e.target}`
);

const mmdLines = [
  'graph LR',
  '',
  '  %% Nodes',
  ...nodeDefLines,
  '',
  '  %% Confirmed relationships (from metadata related_acts)',
  ...confirmedLines,
  '',
  '  %% Auto-detected relationships (needs_review)',
  ...autoLines,
];

fs.writeFileSync(
  path.join(graphDir, 'graph.mmd'),
  mmdLines.join('\n') + '\n',
  'utf8'
);

// ── 8. Summary ───────────────────────────────────────────────────────────────

console.log('graph/graph.json and graph/graph.mmd written.');
console.log(`  nodes:                 ${graph.stats.total_nodes}`);
console.log(`  confirmed edges:       ${graph.stats.confirmed_edges}`);
console.log(`  auto-detected edges:   ${graph.stats.auto_detected_edges}`);
console.log(`  unresolved skipped:    ${graph.stats.unresolved_skipped}`);
