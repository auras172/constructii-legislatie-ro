# Your First AI-assisted Pull Request

A 15-minute guide for making a small, safe contribution to this repository with help from an AI coding agent.

You do not need to be a legal expert to contribute metadata, source links, or documentation. You do need to stay factual and cite official sources.

## What you need

- A GitHub account.
- A fork or branch workflow.
- An AI coding agent such as ChatGPT, Claude, Codex, Gemini, Jules, Cursor, or Windsurf.
- One small issue to work on.

Start with issues labeled `good first issue`.

## Step 1 — Pick one issue

Choose one issue only.

Good first tasks:

- Add metadata for one act.
- Improve an import log template.
- Add an official source link.
- Improve documentation.

Avoid starting with full-text imports until you understand the source and provenance rules.

## Step 2 — Ask the agent to read the repo rules

Use a prompt like:

```text
Read README.md, CONTRIBUTING.md, DISCLAIMER.md, AGENTS.md, and the issue.
Do not edit files yet.
Summarize the task, scope, and validation commands.
```

If the agent starts coding before reading, stop it and redirect it.

## Step 3 — Create a branch

Use a clear branch name:

```text
feature/add-lege-10-metadata
```

Do not work on `main`.

## Step 4 — Make the smallest change

Ask the agent to implement only the issue.

Good instruction:

```text
Implement Issue #X only.
Do not modify unrelated files.
Do not import legal text.
Keep the change metadata-only.
```

## Step 5 — Validate

Run the available checks:

```sh
git diff --check
node scripts/validate-metadata.mjs
node scripts/check-markdown-hygiene.mjs
```

If a command does not exist on your branch, mention that in the PR.

## Step 6 — Review the diff yourself

Before opening a PR, inspect what changed.

Check:

- Did the agent edit only expected files?
- Are official source URLs present?
- Is anything invented or uncertain?
- Are TODOs used instead of guesses?
- Did validation pass?

## Step 7 — Open the pull request

The PR should include:

- Summary
- Files changed
- Source URL and date checked
- Verification results
- Remaining TODOs
- Rollback plan if applicable

## Step 8 — Human review

AI does not approve its own work.

Wait for human review. If a reviewer asks for changes, keep the follow-up small.

## Common mistakes

Avoid:

- solving multiple issues in one PR
- importing full text from unclear sources
- using third-party legal database content
- adding legal interpretation as fact
- broad reformatting
- vague commits like `update` or `fix`

## Success condition

Your first PR is successful when it is small, source-backed, easy to review, and leaves the repository easier for the next contributor to continue.
