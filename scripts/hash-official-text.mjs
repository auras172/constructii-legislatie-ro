import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const OFFICIAL_START = '<!-- OFFICIAL_TEXT_START -->'
const OFFICIAL_END = '<!-- OFFICIAL_TEXT_END -->'

const root = process.cwd()
const actsDir = path.join(root, 'metadata', 'acts')
const legiDir = path.join(root, 'legi')
const importLogDir = path.join(root, 'import-log')

function usage() {
  console.error(`Usage:
  node scripts/hash-official-text.mjs [--report] [slug]
  node scripts/hash-official-text.mjs --check [slug]

Computes SHA-256 hashes for Markdown official text blocks only.
Line endings are normalized to LF before hashing.
This script does not fetch official sources and does not certify legal accuracy.`)
}

function normalizeLineEndings(value) {
  return value.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

function officialTextBlock(markdown, slug) {
  const normalized = normalizeLineEndings(markdown)
  const start = normalized.indexOf(OFFICIAL_START)
  const end = normalized.indexOf(OFFICIAL_END)

  if (start === -1) {
    throw new Error(`${slug}: missing OFFICIAL_TEXT_START marker`)
  }
  if (end === -1) {
    throw new Error(`${slug}: missing OFFICIAL_TEXT_END marker`)
  }
  if (normalized.indexOf(OFFICIAL_START, start + OFFICIAL_START.length) !== -1) {
    throw new Error(`${slug}: multiple OFFICIAL_TEXT_START markers`)
  }
  if (normalized.indexOf(OFFICIAL_END, end + OFFICIAL_END.length) !== -1) {
    throw new Error(`${slug}: multiple OFFICIAL_TEXT_END markers`)
  }
  if (start >= end) {
    throw new Error(`${slug}: OFFICIAL_TEXT_START must appear before OFFICIAL_TEXT_END`)
  }

  return normalized.slice(start + OFFICIAL_START.length, end)
}

function hashOfficialText(markdown, slug) {
  const block = officialTextBlock(markdown, slug)
  return crypto.createHash('sha256').update(block, 'utf8').digest('hex')
}

function flattenMetadataValues(value, acc = []) {
  if (value === null || value === undefined) return acc
  if (Array.isArray(value)) {
    for (const item of value) flattenMetadataValues(item, acc)
    return acc
  }
  if (typeof value === 'object') {
    for (const item of Object.values(value)) flattenMetadataValues(item, acc)
    return acc
  }
  acc.push(String(value))
  return acc
}

function findRecordedHash(data, logContent = '') {
  const metadataCandidates = [
    data.official_text_sha256,
    data.official_text_block_sha256,
    data.markdown_official_block_sha256,
    data.checksums?.official_text_sha256,
    data.checksums?.official_text_block_sha256,
    data.integrity?.official_text_sha256,
    data.integrity?.official_text_block_sha256
  ].filter(Boolean).map(String)

  for (const candidate of metadataCandidates) {
    const match = candidate.match(/\b[a-f0-9]{64}\b/i)
    if (match) return { hash: match[0].toLowerCase(), source: 'metadata' }
  }

  const logPatterns = [
    /\bofficial_text_sha256\s*[:=]\s*`?([a-f0-9]{64})`?/i,
    /\bofficial_text_block_sha256\s*[:=]\s*`?([a-f0-9]{64})`?/i,
    /\bmarkdown_official_block_sha256\s*[:=]\s*`?([a-f0-9]{64})`?/i,
    /\bofficial text SHA-256\s*[:=]\s*`?([a-f0-9]{64})`?/i
  ]

  for (const pattern of logPatterns) {
    const match = logContent.match(pattern)
    if (match) return { hash: match[1].toLowerCase(), source: 'import-log' }
  }

  for (const value of flattenMetadataValues(data)) {
    if (!/official.*text|text.*official|markdown.*block/i.test(value)) continue
    const match = value.match(/\b[a-f0-9]{64}\b/i)
    if (match) return { hash: match[0].toLowerCase(), source: 'metadata' }
  }

  return null
}

function importLogContent(slug, data) {
  if (!fs.existsSync(importLogDir)) return ''

  const logFiles = fs.readdirSync(importLogDir)
    .filter((file) => file.includes(slug) || (data.year && file.includes(String(data.year)) && file.includes(slug)))
    .sort()

  if (logFiles.length === 0) return ''
  return fs.readFileSync(path.join(importLogDir, logFiles[0]), 'utf8')
}

function readAct(slug) {
  const metadataPath = path.join(actsDir, `${slug}.json`)
  if (!fs.existsSync(metadataPath)) {
    throw new Error(`${slug}: metadata/acts/${slug}.json not found`)
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
  if (metadata.import_method === 'metadata-only') {
    return null
  }

  const markdownPath = path.join(legiDir, `${slug}.md`)
  if (!fs.existsSync(markdownPath)) {
    throw new Error(`${slug}: legi/${slug}.md not found`)
  }

  const markdown = fs.readFileSync(markdownPath, 'utf8')
  const hash = hashOfficialText(markdown, slug)
  return {
    slug,
    title: metadata.title,
    hash,
    recorded: findRecordedHash(metadata, importLogContent(slug, metadata))
  }
}

function fullTextSlugs() {
  if (!fs.existsSync(actsDir)) {
    throw new Error(`Missing directory: ${actsDir}`)
  }

  return fs.readdirSync(actsDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''))
    .filter((slug) => !slug.includes(' '))
    .sort()
}

function main() {
  const args = process.argv.slice(2)
  const checkMode = args.includes('--check')
  const reportMode = args.includes('--report') || !checkMode
  const unknownFlags = args.filter((arg) => arg.startsWith('--') && !['--check', '--report'].includes(arg))
  const slug = args.find((arg) => !arg.startsWith('--'))

  if (unknownFlags.length > 0) {
    usage()
    process.exit(2)
  }

  try {
    const slugs = slug ? [slug] : fullTextSlugs()
    const rows = []
    const failures = []
    let missing = 0
    let validated = 0

    for (const currentSlug of slugs) {
      const row = readAct(currentSlug)
      if (row) rows.push(row)
    }

    if (reportMode) {
      for (const row of rows) {
        console.log(`${row.slug} ${row.hash}`)
      }
    }

    if (checkMode) {
      for (const row of rows) {
        if (!row.recorded) {
          missing++
          continue
        }
        if (row.recorded.hash !== row.hash) {
          failures.push(`${row.slug}: recorded ${row.recorded.hash} (${row.recorded.source}), actual ${row.hash}`)
          continue
        }
        validated++
      }

      console.log(`✓ hashed ${rows.length} full-text act(s)`)
      if (validated > 0) console.log(`✓ validated ${validated} recorded hash(es)`)
      if (missing > 0) console.warn(`⚠ ${missing} full-text act(s) do not yet record an official text hash`)

      if (failures.length > 0) {
        for (const failure of failures) console.error(`✗ ${failure}`)
        process.exit(1)
      }
    }
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}

export {
  OFFICIAL_END,
  OFFICIAL_START,
  hashOfficialText,
  findRecordedHash,
  normalizeLineEndings,
  officialTextBlock
}
