import { test, expect } from '@playwright/test';

const url = 'file:///C:/Users/Girish%20Kulkarni/OneDrive/Desktop/Playwright%20learning/playwright_scenarios_lab.html';


// ============================================================
// 1. ALERT
// ============================================================

test('Alert Dialog', async ({ page }) => {

    await page.goto(url);
    page.on('dialog', async dialog => {
        await dialog.accept();
    })
    await page.getByText('Show Alert').click();

});

test('Alert Cancel', async ({ page }) => {

    await page.goto(url);
    page.on('dialog', async dialog => {
        await dialog.dismiss();
    })
    await page.getByText('Show Confirm').click();

});

test('Prompt dialog', async ({ page }) => {
    await page.goto(url);
    page.on('dialog', async dialog => {
        await dialog.accept('Test');
    })
    await page.getByText('Show Prompt').click();

});

test('Handle multiple tabs', async ({ page }) => {

    await page.goto(url);

    const popupPromise = page.waitForEvent('popup')

    await page.getByRole('button', {name: 'Open New Tab'}).click()

    const popup = await popupPromise;

    console.log('New tab', popup.url())

    await page.bringToFront();

   console.log('New tab', await popup.title())

});


test('Frames', async ({ page }) => {
    await page.goto(url);

    //  await page.locator('#username').fill("username");
    const frame = page.frameLocator('iframe[name="loginFrame"]');

    await frame.locator('#username').fill("username")
    await frame.locator('#username').fill("password")




});






