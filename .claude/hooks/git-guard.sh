#!/usr/bin/env bash
# PreToolUse hook (Bash): enforces the Swape git rules before a command runs.
# Reads the tool call JSON on stdin; exit 2 blocks the call and shows stderr to Claude.
#
# Blocks: commit on main, push to main (or from main), force-push, --no-verify / commit -n,
# and `gh pr merge` without --auto (or with --admin).
set -uo pipefail

input=$(cat)
cmd=$(jq -r '.tool_input.command // ""' <<<"$input")
cwd=$(jq -r '.cwd // "."' <<<"$input")
next_branch="" # branch selected earlier in the same command (the hook runs before it executes)

block() {
  echo "git-guard: $1" >&2
  echo "See CLAUDE.md (Règles d'or). Ask your human if you think this is a mistake." >&2
  exit 2
}

current_branch() {
  if [[ -n "$next_branch" ]]; then
    echo "$next_branch"
  else
    git -C "$cwd" branch --show-current 2>/dev/null || true
  fi
}

# Git global options that take a separate value: `git -C dir`, `git -c key=value`.
check_git() {
  local -a words=("$@")
  local i=1 sub=""
  while ((i < ${#words[@]})); do
    case "${words[i]}" in
      -C) cwd="${words[i + 1]:-$cwd}"; ((i += 2)) ;;
      -c | --git-dir | --work-tree | --namespace) ((i += 2)) ;;
      -*) ((i += 1)) ;;
      *) sub="${words[i]}"; break ;;
    esac
  done
  local -a args=("${words[@]:i+1}")

  local a
  for a in "${args[@]}"; do
    [[ "$a" == "--no-verify" ]] && block "--no-verify is forbidden: fix what the pre-commit hooks report instead."
  done

  case "$sub" in
    switch | checkout)
      local j=0
      while ((j < ${#args[@]})); do
        case "${args[j]}" in
          -c | -C | -b | -B) next_branch="${args[j + 1]:-}"; return ;;
          --) ((j += 1)) ;;
          -*) ((j += 1)) ;;
          *) next_branch="${args[j]}"; return ;;
        esac
      done
      ;;
    commit)
      for a in "${args[@]}"; do
        [[ "$a" =~ ^-[a-zA-Z]*n[a-zA-Z]*$ ]] && block "'git commit -n' skips the hooks (same as --no-verify): forbidden."
      done
      [[ "$(current_branch)" == "main" ]] &&
        block "never commit on main. Create a branch for your issue: git switch -c <type>/<issue>-<slug>"
      ;;
    push)
      for a in "${args[@]}"; do
        case "$a" in
          --force | --force-with-lease* | --force-if-includes | --mirror | +*)
            block "force-push is forbidden. Rebase, then push normally; if the push is rejected, ask your human." ;;
          --*) ;;
          -*f*) block "force-push is forbidden. Rebase, then push normally; if the push is rejected, ask your human." ;;
          main | *:main | refs/heads/main | *:refs/heads/main)
            block "never push to main: open a pull request (/ship)." ;;
        esac
      done
      [[ "$(current_branch)" == "main" ]] &&
        block "you are on main: pushing from main is forbidden. Work on an issue branch."
      ;;
  esac
}

check_gh() {
  local joined=" $* "
  if [[ "$joined" =~ [[:space:]]pr[[:space:]]+merge[[:space:]] ]]; then
    [[ "$joined" == *" --admin "* ]] && block "'gh pr merge --admin' bypasses branch protection: forbidden."
    [[ "$joined" != *" --auto "* ]] &&
      block "merge only with 'gh pr merge <n> --squash --auto --delete-branch' (merges when CI is green)."
  fi
}

# Check each part of a compound command on its own.
while IFS= read -r part; do
  read -ra words <<<"$part" || true
  # Skip leading VAR=value assignments and harmless wrappers.
  while ((${#words[@]} > 0)) && [[ "${words[0]}" =~ ^[A-Za-z_][A-Za-z0-9_]*=|^(command|builtin|time|nohup|env)$ ]]; do
    words=("${words[@]:1}")
  done
  ((${#words[@]} == 0)) && continue

  case "${words[0]}" in
    cd)
      target="${words[1]:-$HOME}"
      target="${target%\"}"; target="${target#\"}"
      [[ "$target" = /* ]] && cwd="$target" || cwd="$cwd/$target"
      ;;
    git) check_git "${words[@]}" ;;
    gh) check_gh "${words[@]}" ;;
  esac
done < <(sed -E 's/(&&|\|\||;|\||\$\(|\(|\)|`)/\n/g' <<<"$cmd")

exit 0
