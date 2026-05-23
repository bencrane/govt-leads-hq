#!/usr/bin/env bash
# platform-app-people-drawer-layout-v2 benchmark
#
# Run from the govt-leads-hq repo root. Computes the acceptance-test pass
# rate for the people drawer + layout breathing room feature.
#
# Outputs ONE LINE on stdout in the form:
#
#   PASS_RATE=0.588 PASSED=10 TOTAL=17 CONSTRAINTS_PASSED=3 CONSTRAINTS_TOTAL=10
#   TYPECHECK=ok|fail MARKETING_TC=ok|fail EXISTING_WINNERS=<int>/8 NEW_TESTS=<int>/7
#
# Exit code is always 0 unless the script itself errors.
#
# Tests counted (17 total — granular view):
#   1. platform-app typecheck                   → constraint #9
#   2. marketing-site typecheck                 → constraint #10
#   3-10. Existing 8 winners-browser.spec.ts    → constraint #8
#   11-17. New 7 tests in winners-people-drawer.spec.ts or winners-layout.spec.ts
#
# Constraint rollup (10 constraints total):
#   #1  layout-has-breathing-room
#   #2  filters-sidebar-not-flush-left
#   #3  table-not-flush-right
#   #4  drawer-people-section-renders
#   #5  person-row-shape
#   #6  person-row-expands
#   #7  people-fixture-shape-matches-blitzapi
#   #8  existing-winners-tests-still-pass  (HARD — all 8 must pass)
#   #9  typecheck-clean-platform-app
#   #10 typecheck-clean-marketing-site

set -u
# Resolve worktree root (where spec files live).
WORKTREE_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# Resolve canonical repo root (where node_modules live for bun workspace).
# In a git worktree, .git is a file "gitdir: /canonical/.git/worktrees/wt-..."
# We derive the canonical root by stripping "/.git/worktrees/..." from the gitdir.
_GIT_FILE="$WORKTREE_ROOT/.git"
if [ -f "$_GIT_FILE" ]; then
  _GITDIR_LINE="$(head -1 "$_GIT_FILE")"  # "gitdir: /path/.git/worktrees/wt-..."
  _GITDIR="${_GITDIR_LINE#gitdir: }"
  # Strip /.git/worktrees/<name> → canonical .git parent
  CANONICAL_ROOT="${_GITDIR%/.git/worktrees/*}"
else
  CANONICAL_ROOT="$WORKTREE_ROOT"
fi
# Playwright runs from worktree root; typechecks from canonical root.
cd "$WORKTREE_ROOT" || exit 2

BUN="${BUN:-/Users/benjamincrane/.bun/bin/bun}"
PASSED=0
TOTAL=17
CONSTRAINTS_PASSED=0
CONSTRAINTS_TOTAL=10

TYPECHECK_PA="fail"
TYPECHECK_MS="fail"
PW_OLD_FILE="$(mktemp)"
PW_NEW_FILE="$(mktemp)"
trap 'rm -f "$PW_OLD_FILE" "$PW_NEW_FILE"' EXIT

# ── 1. platform-app typecheck (granular item 1, constraint #9) ──
# Run typecheck from canonical root to ensure full module resolution
if (cd "$CANONICAL_ROOT" && "$BUN" run --filter platform-app typecheck >/dev/null 2>&1); then
  PASSED=$((PASSED + 1))
  CONSTRAINTS_PASSED=$((CONSTRAINTS_PASSED + 1))
  TYPECHECK_PA="ok"
fi

# ── 2. marketing-site typecheck (granular item 2, constraint #10) ──
if (cd "$CANONICAL_ROOT" && "$BUN" run --filter marketing-site typecheck >/dev/null 2>&1); then
  PASSED=$((PASSED + 1))
  CONSTRAINTS_PASSED=$((CONSTRAINTS_PASSED + 1))
  TYPECHECK_MS="ok"
fi

# ── 3-10. Existing winners-browser.spec.ts (granular items 3-10, constraint #8) ──
EXISTING_PW=0
if [ -f "e2e/winners-browser.spec.ts" ]; then
  "$BUN" x playwright test \
    --config=e2e/playwright.config.ts \
    --reporter=json \
    e2e/winners-browser.spec.ts \
    > "$PW_OLD_FILE" 2>/dev/null || true

  RAW=$(grep -oE '"status"[[:space:]]*:[[:space:]]*"(passed|expected)"' "$PW_OLD_FILE" 2>/dev/null | wc -l | tr -d ' ')
  EXISTING_PW=${RAW:-0}
  if [ "$EXISTING_PW" -gt 8 ]; then EXISTING_PW=8; fi
  PASSED=$((PASSED + EXISTING_PW))
  if [ "$EXISTING_PW" -eq 8 ]; then
    CONSTRAINTS_PASSED=$((CONSTRAINTS_PASSED + 1))
  fi
fi

# ── 11-17. New acceptance tests (granular items 11-17, constraints #1-7) ──
NEW_PW=0
NEW_SPEC_COUNT=0

# Determine which new spec files exist
NEW_SPECS=""
if [ -f "e2e/winners-people-drawer.spec.ts" ]; then
  NEW_SPECS="$NEW_SPECS e2e/winners-people-drawer.spec.ts"
fi
if [ -f "e2e/winners-layout.spec.ts" ]; then
  NEW_SPECS="$NEW_SPECS e2e/winners-layout.spec.ts"
fi

if [ -n "$NEW_SPECS" ]; then
  # shellcheck disable=SC2086
  "$BUN" x playwright test \
    --config=e2e/playwright.config.ts \
    --reporter=json \
    $NEW_SPECS \
    > "$PW_NEW_FILE" 2>/dev/null || true

  RAW_NEW=$(grep -oE '"status"[[:space:]]*:[[:space:]]*"(passed|expected)"' "$PW_NEW_FILE" 2>/dev/null | wc -l | tr -d ' ')
  NEW_PW=${RAW_NEW:-0}
  if [ "$NEW_PW" -gt 7 ]; then NEW_PW=7; fi
  PASSED=$((PASSED + NEW_PW))

  # Count individual constraint passes by matching test titles in JSON output
  # Constraints #1-7 map to specific test titles
  CONSTRAINT_NAMES=(
    "layout-has-breathing-room"
    "filters-sidebar-not-flush-left"
    "table-not-flush-right"
    "drawer-people-section-renders"
    "person-row-shape"
    "person-row-expands"
    "people-fixture-shape-matches-blitzapi"
  )

  for cname in "${CONSTRAINT_NAMES[@]}"; do
    # Check if this test title appears with a "passed" or "expected" status
    # Look for the title in the JSON to find it and check status
    if grep -q "\"$cname\"" "$PW_NEW_FILE" 2>/dev/null; then
      # Extract a block around the title and check for passed status nearby
      # Simple heuristic: if title present and passed count > 0 overall
      CONSTRAINTS_PASSED=$((CONSTRAINTS_PASSED + 1))
    fi
  done
  # Reset constraint count for #1-7: re-count properly via pass count
  # Subtract the individual constraints we added and use the total new passes
  CONSTRAINTS_PASSED=$((CONSTRAINTS_PASSED - 7 + NEW_PW))
fi

# Compute pass rate as fraction with 3 decimals.
RATE=$(awk -v p="$PASSED" -v t="$TOTAL" 'BEGIN{ printf "%.3f", p / t }')

echo "PASS_RATE=$RATE PASSED=$PASSED TOTAL=$TOTAL CONSTRAINTS_PASSED=$CONSTRAINTS_PASSED CONSTRAINTS_TOTAL=$CONSTRAINTS_TOTAL TYPECHECK=$TYPECHECK_PA MARKETING_TC=$TYPECHECK_MS EXISTING_WINNERS=${EXISTING_PW}/8 NEW_TESTS=${NEW_PW}/7"
