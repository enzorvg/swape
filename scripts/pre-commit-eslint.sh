#!/usr/bin/env bash
# Run ESLint on staged files, from the workspace package that owns each file
# (each package has its own eslint.config.js and tsconfig).
set -euo pipefail

status=0
for pkg in $(printf '%s\n' "$@" | cut -d/ -f1-2 | sort -u); do
  printf '%s\n' "$@" | grep "^$pkg/" | sed "s|^$pkg/||" |
    (cd "$pkg" && xargs pnpm exec eslint --max-warnings=0 --no-warn-ignored) || status=1
done
exit $status
