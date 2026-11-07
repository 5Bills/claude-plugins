# Claude Code plugins for careful research and writing

A Claude Code plugin marketplace. The core is a set of subagents for working through a hard question in an Obsidian vault: finding sources, writing notes, auditing the reasoning, and checking that a finished document can be followed by someone who wasn't there. Around it are a few smaller plugins: a daily journal, read-aloud, and a usage band.

The agents share one stance: **report, don't rewrite.** Reviewers grade problems and name gaps; the words stay yours. When an agent is unsure what you meant, it ends its report with a question (options, each with what it costs) instead of guessing.

## Install

```
/plugin marketplace add 5Bills/claude-plugins
/plugin install review@5bills
```

Install the others the same way: `vault@5bills`, `simulated-actors@5bills`, `journal@5bills`, `read-aloud@5bills`, `vitals@5bills`. To use a plugin in one vault only, install it with project scope (`claude plugin install review@5bills --scope project`).

## Plugins

### review: reviewers that never rewrite

| | What it checks | Model |
|---|---|---|
| `/audit` | Does the conclusion follow from the stated premises? Each finding is graded **wrong**, **likely wrong** or **merely unproven**, then a separate list of what wasn't considered. Also runs on its own when you state a plan. | Opus |
| `/critique` | How your prose reads: sentence variation, density, flab, hedges, register drift, machine-written tells. Quotes the line, names the tell, leaves the fix to you. | Opus |
| `/reader` | Reads one document as a clever outsider: no other files, no project instructions, no search. Reports every term, mechanism or leap they couldn't follow. | Opus |
| `/haeden` | A deep audit against [HAEDENISM](plugins/review/skills/haedenism/SKILL.md), a method of argument in which every link must be forced by the one before. Expensive (Opus at max effort), so it only runs on request. | Opus |

The `haedenism` skill is also usable on its own: ask Claude to "derive this Haedenistically".

### vault: an Obsidian research vault

| | What it does | Model |
|---|---|---|
| `/research` | Finds facts with sources, vault first, then the web. Quotes primary text rather than paraphrasing, and says plainly when the vault doesn't establish something. | Sonnet |
| `/note` | `scribe` turns what's been established into notes: one topic each, linked where the relationship is used, and shown to you before every write. | Sonnet |
| `/tidy` | `librarian` splits long notes, keeps numbered folders consistent, moves rather than copies (so creation dates survive), and counts files before and after every batch. | Sonnet |
| `/build` | `docs` strips Obsidian syntax from a finished document before it's pasted into Word, flags embeds instead of deleting them, and lists what's missing. | Sonnet |

It also ships a hook that makes your **source folders read-only**: list them in `.claude/protected-paths`, one per line, and any Edit or Write inside them is refused.

### simulated-actors: pre-mortem a plan

Simulates the people who must say yes (an investor, a customer, a regulator, a first hire) from researched profiles, to predict where a plan fails before the real conversations. `/panel` runs every actor in parallel and writes a dated pre-mortem; `/actor <name>` lets you rehearse the conversation live. Actors decide from base rates and see only what the real person would see. A prediction is never treated as evidence. The method is in the [`simulated-actors` skill](plugins/simulated-actors/skills/simulated-actors/SKILL.md).

### journal: a daily journal from your sessions

Hooks append every prompt and reply to `.log/YYYY-MM-DD.md`; at session start Claude flags days that have a log but no entry, and `/journal` writes the entry. Set `CLAUDE_JOURNAL_DIR` (in the `env` block of `~/.claude/settings.json`) to feed one journal from every project; each entry is labelled with its project. `/interview` builds a `Profile.md` so Claude knows who it's working for.

The raw log holds everything you type, so keep the journal folder somewhere private.

### read-aloud: hear each reply

Speaks each reply with Microsoft Edge's neural voices via [edge-tts](https://github.com/rany2/edge-tts), skipping code, tables and URLs. A new prompt silences the old reply; `/read-aloud` toggles it. Needs `edge-tts` and `ffplay` (ffmpeg) on your PATH. Set the voice with `CLAUDE_SPEAK_VOICE` (see `edge-tts --list-voices`) and the speed with `CLAUDE_SPEAK_RATE` (e.g. `+10%`).

### vitals: a usage band

A band above the prompt with context fill, the 5-hour usage limit with a reset countdown, and session cost. Gauges change colour at 50% and 80% using the active theme's colours. On a narrow terminal it drops detail instead of wrapping.

## Set up a vault

The vault agents need to know which folder does what. Copy [`templates/CLAUDE.md`](templates/CLAUDE.md) into your vault's `CLAUDE.md` and fill in the vault map:

| Role | Purpose |
|---|---|
| Sources | primary text kept verbatim; cited, never edited or audited |
| Rough notes | your own thinking; edited only on request |
| Notes | worked-out notes, where `scribe` writes |
| Plans | joint document plans |
| Documents | finished documents, yours alone; `docs` touches formatting only |

Then list the source folders in `.claude/protected-paths`. Without a vault map, the agents ask before writing anything.

The review plugin needs none of this. It works on any text.

## Extras

[`extras/noctalia-theme`](extras/noctalia-theme) builds a Claude Code custom theme from the [Noctalia](https://github.com/noctalia-dev/noctalia) desktop shell's live palette, so Claude repaints whenever the desktop scheme changes. It isn't a plugin; see its README.

## Licence

MIT
