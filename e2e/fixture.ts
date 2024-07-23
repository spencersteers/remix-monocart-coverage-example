/**
 * Test fixture that collects v8 code coverage.
 * Adapted from: https://github.com/cenfun/nextjs-with-playwright/blob/544e2a498812d9c5965a3d28201b64f29f036353/e2e/fixtures.js
 */
import { test as baseTest, expect } from '@playwright/test';
import { addCoverageReport } from 'monocart-reporter';

interface AppFixtures {
  autoTestFixture: void;
}

/**
 * Test and collect v8 coverage
 * {@inheritDoc @playwright/test:test}
 */
const test = baseTest.extend<AppFixtures>({
  autoTestFixture: [
    async ({ page }, use): Promise<void> => {
      
      await Promise.all([
        page.coverage.startJSCoverage({
          resetOnNavigation: false
        }),
      ]);

      await use();

      const [jsCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
      ]);
      const coverageList = [... jsCoverage,];
      await addCoverageReport(coverageList, test.info());
    },
    {
      scope: 'test',
      auto: true,
    },
  ],
});

export { expect, test };