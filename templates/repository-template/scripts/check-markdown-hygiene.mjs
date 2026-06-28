import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const skipDirs = new Set(['.git', 'node_modules'])
let checked = 0

function fail(message) {
  console.error(message)
  process.exitCode = 1
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) walk(path.join(dir, entry.name))
      continue
    }
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue
    checkFile(path.join(dir, entry.name))
  }
}

function checkFile(filePath) {
  checked += 1
  const rel = path.relative(root, filePath)
  const text = fs.readFileSync(filePath, 'utf8')
  const lines = text.split('\n')

  if (!text.endsWith('\n')) {
    fail(`${rel}: missing trailing newline`)
  }

  lines.forEach((line, index) => {
    if (/[ \t]$/.test(line)) {
      fail(`${rel}:${index + 1}: trailing whitespace`)
    }
  })

  if (/^#{1,6}[^#\s]/m.test(text)) {
    fail(`${rel}: heading marker must be followed by a space`)
  }
}

walk(root)

if (process.exitCode) {
  process.exit(process.exitCode)
}

console.log(`Checked ${checked} Markdown file(s).`)
