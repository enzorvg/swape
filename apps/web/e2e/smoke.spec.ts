import { expect, test } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'Swape' })).toBeVisible();
});

test('clicking "Espace recruteur" navigates to the recruiter login page', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Espace recruteur' }).click();

  await expect(page).toHaveURL('/recruiter/login');
});

test('landing page has no horizontal scroll on a 375px screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');

  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(hasHorizontalScroll).toBe(false);
});
