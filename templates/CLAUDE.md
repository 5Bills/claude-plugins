# <Vault name>

<!-- Copy this into your vault's CLAUDE.md and fill it in. The vault plugin's
     agents read the vault map; the review agents use it to know which folders
     are primary sources. Delete any row you don't use. -->

## Vault map

| Role | Folder | Notes |
|---|---|---|
| Sources | `Sources/` | Primary text kept verbatim: your own answers, statute, quotes, transcripts. Never edited, never reasoned over as claims. Also list these in `.claude/protected-paths`. |
| Rough notes | `Inbox/` | Your own unpolished thinking. Claude edits only when asked, and marks `ai: edited`. |
| Notes | `Notes/` | Worked-out notes, one topic each. Where `scribe` writes. |
| Plans | `Plans/` | Section-by-section plans for documents. Joint: Claude may write, marks `ai: edited`. |
| Documents | `Documents/` | Finished documents that leave the vault (pasted into Word). Written by you; `docs` cleans formatting only. |

Document tag: `document`

## House style

<!-- Optional. scribe follows these over its defaults. -->

- Dates: ISO `2026-01-31` in frontmatter and prose.
- Tags: kebab-case.

## Journal

<!-- Optional, for the journal plugin. /journal follows this over its default format. -->
