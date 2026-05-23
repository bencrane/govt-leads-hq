#!/usr/bin/env bash
# platform-app-winners-rebuild-on-primitives benchmark
#
# Run from the govt-leads-hq repo root. Computes the acceptance-test pass
# rate for the 14 success criteria in
# `~/Desktop/hq/directives/2026-05-23-platform-app-winners-rebuild-on-primitives.md`.
#
# Outputs ONE LINE on stdout in the form:
#
#   PASS_RATE=0.857 PASSED=12 TOTAL=14 NONNEG_FAILED=<id-or-none>
#   T1=ok T2=ok T3=fail T4=ok T5=ok T6=ok T7=ok T8=ok T9=ok T10=ok T11=ok T12=ok T13=ok T14=ok
#   INLINE_STYLES=0 LOC_TOTAL=587 HANDROLLED_CONTROLS=0
#
# Exit code is always 0 unless the script itself errors.
#
# Tests (14 total):
#   1.  winners-browser-spec-8-of-8        — all 8 tests in e2e/winners-browser.spec.ts pass (NON-NEGOTIABLE)
#   2.  winners-people-drawer-spec-7-of-7  — all 7 tests in e2e/winners-people-drawer.spec.ts pass (NON-NEGOTIABLE)
#   3.  zero-inline-styles                 — grep -roE 'style=\{\{' apps/platform-app/src/winners/*.tsx | wc -l == 0
#   4.  zero-handrolled-controls           — grep -roE '<(select|table)\b' apps/platform-app/src/winners/*.tsx | wc -l == 0
#   5.  loc-budget                         — wc -l Winners.tsx + PeopleSection.tsx <= 600
#   6.  drawer-uses-radix-dialog           — grep 'Drawer' in Winners.tsx AND no '<div.*position.*fixed' inline-style drawer
#   7.  multiselect-replaces-scrollbox     — grep -c 'MultiSelect' Winners.tsx >= 5
#   8.  datatable-replaces-handrolled      — grep -c 'DataTable' Winners.tsx >= 1
#   9.  platform-app-typecheck             — bun run --filter platform-app typecheck
#   10. marketing-site-typecheck           — bun run --filter marketing-site typecheck (regression guard)
#   11. ui-package-typecheck               — bun run --filter @govt-leads-hq/ui typecheck (regression guard)
#   12. workspace-lint                     — bun run lint OR error count <= predecessor baseline (46)
#   13. storybook-a11y-still-clean         — bun run --filter @govt-leads-hq/ui test:a11y (regression guard)
#   14. no-route-geometry-rule-still-passes — bun x eslint 'apps/*/src/routes/**/*.tsx' exits 0
#
# Non-negotiable tests (must pass or cycle fails): #1, #2
# Allowed-to-miss-up-to-two-of: #5, #6, #7, #8, #12

set -u
WORKTREE_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
_GIT_FILE="$WORKTREE_ROOT/.git"
if [ -f "$_GIT_FILE" ]; then
  _GITDIR_LINE="$(head -1 "$_GIT_FILE")"
  _GITDIR="${_GITDIR_LINE#gitdir: }"
  CANONICAL_ROOT="${_GITDIR%/.git/worktrees/*}"
else
  CANONICAL_ROOT="$WORKTREE_ROOT"
fi
cd "$WORKTREE_ROOT" || exit 2

BUN="${BUN:-$(command -v bun)}"
WINNERS_DIR="$WORKTREE_ROOT/apps/platform-app/src/winners"
WINNERS_TSX="$WINNERS_DIR/Winners.tsx"
PEOPLE_TSX="$WINNERS_DIR/PeopleSection.tsx"
LINT_BASELINE=46

PASSED=0
TOTAL=14
NONNEG_FAILED="none"

T1=fail; T2=fail; T3=fail; T4=fail; T5=fail; T6=fail; T7=fail
T8=fail; T9=fail; T10=fail; T11=fail; T12=fail; T13=fail; T14=fail

mark_pass() {
  PASSED=$((PASSED + 1))
  case "$1" in
    1) T1=ok ;;  2) T2=ok ;;  3) T3=ok ;;  4) T4=ok ;;  5) T5=ok ;;
    6) T6=ok ;;  7) T7=ok ;;  8) T8=ok ;;  9) T9=ok ;;  10) T10=ok ;;
    11) T11=ok ;; 12) T12=ok ;; 13) T13=ok ;; 14) T14=ok ;;
  esac
}
mark_nonneg_fail() {
  if [ "$NONNEG_FAILED" = "none" ]; then
    NONNEG_FAILED="$1"
  else
    NONNEG_FAILED="$NONNEG_FAILED,$1"
  fi
}

# ── 1. winners-browser-spec-8-of-8 (NON-NEGOTIABLE) ──
PW_FILE_BROWSER="$(mktemp -t pw-browser.XXXX.json)"
trap 'rm -f "$PW_FILE_BROWSER" "$PW_FILE_DRAWER"' EXIT
PW_BROWSER_PASS=0
if [ -f "e2e/winners-browser.spec.ts" ]; then
  "$BUN" x playwright test \
    --config=e2e/playwright.config.ts \
    --reporter=json \
    e2e/winners-browser.spec.ts \
    > "$PW_FILE_BROWSER" 2>/dev/null || true
  PW_BROWSER_PASS=$(grep -oE '"status"[[:space:]]*:[[:space:]]*"(passed|expected)"' "$PW_FILE_BROWSER" 2>/dev/null | wc -l | tr -d ' ')
  PW_BROWSER_PASS=${PW_BROWSER_PASS:-0}
fi
if [ "$PW_BROWSER_PASS" -ge 8 ]; then
  mark_pass 1
else
  mark_nonneg_fail 1
fi

# ── 2. winners-people-drawer-spec-7-of-7 (NON-NEGOTIABLE) ──
PW_FILE_DRAWER="$(mktemp -t pw-drawer.XXXX.json)"
PW_DRAWER_PASS=0
if [ -f "e2e/winners-people-drawer.spec.ts" ]; then
  "$BUN" x playwright test \
    --config=e2e/playwright.config.ts \
    --reporter=json \
    e2e/winners-people-drawer.spec.ts \
    > "$PW_FILE_DRAWER" 2>/dev/null || true
  PW_DRAWER_PASS=$(grep -oE '"status"[[:space:]]*:[[:space:]]*"(passed|expected)"' "$PW_FILE_DRAWER" 2>/dev/null | wc -l | tr -d ' ')
  PW_DRAWER_PASS=${PW_DRAWER_PASS:-0}
fi
if [ "$PW_DRAWER_PASS" -ge 7 ]; then
  mark_pass 2
else
  mark_nonneg_fail 2
fi

# ── 3. zero-inline-styles ──
INLINE_STYLES=0
if [ -d "$WINNERS_DIR" ]; then
  INLINE_STYLES=$(grep -roE 'style=\{\{' "$WINNERS_DIR"/*.tsx 2>/dev/null | wc -l | tr -d ' ')
  INLINE_STYLES=${INLINE_STYLES:-0}
fi
if [ "$INLINE_STYLES" -eq 0 ]; then
  mark_pass 3
fi

# ── 4. zero-handrolled-controls ──
HANDROLLED=0
if [ -d "$WINNERS_DIR" ]; then
  HANDROLLED=$(grep -roE '<(select|table)\b' "$WINNERS_DIR"/*.tsx 2>/dev/null | wc -l | tr -d ' ')
  HANDROLLED=${HANDROLLED:-0}
fi
if [ "$HANDROLLED" -eq 0 ]; then
  mark_pass 4
fi

# ── 5. loc-budget ──
LOC_TOTAL=0
if [ -f "$WINNERS_TSX" ] && [ -f "$PEOPLE_TSX" ]; then
  W_LOC=$(wc -l < "$WINNERS_TSX" | tr -d ' ')
  P_LOC=$(wc -l < "$PEOPLE_TSX" | tr -d ' ')
  LOC_TOTAL=$((W_LOC + P_LOC))
fi
if [ "$LOC_TOTAL" -gt 0 ] && [ "$LOC_TOTAL" -le 600 ]; then
  mark_pass 5
fi

# ── 6. drawer-uses-radix-dialog ──
DRAWER_OK=0
if [ -f "$WINNERS_TSX" ]; then
  if grep -q '\bDrawer\b' "$WINNERS_TSX" 2>/dev/null; then
    # Check no inline-style fixed-position drawer remains.
    # The pattern matches `position: "fixed"` (with quotes, in inline style).
    if ! grep -qE 'position:\s*["'\'']fixed["'\'']' "$WINNERS_TSX" 2>/dev/null; then
      DRAWER_OK=1
    fi
  fi
fi
if [ "$DRAWER_OK" = "1" ]; then
  mark_pass 6
fi

# ── 7. multiselect-replaces-scrollbox ──
MS_COUNT=0
if [ -f "$WINNERS_TSX" ]; then
  MS_COUNT=$(grep -c 'MultiSelect' "$WINNERS_TSX" 2>/dev/null | tr -d ' ')
  MS_COUNT=${MS_COUNT:-0}
fi
if [ "$MS_COUNT" -ge 5 ]; then
  mark_pass 7
fi

# ── 8. datatable-replaces-handrolled ──
DT_COUNT=0
if [ -f "$WINNERS_TSX" ]; then
  DT_COUNT=$(grep -c 'DataTable' "$WINNERS_TSX" 2>/dev/null | tr -d ' ')
  DT_COUNT=${DT_COUNT:-0}
fi
if [ "$DT_COUNT" -ge 1 ]; then
  mark_pass 8
fi

# ── 9. platform-app-typecheck ──
if (cd "$CANONICAL_ROOT" && "$BUN" run --filter platform-app typecheck >/dev/null 2>&1); then
  mark_pass 9
fi

# ── 10. marketing-site-typecheck ──
if (cd "$CANONICAL_ROOT" && "$BUN" run --filter marketing-site typecheck >/dev/null 2>&1); then
  mark_pass 10
fi

# ── 11. ui-package-typecheck ──
if (cd "$CANONICAL_ROOT" && "$BUN" run --filter @govt-leads-hq/ui typecheck >/dev/null 2>&1); then
  mark_pass 11
fi

# ── 12. workspace-lint (PASS if clean OR error count <= predecessor baseline 46) ──
LINT_OK=0
if (cd "$CANONICAL_ROOT" && "$BUN" run lint >/dev/null 2>&1); then
  LINT_OK=1
else
  # Compare error count to baseline.
  LINT_OUT="$(mktemp -t lint.XXXX.txt)"
  (cd "$CANONICAL_ROOT" && "$BUN" run lint > "$LINT_OUT" 2>&1) || true
  ERR_COUNT=$(grep -cE '(error|✖)' "$LINT_OUT" 2>/dev/null | tr -d ' ')
  ERR_COUNT=${ERR_COUNT:-9999}
  if [ "$ERR_COUNT" -le "$LINT_BASELINE" ]; then
    LINT_OK=1
  fi
  rm -f "$LINT_OUT"
fi
if [ "$LINT_OK" = "1" ]; then
  mark_pass 12
fi

# ── 13. storybook-a11y-still-clean ──
if (cd "$CANONICAL_ROOT" && "$BUN" run --filter @govt-leads-hq/ui test:a11y >/dev/null 2>&1); then
  mark_pass 13
fi

# ── 14. no-route-geometry-rule-still-passes ──
# winners/ is exempt from rule (rule glob is /apps/*/src/routes/).
# Test asserts marketing-site routes still pass lint (existing baseline PASS).
if (cd "$CANONICAL_ROOT" && "$BUN" x eslint 'apps/*/src/routes/**/*.tsx' >/dev/null 2>&1); then
  mark_pass 14
fi

# Compute pass rate.
RATE=$(awk -v p="$PASSED" -v t="$TOTAL" 'BEGIN{ printf "%.3f", p / t }')

echo "PASS_RATE=$RATE PASSED=$PASSED TOTAL=$TOTAL NONNEG_FAILED=$NONNEG_FAILED T1=$T1 T2=$T2 T3=$T3 T4=$T4 T5=$T5 T6=$T6 T7=$T7 T8=$T8 T9=$T9 T10=$T10 T11=$T11 T12=$T12 T13=$T13 T14=$T14 INLINE_STYLES=$INLINE_STYLES LOC_TOTAL=$LOC_TOTAL HANDROLLED_CONTROLS=$HANDROLLED"
