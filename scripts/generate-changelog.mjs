/**
 * generate-changelog.mjs
 *
 * Reads git log from main, classifies commits by type, cross-references
 * metadata/acts/ for legislation details, and generates:
 *   - CHANGELOG.md  (repo root)
 *   - reports/changelog.json
 *
 * Node stdlib only. No external dependencies. Idempotent.
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const actsDir = path.join(root, 'metadata', 'acts')
const reportsDir = path.join(root, 'reports')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Month label: "2026-06" → "June 2026"
 */
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
function monthLabel(ym) {
  const [year, mon] = ym.split('-')
  return `${MONTH_NAMES[parseInt(mon, 10) - 1]} ${year}`
}

/**
 * Classify a commit subject into a category.
 */
function classify(subject) {
  if (/^feat\(legi\):/.test(subject)) return 'legislation'
  if (/^fix\(metadata\):/.test(subject) || /^fix\(legi\):/.test(subject)) return 'fixes'
  if (/^feat\(ci\):/.test(subject) || /^fix\(ci\):/.test(subject)) return 'infrastructure'
  if (/^feat\(citations\):/.test(subject)) return 'infrastructure'
  if (/^feat\(site\):/.test(subject)) return 'infrastructure'
  if (/^feat\(metadata\):/.test(subject)) return 'infrastructure'
  if (/^docs:/.test(subject)) return 'documentation'
  if (/^fix:/.test(subject)) return 'fixes'
  return 'misc'
}

/**
 * Load all metadata JSON files into a slug → object map.
 * Skip filenames with spaces (macOS duplicates).
 */
function loadMetadata() {
  const map = {}
  if (!fs.existsSync(actsDir)) return map
  const files = fs.readdirSync(actsDir).filter(
    (f) => f.endsWith('.json') && !f.includes(' ')
  )
  for (const f of files) {
    try {
      const slug = f.replace(/\.json$/, '')
      const raw = fs.readFileSync(path.join(actsDir, f), 'utf8')
      map[slug] = JSON.parse(raw)
    } catch {
      // skip invalid JSON
    }
  }
  return map
}

/**
 * Determine if an act is full-text or metadata-only based on import_method.
 */
function importMethodCategory(importMethod) {
  if (!importMethod) return 'full-text'
  if (importMethod.trim() === 'metadata-only') return 'metadata-only'
  return 'full-text'
}

/**
 * For a legislation commit, find which metadata/acts/<slug>.json files were
 * added or modified, return details for each.
 */
function extractLegislationEntries(hash, metadata) {
  let changedFiles
  try {
    changedFiles = execSync(
      `git diff-tree --no-commit-id -r --name-only ${hash}`,
      { encoding: 'utf8' }
    ).trim().split('\n')
  } catch {
    return []
  }

  const entries = []
  for (const file of changedFiles) {
    const match = file.match(/^metadata\/acts\/([^/]+)\.json$/)
    if (!match) continue
    const slug = match[1]
    if (slug.includes(' ')) continue // skip macOS duplicates

    const meta = metadata[slug]
    if (!meta) continue

    const category = importMethodCategory(meta.import_method)
    entries.push({
      slug,
      short_title: meta.short_title || meta.canonical_citation
        || (meta.type && meta.number && meta.year
          ? `${meta.type.charAt(0).toUpperCase() + meta.type.slice(1)} ${meta.number}/${meta.year}`
          : slug),
      domain: meta.domain || '',
      import_method: category,
    })
  }
  return entries
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

// 1. Read git log
const rawLog = execSync(
  'git log --pretty=format:"%H|%ad|%s" --date=format:"%Y-%m" HEAD',
  { encoding: 'utf8' }
).trim()

const commits = rawLog.split('\n').map((line) => {
  const [hash, month, ...rest] = line.split('|')
  return { hash: hash.trim(), month: month.trim(), subject: rest.join('|').trim() }
})

// 2. Load metadata
const metadata = loadMetadata()

// 3. Group by month, classify each commit
const monthsMap = new Map()

for (const commit of commits) {
  if (!monthsMap.has(commit.month)) {
    monthsMap.set(commit.month, {
      month: commit.month,
      label: monthLabel(commit.month),
      legislation_added: [],
      infrastructure: [],
      documentation: [],
      fixes: [],
      misc: [],
    })
  }
  const bucket = monthsMap.get(commit.month)
  const category = classify(commit.subject)

  if (category === 'legislation') {
    const entries = extractLegislationEntries(commit.hash, metadata)
    if (entries.length > 0) {
      bucket.legislation_added.push(...entries)
    } else {
      // Fallback: add commit subject to misc if no metadata found
      bucket.misc.push(commit.subject)
    }
  } else if (category === 'infrastructure') {
    bucket.infrastructure.push(commit.subject)
  } else if (category === 'documentation') {
    bucket.documentation.push(commit.subject)
  } else if (category === 'fixes') {
    bucket.fixes.push(commit.subject)
  } else {
    bucket.misc.push(commit.subject)
  }
}

// Sort months descending (newest first)
const months = Array.from(monthsMap.values()).sort((a, b) =>
  b.month.localeCompare(a.month)
)

// ---------------------------------------------------------------------------
// 4. Generate CHANGELOG.md
// ---------------------------------------------------------------------------

function legBadge(importMethod) {
  return importMethod === 'metadata-only' ? '[metadata-only]' : '[full-text]'
}
function legIcon(importMethod) {
  return importMethod === 'metadata-only' ? '📋' : '✅'
}

const mdLines = [
  '# Changelog',
  '',
  'All notable changes to constructii-legislatie-ro.',
  '',
  '<!-- Generated by scripts/generate-changelog.mjs — do not edit manually -->',
  '',
  '## [Unreleased]',
  '',
]

for (const m of months) {
  mdLines.push(`## ${m.label}`)
  mdLines.push('')

  if (m.legislation_added.length > 0) {
    mdLines.push('### Legislation')
    for (const act of m.legislation_added) {
      const icon = legIcon(act.import_method)
      const badge = legBadge(act.import_method)
      mdLines.push(`- ${icon} ${act.short_title} — ${act.domain} \`${badge}\``)
    }
    mdLines.push('')
  }

  if (m.infrastructure.length > 0) {
    mdLines.push('### Infrastructure')
    for (const s of m.infrastructure) {
      mdLines.push(`- ${s}`)
    }
    mdLines.push('')
  }

  if (m.documentation.length > 0) {
    mdLines.push('### Documentation')
    for (const s of m.documentation) {
      mdLines.push(`- ${s}`)
    }
    mdLines.push('')
  }

  if (m.fixes.length > 0) {
    mdLines.push('### Fixes')
    for (const s of m.fixes) {
      mdLines.push(`- ${s}`)
    }
    mdLines.push('')
  }

  if (m.misc.length > 0) {
    mdLines.push('### Other')
    for (const s of m.misc) {
      mdLines.push(`- ${s}`)
    }
    mdLines.push('')
  }
}

const changelogMd = mdLines.join('\n')
fs.writeFileSync(path.join(root, 'CHANGELOG.md'), changelogMd + '\n', 'utf8')

// ---------------------------------------------------------------------------
// 5. Generate reports/changelog.json
// ---------------------------------------------------------------------------

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true })
}

let totalLegAdded = 0
let totalFullText = 0
let totalMetadataOnly = 0
let totalInfra = 0

for (const m of months) {
  totalLegAdded += m.legislation_added.length
  totalFullText += m.legislation_added.filter((a) => a.import_method === 'full-text').length
  totalMetadataOnly += m.legislation_added.filter((a) => a.import_method === 'metadata-only').length
  totalInfra += m.infrastructure.length
}

const changelogJson = {
  generated_at: new Date().toISOString(),
  months,
  totals: {
    legislation_added: totalLegAdded,
    full_text: totalFullText,
    metadata_only: totalMetadataOnly,
    infrastructure_changes: totalInfra,
  },
}

fs.writeFileSync(
  path.join(reportsDir, 'changelog.json'),
  JSON.stringify(changelogJson, null, 2) + '\n',
  'utf8'
)

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`Changelog generated:`)
console.log(`  CHANGELOG.md        — ${months.length} month(s)`)
console.log(`  reports/changelog.json`)
console.log(`  Legislation added:  ${totalLegAdded} (${totalFullText} full-text, ${totalMetadataOnly} metadata-only)`)
console.log(`  Infrastructure:     ${totalInfra}`)
