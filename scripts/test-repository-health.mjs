#!/usr/bin/env node

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const reporter = path.join(repoRoot, 'scripts', 'repository-health-report.mjs')

function writeFixture(root, slug, metadata) {
  fs.mkdirSync(path.join(root, 'metadata'), { recursive: true })
  fs.mkdirSync(path.join(root, 'metadata', 'acts'), { recursive: true })
  fs.mkdirSync(path.join(root, 'legi'), { recursive: true })
  fs.mkdirSync(path.join(root, 'import-log'), { recursive: true })
  fs.mkdirSync(path.join(root, 'reports'), { recursive: true })
  fs.copyFileSync(path.join(repoRoot, 'metadata', 'schema.json'), path.join(root, 'metadata', 'schema.json'))
  fs.writeFileSync(path.join(root, 'metadata', 'acts', `${slug}.json`), `${JSON.stringify(metadata, null, 2)}\n`)
  fs.writeFileSync(path.join(root, 'legi', `${slug}.md`), `# ${slug}\n`)
  fs.writeFileSync(path.join(root, 'import-log', `${slug}.md`), 'audit\n')
}

function runFixture(metadata, slug) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'repository-health-'))
  writeFixture(root, slug, metadata)
  execFileSync(process.execPath, [reporter], { cwd: root, stdio: 'pipe' })
  return JSON.parse(fs.readFileSync(path.join(root, 'reports', 'repository-health.json'), 'utf8'))
}

const base = {
  title: 'Valid fixture act',
  short_title: 'Fixture',
  canonical_citation: 'Fixture',
  type: 'lege',
  number: '1',
  year: '2026',
  issuer: 'Parlamentul României',
  issuing_body_kind: 'parlament',
  domain: 'urbanism',
  topics: ['fixture'],
  status: 'unknown',
  issue_date: '2026-01-01',
  source_url: 'https://example.test/fixture',
  article_count: 0,
  annex_count: 0,
  import_method: 'metadata-only',
  tags: ['fixture'],
}

const emptyReport = runFixture(base, 'valid-empty-relationships')
if (emptyReport.health_score.score !== 100 || emptyReport.warnings.some((warning) => warning.type === 'missing_relationships')) {
  throw new Error('valid act without relationships must have health 100 and no missing_relationships warning')
}

const unresolvedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'repository-health-invalid-'))
const unresolvedMetadata = {
  ...base,
  relationships: [{ type: 'references', target: 'missing-act', confidence: 'confirmed', evidence: 'fixture' }],
}
writeFixture(unresolvedRoot, 'invalid-unresolved-relationship', unresolvedMetadata)
let validatorFailed = false
try {
  execFileSync(process.execPath, [path.join(repoRoot, 'scripts', 'validate-metadata.mjs')], { cwd: unresolvedRoot, stdio: 'pipe' })
} catch (error) {
  validatorFailed = /does not exist in metadata\/acts/.test(`${error.stdout ?? ''}${error.stderr ?? ''}`)
}
if (!validatorFailed) {
  throw new Error('unresolved relationship target must remain a validate-metadata failure')
}

console.log('repository health relationship fixtures: PASS')
