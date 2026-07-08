import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://127.0.0.1:3333",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command:
      "pnpm exec contentlayer2 build && pnpm build && pnpm exec next start -p 3333",
    url: "http://127.0.0.1:3333",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
