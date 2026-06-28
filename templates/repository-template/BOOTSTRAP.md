# Bootstrap guide — New OCKI repository in 10 minutes

This guide walks you through creating a new OCKI-compliant repository from this template.

**Prerequisites:** GitHub account, Node 20+, Git.

---

## Step 1 — Create the GitHub repository (1 min)

```sh
# Option A: GitHub CLI
gh repo create my-domain-legislation-ro \
  --public \
  --description "Open-source versioned [domain] legislation for Romania"

# Option B: GitHub web UI
# Go to github.com/new and create a new empty public repository.
```

---

## Step 2 — Clone and copy template (2 min)

```sh
# Clone your new empty repo
git clone https://github.com/YOUR_ORG/my-domain-legislation-ro
cd my-domain-legislation-ro

# Copy all template files into the new repo
# (assuming you have the OCKI template available locally)
cp -r /path/to/ocki-template/templates/repository-template/. .

# Or download and extract the template directory directly
```

---

## Step 3 — Replace placeholders (2 min)

Find and replace all placeholders in the copied files:

| Placeholder | Replace with |
|-------------|-------------|
| `{{REPO_NAME}}` | Your repository name, e.g. `my-domain-legislation-ro` |
| `{{DOMAIN}}` | Your domain, e.g. `fiscal`, `mediu`, `munca` |
| `{{DESCRIPTION}}` | One-sentence description of the repository |
| `{{CONTACT_EMAIL}}` | Your contact email address |
| `{{YEAR}}` | Current year, e.g. `2025` |
| `{{OWNER}}` | Your name or organization name |

**Quick replacement with sed (macOS/Linux):**

```sh
REPO_NAME="my-domain-legislation-ro"
DOMAIN="fiscal"
DESCRIPTION="Open-source versioned fiscal legislation for Romania"
CONTACT_EMAIL="contact@example.com"
YEAR="2025"
OWNER="Your Organization"

find . -type f \( -name "*.md" -o -name "*.yml" -o -name "*.json" \) \
  -not -path "./.git/*" | xargs sed -i '' \
  -e "s/{{REPO_NAME}}/$REPO_NAME/g" \
  -e "s/{{DOMAIN}}/$DOMAIN/g" \
  -e "s/{{DESCRIPTION}}/$DESCRIPTION/g" \
  -e "s/{{CONTACT_EMAIL}}/$CONTACT_EMAIL/g" \
  -e "s/{{YEAR}}/$YEAR/g" \
  -e "s/{{OWNER}}/$OWNER/g"
```

**On Linux, omit the `''` after `-i`:**

```sh
find . -type f \( -name "*.md" -o -name "*.yml" -o -name "*.json" \) \
  -not -path "./.git/*" | xargs sed -i \
  -e "s/{{REPO_NAME}}/$REPO_NAME/g" \
  ...
```

---

## Step 4 — Update metadata/schema.json (1 min)

Open `metadata/schema.json` and update:

- `"$id"`: replace the URL with your repository's actual URL or namespace
- `"title"`: replace with your repository's title
- `"domain"` enum: keep or trim to the domains relevant to your project

If your domain uses different `domain` values than the construction template, update the enum list. Keep the schema structure intact — the scripts depend on it.

---

## Step 5 — Validate the template (1 min)

```sh
node --version  # must be 20+

node scripts/validate-metadata.mjs
# Expected: "All metadata files valid." (no files yet, that's fine)

node scripts/check-markdown-hygiene.mjs
# Expected: hygiene check passes

node scripts/check-metadata-parity.mjs
# Expected: passes (no full-text imports yet)

node scripts/check-official-text-integrity.mjs
# Expected: passes (no full-text imports yet)
```

---

## Step 6 — Initial commit (1 min)

```sh
git add .
git commit -m "feat: initialize repository from OCKI bootstrap template

Repository: my-domain-legislation-ro
Domain: fiscal
Template: templates/repository-template from constructii-legislatie-ro"

git push origin main
```

---

## Step 7 — Verify CI (1 min)

Go to your repository on GitHub → Actions tab. The `Validate repository` workflow should appear and pass on the initial commit.

If it fails, check the error output. Common issues:
- Node version mismatch (CI uses Node 20; check `validate.yml`)
- A placeholder `{{...}}` left in a file that the validator reads

---

## Step 8 — Add your first act (1 min)

```sh
# Create the metadata entry
cat > metadata/acts/my-first-act.json << 'EOF'
{
  "title": "Full official title of the act",
  "type": "lege",
  "domain": "fiscal",
  "status": "active",
  "source_url": "https://legislatie.just.ro/...",
  "official_source": "Portal Legislativ",
  "last_checked": "2025-01-01",
  "import_method": "metadata-only",
  "tags": ["fiscal", "impozite"]
}
EOF

node scripts/validate-metadata.mjs
```

Update `INDEX.md` to add a row for this act, then commit and push.

---

## Done

Your repository is now:

- OCKI-compliant (schema, scripts, CI workflow)
- Ready for metadata contributions
- Ready for full-text imports following `docs/anchor-convention.md`
- Protected by CI on every PR

## Next steps

- Add priority acts to `INDEX.md`
- Create issues for each act to track progress
- Use prompts from `PROMPTS.md` for AI-assisted contributions
- Run `node scripts/repository-health-report.mjs` periodically to check quality

## Troubleshooting

**`validate-metadata.mjs` fails with "no acts found":**
This is OK for an empty repository. The script will pass once you add the first act.

**CI fails on `generate-changelog.mjs`:**
This script reads the `main` branch git log. Make sure you have at least one commit on `main`.

**CI fails on `validate-citation-anchors.mjs`:**
This script expects `citations/citation-index.json` to exist. Run `node scripts/generate-citation-index.mjs` to create it, then commit the output.
