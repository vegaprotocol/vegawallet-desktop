import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 10 * 1000
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: `test-results/playwright-report` }],
    ['junit', { outputFile: `test-results/junit-report/report.xml` }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:34115/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
    launchOptions: {
      args: ['--disable-web-security']
    },
    permissions: ['clipboard-read'],
    viewport: {
      width: 740,
      height: 740
    }
  },

  projects: [
    {
      name: 'dev',
      testIgnore: [/.*fairground.test.ts/, /.*mainnet.test.ts/]
    },
    {
      name: 'fairground',
      testMatch: /.*fairground.test.ts/,
      retries: 0
    },
    {
      name: 'mainnet',
      testMatch: /.*mainnet.test.ts/,
      retries: 0
    }
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: `test-results/artifacts`,

  /* Run your local dev server before starting the tests */
  webServer: {
    reuseExistingServer: true,
    command: getMode() ? `yarn ci:${getMode()}` : 'yarn dev:test',
    port: 34115,
    timeout: 6 * 60 * 1000
  }
})

function getMode() {
  if (process.argv.includes('fairground')) {
    return 'fairground'
  } else if (process.argv.includes('mainnet')) {
    return 'mainnet'
  } else if (process.argv.includes('dev')) {
    return 'dev'
  }
}
