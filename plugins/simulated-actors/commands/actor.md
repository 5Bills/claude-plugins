---
description: Talk live to one simulated actor, as rehearsal for the real conversation
argument-hint: [actor name]
---

Start a live session with the simulated actor: $ARGUMENTS. Follow the `simulated-actors` skill (`${CLAUDE_PLUGIN_ROOT}/skills/simulated-actors/SKILL.md`).

1. Assemble the actor's run file in the scratchpad, as `/panel` does. Instead of the decision question, end it with: "The person pitching has just sat down with you. Open as you would."
2. Run the `actor` agent with that file's path, and show the user its reply **verbatim**.
3. From then on, relay each of the user's messages to the same agent with SendMessage, **verbatim and with nothing added**, and show its reply verbatim. Do not coach either side mid-conversation. If the user speaks to you rather than to the actor, they will say so.
4. When the user says the conversation is over, send: "The conversation is over. Give your closing block." Add its closing block, dated, to the run log as a live session, with a blank "Real outcome".

After the session, separately and clearly labelled, give the user your own read: where the actor's answers rested on its profile, and where they did not.
