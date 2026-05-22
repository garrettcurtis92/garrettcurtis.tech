import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for end-to-end (real-browser) tests.
 *
 * Tests live in `e2e/`. Chromium-only at launch — multi-browser matrix
 * can be added later if a specific regression earns the CI minutes.
 *
 * `webServer.command: "npm start"` runs against the production build.
 * In CI we run `npm run build` before `npx playwright test`; locally,
 * Playwright reuses an already-running server if one is on port 3000.
 *
 * `retries: 2` in CI absorbs occasional environment flake. Locally we
 * fail fast so issues surface immediately.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
