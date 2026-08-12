import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box');
  await page.getByPlaceholder('Full Name').fill('Test');
  await page.getByRole('textbox', { name: 'name@example.com' }).fill('Test@gmail.com')
  await page.locator("#currentAddress").fill('Test current address');
  await page.locator('#permanentAddress').fill('textarea');
  await page.getByRole('button', { name: 'Submit' });
});



test.only('Add specific product to cart', async ({ page }) => {

  await page.goto('https://demowebshop.tricentis.com/desktops')

  console.log(await page.locator('.item-box').filter({ hasText: 'Build your own computer' }).textContent())

  await page.locator('.item-box').filter({ hasText: 'Build your own computer' }).getByRole('button', { name: 'Add to cart' }).click();

});


test('Find book name by author', async ({ page }) => {


  await page.goto('https://demoqa.com/books')

  await page.locator('tr').filter({ hasText: 'Richard E. Silverman' }).getByRole('link').click();

  await page.locator('tr').filter({ hasText: "O'Reilly Media'" }).getByRole('link').click();

})


test('Nth Last First', async ({ page }) => {


  await page.goto('https://testautomationpractice.blogspot.com/')

  await page.locator('.input-field').first().fill('First') //0th

  await page.locator('.input-field').last().fill('Last') //2nd

  await page.locator('.input-field').nth(1).fill('Index first') //1st



})


