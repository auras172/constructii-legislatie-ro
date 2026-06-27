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
      const metadataPath = path.join('metadata', 'acts', file)
      const metadata = readJson(metadataPath)
      const slug = file.replace(/\.json$/, '')
      const markdownPath = path.join('legi', `${slug}.md`)
      const markdownExists = fs.existsSync(path.join(repoRoot, markdownPath))
      const markdown = markdownExists ? readText(markdownPath) : ''
      const importLogPath = path.join('import-log', `2026-06-27-${slug}.md`)
      return {
        slug,
        title: metadata.title,
        shortTitle: metadata.short_title ?? slug,
        type: metadata.type,
        domain: metadata.domain,
        status: metadata.status,
        sourceUrl: metadata.source_url,
        officialSource: metadata.official_source,
        lastChecked: metadata.last_checked,
        tags: metadata.tags ?? [],
        metadataPath,
        markdownPath: markdownExists ? markdownPath : null,
        textImported: markdownExists ? hasOfficialText(markdown) : false,
        articleCount: markdownExists ? countHeadings(markdown, '### Articolul') : 0,
        annexCount: markdownExists ? countHeadings(markdown, '### Anexa') : 0,
        importLogPath: fs.existsSync(path.join(repoRoot, importLogPath)) ? importLogPath : null,
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
