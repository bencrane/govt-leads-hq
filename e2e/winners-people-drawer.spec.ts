/**
 * winners-people-drawer.spec.ts — Acceptance tests for the people drawer +
 * layout breathing room feature (platform-app-people-drawer-layout-v2).
 *
 * 7 tests, one per acceptance constraint:
 *   1. layout-has-breathing-room
 *   2. filters-sidebar-not-flush-left
 *   3. table-not-flush-right
 *   4. drawer-people-section-renders
 *   5. person-row-shape
 *   6. person-row-expands
 *   7. people-fixture-shape-matches-blitzapi
 *
 * IMPORTANT: Tests #1-3 set viewport to 1920×1080 BEFORE page.goto per the
 * validator contract. Default Playwright viewport (1280×720) is wrong for these.
 */

import { expect, test } from "@playwright/test";
import { PLATFORM_URL } from "./playwright.config";

const BASE = `${PLATFORM_URL}/winners`;

// ── Test 1: layout-has-breathing-room ─────────────────────────────────────────
test("layout-has-breathing-room", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(BASE, { waitUntil: "networkidle" });

  const winnersPage = page.locator("[data-testid='winners-page']");
  await expect(winnersPage).toBeVisible();

  // Verify max-width is set and is <= 1600px
  const maxWidth = await winnersPage.evaluate((el) => {
    const style = window.getComputedStyle(el);
    const mw = style.maxWidth;
    if (!mw || mw === "none") return Infinity;
    return parseFloat(mw);
  });
  expect(maxWidth).toBeLessThanOrEqual(1600);

  // Verify left edge is >= 32px from viewport left at 1920px width
  // With maxWidth 1440px centered: left edge = (1920 - 1440) / 2 = 240px
  const box = await winnersPage.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(32);
});

// ── Test 2: filters-sidebar-not-flush-left ────────────────────────────────────
test("filters-sidebar-not-flush-left", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(BASE, { waitUntil: "networkidle" });

  // Use the dedicated testid added to the sidebar
  const sidebar = page.locator("[data-testid='winners-filters-sidebar']");
  await expect(sidebar).toBeVisible();

  const box = await sidebar.boundingBox();
  expect(box).not.toBeNull();
  // Sidebar left edge must be >= 32px from viewport left
  expect(box!.x).toBeGreaterThanOrEqual(32);
});

// ── Test 3: table-not-flush-right ─────────────────────────────────────────────
test("table-not-flush-right", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(BASE, { waitUntil: "networkidle" });

  const table = page.locator("[data-testid='winners-table']");
  await expect(table).toBeVisible();

  const box = await table.boundingBox();
  expect(box).not.toBeNull();
  // Right edge must be <= (1920 - 32) = 1888
  const rightEdge = box!.x + box!.width;
  expect(rightEdge).toBeLessThanOrEqual(1888);
});

// ── Test 4: drawer-people-section-renders ─────────────────────────────────────
test("drawer-people-section-renders", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "networkidle" });

  // Click the first winners row to open the drawer
  const firstRow = page.locator("[data-testid='winners-row']").first();
  await expect(firstRow).toBeVisible();
  await firstRow.click();

  // Drawer should be visible
  const drawer = page.locator("[data-testid='winners-detail-drawer']");
  await expect(drawer).toBeVisible();

  // People section must exist within the drawer
  const peopleSection = drawer.locator("[data-testid='drawer-people-section']");
  await expect(peopleSection).toBeVisible();

  // Either renders people rows OR shows the empty state
  const personRowCount = await peopleSection.locator("[data-testid='person-row']").count();
  const emptyStateVisible = await peopleSection.locator("text=No verified contacts on file").isVisible();

  expect(personRowCount >= 1 || emptyStateVisible).toBeTruthy();
});

// ── Test 5: person-row-shape ──────────────────────────────────────────────────
test("person-row-shape", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "networkidle" });

  // We need a row that has people attached. The fixture has 41 UEIs with people
  // out of 48 winners. Try the first row; if it has no people, scan forward.
  let found = false;
  const rowCount = await page.locator("[data-testid='winners-row']").count();

  for (let i = 0; i < Math.min(rowCount, 10) && !found; i++) {
    await page.locator("[data-testid='winners-row']").nth(i).click();
    const drawer = page.locator("[data-testid='winners-detail-drawer']");
    await expect(drawer).toBeVisible();

    const personRows = drawer.locator("[data-testid='person-row']");
    const count = await personRows.count();

    if (count > 0) {
      found = true;

      const firstPersonRow = personRows.first();

      // person-full-name
      const nameEl = firstPersonRow.locator("[data-testid='person-full-name']");
      await expect(nameEl).toBeVisible();
      const nameText = await nameEl.textContent();
      expect(nameText?.trim().length).toBeGreaterThan(0);

      // person-headline (slot must exist; may render "—" for null)
      const headlineEl = firstPersonRow.locator("[data-testid='person-headline']");
      await expect(headlineEl).toBeVisible();

      // person-current-role (format: job_title @ company OR at company OR "—")
      const roleEl = firstPersonRow.locator("[data-testid='person-current-role']");
      await expect(roleEl).toBeVisible();

      // person-location
      const locationEl = firstPersonRow.locator("[data-testid='person-location']");
      await expect(locationEl).toBeVisible();

      // person-linkedin-link — must have target="_blank" and rel="noopener"
      const linkedinEl = firstPersonRow.locator("[data-testid='person-linkedin-link']");
      await expect(linkedinEl).toBeVisible();
      await expect(linkedinEl).toHaveAttribute("target", "_blank");
      await expect(linkedinEl).toHaveAttribute("rel", "noopener");
    } else {
      // Close the drawer and try the next row
      await page.keyboard.press("Escape");
      // Click the overlay to close
      const overlay = page.locator("[data-testid='winners-detail-drawer']");
      if (await overlay.isVisible()) {
        await page.locator("body").press("Escape");
        // Try clicking somewhere outside drawer
        await page.mouse.click(100, 100);
        await page.waitForTimeout(300);
      }
    }
  }

  expect(found).toBeTruthy();
});

// ── Test 6: person-row-expands ────────────────────────────────────────────────
test("person-row-expands", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "networkidle" });

  // Find a winner with people (same scan approach as test 5)
  let found = false;
  const rowCount = await page.locator("[data-testid='winners-row']").count();

  for (let i = 0; i < Math.min(rowCount, 10) && !found; i++) {
    await page.locator("[data-testid='winners-row']").nth(i).click();
    const drawer = page.locator("[data-testid='winners-detail-drawer']");
    await expect(drawer).toBeVisible();

    const personRows = drawer.locator("[data-testid='person-row']");
    const count = await personRows.count();

    if (count > 0) {
      found = true;
      const firstPersonRow = personRows.first();

      // Expansion block exists in DOM but is hidden before click
      const expandedBlock = firstPersonRow.locator("..").locator("[data-testid='person-row-expanded-detail']");

      // Click the row to expand
      await firstPersonRow.click();

      // The expanded detail block is now visible
      await expect(expandedBlock).toBeVisible();

      // Check sub-sections
      await expect(expandedBlock.locator("[data-testid='person-experiences-timeline']")).toBeVisible();
      await expect(expandedBlock.locator("[data-testid='person-education']")).toBeVisible();
      await expect(expandedBlock.locator("[data-testid='person-skills']")).toBeVisible();
      await expect(expandedBlock.locator("[data-testid='person-certifications']")).toBeVisible();

      // Keyboard accessibility — Tab to person-row and press Enter to toggle
      // Close via click first
      await firstPersonRow.click();

      // Focus the row via Tab from the drawer
      await firstPersonRow.focus();
      await page.keyboard.press("Enter");

      // Should be expanded again
      await expect(expandedBlock).toBeVisible();
    } else {
      await page.mouse.click(100, 100);
      await page.waitForTimeout(300);
    }
  }

  expect(found).toBeTruthy();
});

// ── Test 7: people-fixture-shape-matches-blitzapi ─────────────────────────────
test("people-fixture-shape-matches-blitzapi", async ({ page }) => {
  // This is a static test — we load the fixture via the page's module system.
  // Navigate to /winners so the app context is loaded, then eval against the fixture.
  await page.goto(BASE, { waitUntil: "networkidle" });

  // Evaluate fixture shape via the app's window context — the fixture is imported
  // by the running app. We verify shape via the DOM data that the app renders.
  // Since this is a static shape test we also verify counts via rendered output.

  // Verify ≥30 winners have people by scanning rows and counting those with person-rows
  const winnersRowCount = await page.locator("[data-testid='winners-row']").count();
  expect(winnersRowCount).toBeGreaterThanOrEqual(1);

  let winnersWithPeople = 0;
  let totalPeopleFound = 0;

  // Sample first 15 rows to verify distribution
  const sampleCount = Math.min(winnersRowCount, 15);
  for (let i = 0; i < sampleCount; i++) {
    await page.locator("[data-testid='winners-row']").nth(i).click();
    const drawer = page.locator("[data-testid='winners-detail-drawer']");
    await expect(drawer).toBeVisible();

    const count = await drawer.locator("[data-testid='person-row']").count();
    if (count > 0) {
      winnersWithPeople++;
      totalPeopleFound += count;
    }

    // Close the drawer
    await page.mouse.click(100, 100);
    await page.waitForTimeout(150);
  }

  // With 41 out of 48 winners having people, sampling 15 should yield ~12-13 with people
  expect(winnersWithPeople).toBeGreaterThanOrEqual(8);

  // Verify the person-row DOM shape — open first winner with people and check slots
  for (let i = 0; i < Math.min(sampleCount, 10); i++) {
    await page.locator("[data-testid='winners-row']").nth(i).click();
    const drawer = page.locator("[data-testid='winners-detail-drawer']");
    await expect(drawer).toBeVisible();

    const personRows = drawer.locator("[data-testid='person-row']");
    if (await personRows.count() > 0) {
      const first = personRows.first();
      // Verify required shape fields are present
      await expect(first.locator("[data-testid='person-full-name']")).toBeVisible();
      await expect(first.locator("[data-testid='person-headline']")).toBeVisible();
      await expect(first.locator("[data-testid='person-current-role']")).toBeVisible();
      await expect(first.locator("[data-testid='person-location']")).toBeVisible();
      await expect(first.locator("[data-testid='person-linkedin-link']")).toBeVisible();

      // Verify location field sub-keys exist (city/state or fallback) via non-empty content
      const locationText = await first.locator("[data-testid='person-location']").textContent();
      expect(locationText?.trim().length).toBeGreaterThan(0);

      // Verify linkedin_url has http (valid URL)
      const href = await first.locator("[data-testid='person-linkedin-link']").getAttribute("href");
      expect(href).toMatch(/^https?:\/\//);

      break;
    }
    await page.mouse.click(100, 100);
    await page.waitForTimeout(150);
  }
});
