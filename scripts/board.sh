#!/usr/bin/env bash
# Swape board helper: edit and read the GitHub Project without handling GraphQL ids.
# Ids come from .github/project.json. Requires: gh (with the `project` scope), jq.
#
#   scripts/board.sh move <issue> <Status>              Status: Backlog | Todo | "In Progress" | "In Review" | Done | Blocked
#   scripts/board.sh set <issue> <Field> <Value>        Field: Status | Priority | Size | Area | Sprint | Reviewer | Files
#   scripts/board.sh get <issue>                        all board fields of one issue (JSON)
#   scripts/board.sh list [--status S] [--assignee @me|login] [--sprint "Sprint 0"] [--json]
#   scripts/board.sh conflicts <issue>                  In Progress / In Review tickets whose Files overlap this one
#
# An issue that is not on the board yet is added automatically by `move` and `set`.
set -euo pipefail

root=$(git rev-parse --show-toplevel)
config="$root/.github/project.json"
[[ -f "$config" ]] || { echo "board.sh: $config not found" >&2; exit 1; }

cfg() { jq -r "$1" "$config"; }
owner=$(cfg .owner)
repo=$(cfg .repo)
project_number=$(cfg .projectNumber)
project_id=$(cfg .projectId)

die() { echo "board.sh: $*" >&2; exit 1; }

usage() {
  sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
  exit 1
}

field_name() {
  local name
  name=$(jq -r --arg f "$1" '(.aliases[$f] // $f) as $n | .fields | keys[] | select(ascii_downcase == ($n | ascii_downcase))' "$config")
  [[ -n "$name" ]] || die "unknown field '$1' (known: $(jq -r '[.fields | keys[]] + [.aliases | keys[]] | join(", ")' "$config"))"
  echo "$name"
}

issue_number() {
  local n="${1#\#}"
  [[ "$n" =~ ^[0-9]+$ ]] || die "invalid issue number '$1'"
  echo "$n"
}

# Returns the project item id of an issue, adding the issue to the board if needed.
item_id() {
  local n
  n=$(issue_number "$1")
  gh project item-add "$project_number" --owner "$owner" \
    --url "https://github.com/$repo/issues/$n" --format json --jq .id
}

items_json() {
  gh project item-list "$project_number" --owner "$owner" --format json --limit 1000 |
    jq '[.items[] | select(.content.type == "Issue" and .content.repository == "'"$repo"'") | {
      number: .content.number,
      title: .content.title,
      status: (.status // ""),
      priority: (.priority // ""),
      size: (.size // ""),
      area: (.area // ""),
      sprint: (.sprint.title // ""),
      reviewer: (.relecteur // ""),
      assignees: (.assignees // []),
      files: (.files // "")
    }] | sort_by(.number)'
}

cmd_set() {
  (($# == 3)) || usage
  local n field value id field_id type option_id
  n=$(issue_number "$1")
  field=$(field_name "$2")
  value="$3"
  field_id=$(cfg ".fields[\"$field\"].id")
  type=$(cfg ".fields[\"$field\"].type")
  id=$(item_id "$n")

  case "$type" in
    SINGLE_SELECT)
      option_id=$(jq -r --arg f "$field" --arg v "$value" \
        '.fields[$f].options | to_entries[] | select((.key | ascii_downcase) == ($v | ascii_downcase)) | .value' "$config")
      [[ -n "$option_id" ]] || die "invalid $field '$value' (allowed: $(jq -r --arg f "$field" '.fields[$f].options | keys_unsorted | join(", ")' "$config"))"
      gh project item-edit --id "$id" --project-id "$project_id" --field-id "$field_id" \
        --single-select-option-id "$option_id" >/dev/null
      ;;
    TEXT)
      if [[ -z "$value" ]]; then
        gh project item-edit --id "$id" --project-id "$project_id" --field-id "$field_id" --clear >/dev/null
      else
        gh project item-edit --id "$id" --project-id "$project_id" --field-id "$field_id" --text "$value" >/dev/null
      fi
      ;;
    ITERATION)
      option_id=$(jq -r --arg f "$field" --arg v "$value" \
        '.fields[$f].iterations | to_entries[] | select((.key | ascii_downcase) == ($v | ascii_downcase)) | .value.id' "$config")
      [[ -n "$option_id" ]] || die "unknown sprint '$value' (known: $(jq -r --arg f "$field" '.fields[$f].iterations | keys_unsorted | join(", ")' "$config"); regenerate .github/project.json if a sprint was added)"
      gh project item-edit --id "$id" --project-id "$project_id" --field-id "$field_id" --iteration-id "$option_id" >/dev/null
      ;;
    *) die "unsupported field type $type" ;;
  esac
  echo "#$n: $field = $value"
}

cmd_get() {
  (($# == 1)) || usage
  local n
  n=$(issue_number "$1")
  items_json | jq --argjson n "$n" '.[] | select(.number == $n)' | grep . || die "#$n is not on the board"
}

cmd_list() {
  local status="" assignee="" sprint="" as_json=false
  while (($# > 0)); do
    case "$1" in
      --status) status="$2"; shift 2 ;;
      --assignee) assignee="$2"; shift 2 ;;
      --sprint) sprint="$2"; shift 2 ;;
      --json) as_json=true; shift ;;
      *) usage ;;
    esac
  done
  [[ "$assignee" == "@me" ]] && assignee=$(gh api user --jq .login)

  local filtered
  filtered=$(items_json | jq --arg s "$status" --arg a "$assignee" --arg sp "$sprint" '[.[]
    | select($s == "" or (.status | ascii_downcase) == ($s | ascii_downcase))
    | select($a == "" or (.assignees | index($a)))
    | select($sp == "" or (.sprint | ascii_downcase) == ($sp | ascii_downcase))]')

  if $as_json; then
    echo "$filtered"
  else
    jq -r '(["#", "STATUS", "PRIO", "SIZE", "AREA", "SPRINT", "ASSIGNEES", "REVIEWER", "TITLE", "FILES"] | @tsv),
      (.[] | ["#\(.number)", .status, .priority, .size, .area, .sprint, (.assignees | join(",")), .reviewer, .title, (.files | gsub("\n"; " ; "))] | @tsv)' <<<"$filtered" |
      column -t -s $'\t'
  fi
}

# Literal prefix of a glob: everything before the first wildcard character.
glob_prefix() { local p="$1"; echo "${p%%[\*\?\[\{]*}"; }

# Two Files patterns overlap if the literal prefix of one starts with the literal prefix of the other.
patterns_overlap() {
  local a b
  a=$(glob_prefix "$1")
  b=$(glob_prefix "$2")
  [[ "$a" == "$b"* || "$b" == "$a"* ]]
}

split_files() { tr ';,\n' '   ' <<<"$1" | tr -s ' ' '\n' | sed '/^$/d'; }

cmd_conflicts() {
  (($# == 1)) || usage
  local n all mine found=0
  n=$(issue_number "$1")
  all=$(items_json)
  mine=$(jq -r --argjson n "$n" '.[] | select(.number == $n) | .files' <<<"$all")
  [[ -n "$mine" ]] || die "#$n has no Files on the board: fill it before starting (scripts/board.sh set $n Files \"...\")"

  local -a my_patterns
  mapfile -t my_patterns < <(split_files "$mine")

  while IFS=$'\t' read -r other status assignees title files; do
    local -a their_patterns hits=()
    mapfile -t their_patterns < <(split_files "$files")
    for p in "${my_patterns[@]}"; do
      for q in "${their_patterns[@]}"; do
        patterns_overlap "$p" "$q" && hits+=("$p ~ $q")
      done
    done
    if ((${#hits[@]} > 0)); then
      found=1
      printf '#%s\t%s\t%s\t%s\t%s\n' "$other" "$status" "${assignees:--}" "$title" "$(IFS=';'; echo "${hits[*]}")"
    fi
  done < <(jq -r --argjson n "$n" '.[]
    | select(.number != $n and (.status == "In Progress" or .status == "In Review") and .files != "")
    | [.number, .status, (.assignees | join(",")), .title, (.files | gsub("\n"; ";"))] | @tsv' <<<"$all")

  ((found == 0)) && echo "#$n: no Files overlap with In Progress / In Review tickets."
  return 0
}

(($# > 0)) || usage
command="$1"
shift
case "$command" in
  move) (($# == 2)) || usage; cmd_set "$1" Status "$2" ;;
  set) cmd_set "$@" ;;
  get) cmd_get "$@" ;;
  list) cmd_list "$@" ;;
  conflicts) cmd_conflicts "$@" ;;
  -h | --help | help) usage ;;
  *) usage ;;
esac
