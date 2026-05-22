import { test, expect } from "@playwright/test";

/**
 * Happy-path coverage for Slice 1:
 * 1. Load the home page. Headline renders.
 * 2. Click the About nav link. Lands on /about with the photo visible.
 * 3. Toggle the theme to dark. `<html data-theme>` becomes "dark".
 * 4. Reload. The bootstrap script reads localStorage and the theme
 *    persists across the reload.
 *
 * We assert against the `data-theme` attribute on `<html>` instead of
 * computed CSS color — the attribute is the source of truth and is
 * available the instant the bootstrap script runs, before paint.
 */

test("home → about navigation and theme persistence", async ({ page }) => {
  // 1. Home loads and shows the locked headline.
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("AI-native builder");

  // 2. About link navigates to /about, photo is visible.
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByAltText("Garrett Curtis")).toBeVisible();

  // 3. Toggle from light (default) to dark.
  const toggle = page.getByRole("button", { name: /switch to dark mode/i });
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  // 4. Reload — bootstrap script must re-apply the persisted theme.
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
