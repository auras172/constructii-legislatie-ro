# Construction Glossary

This glossary explains repository terms used in the construction legislation
corpus. It is written for contributors, reviewers, and AI agents that need a
shared vocabulary before editing metadata, docs, or import logs.

These definitions are repository usage guidance, not legal advice. Official
legal meaning remains in the official sources cited by each act. Do not use this
glossary to infer relationships, legal conclusions, effective dates, or source
authority when the cited source does not support them.

## Terms

| Term | Repository usage | Notes |
| --- | --- | --- |
| act normativ | A tracked legal, regulatory, or technical act relevant to construction legislation. | Examples include laws, government decisions, ordinances, norms, procedures, and technical regulations. |
| metadata-only | An import where the repository stores structured metadata, a short Markdown stub, source links, and provenance, but not the official legal text. | This is the default mode for small evidence-first imports. |
| full-text import | An import where the repository also stores the official text inside the Markdown act page. | Full text is bounded by the repository's official text markers and checked by integrity tooling. |
| sursa oficiala | The authority-backed source used for provenance, such as Portal Legislativ, Monitorul Oficial references, ministry pages, or authority PDFs. | Unofficial mirrors and commercial databases are not treated as source authority. |
| Portal Legislativ | The Romanian public legislation portal used for many official act pages and consolidated versions. | Portal IDs and source URLs should be recorded when used as evidence. |
| Monitorul Oficial | The official publication venue for Romanian acts. | A Monitorul Oficial number/date is publication evidence, but the repository does not replace the official publication. |
| import log | A dated note under `import-log/` that records what was checked, which sources were used, and which relationship decisions were made. | Import logs should include caveats when source availability, effective date, or scope is unclear. |
| provenienta | The evidence trail for where repository data came from and when it was checked. | Usually represented by source URLs, publication references, `last_checked`, and import-log notes. |
| consolidat | A version of an act that incorporates later changes up to a stated source date or update point. | Only use when the source or repo metadata supports that version kind. |
| republicat | An officially republished version of an act. | Republication can change numbering or structure, so it should not be assumed from ordinary amendments. |
| abrogat | A status indicating that an act has been repealed, in whole or as represented by the source metadata. | Status must come from source-backed metadata, not topic similarity. |
| modifica / modificat de | `modifica` means an act changes another act; `modificat de` means an act is changed by another act. | These relationships require explicit source evidence, such as an amendment article or Portal Legislativ action. |
| `related_acts` | A metadata field for source-backed local relationships that help the graph connect acts. | It is not a place for broad topic associations or guesses. |
| `amends` | A relationship type where the source act modifies the target act. | Use only when official source evidence supports the amendment. |
| `amended_by` | A metadata list on an act that records local acts known to amend it. | This is an append-only provenance aid unless validation or source correction requires otherwise. |
| `implements` | A relationship type where an act applies, operationalizes, or implements another act. | Use only when the official source directly supports this relationship. |
| citation anchor | A stable Markdown anchor used to point to a specific article, annex, or section in a full-text act page. | Anchors support precise citations and should remain stable once published. |
| graph edge | A machine-readable relationship between two act nodes in generated graph artifacts. | Edges should derive from confirmed metadata or clearly labeled generated review candidates. |
| `needs_review` | A graph or cross-reference status for a detected relationship that has not been confirmed as source-backed metadata. | It should not be treated as confirmed legal provenance. |
| `domain` | The primary taxonomy bucket for an act. | Each act should have one primary domain when classified. |
| `topics` | Structured secondary taxonomy terms that describe the act's subject matter. | Topics improve browsing and retrieval, but they are not relationship evidence. |
| `tags` | Search and retrieval keywords used by the repository. | Tags are intentionally lightweight and must not be used to infer graph edges. |

## How To Use

Use this glossary together with:

- [metadata model](./metadata-model.md) for field-level expectations;
- [taxonomy](./taxonomy.md) for `domain`, `topics`, and `tags`;
- [relationship specification](./relationship-specification.md) for graph edge
  meaning and evidence rules;
- [contributor examples](./contributor-examples.md) for small safe changes.

When the glossary conflicts with a schema, validation script, source page, or
more specific repository specification, follow the more specific evidence.
