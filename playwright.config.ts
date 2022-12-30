import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import { customerStorageStatePath } from "./e2e/global-setup";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require("dotenv").config();

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
const PORT = Number(process.env.PORT || 3000);

if (!PORT) {
  throw new Error(`PORT environment variable is required`);
}

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  // Will cause error which can be ignored since nested within outputDir
  // Configuration Error: HTML reporter output folder clashes with the tests output folder
  reporter: [["html", { outputFolder: "e2e-results/playwright-report" }]],

  globalSetup: require.resolve("./e2e/global-setup"),
  use: {
    baseURL: `http://localhost:${PORT}`,
    storageState: customerStorageStatePath,
    // headless: false,

    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',
  outputDir: "e2e-results/",

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm dev",
    port: Number(PORT),
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
