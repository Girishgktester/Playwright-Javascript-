import { test, expect } from '@playwright/test';
import { time } from 'node:console';

test('1. Page assertions', async ({ page }) => {
  await page.goto('file:///C:/Users/Girish%20Kulkarni/OneDrive/Documents/Playwright-Javascript/Assignment%20HTMLS/Pw_assertions_lab.html');

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
  await expect.soft(editable).not.toBeEmpty();
  await empty.click();
  await expect(editable).toBeEmpty()

});


test('Dropdown assertions', async ({ page }) => {
  await page.goto('file:///C:/Users/Girish%20Kulkarni/OneDrive/Documents/Playwright-Javascript/Assignment%20HTMLS/Pw_assertions_lab.html');

  const dropdownvalues = page.locator('#environment');

  await dropdownvalues.selectOption('stage');

  // await dropdownvalues.selectOption({ index: 2 })

  await expect(dropdownvalues).toHaveValue('stage')

  // const options = await page.locator('#environment option').allTextContents();

  // console.log('options' + options)

  //  await expect(options).toHaveValue("Development")

  // await expect(options).toHaveText(["Development", "QA", "Staging", "Production"])

//   const options = page.locator('#environment');

//   console.log('options' + await options.textContent())
//     console.log('options' + await options.getAttribute('value'))


//   await expect(options).toHaveValue('QA');

//   const options1 = await page.locator('#environment option').allTextContents();

// expect(options1).toEqual([
//   'Development',
//   'QA',
//   'Staging',
//   'Production'
// ]);

})


test('Soft assertions', async ({ page }) => {
  await page.goto('file:///C:/Users/Girish%20Kulkarni/OneDrive/Documents/Playwright-Javascript/Assignment%20HTMLS/Pw_assertions_lab.html');


  await expect(page).toHaveTitle('Playwright Assertions Lab');

  const visibleButton = page.getByRole('button', { name: 'Visible Button' });

  await visibleButton.click({timeout: 1000});


  // await expect(visibleButton).toBeVisible();
  // await expect(visibleButton).toBeVisible();
  // await expect(visibleButton).toBeVisible();

  await expect.soft(visibleButton).toBeVisible({timeout: 1000});

  await expect.soft(visibleButton).toBeVisible();
  await expect.soft(visibleButton).toBeVisible();



});
