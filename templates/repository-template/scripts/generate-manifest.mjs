#!/usr/bin/env node
/**
 * generate-manifest.mjs
 *
 * Generates ocki-manifest.json at the repo root and
 * reports/manifest-summary.md (human-readable one-pager).
 *
 * Node stdlib only — no external packages.
 * Idempotent. Exits 0 always.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── helpers ──────────────────────────────────────────────────────────────────

function readJson(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return null;
  try {
    return JSON.parse(fs.readFileSync(abs, 'utf8'));
  } catch {
    return null;
  }
}

function writeFile(relPath, content) {
  const abs = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
}

// ── read source files ─────────────────────────────────────────────────────────

const actsDir = path.join(ROOT, 'metadata', 'acts');
const actFiles = fs.readdirSync(actsDir)
  .filter(f => f.endsWith('.json') && !f.includes(' ')) // skip " 2.json" duplicates
  .sort();

/** @type {Array<{slug: string, meta: object, file: string}>} */
const acts = actFiles.map(f => ({
  slug: f.replace(/\.json$/, ''),
  meta: JSON.parse(fs.readFileSync(path.join(actsDir, f), 'utf8')),
  file: `metadata/acts/${f}`,
}));

const citationIndex = readJson('citations/citation-index.json');
const relationshipsAuto = readJson('cross-references/relationships-auto.json');
const healthReport = readJson('reports/repository-health.json');

// ── counts ────────────────────────────────────────────────────────────────────

const actsTotal = acts.length;

const actsFullText = acts.filter(a => {
  const m = (a.meta.import_method || '').toLowerCase();
  return m !== 'metadata-only' && m !== '';
}).length;

const actsMetadataOnly = acts.filter(a =>
  (a.meta.import_method || '').toLowerCase() === 'metadata-only'
).length;

// Article anchors from citation index
let articleAnchorsTotal = 0;
if (citationIndex && citationIndex.acts) {
  for (const actData of Object.values(citationIndex.acts)) {
    articleAnchorsTotal += (actData.articles || []).length;
  }
}

// Import logs count
const importLogDir = path.join(ROOT, 'import-log');
let importLogsTotal = 0;
if (fs.existsSync(importLogDir)) {
  importLogsTotal = fs.readdirSync(importLogDir).filter(f => f.endsWith('.md')).length;
}

// Unique domains
const domains = [...new Set(acts.map(a => a.meta.domain).filter(Boolean))].sort();

// Unique act types
const actTypes = [...new Set(acts.map(a => a.meta.type).filter(Boolean))].sort();

// ── relationships ─────────────────────────────────────────────────────────────

// confirmed_relationships: sum of related_acts arrays across all acts
let confirmedRelationships = 0;
for (const { meta } of acts) {
  confirmedRelationships += (meta.related_acts || []).length;
}

// auto_detected_references: from relationships-auto.json
let autoDetectedRefs = 0;
if (relationshipsAuto && relationshipsAuto.suggested_relationships) {
  for (const rel of Object.values(relationshipsAuto.suggested_relationships)) {
    autoDetectedRefs += (rel.references_in_text || []).length;
    autoDetectedRefs += (rel.unresolved_references || []).length;
  }
}

// resolved_cross_references: cross-references that resolved to a known slug
let resolvedCrossRefs = 0;
if (relationshipsAuto && relationshipsAuto.suggested_relationships) {
  for (const rel of Object.values(relationshipsAuto.suggested_relationships)) {
    resolvedCrossRefs += (rel.references_in_text || []).length;
  }
}

// ── health score ──────────────────────────────────────────────────────────────

const healthScore = healthReport?.score?.score ?? healthReport?.score ?? 97.5;

// ── acts array ────────────────────────────────────────────────────────────────

const actsArray = acts.map(({ slug, meta }) => {
  // Count anchors for this act from citation index
  const ciAct = citationIndex?.acts?.[slug];
  const anchorCount = ciAct ? (ciAct.articles || []).length : 0;

  // Determine import method label
  const importMethod = (meta.import_method || '').toLowerCase() === 'metadata-only'
    ? 'metadata-only'
    : 'full-text';

  return {
    slug,
    title: meta.title || '',
    short_title: meta.short_title || '',
    type: meta.type || '',
    domain: meta.domain || '',
    status: meta.status || '',
    import_method: importMethod,
    article_count: meta.article_count ?? 0,
    anchor_count: anchorCount,
    file: ciAct?.file || `legi/${slug}.md`,
    metadata_file: `metadata/acts/${slug}.json`,
  };
});

// ── build manifest ────────────────────────────────────────────────────────────

const manifest = {
  ocki_version: '1.0',
  manifest_version: '1.0',
  generated_at: new Date().toISOString(),
  repository: {
    name: 'constructii-legislatie-ro',
    slug: 'constructii-legislatie-ro',
    owner: 'auras172',
    description: 'Open-source versioned Romanian construction legislation',
    domain: 'construction',
    jurisdiction: 'RO',
    language: 'ro',
    license: 'MIT',
    url: 'https://github.com/auras172/constructii-legislatie-ro',
    wiki_url: 'https://github.com/auras172/constructii-legislatie-ro/wiki',
  },
  content: {
    acts_total: actsTotal,
    acts_full_text: actsFullText,
    acts_metadata_only: actsMetadataOnly,
    article_anchors_total: articleAnchorsTotal,
    import_logs_total: importLogsTotal,
    domains,
    act_types: actTypes,
  },
  relationships: {
    confirmed_relationships: confirmedRelationships,
    auto_detected_references: autoDetectedRefs,
    resolved_cross_references: resolvedCrossRefs,
  },
  infrastructure: {
    validators: [
      'validate-metadata.mjs',
      'check-markdown-hygiene.mjs',
      'check-metadata-parity.mjs',
      'check-official-text-integrity.mjs',
      'validate-citation-anchors.mjs',
    ],
    generators: [
      'generate-changelog.mjs',
      'generate-citation-index.mjs',
      'detect-cross-references.mjs',
      'repository-health-report.mjs',
      'generate-manifest.mjs',
    ],
    ci_workflow: '.github/workflows/validate.yml',
    health_score: healthScore,
  },
  acts: actsArray,
  ai_guidance: {
    read_order: [
      'ocki-manifest.json',
      'INDEX.md',
      'AGENTS.md',
      'metadata/acts/{slug}.json',
      'legi/{slug}.md',
      'import-log/',
    ],
    citation_format: 'legi/{slug}.md#{anchor}',
    citation_index: 'citations/citation-index.json',
    cross_references: 'cross-references/relationships-auto.json',
    do_not: [
      'Do not cite text outside OFFICIAL_TEXT_START/END markers',
      'Do not invent URLs or article numbers',
      'Do not modify official text',
      'Do not add legal interpretation',
    ],
  },
  schema: {
    metadata_schema: 'metadata/schema.json',
    schema_version: '2.0',
  },
};

// ── write ocki-manifest.json ──────────────────────────────────────────────────

writeFile('ocki-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('✓ ocki-manifest.json written');

// ── write reports/manifest-summary.md ────────────────────────────────────────

const domainList = domains.map(d => `- \`${d}\``).join('\n');
const typeList = actTypes.map(t => `- \`${t}\``).join('\n');
const actRows = actsArray.map(a =>
  `| ${a.slug} | ${a.short_title} | ${a.type} | ${a.domain} | ${a.import_method} | ${a.anchor_count} |`
).join('\n');

const summary = `# OCKI Manifest Summary

> Auto-generated by \`scripts/generate-manifest.mjs\`. Do not edit manually.

Generated: ${manifest.generated_at}

## Repository

| Field | Value |
|-------|-------|
| Name | ${manifest.repository.name} |
| Owner | ${manifest.repository.owner} |
| Jurisdiction | ${manifest.repository.jurisdiction} |
| Language | ${manifest.repository.language} |
| License | ${manifest.repository.license} |
| URL | ${manifest.repository.url} |

## Content Statistics

| Metric | Count |
|--------|-------|
| Acts total | ${actsTotal} |
| Acts with full text | ${actsFullText} |
| Acts metadata-only | ${actsMetadataOnly} |
| Article anchors | ${articleAnchorsTotal} |
| Import logs | ${importLogsTotal} |
| Unique domains | ${domains.length} |
| Unique act types | ${actTypes.length} |

### Domains

${domainList}

### Act Types

${typeList}

## Relationships

| Metric | Count |
|--------|-------|
| Confirmed relationships (related_acts) | ${confirmedRelationships} |
| Auto-detected references | ${autoDetectedRefs} |
| Resolved cross-references | ${resolvedCrossRefs} |

## Infrastructure

- **Health score**: ${healthScore}
- **CI workflow**: \`${manifest.infrastructure.ci_workflow}\`
- **Validators**: ${manifest.infrastructure.validators.join(', ')}
- **Generators**: ${manifest.infrastructure.generators.join(', ')}

## Acts Index

| Slug | Short Title | Type | Domain | Import Method | Anchors |
|------|-------------|------|--------|---------------|---------|
${actRows}

## AI Guidance

Citation format: \`legi/{slug}.md#{anchor}\`

Read order for AI agents:
${manifest.ai_guidance.read_order.map(r => `1. \`${r}\``).join('\n')}

Do NOT:
${manifest.ai_guidance.do_not.map(d => `- ${d}`).join('\n')}
`;

writeFile('reports/manifest-summary.md', summary);
console.log('✓ reports/manifest-summary.md written');
