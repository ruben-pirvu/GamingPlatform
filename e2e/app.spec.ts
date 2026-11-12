import { expect, test } from '@playwright/test';

test('Angular loads and reaches the ASP.NET API through its proxy', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Hello, gaming-platform' })).toBeVisible();

  const health = await page.evaluate(async () => {
    const response = await fetch('/api/health');
    return { status: response.status, body: await response.json() };
  });

  expect(health).toEqual({ status: 200, body: { status: 'ok' } });
});
