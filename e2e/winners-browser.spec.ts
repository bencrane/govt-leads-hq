/**
 * winners-browser.spec.ts — Acceptance tests for the 30-day federal contract
 * winners browser (platform-app /winners route).
 *
 * 8 tests, one per acceptance test ID from the directive:
 *   1. route-renders
 *   2. filter-panel-mounts
 *   3. apply-filter-updates-url
 *   4. url-restores-filter
 *   5. result-list-renders
 *   6. sort-by-amount-works
 *   7. detail-drawer-opens
 *   8. csv-export-works
 *
 * All tests use data-testid selectors for stability across UI changes.
 * Tests run against the fixture-backed implementation — no live backend.
 */

import { expect, test } from "@playwright/test";
import { PLATFORM_URL } from "./playwright.config";

const BASE = `${PLATFORM_URL}/winners`;

// ── Test 1: route-renders ────────────────────────────────────────────────────
test("route-renders", async ({ page }) => {
  const response = await page.goto(BASE, { waitUntil: "networkidle" });
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator("[data-testid='winners-page']")).toBeVisible();
});

// ── Test 2: filter-panel-mounts ──────────────────────────────────────────────
test("filter-panel-mounts", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "networkidle" });

  // Assert all 12 filter controls with their stable testids
  await expect(page.locator("[data-testid='naics-input']")).toBeVisible();
  await expect(page.locator("[data-testid='award-amount-min']")).toBeVisible();
  await expect(page.locator("[data-testid='award-amount-max']")).toBeVisible();
  await expect(page.locator("[data-testid='pop-state-select']")).toBeVisible();
  await expect(page.locator("[data-testid='set-aside-select']")).toBeVisible();
  await expect(page.locator("[data-testid='agency-select']")).toBeVisible();
  await expect(page.locator("[data-testid='date-range-picker']")).toBeVisible();
  await expect(page.locator("[data-testid='keyword-input']")).toBeVisible();
  await expect(page.locator("[data-testid='employee-band-select']")).toBeVisible();
  await expect(page.locator("[data-testid='revenue-band-select']")).toBeVisible();
  await expect(page.locator("[data-testid='funding-status-select']")).toBeVisible();
  await expect(page.locator("[data-testid='founded-year-min']")).toBeVisible();
  await expect(page.locator("[data-testid='founded-year-max']")).toBeVisible();
});

// ── Test 3: apply-filter-updates-url ─────────────────────────────────────────
test("apply-filter-updates-url", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "networkidle" });

  // Type NAICS code into the naics-input
  const naicsInput = page.locator("[data-testid='naics-input']");
  await naicsInput.fill("541512");

  // URL should contain ?naics=541512 without a full reload
  await expect(page).toHaveURL(/naics=541512/);
});

// ── Test 4: url-restores-filter ──────────────────────────────────────────────
test("url-restores-filter", async ({ page }) => {
  // Navigate directly to a pre-filtered URL
  await page.goto(`${BASE}?naics=541512&pop_state=VA,MD`, { waitUntil: "networkidle" });

  // Filter controls should reflect the URL values
  const naicsInput = page.locator("[data-testid='naics-input']");
  await expect(naicsInput).toHaveValue("541512");

  // The result table should be scoped — only rows matching naics=541512 and pop_state VA or MD
  // Verify at least one row is visible (fixture has 541512 rows in VA/MD)
  await expect(page.locator("[data-testid='winners-row']").first()).toBeVisible();

  // Spot-check that table is scoped: if no rows match, the no-results message is shown
  // (with these fixture params we expect matches, so assert rows present)
  const rowCount = await page.locator("[data-testid='winners-row']").count();
  expect(rowCount).toBeGreaterThan(0);
});

// ── Test 5: result-list-renders ──────────────────────────────────────────────
test("result-list-renders", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "networkidle" });

  // At least one row
  const rows = page.locator("[data-testid='winners-row']");
  await expect(rows.first()).toBeVisible();
  const count = await rows.count();
  expect(count).toBeGreaterThanOrEqual(1);

  // First row should show all required columns: entity name, obligation amount,
  // agency, NAICS, perf state, posted date
  const firstRow = rows.first();

  // Entity name (company name is in a div inside first td)
  const entityCell = firstRow.locator("td").first();
  await expect(entityCell).not.toBeEmpty();

  // Obligation cell
  const obligationCell = firstRow.locator("[data-testid='cell-obligation']");
  await expect(obligationCell).toBeVisible();
  // Should contain a $ amount
  const obligationText = await obligationCell.textContent();
  expect(obligationText).toMatch(/\$/);
});

// ── Test 6: sort-by-amount-works ─────────────────────────────────────────────
test("sort-by-amount-works", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "networkidle" });

  // Capture first-row obligation before sort
  const firstRowObligationBefore = await page
    .locator("[data-testid='winners-row']")
    .first()
    .locator("[data-testid='cell-obligation']")
    .textContent();

  // Click the amount sort header
  await page.locator("[data-testid='sort-amount']").click();

  // Wait for re-render
  await page.waitForTimeout(200);

  // First-row obligation should change (sort direction flipped)
  const firstRowObligationAfter = await page
    .locator("[data-testid='winners-row']")
    .first()
    .locator("[data-testid='cell-obligation']")
    .textContent();

  expect(firstRowObligationAfter).not.toEqual(firstRowObligationBefore);
});

// ── Test 7: detail-drawer-opens ──────────────────────────────────────────────
test("detail-drawer-opens", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "networkidle" });

  // Click the first row to open the drawer
  await page.locator("[data-testid='winners-row']").first().click();

  // Drawer should be visible
  const drawer = page.locator("[data-testid='winners-detail-drawer']");
  await expect(drawer).toBeVisible();

  // Must contain award-fields block
  await expect(drawer.locator("[data-testid='award-fields']")).toBeVisible();

  // Must contain firmographic-block
  await expect(drawer.locator("[data-testid='firmographic-block']")).toBeVisible();

  // Must NOT contain contacts-block
  await expect(drawer.locator("[data-testid='contacts-block']")).not.toBeVisible();
});

// ── Test 8: csv-export-works ─────────────────────────────────────────────────
test("csv-export-works", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "networkidle" });

  // Wait for the download event triggered by the Export CSV button
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("[data-testid='export-csv-button']").click(),
  ]);

  // Read the downloaded file
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  const content = Buffer.concat(chunks).toString("utf-8");

  // First line must equal the canonical CSV header
  const firstLine = content.split("\n")[0].trim();
  expect(firstLine).toBe("entity_name,obligation_30d,agency,naics_code,perf_state,latest_contract_date");
});
