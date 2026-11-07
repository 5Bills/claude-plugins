---
name: simulated-actors
description: Method for pre-mortems by simulated people - investors, customers, partners, regulators, hires - played from researched profiles to predict where a plan fails before the real conversations. Use when setting up actor profiles, the roster or the run log, or when running /panel or /actor.
---

# Simulated actors

A pre-mortem for any plan that depends on other people saying yes: investors, customers, partners, a regulator, a first hire. Each of those people is simulated from a researched profile, so that a prediction of where the plan fails exists *before* the real conversations happen.

Used by the `actor` agent and the `/panel` and `/actor` commands.

## Where things live

Notes are found by name, so they can sit anywhere in the vault. CLAUDE.md can rename any of them.

| Note | Default name | Holds |
|---|---|---|
| Roster | `Actor roster.md` | the table below |
| Profiles | one note per actor, linked from the roster | see Profiles |
| Conditions | `Conditions.md` (optional) | what must hold for the plan to work |
| Run log | `Actor runs.md` | one dated entry per panel or live session |

## What it is, and what it is not

**A simulated answer is a prediction, never evidence.** Nothing in the plan changes status because a simulated actor said yes. It changes when the real person does.

Two dangers shape the design:

- **Agreement.** A model briefed by the people being judged tends to like them. Each actor therefore decides from its profile's base rates and criteria, not from the pitch's enthusiasm, and says when it is inferring rather than drawing on a source.
- **Omniscience.** No real person has read your notes. Each actor sees only what that person really would (the section headed "What they would be shown" in its profile), so what the pitch fails to say shows up as a finding.

**Every prediction is dated before the matching real conversation and scored after it.** An actor whose predictions keep matching reality earns more weight for the people who cannot easily be reached; one that misses gets its profile rebuilt.

## Profiles

One note per actor, linked from the roster. Each holds, from research rather than imagination:

- who this person is, what their job rewards, and what they are under pressure from;
- base rates: how often people in this role say yes to something like this;
- their decision criteria, in the order they apply them;
- **What they would be shown**: exactly the material this person would really see, and nothing more.

## The roster

A table in the roster note, one row per actor:

| Actor | Decides | Condition |
|---|---|---|
| [[Profile note]] | The one decision this person is asked to make | Which condition of the plan it bears on |

"Conditions" are the things that must hold for the plan to work, listed in the conditions note and numbered. The pre-mortem is organised by them.

## How to run it

**`/panel`, for the prediction.** For each actor, the main session assembles a run file in the scratchpad: the profile, and then the actor's decision from the roster. It runs the `actor` agent on each file in parallel. The results go into the run log, dated:

- a table of decisions, with likelihood bands and deciding reasons;
- a pre-mortem by condition;
- what each actor needed and was not shown.

`/panel broker angel` runs only those actors. A blank `/panel` runs every actor that has a profile.

**`/actor <name>`, for rehearsal.** The actor opens the conversation, and every message the user types is passed to it verbatim, as it would be heard in the room. When the user says the conversation is over, the actor gives its decision, which is logged as a live session.

**When to run a panel:**

- before a real conversation, so the prediction is on record first;
- after a change to the design or the pitch, to see whether anyone moves.

A run is not repeated to get a better answer. If a result disappoints, the pitch or the plan changes, not the run.

## Scoring

Each entry in the run log has a "Real outcome" column, filled in when the real conversation happens. A miss is read before the profile is touched: whether it came from a missing fact in the profile, a briefing richer or poorer than what the real person saw, or the actor being agreeable. Fix that, and only that.
