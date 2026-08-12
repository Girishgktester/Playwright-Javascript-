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
    await page.goto('file:///C:/Users/Girish%20Kulkarni/OneDrive/Desktop/Playwright%20learning/has.html')

    // await page.locator('.product-card').filter({hasText : 'MacBook Air M3'}).getByRole('button',{name: 'Add to cart'});

    // const product = page.locator('.product-card').filter({hasText : ' A'});

    await product.getByRole('button', {name: 'Add to cart'}).click();


   const wishlist =  await page.locator('.product-card').filter({has:page.getByRole('button', {name:'wishlist'})}).count();

     await expect(wishlist).toBe(4)



});


