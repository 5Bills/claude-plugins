---
description: First-run interview that builds Profile.md, so Claude knows who it is working for
---

Interview the user to build `Profile.md` in this project. If `Profile.md` already exists, read it first and only ask about gaps.

Cover these areas, one at a time, with a few questions each. Wait for their answers before moving on, and let them skip anything:

1. **Basics**: who they are, daily routine, what a normal week looks like.
2. **People** `#people`: family, friends, anyone important or difficult. Create a note for each person they name.
3. **Health** `#health`: sleep, exercise, food, anything they want tracked.
4. **Money and admin** `#money` `#admin`: the shape of their finances at a level they're comfortable with, recurring bills and deadlines, tasks hanging over them.
5. **Mood** `#mood`: what they're like when things go well and badly, what they want Claude to watch for.
6. **Goals and values**: what they're aiming at. If they keep their own writing about this, link it and never edit it.

Ask only what they're happy to put in a plain file on disk. When done, draft `Profile.md` with sections per area and `[[wikilinks]]` to the people notes, show it, and write it once they agree.
