{/* <div class="product">
    <h3>iPhone 15</h3>
    <button>Add to Cart</button>
</div>

<div class="product">
    <h3>Samsung S24</h3>
    <button>Add to Cart</button>
</div> */}


import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await page.locator('.product').filter({hasText:'iPhone 15'}).getByRole('button', {name: 'Add to cart'})

  await page.locator('.product').filter({hasText : 'iphone 15'}).getByRole('button',{name : 'Add to cart'});

  await page.locator('.product').filter({has: page.getByRole('heading',{name: 'iphonen 15'})}).getByRole('button', {name: 'Add to cart'});

}); 


test('Find macbook using hasText', async({page}) =>{
  await page.goto('file:///C:/Users/Girish%20Kulkarni/OneDrive/Documents/Playwright-Javascript/Assignment%20HTMLS/Pw_assertions_lab.html')

  const product = page.locator('.product').filter({hasText: 'MacBook Air M3'});

  await expect(product).toBeVisible();
  await expect(product).toContainText('MacBook Air M3');

  await expect(page.locator('.product')).toHaveCount(4);



});


