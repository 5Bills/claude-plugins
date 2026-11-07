---
description: Run the simulated actors as a panel and write a dated pre-mortem of the plan
argument-hint: [actors, or blank for all]
---

Run a panel of simulated actors on: $ARGUMENTS (blank means every actor in the roster that has a profile). Follow the `simulated-actors` skill (`${CLAUDE_PLUGIN_ROOT}/skills/simulated-actors/SKILL.md`) for where the roster, profiles, conditions and run log live.

1. **Assemble a run file per actor** in the scratchpad. It holds the profile note's text, minus frontmatter and `## Related`, so the briefing is the section headed "What they would be shown". Then add one question: the decision that actor is asked to make, taken from the roster. Add nothing else about the project. Anything the actor needs and cannot find is a finding.
2. **Run the `actor` agent once per actor, in parallel**, giving each its run file's path and nothing else.
3. **Write a dated entry** at the bottom of the run log:
   - a table with one row per actor: decision, likelihood, deciding reason, condition affected, and a blank "Real outcome" column;
   - then the pre-mortem: for each condition in the conditions note that the run bears on, the predicted outcome, its most likely failure, and what would change it (skip this if there is no conditions note);
   - then "Not in what they were shown", collected across actors, because those gaps are fixes to the pitch.
4. **Report to the user**: the predictions, the pre-mortem, and any actor who said yes for a reason that cannot be traced to its profile.

**A prediction is not evidence.** Do not change any condition's status because of a run.
