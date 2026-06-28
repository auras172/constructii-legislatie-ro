import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const actsDir = path.join(root, 'metadata', 'acts')
const legiDir = path.join(root, 'legi')
const importLogDir = path.join(root, 'import-log')

let checked = 0
let skipped = 0
const failures = []

function fail(slug, reason) {
  failures.push({ slug, reason })
}

if (!fs.existsSync(actsDir)) {
  console.error(`Missing directory: ${actsDir}`)
  process.exit(1)
}

const jsonFiles = fs.readdirSync(actsDir).filter((f) => f.endsWith('.json')).sort()

for (const file of jsonFiles) {
  const slug = file.replace(/\.json$/, '')

  // Skip macOS Finder duplicate artifacts (filename contains a space — not a valid slug)
  if (slug.includes(' ')) continue
  const jsonPath = path.join(actsDir, file)

  let data
  try {
    data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  } catch (e) {
    fail(slug, `invalid JSON: ${e.message}`)
    continue
  }

  if (data.import_method === 'metadata-only') {
    skipped++
    continue
  }

  // Check 3a: legi/<slug>.md exists
  const mdPath = path.join(legiDir, `${slug}.md`)
  if (!fs.existsSync(mdPath)) {
    fail(slug, `legi/${slug}.md not found`)
    continue
  }

  const lines = fs.readFileSync(mdPath, 'utf8').split('\n')

  const startLines = lines.reduce((acc, line, i) => line.includes('OFFICIAL_TEXT_START') ? [...acc, i + 1] : acc, [])
  const endLines = lines.reduce((acc, line, i) => line.includes('OFFICIAL_TEXT_END') ? [...acc, i + 1] : acc, [])

  // Check 3b: exactly one START
  if (startLines.length !== 1) {
    fail(slug, `expected 1 OFFICIAL_TEXT_START marker, found ${startLines.length}`)
    continue
  }

  // Check 3c: exactly one END
  if (endLines.length !== 1) {
    fail(slug, `expected 1 OFFICIAL_TEXT_END marker, found ${endLines.length}`)
    continue
  }

  // Check 3d: START before END
  if (startLines[0] >= endLines[0]) {
    fail(slug, `OFFICIAL_TEXT_START (line ${startLines[0]}) must appear before OFFICIAL_TEXT_END (line ${endLines[0]})`)
    continue
  }

  // Check 3e-3f: import log exists and is non-empty
  let logFiles = []
  if (fs.existsSync(importLogDir)) {
    logFiles = fs.readdirSync(importLogDir).filter((f) => f.includes(slug) || (data.year && f.includes(data.year) && f.includes(slug)))
  }

  if (logFiles.length === 0) {
    fail(slug, `no import log found in import-log/ matching slug '${slug}'`)
    continue
  }

  const logPath = path.join(importLogDir, logFiles[0])
  const logStat = fs.statSync(logPath)
  if (logStat.size === 0) {
    fail(slug, `import log ${logFiles[0]} is empty`)
    continue
  }

  checked++
}

// Summary
if (checked > 0) console.log(`✓ checked ${checked} full-text act(s)`)
if (skipped > 0) console.log(`○ skipped ${skipped} metadata-only act(s)`)

for (const { slug, reason } of failures) {
  console.error(`✗ ${slug}: ${reason}`)
}

if (failures.length > 0) {
  process.exit(1)
}
