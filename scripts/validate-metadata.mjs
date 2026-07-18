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
const relationshipValues = new Set(schema.properties.relationships?.items?.properties?.relationship?.enum ?? [])
const confidenceValues = new Set(schema.properties.relationships?.items?.properties?.confidence?.enum ?? [])
const evidenceTypeValues = new Set(schema.properties.relationships?.items?.properties?.evidence_type?.enum ?? [])
const relationshipSimpleFields = {
  related_to: 'related_acts',
  implements: 'implements',
  amends: 'amends',
  amended_by: 'amended_by',
}

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

const knownSlugs = new Set(files.map((file) => path.basename(file, '.json')))

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

  if ('relationships' in data) {
    if (!Array.isArray(data.relationships)) {
      fail(`${file}: relationships must be an array`)
      continue
    }

    const seenRelationships = new Set()

    data.relationships.forEach((relationship, index) => {
      const prefix = `${file}: relationships[${index}]`

      if (!relationship || typeof relationship !== 'object' || Array.isArray(relationship)) {
        fail(`${prefix} must be an object`)
        return
      }

      const allowedRelationshipFields = new Set([
        'target',
        'relationship',
        'confidence',
        'evidence_type',
        'evidence',
        'source_url',
        'evidence_path',
        'notes',
      ])

      for (const key of Object.keys(relationship)) {
        if (!allowedRelationshipFields.has(key)) {
          fail(`${prefix}: unexpected field '${key}'`)
        }
      }

      for (const key of ['target', 'relationship', 'confidence', 'evidence_type']) {
        if (!(key in relationship)) {
          fail(`${prefix}: missing required field '${key}'`)
        }
      }

      const target = relationship.target
      const type = relationship.relationship
      const confidence = relationship.confidence
      const evidenceType = relationship.evidence_type

      if (typeof target !== 'string' || target.length === 0) {
        fail(`${prefix}: target must be a non-empty string`)
      } else if (target === path.basename(file, '.json')) {
        fail(`${prefix}: target must not reference itself`)
      } else if (!knownSlugs.has(target)) {
        fail(`${prefix}: target '${target}' does not exist in metadata/acts`)
      }

      if (!relationshipValues.has(type)) {
        fail(`${prefix}: invalid relationship '${type}'`)
      }

      if (!confidenceValues.has(confidence)) {
        fail(`${prefix}: invalid confidence '${confidence}'`)
      }

      if (!evidenceTypeValues.has(evidenceType)) {
        fail(`${prefix}: invalid evidence_type '${evidenceType}'`)
      }

      const evidenceFields = ['evidence', 'source_url', 'evidence_path', 'notes']
      const hasEvidence = evidenceFields.some((key) => (
        typeof relationship[key] === 'string' && relationship[key].trim().length > 0
      ))

      if (!hasEvidence) {
        fail(`${prefix}: at least one evidence field is required`)
      }

      const dedupeKey = `${target}||${type}`
      if (seenRelationships.has(dedupeKey)) {
        fail(`${prefix}: duplicate relationship '${type}' to '${target}'`)
      }
      seenRelationships.add(dedupeKey)

      const simpleField = relationshipSimpleFields[type]
      if (simpleField && Array.isArray(data[simpleField]) && data[simpleField].includes(target)) {
        fail(`${prefix}: duplicates ${simpleField} entry '${target}'`)
      }
    })
  }
}

if (process.exitCode) {
  process.exit(process.exitCode)
}

console.log(`Validated ${files.length} metadata file(s).`)
