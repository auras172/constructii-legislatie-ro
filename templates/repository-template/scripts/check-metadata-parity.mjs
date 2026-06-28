/**
 * Checks that shared fields between metadata/acts/<slug>.json and legi/<slug>.md
 * frontmatter are in agreement. JSON is the canonical source; divergences are errors.
 *
 * Fields checked: title, short_title, type, number, year, domain, status, source_url, tags
 */

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
let errors = 0

function fail(message) {
  console.error(message)
  errors++
}

// Minimal frontmatter parser — handles string scalars and simple string arrays.
// No dependencies on purpose. Supports:
//   key: value
//   key: "value"
//   key:
//     - item
function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---')) return null
  const end = markdown.indexOf('\n---', 3)
  if (end === -1) return null
  const block = markdown.slice(4, end)
  const result = {}
  const lines = block.split('\n')
  let currentKey = null
  let currentArray = null

  for (const line of lines) {
    // Array item
    if (currentArray !== null && /^ {2}- /.test(line)) {
      currentArray.push(line.replace(/^ {2}- /, '').trim())
      continue
    }
    // Scalar key or start of array
    const match = line.match(/^([a-z_]+):\s*(.*)$/)
    if (match) {
      if (currentKey && currentArray) {
        result[currentKey] = currentArray
        currentArray = null
      }
      currentKey = match[1]
      const value = match[2].trim()
      if (value === '') {
        currentArray = []
      } else {
        currentArray = null
        result[currentKey] = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
      }
    }
  }
  if (currentKey && currentArray) {
    result[currentKey] = currentArray
  }

  return result
}

function normalizeString(v) {
  return String(v ?? '').trim()
}

function normalizeTags(v) {
  if (Array.isArray(v)) return [...v].map((t) => t.trim()).sort().join(',')
  return ''
}

const SHARED_FIELDS = ['title', 'short_title', 'type', 'number', 'year', 'domain', 'status', 'source_url']

const actsDir = path.join(root, 'metadata', 'acts')
if (!fs.existsSync(actsDir)) {
  console.log('No metadata/acts directory — skipping parity check.')
  process.exit(0)
}

const jsonFiles = fs.readdirSync(actsDir).filter((f) => f.endsWith('.json')).sort()
let checked = 0

for (const file of jsonFiles) {
  const slug = file.replace(/\.json$/, '')
  const jsonPath = path.join(actsDir, file)
  const mdPath = path.join(root, 'legi', `${slug}.md`)

  if (!fs.existsSync(mdPath)) continue

  let json
  try {
    json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  } catch (e) {
    fail(`${file}: invalid JSON — ${e.message}`)
    continue
  }

  const markdown = fs.readFileSync(mdPath, 'utf8')
  const fm = parseFrontmatter(markdown)
  if (!fm) {
    fail(`legi/${slug}.md: no frontmatter found`)
    continue
  }

  checked++

  for (const field of SHARED_FIELDS) {
    if (!(field in json)) continue // field not in JSON — nothing to compare
    if (!(field in fm)) {
      fail(`legi/${slug}.md: frontmatter missing field '${field}' (JSON has '${json[field]}')`)
      continue
    }
    const jsonVal = normalizeString(json[field])
    const fmVal = normalizeString(fm[field])
    if (jsonVal !== fmVal) {
      fail(
        `${slug}: field '${field}' diverges\n` +
        `  JSON:        ${jsonVal}\n` +
        `  frontmatter: ${fmVal}`,
      )
    }
  }

  // Tags comparison
  if ('tags' in json) {
    const jsonTags = normalizeTags(json.tags)
    const fmTags = normalizeTags(fm.tags)
    if (jsonTags !== fmTags) {
      fail(
        `${slug}: field 'tags' diverges\n` +
        `  JSON:        ${jsonTags}\n` +
        `  frontmatter: ${fmTags}`,
      )
    }
  }
}

if (errors === 0) {
  console.log(`Parity check passed (${checked} act(s) with both JSON and frontmatter).`)
} else {
  process.exitCode = 1
}
