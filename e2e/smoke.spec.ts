/**
 * GovtLeads HQ e2e smoke suite.
 *
 * Two surfaces:
 *
 *   1. marketing-site (5174) — the homepage thesis h1.
 *   2. platform-app (5173) — /winners route smoke.
 *      The rare-structure cockpit was deleted in the 30d-winners-browser
 *      feature cycle. This test now asserts the /winners route renders.
 */

import { expect, test } from "@playwright/test";
import { MARKETING_URL, PLATFORM_URL } from "./playwright.config";

const SHOTS = "test-results";

// ───────────────────────────────────────────────────────────────────
// marketing-site — homepage thesis h1.
// Both spans (the framer-motion crossfade pair) are always present in
// the DOM; animation only tweens opacity, so text-content assertions
// hold regardless of motion-reduced preference or animation phase.
// ───────────────────────────────────────────────────────────────────

test("marketing-site homepage renders the thesis h1 with zero console errors", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  await page.goto(`${MARKETING_URL}/`, { waitUntil: "networkidle" });

  const heading = page.locator("h1");
  await expect(heading).toBeVisible();
  await expect(heading).toContainText("Every Government Contract Creates Two Things");
  await expect(heading).toContainText("A Buyer With Money and a Deadline They Need to Hit");

  await page.screenshot({ path: `${SHOTS}/marketing-homepage.png`, fullPage: true });

  expect(consoleErrors, `console errors: ${consoleErrors.join(" | ")}`).toEqual([]);
});

// ───────────────────────────────────────────────────────────────────
// platform-app — /winners route smoke.
// Replaces the deprecated cockpit smoke; the rare-structure cockpit
// was deleted in the 30d-winners-browser feature cycle.
// ───────────────────────────────────────────────────────────────────

test("platform-app /winners route renders the winners page", async ({ page }) => {
  await page.goto(`${PLATFORM_URL}/winners`, { waitUntil: "networkidle" });
  const winnersPage = page.locator("[data-testid='winners-page']");
  await expect(winnersPage).toBeVisible();
});
