import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
const host = "127.0.0.1";
const port = 3100;
const baseURL = `http://${host}:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  failOnFlakyTests: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm start -- --hostname ${host} --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
  },
});
