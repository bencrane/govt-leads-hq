#!/usr/bin/env bash
# platform-app-primitives-foundation benchmark
#
# Run from the govt-leads-hq repo root. Computes the acceptance-test pass
# rate for the 13 success criteria in
# `~/Desktop/hq/directives/2026-05-23-platform-app-primitives-foundation.md`.
#
# Outputs ONE LINE on stdout in the form:
#
#   PASS_RATE=0.846 PASSED=11 TOTAL=13 NONNEG_FAILED=<id-or-none>
#   T1=ok T2=ok T3=fail T4=ok T5=ok T6=ok T7=ok T8=ok T9=ok T10=ok T11=ok T12=ok T13=ok
#
# Exit code is always 0 unless the script itself errors.
#
# Tests (13 total):
#   1.  ui-package-typecheck            — bun run --filter @govt-leads-hq/ui typecheck
#   2.  ui-package-build                — bun run --filter @govt-leads-hq/ui build
#   3.  ui-exports-surface              — dynamic import of @govt-leads-hq/ui asserts 38 named exports
#                                         (new Form/Display/Feedback/Motion/Interactive/Page-chrome)
#   4.  storybook-builds                — bun run --filter @govt-leads-hq/ui storybook:build
#                                         AND each new primitive has ≥1 story file token-match
#   5.  storybook-a11y-clean            — bun run --filter @govt-leads-hq/ui test:a11y (0 axe violations)
#                                         (script wired by executor using @storybook/test-runner + axe-playwright)
#   6.  eslint-rule-active              — bun run --filter eslint-plugin-govt-leads-hq test
#                                         AND `bun x eslint apps/*/src/routes/**/*.tsx` exits 0 (rule wired)
#   7.  workspace-typecheck             — bun run typecheck
#   8.  workspace-lint                  — bun run lint  (NOTE: baseline has 46 biome errors; executor must
#                                         either fix inherited debt or document a scoped lint command)
#   9.  winners-regression-guard        — all 8 winners-browser.spec.ts + all 7 winners-people-drawer.spec.ts pass
#                                         (NON-NEGOTIABLE per validator success threshold)
#   10. marketing-site-regression-guard — bun run --filter marketing-site typecheck
#                                         (NON-NEGOTIABLE per validator success threshold)
#   11. bundle-size-budget              — packages/ui dist ≤ 600KB raw (~200KB gzipped); SKIP-pass if no dist
#                                         (currently `build` is `tsc --noEmit` — executor adds real build)
#   12. primitive-uses-radix-audit      — ≥6 of packages/ui/src/*.tsx import @radix-ui/react-*
#   13. design-system-doc-exists        — docs/design-system.md ≥50 lines AND docs/design-decisions.md exists
#
# Non-negotiable tests (must pass or cycle fails): #9, #10
# Allowed-to-miss-one-of: #11, #12, #13

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
PASSED=0
TOTAL=13
NONNEG_FAILED="none"

T1=fail; T2=fail; T3=fail; T4=fail; T5=fail; T6=fail; T7=fail
T8=fail; T9=fail; T10=fail; T11=fail; T12=fail; T13=fail

mark_pass() {
  PASSED=$((PASSED + 1))
  case "$1" in
    1) T1=ok ;; 2) T2=ok ;; 3) T3=ok ;; 4) T4=ok ;; 5) T5=ok ;;
    6) T6=ok ;; 7) T7=ok ;; 8) T8=ok ;; 9) T9=ok ;; 10) T10=ok ;;
    11) T11=ok ;; 12) T12=ok ;; 13) T13=ok ;;
  esac
}
mark_nonneg_fail() {
  if [ "$NONNEG_FAILED" = "none" ]; then
    NONNEG_FAILED="$1"
  else
    NONNEG_FAILED="$NONNEG_FAILED,$1"
  fi
}

# ── 1. ui-package-typecheck ──
if (cd "$CANONICAL_ROOT" && "$BUN" run --filter @govt-leads-hq/ui typecheck >/dev/null 2>&1); then
  mark_pass 1
fi

# ── 2. ui-package-build ──
if (cd "$CANONICAL_ROOT" && "$BUN" run --filter @govt-leads-hq/ui build >/dev/null 2>&1); then
  mark_pass 2
fi

# ── 3. ui-exports-surface ──
# 38 required new primitive exports. The script dynamic-imports the package and
# asserts each name is present. We place the script INSIDE the repo (not /tmp)
# so bun resolves `@govt-leads-hq/ui` from the workspace.
EXPORTS_SCRIPT="$CANONICAL_ROOT/.scope-tmp-expsurface-$$.mjs"
trap 'rm -f "$EXPORTS_SCRIPT"' EXIT
cat > "$EXPORTS_SCRIPT" <<'EOF'
import('@govt-leads-hq/ui').then((m) => {
  const required = [
    // Form (12)
    'Field','Label','Input','Textarea','Select','MultiSelect','Combobox',
    'TagInput','NumberInput','DateRangePicker','Checkbox','FieldGroup','FormErrors',
    // Display (9)
    'Avatar','Stat','KVTable','DataTable','Pagination','Spinner','SectionLabel',
    'ScrollArea','CompanyLogo',
    // Feedback (5)
    'Drawer','Modal','Tooltip','Banner','Toast',
    // Motion (3)
    'AppearOnMount','FadeIn','SlideIn',
    // Interactive (4)
    'Tabs','TabList','Tab','TabPanel',
    // Page chrome (5)
    'PageHeader','PageBody','PageSection','PageActions','PageEmptyState'
  ];
  const missing = required.filter((k) => !(k in m));
  if (missing.length) { console.error('missing:', missing.join(',')); process.exit(1); }
  process.exit(0);
}).catch((e) => { console.error('import failed:', e.message); process.exit(2); });
EOF
if (cd "$CANONICAL_ROOT" && "$BUN" "$EXPORTS_SCRIPT" >/dev/null 2>&1); then
  mark_pass 3
fi

# ── 4. storybook-builds ──
# Build storybook + verify ≥1 story file per new primitive category.
SB_OK=1
if ! (cd "$CANONICAL_ROOT" && "$BUN" run --filter @govt-leads-hq/ui storybook:build >/dev/null 2>&1); then
  SB_OK=0
fi
# Each new category must have at least one *.stories.tsx file that mentions its primitives.
# We check by token presence in any story file under packages/ui/src/.
if [ "$SB_OK" = "1" ]; then
  STORIES_DIR="$WORKTREE_ROOT/packages/ui/src"
  STORY_FILES=$(find "$STORIES_DIR" -maxdepth 2 -name "*.stories.tsx" 2>/dev/null | tr '\n' ' ')
  CATEGORIES_OK=1
  for tok in "Field" "DataTable" "Drawer" "AppearOnMount" "Tabs" "PageHeader"; do
    if [ -n "$STORY_FILES" ]; then
      # shellcheck disable=SC2086
      if ! grep -l "$tok" $STORY_FILES >/dev/null 2>&1; then
        CATEGORIES_OK=0
      fi
    else
      CATEGORIES_OK=0
    fi
  done
  if [ "$CATEGORIES_OK" = "1" ]; then mark_pass 4; fi
fi

# ── 5. storybook-a11y-clean ──
# Executor wires `test:a11y` script. If absent OR exits non-zero, criterion fails.
if (cd "$CANONICAL_ROOT" && "$BUN" run --filter @govt-leads-hq/ui test:a11y >/dev/null 2>&1); then
  mark_pass 5
fi

# ── 6. eslint-rule-active ──
# Plugin unit tests pass AND eslint runs on routes (rule wired in eslint.config).
ESLINT_PLUGIN_OK=0
if (cd "$CANONICAL_ROOT" && "$BUN" run --filter eslint-plugin-govt-leads-hq test >/dev/null 2>&1); then
  ESLINT_PLUGIN_OK=1
fi
ESLINT_ROUTES_OK=0
# eslint exit 0 on existing route files means the rule is wired AND existing routes are clean
# (marketing-site already migrated to <Page>; platform-app has no routes/ dir today)
if (cd "$CANONICAL_ROOT" && "$BUN" x eslint 'apps/*/src/routes/**/*.tsx' >/dev/null 2>&1); then
  ESLINT_ROUTES_OK=1
fi
if [ "$ESLINT_PLUGIN_OK" = "1" ] && [ "$ESLINT_ROUTES_OK" = "1" ]; then
  mark_pass 6
fi

# ── 7. workspace-typecheck ──
if (cd "$CANONICAL_ROOT" && "$BUN" run typecheck >/dev/null 2>&1); then
  mark_pass 7
fi

# ── 8. workspace-lint ──
if (cd "$CANONICAL_ROOT" && "$BUN" run lint >/dev/null 2>&1); then
  mark_pass 8
fi

# ── 9. winners-regression-guard (NON-NEGOTIABLE) ──
# All 8 + 7 = 15 e2e tests must pass.
PW_FILE="$(mktemp -t pw.XXXX.json)"
trap 'rm -f "$EXPORTS_SCRIPT" "$PW_FILE"' EXIT
PW_PASS=0
if [ -f "e2e/winners-browser.spec.ts" ] && [ -f "e2e/winners-people-drawer.spec.ts" ]; then
  "$BUN" x playwright test \
    --config=e2e/playwright.config.ts \
    --reporter=json \
    e2e/winners-browser.spec.ts e2e/winners-people-drawer.spec.ts \
    > "$PW_FILE" 2>/dev/null || true
  PW_PASS=$(grep -oE '"status"[[:space:]]*:[[:space:]]*"(passed|expected)"' "$PW_FILE" 2>/dev/null | wc -l | tr -d ' ')
  PW_PASS=${PW_PASS:-0}
fi
if [ "$PW_PASS" -ge 15 ]; then
  mark_pass 9
else
  mark_nonneg_fail 9
fi

# ── 10. marketing-site-regression-guard (NON-NEGOTIABLE) ──
if (cd "$CANONICAL_ROOT" && "$BUN" run --filter marketing-site typecheck >/dev/null 2>&1); then
  mark_pass 10
else
  mark_nonneg_fail 10
fi

# ── 11. bundle-size-budget ──
# packages/ui has no dist today (build is tsc --noEmit). If executor wires a real
# build (vite library mode or tsup), check size. Otherwise SKIP-pass.
DIST_DIR="$WORKTREE_ROOT/packages/ui/dist"
if [ -d "$DIST_DIR" ]; then
  RAW_BYTES=$(find "$DIST_DIR" -type f \( -name "*.js" -o -name "*.mjs" \) -exec wc -c {} + 2>/dev/null \
              | tail -1 | awk '{print $1}')
  RAW_BYTES=${RAW_BYTES:-0}
  if [ "$RAW_BYTES" -gt 0 ] && [ "$RAW_BYTES" -le 614400 ]; then
    mark_pass 11
  fi
else
  # No real build artifact — pass by policy (source-export package).
  # Executor MAY override by adding a vite library build.
  mark_pass 11
fi

# ── 12. primitive-uses-radix-audit ──
RADIX_FILES=0
if [ -d "$WORKTREE_ROOT/packages/ui/src" ]; then
  RADIX_FILES=$(grep -lE '@radix-ui/react-(select|dialog|tooltip|tabs|checkbox|scroll-area|toast|popover)' \
                "$WORKTREE_ROOT/packages/ui/src/"*.tsx 2>/dev/null | wc -l | tr -d ' ')
  RADIX_FILES=${RADIX_FILES:-0}
fi
if [ "$RADIX_FILES" -ge 6 ]; then
  mark_pass 12
fi

# ── 13. design-system-doc-exists ──
DS_DOC="$WORKTREE_ROOT/docs/design-system.md"
DD_DOC="$WORKTREE_ROOT/docs/design-decisions.md"
if [ -f "$DS_DOC" ] && [ -f "$DD_DOC" ]; then
  DS_LINES=$(wc -l < "$DS_DOC" 2>/dev/null | tr -d ' ')
  DS_LINES=${DS_LINES:-0}
  if [ "$DS_LINES" -gt 50 ]; then
    mark_pass 13
  fi
fi

# Compute pass rate.
RATE=$(awk -v p="$PASSED" -v t="$TOTAL" 'BEGIN{ printf "%.3f", p / t }')

echo "PASS_RATE=$RATE PASSED=$PASSED TOTAL=$TOTAL NONNEG_FAILED=$NONNEG_FAILED T1=$T1 T2=$T2 T3=$T3 T4=$T4 T5=$T5 T6=$T6 T7=$T7 T8=$T8 T9=$T9 T10=$T10 T11=$T11 T12=$T12 T13=$T13"
