#!/usr/bin/env bash
# platform-app-30d-winners-browser benchmark
#
# Run from the govt-leads-hq repo root. Computes the acceptance-test pass
# rate for the 30-day winners browser feature.
#
# Outputs ONE LINE on stdout in the form:
#
#   PASS_RATE=0.700 PASSED=7 TOTAL=10 TYPECHECK=ok|fail LINT=ok|fail|skip MARKETING_TC=ok|fail
#
# Exit code is always 0 unless the script itself errors. The harness reads
# the pass-rate from stdout.
#
# Tests considered (10 total):
#   1.  platform-app typecheck (constraint #9)
#   2.  marketing-site typecheck (constraint #10a)
#   3-10. Eight Playwright tests in e2e/winners-browser.spec.ts:
#         route-renders, filter-panel-mounts, apply-filter-updates-url,
#         url-restores-filter, result-list-renders, sort-by-amount-works,
#         detail-drawer-opens, csv-export-works
#
# NOTE: constraint #10b ("marketing-site smoke test still passes") is a
# baseline-already-broken constraint and tracked separately by the
# validator (see directive's Validator notes). It is NOT counted toward
# the 10/10 here because the operator's reshape of marketing-site this
# session already broke it pre-feature; the executor cannot legally fix
# it without violating Out-of-scope. See VALIDATOR notes.

set -u
cd "$(dirname "$0")/../.." || exit 2

BUN="${BUN:-/Users/benjamincrane/.bun/bin/bun}"
PASSED=0
TOTAL=10
TYPECHECK_PA="fail"
TYPECHECK_MS="fail"
PW_RESULT_FILE="$(mktemp)"
trap 'rm -f "$PW_RESULT_FILE"' EXIT

# ── 1. platform-app typecheck ──
if "$BUN" run --filter platform-app typecheck >/dev/null 2>&1; then
  PASSED=$((PASSED + 1))
  TYPECHECK_PA="ok"
fi

# ── 2. marketing-site typecheck ──
if "$BUN" run --filter marketing-site typecheck >/dev/null 2>&1; then
  PASSED=$((PASSED + 1))
  TYPECHECK_MS="ok"
fi

# ── 3-10. Playwright winners-browser spec ──
# The spec MUST exist; if it doesn't, all 8 are counted as fail (so the
# executor sees PASS_RATE=0.200 from the typechecks and knows the spec
# is the gap).
if [ -f "e2e/winners-browser.spec.ts" ]; then
  # Use JSON reporter so we can count individual test results.
  "$BUN" x playwright test \
    --config=e2e/playwright.config.ts \
    --reporter=json \
    e2e/winners-browser.spec.ts \
    > "$PW_RESULT_FILE" 2>/dev/null || true

  # Parse passed/failed counts. The JSON reporter writes one large object.
  # The reporter emits "status": "passed" (with a space after colon) in
  # pretty-printed JSON; match both forms to be robust.
  PW_PASSED=$(grep -oE '"status"[[:space:]]*:[[:space:]]*"passed"' "$PW_RESULT_FILE" 2>/dev/null | wc -l | tr -d ' ')
  PW_PASSED=${PW_PASSED:-0}
  # Cap at 8 so a misbehaving reporter can't inflate.
  if [ "$PW_PASSED" -gt 8 ]; then PW_PASSED=8; fi
  PASSED=$((PASSED + PW_PASSED))
fi

# Compute pass rate as fraction with 3 decimals.
RATE=$(awk -v p="$PASSED" -v t="$TOTAL" 'BEGIN{ printf "%.3f", p / t }')

echo "PASS_RATE=$RATE PASSED=$PASSED TOTAL=$TOTAL TYPECHECK=$TYPECHECK_PA LINT=skip MARKETING_TC=$TYPECHECK_MS"
