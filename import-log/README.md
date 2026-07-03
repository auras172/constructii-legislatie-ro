# Import Log

This directory records provenance for official-source text imports.

Each official text import should have one log file named:

```text
YYYY-MM-DD-short-act-name.md
```

The log should record:

- exact source URL
- official source name
- date accessed
- import method
- whether the text came from a printable/consolidated form
- number of article headings detected
- number of annex headings detected
- verification commands run
- optional checksum of the raw captured source
- optional checksum of the normalized Markdown official text block
- known limitations of the mechanical conversion

Import logs are not legal commentary. They are technical provenance records.

## Official text block hash format

For full-text imports, future import logs should record the hash of the exact
Markdown block between `OFFICIAL_TEXT_START` and `OFFICIAL_TEXT_END` after
line endings are normalized to LF:

```text
official_text_sha256: <64 lowercase hex characters>
```

This is distinct from any raw source-body checksum captured from Portal
Legislativ, MDLPA, ISCIR, ANRE, Monitorul Oficial, or another official source.
Raw source hashes prove what was fetched; `official_text_sha256` proves that
the imported Markdown official block is stable inside this repository.
