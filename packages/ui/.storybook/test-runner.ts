/**
 * Storybook test-runner config — injects axe-core via axe-playwright on every
 * story and asserts there are no WCAG A/AA violations.
 *
 * The runner boots a real Chromium browser (via Playwright), navigates to
 * each story in turn, and runs axe against `#storybook-root`. A clean run
 * is the gate for criterion T5 (storybook-a11y-clean).
 *
 * Tuning notes:
 *   - Color-contrast on certain decorative elements (mono labels) gets
 *     waived per-story via `parameters: { a11y: { config: { rules: [
 *       { id: "color-contrast", enabled: false } ] } } }` — see ADR-05 in
 *     `docs/design-decisions.md`.
 *   - Form stories that compose Tooltips inside iframes pass `portalContainer`
 *     so the portaled content renders inside the story root and axe can
 *     reach it.
 */

import type { TestRunnerConfig } from "@storybook/test-runner";
import { getStoryContext } from "@storybook/test-runner";
import { checkA11y, injectAxe } from "axe-playwright";

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    // Pull per-story a11y parameters so individual stories can opt out of
    // rules they shouldn't gate on (e.g. color-contrast on a mono decoration).
    const storyContext = await getStoryContext(page, context);
    const a11yParams = (storyContext.parameters?.a11y ?? {}) as {
      disable?: boolean;
      config?: { rules?: Array<{ id: string; enabled?: boolean; selector?: string }> };
      options?: Record<string, unknown>;
    };
    if (a11yParams.disable) return;

    await checkA11y(page, "#storybook-root", {
      detailedReport: true,
      detailedReportOptions: { html: false },
      axeOptions: {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
        rules: Object.fromEntries(
          (a11yParams.config?.rules ?? []).map((r) => [r.id, { enabled: r.enabled !== false }]),
        ),
      },
    });
  },
};

export default config;
