#!/usr/bin/env python3
"""Turn the Noctalia palette (rendered by the claude-code user template) into a
Claude Code custom theme at ~/.claude/themes/noctalia.json.

Run by the template's post_hook on every colour-scheme change; Claude Code
watches its themes folder, so open sessions repaint live.
"""
import json
import os
import sys

HOME = os.path.expanduser("~")
SRC = sys.argv[1] if len(sys.argv) > 1 else f"{HOME}/.cache/noctalia/claude-code-palette.json"
DST = f"{HOME}/.claude/themes/noctalia.json"

p = json.load(open(SRC))


def rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    """a blended toward b by t (0 = a, 1 = b)."""
    a, b = rgb(a) if isinstance(a, str) else a, rgb(b) if isinstance(b, str) else b
    return tuple(round(x + (y - x) * t) for x, y in zip(a, b))


def css(c):
    c = rgb(c) if isinstance(c, str) else c
    return "rgb(%d,%d,%d)" % c


bg, fg = p["terminal_background"], p["terminal_foreground"]
red, green, yellow = p["terminal_normal_red"], p["terminal_normal_green"], p["terminal_normal_yellow"]
blue, magenta, cyan = p["terminal_normal_blue"], p["terminal_normal_magenta"], p["terminal_normal_cyan"]
bred, bgreen, byellow = p["terminal_bright_red"], p["terminal_bright_green"], p["terminal_bright_yellow"]
bblue, bmagenta, bcyan = p["terminal_bright_blue"], p["terminal_bright_magenta"], p["terminal_bright_cyan"]
accent = p["primary"]
orange = mix(red, yellow, 0.45)

lum = sum(w * v for w, v in zip((0.2126, 0.7152, 0.0722), rgb(bg))) / 255
base = "dark" if lum < 0.5 else "light"

o = {
    # Claude's own colour is the Noctalia accent
    "claude": accent,
    "claudeShimmer": mix(accent, fg, 0.3),
    "clawd_body": accent,
    "clawd_background": bg,
    "briefLabelClaude": accent,
    "briefLabelYou": blue,
    # text
    "text": fg,
    "inverseText": bg,
    "inactive": mix(fg, bg, 0.4),
    "inactiveShimmer": mix(fg, bg, 0.15),
    "subtle": mix(fg, bg, 0.7),
    "promptBorder": p["outline"],
    "promptBorderShimmer": p["on_surface_variant"],
    # modes and prompts
    "autoAccept": magenta,
    "autoAcceptShimmer": bmagenta,
    "skill": magenta,
    "merged": magenta,
    "effortUltra": magenta,
    "bashBorder": p["tertiary"],
    "planMode": cyan,
    "ide": blue,
    "background": cyan,
    "permission": blue,
    "permissionShimmer": bblue,
    "suggestion": blue,
    "remember": blue,
    "claudeBlue_FOR_SYSTEM_SPINNER": blue,
    "claudeBlueShimmer_FOR_SYSTEM_SPINNER": bblue,
    "rate_limit_fill": accent,
    "rate_limit_empty": mix(accent, bg, 0.7),
    "fastMode": orange,
    "fastModeShimmer": mix(orange, fg, 0.3),
    # status
    "success": green,
    "error": red,
    "warning": p["secondary"],
    "warningShimmer": mix(p["secondary"], fg, 0.3),
    # diffs: tinted backgrounds, brighter for the changed words
    "diffAdded": mix(green, bg, 0.72),
    "diffRemoved": mix(red, bg, 0.72),
    "diffAddedDimmed": mix(green, bg, 0.85),
    "diffRemovedDimmed": mix(red, bg, 0.85),
    "diffAddedWord": mix(green, bg, 0.4),
    "diffRemovedWord": mix(red, bg, 0.4),
    # surfaces
    "userMessageBackground": mix(fg, bg, 0.9),
    "userMessageBackgroundHover": mix(fg, bg, 0.84),
    "composerSidebarBackground": mix(fg, bg, 0.94),
    "selectionBg": p["terminal_selection_bg"],
    "bashMessageBackgroundColor": mix(p["tertiary"], bg, 0.88),
    "memoryBackgroundColor": mix(cyan, bg, 0.88),
    # subagents
    "red_FOR_SUBAGENTS_ONLY": red,
    "blue_FOR_SUBAGENTS_ONLY": blue,
    "green_FOR_SUBAGENTS_ONLY": green,
    "yellow_FOR_SUBAGENTS_ONLY": yellow,
    "purple_FOR_SUBAGENTS_ONLY": magenta,
    "orange_FOR_SUBAGENTS_ONLY": orange,
    "pink_FOR_SUBAGENTS_ONLY": mix(magenta, red, 0.5),
    "cyan_FOR_SUBAGENTS_ONLY": cyan,
    "professionalBlue": blue,
    "chromeYellow": yellow,
    # rainbow (ultrathink etc.)
    "rainbow_red": red, "rainbow_red_shimmer": bred,
    "rainbow_orange": orange, "rainbow_orange_shimmer": mix(orange, fg, 0.3),
    "rainbow_yellow": yellow, "rainbow_yellow_shimmer": byellow,
    "rainbow_green": green, "rainbow_green_shimmer": bgreen,
    "rainbow_blue": blue, "rainbow_blue_shimmer": bblue,
    "rainbow_indigo": mix(blue, magenta, 0.5), "rainbow_indigo_shimmer": mix(bblue, bmagenta, 0.5),
    "rainbow_violet": magenta, "rainbow_violet_shimmer": bmagenta,
}

theme = {"name": "Noctalia", "base": base, "overrides": {k: css(v) for k, v in o.items()}}
text = json.dumps(theme, indent=2) + "\n"
try:
    if open(DST).read() == text:
        sys.exit(0)
except FileNotFoundError:
    pass
os.makedirs(os.path.dirname(DST), exist_ok=True)
tmp = DST + ".tmp"
open(tmp, "w").write(text)
os.replace(tmp, DST)
