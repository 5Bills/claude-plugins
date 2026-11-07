---
description: Write or redo a day's journal entry from the raw log
argument-hint: "[YYYY-MM-DD, default today]"
---

Write the journal entry for $ARGUMENTS (today if blank).

1. Read the raw log for that day: `<journal dir>/.log/<date>.md`, where the journal dir is `$CLAUDE_JOURNAL_DIR` if set, otherwise this project. Each entry is headed with the time, who spoke, and the project it came from.
2. Write `<journal dir>/Journal/<date>.md`. If CLAUDE.md has a Journal section, follow it. Otherwise:
   - frontmatter with `created: <date>` and tags for the day's themes;
   - a short first-person narrative of the day, in the user's voice, saying what happened and what was decided, not what Claude did;
   - `## Timeline`: the day's work in order, one line each;
   - `## Progress`: one subsection per project that logged to it, saying what moved forward;
   - `[[wikilinks]]` to notes that were created or changed.
3. If the entry already exists, show what you would change and ask before overwriting.

The raw log holds everything typed that day. Leave out anything that reads as private to a third party, and never copy a password, key or token into the entry.
