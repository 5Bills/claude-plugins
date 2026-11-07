#!/bin/sh
# PreToolUse hook: refuses any Edit/Write inside the project's source folders,
# the ones that hold primary text verbatim (your own answers, statute, quotes,
# transcripts). They are authoritative because they are unaltered, so an edit
# destroys the thing that makes them worth having.
#
# List the folders in .claude/protected-paths, one per line, relative to the
# project root (e.g. "Sources" or "(1) Primary sources"). Blank lines and lines
# starting with # are ignored. No file, no protection.

root="${CLAUDE_PROJECT_DIR:-$PWD}"
list="$root/.claude/protected-paths"
[ -f "$list" ] || exit 0

path=$(python3 -c 'import sys,json
try:
    print(json.load(sys.stdin).get("tool_input", {}).get("file_path", ""))
except Exception:
    print("")' 2>/dev/null)
[ -n "$path" ] || exit 0
rel=${path#"$root"/}

while IFS= read -r dir || [ -n "$dir" ]; do
  case "$dir" in ''|'#'*) continue ;; esac
  dir=${dir%/}
  case "$rel" in
    "$dir"/*)
      echo "Blocked: '$path' is inside '$dir', a protected source folder (.claude/protected-paths)." >&2
      echo "Source folders hold primary text verbatim. Cite them, do not change them." >&2
      exit 2 ;;
  esac
done < "$list"
exit 0
