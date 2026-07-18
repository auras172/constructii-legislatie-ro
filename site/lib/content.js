import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(currentDir, '..', '..')

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath))
}

function firstParagraph(markdown) {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && !line.startsWith('---') && !line.startsWith('```'))[0] ?? ''
}

function stripFrontmatter(markdown) {
  if (!markdown.startsWith('---')) return markdown
  const end = markdown.indexOf('\n---', 3)
  if (end === -1) return markdown
  return markdown.slice(end + 4).trimStart()
}

function hasOfficialText(markdown) {
  return markdown.includes('OFFICIAL_TEXT_START') && markdown.includes('OFFICIAL_TEXT_END')
}

function countHeadings(markdown, prefix) {
  return markdown.split('\n').filter((line) => line.startsWith(prefix)).length
}

function markdownSummary(relativePath) {
  const markdown = readText(relativePath)
  return {
    path: relativePath,
    intro: firstParagraph(stripFrontmatter(markdown)),
  }
}

function buildActFromSlug(slug, metadata) {
  const markdownPath = path.join('legi', `${slug}.md`)
  const markdownExists = fs.existsSync(path.join(repoRoot, markdownPath))
  const markdown = markdownExists ? readText(markdownPath) : ''

  const importLogDir = path.join(repoRoot, 'import-log')
  const importLogFiles = fs.existsSync(importLogDir)
    ? fs.readdirSync(importLogDir)
        .filter((f) => f.endsWith(`-${slug}.md`))
        .sort()
    : []

  const importMethod = metadata.import_method ?? null
  const importKind = importMethod === 'metadata-only' ? 'metadata-only' : 'full-text'

  return {
    slug,
    title: metadata.title,
    shortTitle: metadata.short_title ?? slug,
    canonicalCitation: metadata.canonical_citation ?? null,
    type: metadata.type,
    domain: metadata.domain,
    topics: metadata.topics ?? [],
    status: metadata.status,
    issuer: metadata.issuer ?? null,
    issuingBodyKind: metadata.issuing_body_kind ?? null,
    issueDate: metadata.issue_date ?? null,
    effectiveDate: metadata.effective_date ?? null,
    publicationMedium: metadata.publication_medium ?? null,
    sourceUrl: metadata.source_url,
    officialSource: metadata.official_source ?? null,
    officialDetailUrl: metadata.official_detail_url ?? null,
    versionKind: metadata.version_kind ?? null,
    consolidatedAsOf: metadata.consolidated_as_of ?? null,
    lastChecked: metadata.last_checked,
    version: metadata.version ?? null,
    tags: metadata.tags ?? [],
    articleCount: metadata.article_count ?? (markdownExists ? countHeadings(markdown, '### Articolul') : 0),
    annexCount: metadata.annex_count ?? (markdownExists ? countHeadings(markdown, '### Anexa') : 0),
    importMethod,
    importKind,
    rightsNote: metadata.rights_note ?? null,
    relatedActs: metadata.related_acts ?? [],
    implements: metadata.implements ?? [],
    amends: metadata.amends ?? [],
    amendedBy: metadata.amended_by ?? [],
    markdownPath: markdownExists ? markdownPath : null,
    textImported: markdownExists ? hasOfficialText(markdown) : false,
    importLogPaths: importLogFiles.map((f) => path.join('import-log', f)),
  }
}

export function getProjectOverview() {
  return {
    readme: markdownSummary('README.md'),
    vision: fs.existsSync(path.join(repoRoot, 'VISION.md')) ? markdownSummary('VISION.md') : null,
    roadmap: fs.existsSync(path.join(repoRoot, 'ROADMAP.md')) ? markdownSummary('ROADMAP.md') : null,
    disclaimer: markdownSummary('DISCLAIMER.md'),
  }
}

export function getActs() {
  const actsDir = path.join(repoRoot, 'metadata', 'acts')
  if (!fs.existsSync(actsDir)) return []

  return fs.readdirSync(actsDir)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => {
      const slug = file.replace(/\.json$/, '')
      const metadata = readJson(path.join('metadata', 'acts', file))
      return buildActFromSlug(slug, metadata)
    })
}

export function getRepositoryStats() {
  const acts = getActs()
  const graphPath = path.join(repoRoot, 'graph', 'graph.json')
  const healthPath = path.join(repoRoot, 'reports', 'repository-health.json')
  const citationPath = path.join(repoRoot, 'citations', 'citation-index.json')

  const graph = fs.existsSync(graphPath) ? readJson('graph/graph.json') : null
  const health = fs.existsSync(healthPath) ? readJson('reports/repository-health.json') : null
  const citationIndex = fs.existsSync(citationPath) ? readJson('citations/citation-index.json') : null
  const fullTextActs = acts.filter((act) => act.textImported).length

  return {
    actsTotal: acts.length,
    fullTextActs,
    metadataOnlyActs: acts.length - fullTextActs,
    domainsTotal: new Set(acts.map((act) => act.domain)).size,
    importLogs: health?.summary?.total_import_logs ?? (fs.existsSync(path.join(repoRoot, 'import-log'))
      ? fs.readdirSync(path.join(repoRoot, 'import-log')).filter((file) => file.endsWith('.md')).length
      : 0),
    graphNodes: graph?.nodes?.length ?? acts.length,
    confirmedEdges: graph?.edges?.filter((edge) => edge.review_status === 'confirmed').length ?? 0,
    pendingEdges: graph?.edges?.filter((edge) => edge.review_status === 'needs_review').length ?? 0,
    healthScore: health?.score ?? health?.summary?.health_score ?? 100,
    articleAnchors: Array.isArray(citationIndex)
      ? citationIndex.length
      : citationIndex?.citations?.length ?? citationIndex?.anchors?.length ?? 799,
  }
}

export function getActSlugs() {
  const actsDir = path.join(repoRoot, 'metadata', 'acts')
  if (!fs.existsSync(actsDir)) return []
  return fs.readdirSync(actsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
}

export function getActBySlug(slug) {
  const metadataPath = path.join('metadata', 'acts', `${slug}.json`)
  const fullPath = path.join(repoRoot, metadataPath)
  if (!fs.existsSync(fullPath)) return null
  const metadata = readJson(metadataPath)
  return buildActFromSlug(slug, metadata)
}

export function getImportLogs(slug) {
  const importLogDir = path.join(repoRoot, 'import-log')
  if (!fs.existsSync(importLogDir)) return []

  return fs.readdirSync(importLogDir)
    .filter((f) => f.endsWith(`-${slug}.md`))
    .sort()
    .map((f) => {
      const relativePath = path.join('import-log', f)
      const content = readText(relativePath)
      const dateMatch = f.match(/^(\d{4}-\d{2}-\d{2})/)
      return {
        filename: f,
        date: dateMatch ? dateMatch[1] : null,
        content: stripFrontmatter(content),
        githubUrl: `https://github.com/auras172/constructii-legislatie-ro/blob/main/${relativePath}`,
      }
    })
}

export function getContributorResources() {
  return [
    { title: 'Contributing', path: 'CONTRIBUTING.md', summary: markdownSummary('CONTRIBUTING.md').intro },
    { title: 'AI agent contract', path: 'AGENTS.md', summary: markdownSummary('AGENTS.md').intro },
    { title: 'Standard prompts', path: 'PROMPTS.md', summary: markdownSummary('PROMPTS.md').intro },
    { title: 'First AI-assisted PR', path: 'docs/ai-contributor-onboarding.md', summary: markdownSummary('docs/ai-contributor-onboarding.md').intro },
  ].filter((item) => fs.existsSync(path.join(repoRoot, item.path)))
}
