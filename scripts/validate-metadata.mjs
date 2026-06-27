import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const schemaPath = path.join(root, 'metadata', 'schema.json')
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))
const metadataDir = path.join(root, 'metadata', 'acts')

const enumFields = Object.fromEntries(
  Object.entries(schema.properties)
    .filter(([, value]) => Array.isArray(value.enum))
    .map(([key, value]) => [key, value.enum]),
)

const required = schema.required ?? []
const allowed = new Set(Object.keys(schema.properties ?? {}))
const dateRe = /^\d{4}-\d{2}-\d{2}$/

function fail(message) {
  console.error(message)
  process.exitCode = 1
}

if (!fs.existsSync(metadataDir)) {
  fail(`Missing metadata directory: ${metadataDir}`)
  process.exit()
}

const files = fs.readdirSync(metadataDir).filter((file) => file.endsWith('.json')).sort()
if (files.length === 0) {
  fail('No metadata act files found')
}

for (const file of files) {
  const filePath = path.join(metadataDir, file)
  let data
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    fail(`${file}: invalid JSON (${error.message})`)
    continue
  }

  for (const key of Object.keys(data)) {
    if (!allowed.has(key)) {
      fail(`${file}: unexpected field '${key}'`)
    }
  }

  for (const key of required) {
    if (!(key in data)) {
      fail(`${file}: missing required field '${key}'`)
    }
  }

  for (const [key, values] of Object.entries(enumFields)) {
    if (key in data && !values.includes(data[key])) {
      fail(`${file}: invalid ${key} '${data[key]}'`)
    }
  }

  if ('last_checked' in data && !dateRe.test(String(data.last_checked))) {
    fail(`${file}: last_checked must use YYYY-MM-DD`)
  }

  if (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== 'string' || tag.length === 0)) {
    fail(`${file}: tags must be a non-empty string array`)
  }
}

if (process.exitCode) {
  process.exit(process.exitCode)
}

console.log(`Validated ${files.length} metadata file(s).`)
