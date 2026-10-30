import { expect, test } from '@playwright/test';

const WIDTHS = [375, 320];

for (const width of WIDTHS) {
  test(`no horizontal scroll at ${String(width)} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('no content is clipped at 375 px by the hidden overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');

  const clipped = await page.evaluate(
    () =>
      [...document.querySelectorAll('main *')].filter((element) => {
        const { left, right } = element.getBoundingClientRect();
        return left < 0 || right > document.documentElement.clientWidth;
      }).length,
  );

  expect(clipped).toBe(0);
});

test('the recruiter link stays visible at 375 px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');

  await expect(page.getByRole('link', { name: /espace recruteur/i })).toBeVisible();
});

test('clicking the recruiter link reaches the login URL', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: /espace recruteur/i }).click();

  await expect(page).toHaveURL(/\/recruiter\/login$/);
});

test('the title uses the Gliker display font', async ({ page }) => {
  await page.goto('/');

  const family = await page
    .getByRole('heading', { level: 1 })
    .evaluate((element) => getComputedStyle(element).fontFamily);

  expect(family).toMatch(/gliker/i);
});

test('the recruiter button uses the dark text token on the primary color', async ({ page }) => {
  await page.goto('/');

  const link = page.getByRole('link', { name: /espace recruteur/i });

  await expect(link).toHaveCSS('color', 'rgb(30, 30, 30)');
  await expect(link).toHaveCSS('background-color', 'rgb(0, 191, 99)');
});

test('the step numbers render large, in the deep green token', async ({ page }) => {
  await page.goto('/');

  const number = page.getByRole('listitem').first().getByText('01');

  await expect(number).toHaveCSS('color', 'rgb(0, 140, 70)');
  await expect(number).toHaveCSS('font-size', '48px');
});

test('the section badge has a visible soft background', async ({ page }) => {
  await page.goto('/');

  const badge = page.getByText('Comment ça marche', { exact: true });

  await expect(badge).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});
