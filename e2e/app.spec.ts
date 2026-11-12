import { expect, test } from '@playwright/test';

test('eligible users can sign in through the Angular client', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('demo');
  await page.getByLabel('Password').fill('DemoPass123!');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('heading', { name: 'Welcome, demo' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Your account is eligible to play.');
});

test('ineligible users can authenticate but are shown their eligibility status', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('restricted');
  await page.getByLabel('Password').fill('RestrictedPass123!');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('heading', { name: 'Welcome, restricted' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Your account is not eligible to play.');
});

test('invalid credentials do not authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('demo');
  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('alert')).toHaveText('Invalid username or password.');
});
