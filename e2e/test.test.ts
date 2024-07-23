import { expect, test } from './fixture';

test('test', async ({ page }) => {
  await page.goto(`/test`);
  const text = page.getByText("Test");
  await expect(text).toBeVisible();
});