# Noctalia theme for Claude Code

`build.py` maps the [Noctalia](https://github.com/noctalia-dev/noctalia) palette onto Claude Code's theme keys and writes `~/.claude/themes/noctalia.json`. Claude's orange becomes the scheme's primary colour, and diff backgrounds are the terminal green and red mixed into the background. Claude Code watches its themes folder, so open sessions repaint on every scheme change.

## Setup

1. Copy `build.py` and `palette.json` to `~/.config/noctalia/templates/claude-code/`.
2. Register them as a Noctalia user template in `~/.config/noctalia/config.toml`, with your own home path:

   ```toml
   [theme.templates.user.claude_code]
   input_path  = "/home/YOU/.config/noctalia/templates/claude-code/palette.json"
   output_path = "/home/YOU/.cache/noctalia/claude-code-palette.json"
   post_hook   = "python3 /home/YOU/.config/noctalia/templates/claude-code/build.py"
   ```

3. Set `"theme": "custom:noctalia"` in `~/.claude/settings.json`.
4. Run `noctalia msg templates-apply`.

Override keys must exist in Claude Code's built-in theme, and colours must be `rgb(r,g,b)`. Anything else is silently dropped.
