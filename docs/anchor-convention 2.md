# Anchor convention

This document defines the stable anchor convention for article-level citations in this repository.

## Purpose

Stable anchors allow:

- direct citation of specific articles, paragraphs, and letters from external sources
- reliable linking from a static public site
- consistent references in RAG systems, compliance checklists, and datasets

## Rules

1. **Structural, not interpretive.** Anchors follow the official numbering exactly. Do not create anchors based on content or subject matter.
2. **Lowercase, ASCII, hyphenated.** Use only `a-z`, `0-9`, and `-`.
3. **Preserve official numbering.** If the official text numbers an article as `Art. 7`, the anchor is `#art-7`, not `#article-7` or `#art7`.
4. **Fixed for the lifetime of an act version.** Do not renumber anchors when text is updated; add new anchors for new articles.

## Format

```text
Article:          #art-{n}
Paragraph:        #art-{n}-alin-{p}
Letter:           #art-{n}-alin-{p}-lit-{l}
Point:            #art-{n}-pct-{k}
Annex:            #anexa-{n}
Article in annex: #anexa-{n}-art-{m}
```

## Examples

```text
Article 1:                          #art-1
Article 7, paragraph 3:             #art-7-alin-3
Article 1, paragraph 1, letter a:   #art-1-alin-1-lit-a
Article 3, point 2:                 #art-3-pct-2
Annex 1:                            #anexa-1
Annex 1, article 2:                 #anexa-1-art-2
```

## Application in Markdown

Add anchors as HTML `id` attributes or as explicit Markdown heading identifiers:

```markdown
### Art. 1 {#art-1}

### Art. 7 {#art-7}

#### Alin. (3) {#art-7-alin-3}
```

When the Markdown renderer does not support explicit heading IDs, use an empty HTML anchor before the heading:

```markdown
<a id="art-1"></a>

### Art. 1
```

## Migration

Acts imported before this convention was established should be updated incrementally, one act per PR. The import log for each act should record when anchors were added.

## Reference act

The convention is illustrated in `legi/lege-50-1991.md`. Use that file as a reference when adding anchors to other acts.
