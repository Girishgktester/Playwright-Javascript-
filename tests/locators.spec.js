import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await page.getByRole('button', {name: 'Add to cart'});

  await page.getByRole('button', {name:'Add to wishlist'})

  await page.getByRole('link',{name:'Tricentis'})

  await page.getByRole('heading',{name:'Computing and Internet'} )

  await page.getByRole('img', {name: 'Male'})


  await page.getByLabel('First name:')

  await page.getByPlaceholder('Type to search');

  await page.getByAltText('Picture of Samsung Galaxy S24 256GB');


  await page.getByText('Laptop')

  await page.getByTitle('nopCommerce demo store. Login')


  //getbyrole
  //getbylable
  //getbyText
  //getbyplaceholder
  //getbytitle
  //getbyalttext
  //getbydatatestid


//   aria-lable
//alt
//title
//strong
//id div name value placeholder style href





});