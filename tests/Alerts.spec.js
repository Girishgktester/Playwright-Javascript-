import { test, expect } from '@playwright/test';

const url = 'file:///C:/Users/Girish%20Kulkarni/OneDrive/Desktop/Playwright%20learning/playwright_scenarios_lab.html';


// ============================================================
// 1. ALERT
// ============================================================

test('Alert Dialog', async ({ page }) => {

    await page.goto(url);

    page.on('dialog', async dialog => {
        await dialog.accept();
    });

    await page.getByRole('button', { name: 'Show Alert' }).click();

});


// ============================================================
// 2. CONFIRM - OK
// ============================================================

test('Confirm Dialog - Accept', async ({ page }) => {

    await page.goto(url);

    page.on('dialog', async dialog => {
        await dialog.accept();
    });

    await page.getByRole('button', { name: 'Show Confirm' }).click();

    await expect(
        page.locator('#dialogResult')
    ).toHaveText('User clicked OK.');

});


// ============================================================
// 3. CONFIRM - CANCEL
// ============================================================

test('Confirm Dialog - Cancel', async ({ page }) => {

    await page.goto(url);

    page.on('dialog', async dialog => {
        await dialog.dismiss();
    });

    await page.getByRole('button', { name: 'Show Confirm' }).click();

    await expect(
        page.locator('#dialogResult')
    ).toHaveText('User clicked Cancel.');

});


// ============================================================
// 4. PROMPT
// ============================================================

test('Prompt Dialog', async ({ page }) => {

    await page.goto(url);

    page.on('dialog', async dialog => {
        await dialog.accept('Girish');
    });

    await page.getByRole('button', { name: 'Show Prompt' }).click();

    await expect(
        page.locator('#dialogResult')
    ).toHaveText('Hello Girish');

});


// ============================================================
// 5. MULTIPLE TAB / POPUP
// ============================================================

test('Multiple Tab', async ({ page }) => {

    await page.goto(url);

    const popupPromise = page.waitForEvent('popup');

    await page.getByRole('button', { name: 'Open New Tab' }).click();

    const popup = await popupPromise;

    await popup.waitForLoadState();

    console.log('New Tab URL:', popup.url());

});


// ============================================================
// 6. MULTIPLE PAGES
// ============================================================

test('Multiple Pages', async ({ page, context }) => {

    await page.goto(url);

    const page1 = await context.newPage();

    const page2 = await context.newPage();

    await page1.goto('https://example.com');

    await page2.goto('https://example.org');

    console.log('Page 1:', page1.url());

    console.log('Page 2:', page2.url());

});


// ============================================================
// 8. LOGIN IFRAME
// ============================================================

test('Login iFrame', async ({ page }) => {

    await page.goto(url);

    const frame = page.frameLocator(
        'iframe[name="loginFrame"]'
    );

    await frame
        .getByPlaceholder('Enter username')
        .fill('girish');

    await frame
        .getByPlaceholder('Enter password')
        .fill('password123');

    await frame
        .getByRole('button', { name: 'Login' })
        .click();

    await expect(
        frame.locator('#loginResult')
    ).toHaveText('Login Successful');

});