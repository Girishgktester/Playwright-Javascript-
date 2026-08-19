import { test, expect } from '@playwright/test';

test.describe('Playwright Assertions Lab', () => {

  test.beforeEach(async ({ page }) => {
    // Opens our Assertions Lab HTML page before every test.
    // Change the URL/path depending on where you host the HTML file.
await page.goto('file:///C:/Users/Girish%20Kulkarni/OneDrive/Desktop/Playwright%20learning/Pw_assertions_lab.html');  });


  test('1. Page assertions', async ({ page }) => {

    // Verifies the browser tab/page title.
    await expect(page).toHaveTitle('Playwright Assertions Lab');

    // Verifies that the URL contains our HTML file name.
    await expect(page).toHaveURL(/playwright_assertions_lab/);
  });


  test('2. Visibility assertions', async ({ page }) => {

    const visibleButton = page.locator('#visibleButton');
    const hiddenButton = page.locator('#hiddenButton');

    // Verifies that the element is visible to the user.
    await expect(visibleButton).toBeVisible();

    // Verifies that the element is hidden from the user.
    await expect(hiddenButton).toBeHidden();

    // Verifies that the element exists in the DOM.
    // An element can be attached but still hidden.
    await expect(hiddenButton).toBeAttached();
  });


  test('3. Enabled and disabled assertions', async ({ page }) => {

    const enabledButton = page.locator('#enabledButton');
    const disabledButton = page.locator('#disabledButton');

    // Verifies that the button can be interacted with.
    await expect(enabledButton).toBeEnabled();

    // Verifies that the button is disabled.
    await expect(disabledButton).toBeDisabled();
  });


  test('4. Editable assertions', async ({ page }) => {

    const nameInput = page.locator('#nameInput');
    const readonlyInput = page.locator('#readonlyInput');

    // Verifies that the user can edit this input.
    await expect(nameInput).toBeEditable();

    // Negative assertion:
    // verifies that the readonly field is NOT editable.
    await expect(readonlyInput).not.toBeEditable();
  });


  test('5. Input value assertions', async ({ page }) => {

    const nameInput = page.locator('#nameInput');

    // Verifies the current value inside the input.
    await expect(nameInput).toHaveValue('Girish');

    // Click the Clear Name button.
    await page.locator('#clearInput').click();

    // Verifies that the input is now empty.
    await expect(nameInput).toBeEmpty();

    // We can also verify the empty value directly.
    await expect(nameInput).toHaveValue('');
  });


  test('6. Exact and partial text assertions', async ({ page }) => {

    const welcomeText = page.locator('#welcomeText');
    const partialText = page.locator('#partialText');

    // Verifies the complete text of the element.
    await expect(welcomeText)
      .toHaveText('Welcome back, Automation Engineer!');

    // Verifies that the element contains this text.
    // The complete text does not need to match.
    await expect(partialText)
      .toContainText('Assertions Lab');

    // Another partial-text verification.
    await expect(partialText)
      .toContainText('ready for practice');
  });


  test('7. Checkbox assertions', async ({ page }) => {

    const terms = page.locator('#terms');
    const newsletter = page.locator('#newsletter');

    // Verifies that Accept Terms is already checked.
    await expect(terms).toBeChecked();

    // Verifies that Newsletter is NOT checked.
    await expect(newsletter).not.toBeChecked();

    // Check the newsletter checkbox.
    await newsletter.check();

    // Verify the state changed successfully.
    await expect(newsletter).toBeChecked();
  });


  test('8. Radio button assertions', async ({ page }) => {

    const beginner = page.locator('#beginner');
    const advanced = page.locator('#advanced');

    // Advanced is selected by default.
    await expect(advanced).toBeChecked();

    // Beginner should not be selected.
    await expect(beginner).not.toBeChecked();

    // Select Beginner.
    await beginner.check();

    // Verify Beginner is now selected.
    await expect(beginner).toBeChecked();

    // Because these are radio buttons in the same group,
    // Advanced should automatically become unchecked.
    await expect(advanced).not.toBeChecked();
  });


  test('9. Attribute assertion', async ({ page }) => {

    const docsLink = page.locator('#docsLink');

    // Verifies that the element contains the expected href attribute.
    await expect(docsLink)
      .toHaveAttribute('href', '#assertions');
  });


  test('10. Class assertion', async ({ page }) => {

    const statusBadge = page.locator('#statusBadge');

    // Verifies the class attribute of the element.
    await expect(statusBadge)
      .toHaveClass('badge');

    // Regex is useful when an element contains multiple classes.
    await expect(statusBadge)
      .toHaveClass(/badge/);
  });


  test('11. Dropdown value assertion', async ({ page }) => {

    const environment = page.locator('#environment');

    // Verifies that QA is currently selected.
    // The option value is "qa".
    await expect(environment).toHaveValue('qa');

    // Change the dropdown to Staging.
    await environment.selectOption('stage');

    // Verify that the selected value changed.
    await expect(environment).toHaveValue('stage');
  });


  test('12. Count assertion', async ({ page }) => {

    const products = page.locator('.product');

    // Verifies that exactly 4 product cards exist.
    await expect(products).toHaveCount(4);
  });


  test('13. Collection text assertion', async ({ page }) => {

    const productNames = page.locator('.product h3');

    // When a locator matches multiple elements,
    // toHaveText() can verify their text as an array.
    await expect(productNames).toHaveText([
      'MacBook Air M3',
      'iPhone 16 Pro',
      'Magic Keyboard',
      'AirPods Pro'
    ]);
  });


  test('14. Verify individual product', async ({ page }) => {

    const firstProduct = page.locator('.product').first();

    // Verifies that the first product contains MacBook text.
    await expect(firstProduct)
      .toContainText('MacBook Air M3');

    // Verifies that the same card contains its price.
    await expect(firstProduct)
      .toContainText('$1,099');

    // Verifies its stock information.
    await expect(firstProduct)
      .toContainText('In Stock');
  });


  test('15. Dynamic UI assertion', async ({ page }) => {

    const orderStatus = page.locator('#orderStatus');

    // Verify the initial state.
    await expect(orderStatus)
      .toContainText('Processing');

    // User performs an action.
    await page.locator('#updateOrder').click();

    // Verify the UI changed after the action.
    await expect(orderStatus)
      .toContainText('Packed');

    await page.locator('#updateOrder').click();

    // Verify the next state.
    await expect(orderStatus)
      .toContainText('Shipped');

    await page.locator('#updateOrder').click();

    // Verify the final state.
    await expect(orderStatus)
      .toContainText('Delivered');
  });


  test('16. Negative assertion', async ({ page }) => {

    const errorMessage = page.locator('#errorMessage');

    // Error exists in DOM but is initially hidden.
    await expect(errorMessage).toBeHidden();

    // Negative assertion:
    // verifies that the error is NOT visible.
    await expect(errorMessage).not.toBeVisible();

    // Trigger the error.
    await page.locator('#toggleError').click();

    // Now the error should become visible.
    await expect(errorMessage).toBeVisible();

    // Verify its message.
    await expect(errorMessage)
      .toContainText('Payment failed');
  });


  test('17. Soft assertions', async ({ page }) => {

    // Soft assertions allow execution to continue even when
    // one assertion fails.

    await expect.soft(page)
      .toHaveTitle('Playwright Assertions Lab');

    await expect.soft(page.locator('#visibleButton'))
      .toBeVisible();

    await expect.soft(page.locator('#enabledButton'))
      .toBeEnabled();

    await expect.soft(page.locator('#terms'))
      .toBeChecked();

    await expect.soft(page.locator('.product'))
      .toHaveCount(4);

    // Playwright collects soft assertion failures and
    // reports the test as failed at the end.
  });


  test('18. Custom assertion timeout', async ({ page }) => {

    const message = page.locator('#visibilityMessage');

    // Playwright automatically retries this assertion
    // until it passes or 10 seconds have elapsed.
    await expect(message)
      .toBeVisible({ timeout: 10000 });
  });

});