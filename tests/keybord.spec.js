import { test, expect } from '@playwright/test';


const htmlPath = 'C:/Users/Girish Kulkarni/OneDrive/Documents/Playwright-Javascript/Assignment HTMLS/pw_mouse_actions.html';

test('has title', async ({ page }) => {
    await page.goto(htmlPath);

    // Right or left click
    await page.locator('#hoverTarget').hover();

    const keyinput = page.locator('#keyboardInput');

    await keyinput.focus();
    await keyinput.blur();
    await keyinput.press('Tab', { delay: 200 });

    await keyinput.fill('Sendkeys')

    await keyinput.press('Control+A');
    await keyinput.press('Control+C');
    await keyinput.press('Control+V');

    await page.locator('#sequentialInput').pressSequentially('Send text', { delay: 500 });

    // await page.keyboard.insertText('Text')

    await page.keyboard.press('ArrowDown');


});