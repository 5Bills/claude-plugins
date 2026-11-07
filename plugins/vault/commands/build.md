---
description: Clean a document of Obsidian syntax and report what is missing
argument-hint: [document name]
---

Use the `docs` agent on: $ARGUMENTS

Strip any Obsidian syntax that would paste into Word as literal text: wikilinks flattened, callout syntax removed, block references and markers deleted. Flag embeds rather than deleting them. Then report what is missing: a section not yet written, a fact with no source behind it, a heading with nothing under it.

Formatting only. Do not change a word.
