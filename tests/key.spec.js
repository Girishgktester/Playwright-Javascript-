import { test, expect } from '@playwright/test';
const htmlPath = 'C:/Users/Girish Kulkarni/OneDrive/Documents/Playwright-Javascript/Assignment HTMLS/pw_mouse_actions.html';

test.describe('Keyboard Actions', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(htmlPath);
  });

  // 1. locator.press() - Enter
  test('Press Enter using locator.press()', async ({ page }) => {

    const input = page.locator('#keyboardInput');

    await input.press('Enter');

  });


  // 2. locator.press() - Arrow Down
  test('Press ArrowDown using locator.press()', async ({ page }) => {

    const input = page.locator('#keyboardInput');

    await input.press('ArrowDown');

  });


  // 3. locator.press() - Escape
  test('Press Escape using locator.press()', async ({ page }) => {

    const input = page.locator('#keyboardInput');

    await input.press('Escape');

  });


  // 4. locator.press() - Ctrl/Cmd + A
  test('Select all text using Ctrl or Cmd + A', async ({ page }) => {

    const input = page.locator('#keyboardInput');

    await input.fill('Playwright Keyboard');

    await input.press('ControlOrMeta+A');

  });


  // 5. locator.press() with delay
  test('Press key with delay', async ({ page }) => {

    const input = page.locator('#keyboardInput');

    await input.press('Enter', {
      delay: 500
    });

  });


  // 6. pressSequentially()
  test('Type text using pressSequentially()', async ({ page }) => {

    const input = page.locator('#sequentialInput');

    await input.pressSequentially('Hello Playwright');

    await expect(input)
      .toHaveValue('Hello Playwright');

  });


  // 7. pressSequentially() with delay
  test('Type text character by character with delay', async ({ page }) => {

    const input = page.locator('#sequentialInput');

    await input.pressSequentially('Hello Playwright', {
      delay: 100
    });

    await expect(input)
      .toHaveValue('Hello Playwright');

  });


  // 8. keyboard.press()
  test('Page-level keyboard press', async ({ page }) => {

    const input = page.locator('#keyboardInput');

    await input.fill('Playwright');

    await input.focus();

    await page.keyboard.press('ControlOrMeta+A');

  });


  // 9. keyboard.down() + keyboard.up()
  test('Hold and release Shift key', async ({ page }) => {

    const input = page.locator('#keyboardInput');

    await input.focus();

    await page.keyboard.down('Shift');

    await page.keyboard.press('a');

    await page.keyboard.up('Shift');

  });


  // 10. keyboard.type()
  test('Type using keyboard.type()', async ({ page }) => {

    const input = page.locator('#typeInput');

    await input.focus();

    await page.keyboard.type('Playwright Keyboard');

    await expect(input)
      .toHaveValue('Playwright Keyboard');

  });


  // 11. keyboard.type() with delay
  test('Type using keyboard.type() with delay', async ({ page }) => {

    const input = page.locator('#typeInput');

    await input.focus();

    await page.keyboard.type('Playwright Keyboard', {
      delay: 100
    });

    await expect(input)
      .toHaveValue('Playwright Keyboard');

  });


  // 12. keyboard.insertText()
  test('Insert text using keyboard.insertText()', async ({ page }) => {

    const input = page.locator('#insertInput');

    await input.focus();

    await page.keyboard.insertText('Inserted text');

    await expect(input)
      .toHaveValue('Inserted text');

  });

});