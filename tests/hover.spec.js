import { test, expect } from '@playwright/test';


const htmlPath ='C:\\Users\\Girish Kulkarni\\OneDrive\\Desktop\\Playwright learning\\pw_mouse_actions.html';

test('has title', async ({ page }) => {
  await page.goto(htmlPath);

  // Right or left click
  await page.locator('#hoverTarget').hover();
 

//   await page.locator('#hoverForceTarget').hover()
  await page.locator('#hoverForceTarget').hover({force:true})
  await page.locator('#hoverForceTarget').hover({force:true})

});
