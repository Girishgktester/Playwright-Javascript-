import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('Login', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('Logout', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('Fetch title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwrights/);

 const login = page.getByRole('button', {name: 'Login'})

 await login.click();


});





// ✅ What a *test* is
// ✅ What *test()* does
// ✅ Why we use *async*
// ✅ Why we use *await*
// ✅ What *page* is
// ✅ What the *Playwright config file* is
// ✅ What a *locator* is