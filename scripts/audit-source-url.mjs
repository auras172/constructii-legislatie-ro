import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outRoot = '/tmp/constructii-source-audit'

function fail(message) {
  console.error(message)
  process.exit(1)
}

function usage() {
  console.error('Usage: node scripts/audit-source-url.mjs <slug> [--official-detail]')
  console.error('')
  console.error('Audits one metadata file from metadata/acts/<slug>.json.')
  console.error('This script does not import official text and does not certify legal accuracy.')
}

function classifyAuthority(url) {
  let hostname
  try {
    hostname = new URL(url).hostname.toLowerCase()
  } catch {
    return 'other'
  }

  if (hostname === 'legislatie.just.ro') return 'Portal Legislativ'
  if (hostname === 'mdlpa.ro' || hostname.endsWith('.mdlpa.ro')) return 'MDLPA'
  if (hostname === 'iscir.ro' || hostname.endsWith('.iscir.ro')) return 'ISCIR'
  if (hostname === 'anre.ro' || hostname.endsWith('.anre.ro')) return 'ANRE'
  return 'other'
}

function safeFileStem(url) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return 'source-body'
  }

  const raw = `${parsed.hostname}${parsed.pathname}`.replace(/\/+$/, '') || 'source-body'
  const stem = raw
    .replace(/^www\./, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return stem || 'source-body'
}

function uniqueOutputPath(dir, stem) {
  let candidate = path.join(dir, `${stem}.body`)
  let counter = 1
  while (fs.existsSync(candidate)) {
    candidate = path.join(dir, `${stem}.${counter}.body`)
    counter += 1
  }
  return candidate
}

const args = process.argv.slice(2)
const slug = args.find((arg) => !arg.startsWith('-'))
const useOfficialDetail = args.includes('--official-detail')

if (!slug || args.includes('--help') || args.includes('-h')) {
  usage()
  process.exit(slug ? 0 : 1)
}

const metadataPath = path.join(root, 'metadata', 'acts', `${slug}.json`)
if (!fs.existsSync(metadataPath)) {
  fail(`Missing metadata file: ${path.relative(root, metadataPath)}`)
}

let metadata
try {
  metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
} catch (error) {
  fail(`${path.relative(root, metadataPath)}: invalid JSON (${error.message})`)
}

const sourceUrl = metadata.source_url
const officialDetailUrl = metadata.official_detail_url
const selectedUrl = useOfficialDetail ? officialDetailUrl : sourceUrl || officialDetailUrl

if (!selectedUrl) {
  fail(`${path.relative(root, metadataPath)}: missing source_url${useOfficialDetail ? ' / official_detail_url' : ''}`)
}

if (useOfficialDetail && !officialDetailUrl) {
  fail(`${path.relative(root, metadataPath)}: missing official_detail_url`)
}

let response
let body
try {
  response = await fetch(selectedUrl, {
    headers: {
      'User-Agent': 'constructii-legislatie-ro source audit helper',
    },
  })
  body = Buffer.from(await response.arrayBuffer())
} catch (error) {
  fail(`Fetch failed for ${selectedUrl}: ${error.message}`)
}

const outputDir = path.join(outRoot, slug)
fs.mkdirSync(outputDir, { recursive: true })
const outputPath = uniqueOutputPath(outputDir, safeFileStem(selectedUrl))
fs.writeFileSync(outputPath, body, { flag: 'wx' })

const hash = crypto.createHash('sha256').update(body).digest('hex')
const contentType = response.headers.get('content-type') ?? 'unknown'

console.log('WARNING: This script does not import official text and does not certify legal accuracy.')
console.log(`slug: ${slug}`)
console.log(`title: ${metadata.title ?? 'unknown'}`)
console.log(`source_url: ${sourceUrl ?? 'missing'}`)
console.log(`official_detail_url: ${officialDetailUrl ?? 'missing'}`)
console.log(`fetched_url: ${selectedUrl}`)
console.log(`authority: ${classifyAuthority(selectedUrl)}`)
console.log(`http_status: ${response.status}`)
console.log(`content_type: ${contentType}`)
console.log(`byte_size: ${body.length}`)
console.log(`sha256: ${hash}`)
console.log(`saved_body: ${outputPath}`)

if (!response.ok) {
  fail(`Fetch returned non-success HTTP status ${response.status}`)
}
