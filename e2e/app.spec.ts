import { expect, test } from '@playwright/test';

test('eligible users can sign in through the Angular client', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('demo');
  await page.getByLabel('Password').fill('DemoPass123!');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('heading', { name: 'Welcome, demo' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Your account is eligible to play.');

  await page.getByRole('link', { name: 'Browse games' }).click();
  await expect(page).toHaveURL(/\/games$/);
  await expect(page.locator('.game-card')).toHaveCount(7);
  await page.getByRole('button', { name: /Solar Spins/ }).click();
  const gameDialog = page.getByRole('dialog');
  await expect(gameDialog.getByRole('heading', { name: 'Solar Spins' })).toBeVisible();
  await gameDialog.getByRole('button', { name: 'Check eligibility & launch' }).click();
  await expect(page.getByText('Game ready to load')).toBeVisible();
  await expect(page.getByText(/Waiting for the external game service/)).toBeVisible();
});

test('ineligible users cannot open authenticated game pages', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('restricted');
  await page.getByLabel('Password').fill('RestrictedPass123!');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('heading', { name: 'Welcome, restricted' })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveText('You must be of legal age to access games.');
  await expect(page.getByRole('link', { name: 'Browse games' })).toHaveCount(0);

  await page.goto('/games');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Welcome, restricted' })).toBeVisible();
});

test('invalid credentials do not authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('demo');
  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('alert')).toHaveText('Invalid username or password.');
});
