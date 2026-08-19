import { test, expect } from '@playwright/test';

test('1. Page assertions', async ({ page }) => {
  await page.goto('file:///C:/Users/Girish%20Kulkarni/OneDrive/Desktop/Playwright%20learning/Pw_assertions_lab.html');

  await expect(page).toHaveTitle('Playwright Assertions Lab');

  const visibleButton = page.getByRole('button', { name: 'Visible Button' });
  await expect(visibleButton).toBeVisible();

  const hiddenbutton = page.locator('#hiddenButton');
  await expect(hiddenbutton).toBeHidden();
  await expect(hiddenbutton).toBeAttached();

  const enabled = page.getByRole('button', { name: 'Enabled Action' })
  await expect(enabled).toBeEnabled();

  const disbaled = page.getByRole('button', { name: 'Disabled Action' })
  await expect(disbaled).toBeDisabled();

  const editable = page.locator('#nameInput');

  await expect(editable).toBeEditable();

  const noneditable = page.locator('#readonlyInput');
  await expect(noneditable).not.toBeEditable();

  const textAsssertion = page.locator('#welcomeText');

  console.log('Fetch text' + await textAsssertion.textContent())

  await expect(textAsssertion).toHaveText('Welcome back, Automation Engineer!')
  await expect(textAsssertion).toContainText('Welcome back, Automation Engineer!')

  console.log('getAttribute-->' + await editable.getAttribute('value'));
  await expect(editable).toHaveValue('Girish')

  const empty = page.locator('#clearInput');
  await expect(editable).soft.toBeEmpty()
  await empty.click();
  await expect(editable).toBeEmpty()

});


test('Dropdown assertions', async ({ page }) => {
  await page.goto('file:///C:/Users/Girish%20Kulkarni/OneDrive/Desktop/Playwright%20learning/Pw_assertions_lab.html');

  // const dropdownvalues = page.locator('#environment option');

  // await dropdownvalues.click();

  // await dropdownvalues.selectOption({ index: 2 })

  // await expect(dropdownvalues).toHaveValue('stage')

  // const options = await page.locator('#environment option').allTextContents();

  // console.log('options' + options)

  //  await expect(options).toHaveValue("Development")

  // await expect(options).toHaveText(["Development", "QA", "Staging", "Production"])

  const options = page.locator('#environment option');

  await expect(options).toHaveText([
    'Development',
    'QA',
    'Staging',
    'Production'
  ]);

  const options1 = await page.locator('#environment option').allTextContents();

expect(options1).toEqual([
  'Development',
  'QA',
  'Staging',
  'Production'
]);

})


test('Soft assertions', async ({ page }) => {
  await page.goto('file:///C:/Users/Girish%20Kulkarni/OneDrive/Desktop/Playwright%20learning/Pw_assertions_lab.html');


  await expect(page).toHaveTitle('Playwright Assertions Lab');

  const visibleButton = page.getByRole('button', { name: 'Visible Button' });

  // await expect(visibleButton).toBeVisible();
  // await expect(visibleButton).toBeVisible();
  // await expect(visibleButton).toBeVisible();

  await expect(visibleButton).soft.toBeVisible();
  await expect(visibleButton).soft.toBeVisible();
  await expect(visibleButton).soft.toBeVisible();

});
