const { test, expect } = require('@playwright/test');
test('simple local check', async ({ page }) => { await page.setContent('<h1>Hello</h1>'); await expect(page.locator('h1')).toHaveText('Hello'); });
