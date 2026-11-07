---
description: Read a document as an outsider would and report what cannot be followed
argument-hint: [document name]
---

Use the `reader` agent on: $ARGUMENTS

Give it the document and nothing else. It must not read the vault, and it must not be told anything about the project that is not in the file.

Report what a clever reader with no specialist background could not follow: terms used before they are defined, mechanisms relied on before they are explained, sentences that assume vault knowledge, missing steps, numbers with no stated basis, and any Obsidian syntax that would paste into Word as literal text. Name the gaps; do not supply the sentences.
