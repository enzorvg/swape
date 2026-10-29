#!/usr/bin/env bash
# PostToolUse hook (Edit|Write): format the file Claude just changed. Never blocks.
set -uo pipefail

file=$(jq -r '.tool_input.file_path // ""')
root="${CLAUDE_PROJECT_DIR:-.}"
[[ -f "$file" ]] || exit 0

case "$file" in
  "$root"/apps/api/*.py)
    uv run --quiet --directory "$root/apps/api" ruff format --quiet "$file" >/dev/null 2>&1 ;;
  *.ts | *.tsx | *.js | *.jsx | *.json | *.css | *.html | *.yml | *.yaml)
    (cd "$root" && pnpm exec prettier --write --ignore-unknown --log-level silent "$file") >/dev/null 2>&1 ;;
esac
exit 0
