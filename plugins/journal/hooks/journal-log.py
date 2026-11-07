#!/usr/bin/env python3
"""Raw capture for a daily journal.

  journal-log.py prompt   UserPromptSubmit: append the prompt to <journal>/.log/YYYY-MM-DD.md
  journal-log.py reply    Stop: append Claude's last reply
  journal-log.py start    SessionStart: tell Claude which past days still need a journal entry

<journal> is $CLAUDE_JOURNAL_DIR if set, otherwise the current project. Set it
(in the env block of ~/.claude/settings.json) to keep one journal fed by every
project; each entry is labelled with the project it came from. `start` only
nags inside the journal project itself.
"""
import json, os, sys
from datetime import datetime
from pathlib import Path

PROJECT = Path(os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()).resolve()
JOURNAL_DIR = Path(os.path.expanduser(os.environ.get("CLAUDE_JOURNAL_DIR") or PROJECT)).resolve()
LOG = JOURNAL_DIR / ".log"
JOURNAL = JOURNAL_DIR / "Journal"


def append(who, text):
    now = datetime.now()
    LOG.mkdir(parents=True, exist_ok=True)
    with open(LOG / f"{now:%Y-%m-%d}.md", "a") as f:
        f.write(f"\n## {now:%H:%M:%S} {who} · {PROJECT.name}\n\n{text.strip()}\n")


def last_reply(hook):
    if hook.get("last_assistant_message"):
        return hook["last_assistant_message"]
    texts = []
    for line in Path(hook["transcript_path"]).read_text().splitlines():
        try:
            e = json.loads(line)
        except ValueError:
            continue
        content = (e.get("message") or {}).get("content")
        if e.get("type") == "user":
            if isinstance(content, str) or any(b.get("type") == "text" for b in content or []):
                texts = []
        elif e.get("type") == "assistant" and isinstance(content, list):
            texts += [b["text"] for b in content if b.get("type") == "text"]
    return texts[-1] if texts else ""


def start():
    if PROJECT != JOURNAL_DIR:
        return
    today = f"{datetime.now():%Y-%m-%d}"
    logged = {p.stem for p in LOG.glob("*.md")} if LOG.exists() else set()
    done = {p.stem for p in JOURNAL.glob("*.md")} if JOURNAL.exists() else set()
    missing = sorted(d for d in logged - done if d < today)
    if not missing:
        return
    msg = ("Journal entries missing for: " + ", ".join(missing) +
           ". Before anything else, tell the user and offer to write each one with /journal "
           "(oldest first).")
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "SessionStart",
                                             "additionalContext": msg}}))


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    hook = json.load(sys.stdin)
    if cmd == "prompt":
        append("You", hook.get("prompt", ""))
    elif cmd == "reply":
        if not hook.get("stop_hook_active"):
            append("Claude", last_reply(hook))
    elif cmd == "start":
        start()


main()
