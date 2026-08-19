import { test, expect } from '@playwright/test';


const htmlPath = 'C:\\Users\\Girish Kulkarni\\OneDrive\\Desktop\\Playwright learning\\pw_mouse_actions.html';

test('has title', async ({ page }) => {
    await page.goto("https://demowebshop.tricentis.com/");

    // const pagetitle = await page.title();

    // console.log(pagetitle)

    // await expect(pagetitle).toEqual('Demo Web Shop')

    await expect(page).toHaveTitle("Demo Web Shop");

    // const logo = page.locator('.header-logo');


    const searchButton = page.locator('.button-1 search-box-button');


    await expect(searchButton).toBeVisible();


    //     await expect(searchButton).toBeAttached(); 

 console.log('Text'+ await searchButton.inputValue())
   
    // await expect(searchButton).toHaveAttribute('value','Search')


});
