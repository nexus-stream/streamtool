import { defineConfig } from "@playwright/test";

// Single real-browser test that needs multiple tabs on one origin. Everything
// else stays in vitest/jsdom. The dev server is started on demand and reused
// locally so repeated runs don't spawn a new server each time.
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
