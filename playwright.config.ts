import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import { CoverageReportOptions } from 'monocart-reporter';

const PORT = Number(process.env.PORT || 5173);

if (!PORT) {
  throw new Error(`PORT environment variable is required`);
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './e2e',
  outputDir: './e2e/test-results',
  testMatch: ['**/*.test.ts'],
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /** Maximum time expect() should wait for the condition to be met. */
    timeout: 5000,
  },
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: `http://localhost:${PORT}`,
    actionTimeout: 0,
    trace: 'on-first-retry',
  },
  reporter: [
    ['list'],
    [
      'monocart-reporter',
      {
        outputFile: `./e2e/test-results/monocart-report.html`,
        coverage: {
          logging: 'debug',
          outputDir: './coverage/e2e/',
          entryFilter:{
            '**/node_modules/**': false,
            '**/assets/**': true,
          },
          sourceFilter(sourcePath) {
            if (sourcePath.includes('node_modules')) return false;
            return true;
          },
          reports: [
            [
              'v8',
              {
                outputFile: 'v8/index.html',
              },
            ],
          ],
        } satisfies CoverageReportOptions,
      },
    ],
  ],
  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
    },
  ],
  globalTeardown: './e2e/global-teardown.ts',
  webServer: {
    command: `remix-serve ./build/server/index.js`,
    env: {
      PORT: PORT.toString(),
      NODE_V8_COVERAGE: 'coverage/e2e-node-v8-coverage',
      NODE_OPTIONS: '--inspect=9229',
    },
    port: Number(PORT),
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 10 * 1000,
  },
};

export default config;
