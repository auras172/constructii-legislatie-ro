# AGENTS.md Specification v1

A proposed lightweight specification for repositories that want to support collaboration between humans and AI agents.

This is not a formal standard. It is a practical pattern that any open-source project can adapt.

## Purpose

`AGENTS.md` tells AI agents how to work safely inside a repository.

A good `AGENTS.md` should be readable by:

- human contributors
- ChatGPT
- Claude
- Codex
- Gemini
- Jules
- Cursor
- Windsurf
- future AI coding agents

## Required sections

### 1. Identity

Explain what the repository is and what it is not.

Example:

```text
This repository is an open-source construction legislation knowledge base.
It is not legal advice and not an official government source.
```

### 2. Mission

State the purpose of the project in one or two paragraphs.

### 3. Repository conventions

List files the agent must read before editing, such as:

- `README.md`
- `CONTRIBUTING.md`
- `DISCLAIMER.md`
- `VISION.md`
- `ROADMAP.md`
- `AGENTS.md`

### 4. Workflow

Define the contribution flow:

```text
Issue -> branch -> implementation -> validation -> pull request -> human review -> merge
```

### 5. Scope rules

Define how small a contribution should be.

Recommended rule:

```text
One issue = one pull request.
```

### 6. Validation

List commands or checks that should run before opening a PR.

The file should also say what to do if a command is unavailable.

### 7. Architecture boundaries

Explain what agents must not change without explicit approval.

Examples:

- project structure
- metadata schema
- official text blocks
- import workflow
- dependencies

### 8. Security rules

State secret-handling and safety rules.

Examples:

- never expose tokens
- never commit private data
- never paste credentials into docs

### 9. Legal constraints

For legal, regulatory, medical, financial, or compliance repositories, define source and interpretation limits.

For this repository:

- never invent legal text
- never present interpretation as fact
- cite official sources
- record provenance

### 10. Commit conventions

Give examples of good and bad commit messages.

### 11. Pull request conventions

Require every PR to explain:

- what changed
- why it changed
- how it was verified
- rollback plan, if applicable

### 12. Human approval policy

Make clear that AI agents do not approve their own work.

Human review remains required.

### 13. Definition of Done

Define what “done” means.

A good Definition of Done includes:

- source-backed change
- narrow scope
- validation run
- docs updated if needed
- no unrelated edits
- human review pending or completed

## Optional sections

### Prompt library

Link to `PROMPTS.md` if the repository provides reusable AI-agent task prompts.

### Provenance rules

Useful for data, legal text, research, documentation, or compliance repositories.

### Examples

Include branch names, commit messages, PR descriptions, and import-log examples.

## Philosophy

`AGENTS.md` is not just another documentation file.

It is an operating contract for AI-native open source: projects designed from the first day for collaboration between humans and agents.
