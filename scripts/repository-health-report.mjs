/**
 * repository-health-report.mjs
 *
 * Generates reports/repository-health.{json,md} from the repository's
 * metadata, import-log, and legi directories.
 *
 * Node stdlib only. No external dependencies. Exit 0 always.
 *
 * Health Score Formula (0–100):
 *   score = (metadata_completeness / 100 * 20)
 *         + (import_logs         / 100 * 20)
 *         + (relationships       / 100 * 15)
 *         + (official_markers    / 100 * 25)
 *         + (provenance          / 100 * 20)
 *
 *   Each dimension is (qualifying_acts / relevant_total) * 100, then
 *   multiplied by its weight and summed.
 *   Denominator for official_markers is full-text acts only.
 *   If a denominator is zero the dimension scores full weight (no acts → no failures).
 */

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const actsDir    = path.join(root, 'metadata', 'acts')
const legiDir    = path.join(root, 'legi')
const importLogDir = path.join(root, 'import-log')
const reportsDir = path.join(root, 'reports')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pct(num, den) {
  if (den === 0) return 100
  return Math.round((num / den) * 10000) / 100 // two decimal places
}

// ---------------------------------------------------------------------------
// Read inputs
// ---------------------------------------------------------------------------

// 1. All metadata JSON files (skip filenames with spaces — macOS artifacts)
const jsonFiles = fs.existsSync(actsDir)
  ? fs.readdirSync(actsDir).filter((f) => f.endsWith('.json') && !f.includes(' ')).sort()
  : []

// 2. All import-log files (excluding README)
const importLogFiles = fs.existsSync(importLogDir)
  ? fs.readdirSync(importLogDir).filter((f) => f !== 'README.md' && !f.startsWith('.'))
  : []

// 3. All legi markdown files (excluding README)
const legiFiles = fs.existsSync(legiDir)
  ? fs.readdirSync(legiDir).filter((f) => f.endsWith('.md') && f !== 'README.md')
  : []

const legiSlugs = new Set(legiFiles.map((f) => f.replace(/\.md$/, '')))

// ---------------------------------------------------------------------------
// Parse acts
// ---------------------------------------------------------------------------

const warnings = []
const seenSlugs = new Set()
const acts = []

function warn(type, slug, message) {
  warnings.push({ type, slug, message })
}

for (const file of jsonFiles) {
  const slug = file.replace(/\.json$/, '')

  // Duplicate slug check
  if (seenSlugs.has(slug)) {
    warn('duplicate_slug', slug, `Duplicate slug detected: ${slug}`)
    continue
  }
  seenSlugs.add(slug)

  const jsonPath = path.join(actsDir, file)
  let data
  try {
    data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  } catch (e) {
    warn('invalid_json', slug, `Cannot parse JSON: ${e.message}`)
    continue
  }

  acts.push({ slug, data })
}

// ---------------------------------------------------------------------------
// Build coverage matrix + collect warnings
// ---------------------------------------------------------------------------

function countRelLinks(data) {
  const keys = ['related_acts', 'implements', 'amends', 'amended_by']
  return keys.reduce((sum, k) => {
    const v = data[k]
    return sum + (Array.isArray(v) ? v.length : 0)
  }, 0)
}

function findImportLog(slug) {
  // Case-insensitive match of any log file containing the slug
  const lower = slug.toLowerCase()
  return importLogFiles.filter((f) => f.toLowerCase().includes(lower))
}

function checkOfficialMarkers(slug) {
  const mdPath = path.join(legiDir, `${slug}.md`)
  if (!fs.existsSync(mdPath)) return false
  const content = fs.readFileSync(mdPath, 'utf8')
  return content.includes('OFFICIAL_TEXT_START') && content.includes('OFFICIAL_TEXT_END')
}

const coverage = []

for (const { slug, data } of acts) {
  const isMetadataOnly = data.import_method === 'metadata-only'
  const isFullText = !isMetadataOnly

  // import_log
  const matchingLogs = findImportLog(slug)
  const hasImportLog = matchingLogs.length > 0

  // provenance: import log exists AND is non-empty
  let provenance = false
  if (hasImportLog) {
    const logPath = path.join(importLogDir, matchingLogs[0])
    const stat = fs.statSync(logPath)
    provenance = stat.size > 0
  }

  // official markers (only relevant for full-text)
  let officialMarkers = null
  if (isFullText) {
    officialMarkers = checkOfficialMarkers(slug)
  }

  // relationships
  const relCount = countRelLinks(data)

  // ---- warnings ----
  if (isFullText && !hasImportLog) {
    warn('missing_import_log', slug, `Full-text act has no import log in import-log/`)
  }
  if (!legiSlugs.has(slug)) {
    if (isFullText) {
      warn('missing_markdown', slug, `legi/${slug}.md does not exist`)
    } else {
      warn('orphan_metadata', slug, `metadata-only act has no legi/${slug}.md (expected for metadata-only, informational)`)
    }
  }
  if (relCount === 0) {
    warn('missing_relationships', slug, `No relationship links (related_acts/implements/amends/amended_by)`)
  }
  if (isFullText && officialMarkers === false) {
    warn('missing_official_markers', slug, `legi/${slug}.md is missing OFFICIAL_TEXT_START or OFFICIAL_TEXT_END markers`)
  }

  const requiredFields = ['title', 'domain', 'status', 'source_url']
  const missingFields = requiredFields.filter((f) => !data[f])
  if (missingFields.length > 0) {
    warn('incomplete_metadata', slug, `Missing required fields: ${missingFields.join(', ')}`)
  }

  coverage.push({
    slug,
    full_text: isFullText,
    metadata: true,
    import_log: hasImportLog,
    official_markers: officialMarkers,
    relationships: relCount,
    provenance,
  })
}

// Orphan markdown: legi/<slug>.md exists but no matching JSON
for (const legiSlug of legiSlugs) {
  if (!seenSlugs.has(legiSlug)) {
    warn('orphan_markdown', legiSlug, `legi/${legiSlug}.md exists but no metadata/acts/${legiSlug}.json found`)
  }
}

// ---------------------------------------------------------------------------
// Summary counts
// ---------------------------------------------------------------------------

const totalMetadata      = acts.length
const totalFullText      = coverage.filter((c) => c.full_text).length
const totalMetadataOnly  = coverage.filter((c) => !c.full_text).length
const totalImportLogs    = importLogFiles.length
const totalRelLinks      = coverage.reduce((s, c) => s + c.relationships, 0)

const allDomains  = acts.map(({ data }) => data.domain).filter(Boolean)
const allIssuers  = acts.map(({ data }) => data.issuing_body_kind).filter(Boolean)
const uniqueDomains  = new Set(allDomains).size
const uniqueIssuers  = new Set(allIssuers).size

const summary = {
  total_metadata_entries:  totalMetadata,
  total_full_text_acts:    totalFullText,
  total_metadata_only_acts: totalMetadataOnly,
  total_import_logs:       totalImportLogs,
  total_relationship_links: totalRelLinks,
  total_unique_domains:    uniqueDomains,
  total_unique_issuers:    uniqueIssuers,
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

function countBy(arr) {
  return arr.reduce((acc, v) => {
    acc[v] = (acc[v] || 0) + 1
    return acc
  }, {})
}

const domainCounts       = countBy(allDomains)
const issuerCounts       = countBy(allIssuers)
const yearCounts         = countBy(acts.map(({ data }) => data.year).filter(Boolean))
const importMethodCounts = countBy(acts.map(({ data }) => data.import_method || 'full-text'))

const statistics = {
  domains:          domainCounts,
  issuers:          issuerCounts,
  publication_years: yearCounts,
  import_methods:   importMethodCounts,
}

// ---------------------------------------------------------------------------
// Health Score
// ---------------------------------------------------------------------------

const fulltextCoverage = coverage.filter((c) => c.full_text)

const dim_metadataCompleteness = pct(
  acts.filter(({ data }) => data.title && data.domain && data.status && data.source_url).length,
  totalMetadata
)
const dim_importLogs = pct(
  coverage.filter((c) => c.import_log).length,
  totalMetadata
)
const dim_relationships = pct(
  coverage.filter((c) => c.relationships > 0).length,
  totalMetadata
)
const dim_officialMarkers = pct(
  fulltextCoverage.filter((c) => c.official_markers === true).length,
  totalFullText
)
const dim_provenance = pct(
  coverage.filter((c) => c.provenance).length,
  totalMetadata
)

const FORMULA = 'score = dim_metadata_completeness*0.20 + dim_import_logs*0.20 + dim_relationships*0.15 + dim_official_markers*0.25 + dim_provenance*0.20'

const rawScore =
  dim_metadataCompleteness * 0.20 +
  dim_importLogs           * 0.20 +
  dim_relationships        * 0.15 +
  dim_officialMarkers      * 0.25 +
  dim_provenance           * 0.20

const healthScore = {
  score: Math.round(rawScore * 10) / 10,
  dimensions: {
    metadata_completeness: dim_metadataCompleteness,
    import_logs:           dim_importLogs,
    relationships:         dim_relationships,
    official_markers:      dim_officialMarkers,
    provenance:            dim_provenance,
  },
  formula: FORMULA,
}

// ---------------------------------------------------------------------------
// Assemble JSON report
// ---------------------------------------------------------------------------

const report = {
  generated_at: new Date().toISOString(),
  summary,
  coverage,
  statistics,
  health_score: healthScore,
  warnings,
}

// ---------------------------------------------------------------------------
// Write JSON
// ---------------------------------------------------------------------------

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true })
}

fs.writeFileSync(
  path.join(reportsDir, 'repository-health.json'),
  JSON.stringify(report, null, 2) + '\n'
)

// ---------------------------------------------------------------------------
// Build Markdown report
// ---------------------------------------------------------------------------

function mdTable(headers, rows) {
  const sep = headers.map(() => '---')
  const lines = [
    '| ' + headers.join(' | ') + ' |',
    '| ' + sep.join(' | ') + ' |',
    ...rows.map((r) => '| ' + r.join(' | ') + ' |'),
  ]
  return lines.join('\n')
}

function bool(v) {
  if (v === null || v === undefined) return '—'
  return v ? '✓' : '✗'
}

const coverageTable = mdTable(
  ['slug', 'full text', 'metadata', 'import log', 'markers', 'relationships', 'provenance'],
  coverage.map((c) => [
    c.slug,
    bool(c.full_text),
    bool(c.metadata),
    bool(c.import_log),
    bool(c.official_markers),
    String(c.relationships),
    bool(c.provenance),
  ])
)

const summaryTable = mdTable(
  ['Metric', 'Value'],
  [
    ['Total metadata entries',   String(summary.total_metadata_entries)],
    ['Full-text acts',           String(summary.total_full_text_acts)],
    ['Metadata-only acts',       String(summary.total_metadata_only_acts)],
    ['Import log files',         String(summary.total_import_logs)],
    ['Total relationship links', String(summary.total_relationship_links)],
    ['Unique domains',           String(summary.total_unique_domains)],
    ['Unique issuers',           String(summary.total_unique_issuers)],
  ]
)

const scoreTable = mdTable(
  ['Dimension', 'Score (%)', 'Weight'],
  [
    ['Metadata completeness', String(healthScore.dimensions.metadata_completeness), '20'],
    ['Import logs',           String(healthScore.dimensions.import_logs),           '20'],
    ['Relationships',         String(healthScore.dimensions.relationships),          '15'],
    ['Official markers',      String(healthScore.dimensions.official_markers),      '25'],
    ['Provenance',            String(healthScore.dimensions.provenance),            '20'],
    ['**Total**',             `**${healthScore.score}**`,                           '**100**'],
  ]
)

function statsSection(title, obj) {
  const rows = Object.entries(obj).sort((a, b) => b[1] - a[1])
  return `### ${title}\n\n` + mdTable(['Value', 'Count'], rows.map(([k, v]) => [k, String(v)]))
}

const warningsSection = warnings.length === 0
  ? 'No warnings — repository is clean.'
  : warnings.map((w) => `- **[${w.type}]** \`${w.slug}\`: ${w.message}`).join('\n')

const md = `# Repository Health Report

Generated: ${report.generated_at}

## Summary

${summaryTable}

## Coverage Matrix

${coverageTable}

## Statistics

${statsSection('Domains', statistics.domains)}

${statsSection('Issuers', statistics.issuers)}

${statsSection('Publication Years', statistics.publication_years)}

${statsSection('Import Methods', statistics.import_methods)}

## Health Score

**Score: ${healthScore.score} / 100**

${scoreTable}

### Formula

\`\`\`
${FORMULA}
\`\`\`

Each dimension is computed as \`(qualifying_acts / relevant_total) * 100\`.
The denominator for **official_markers** is full-text acts only.
If a denominator is zero the dimension scores 100 (no acts → no failures).

## Warnings

${warningsSection}
`

fs.writeFileSync(path.join(reportsDir, 'repository-health.md'), md)

// ---------------------------------------------------------------------------
// Stdout summary
// ---------------------------------------------------------------------------

console.log(`Repository Health Report`)
console.log(`  Score:    ${healthScore.score} / 100`)
console.log(`  Acts:     ${totalMetadata} total (${totalFullText} full-text, ${totalMetadataOnly} metadata-only)`)
console.log(`  Warnings: ${warnings.length}`)
console.log(`  Output:   reports/repository-health.{json,md}`)
