import { test, expect } from '@playwright/test';


const htmlPath = 'C:/Users/Girish Kulkarni/OneDrive/Documents/Playwright-Javascript/Assignment HTMLS/pw_mouse_actions.html';

test('has title', async ({ page }) => {
  await page.goto(htmlPath);

  // Right or left click
  await page.getByRole('button', {name : 'Middle Click'}).click()

  // click count 
  await page.getByText('Click Me').first().click({clickCount :3});


  //delay
  await page.getByRole('button', {name: 'Delay 500 ms'}).first().dblclick({delay: 1000});

  //force
  await page.locator('#forceTarget').click({force : true});

  await page.locator('#modifierTarget').click({modifiers : ['Shift', 'Alt']});

  await page.locator('#positionTarget').click({position : {x:863, y:124 }});

  await page.locator('#forceTarget').click({force: true, timeout: 5000});

  await page.locator('#forceTarget').click({force: true});

  //trial it will not click 
  await page.locator('#forceTarget').click({force: true, trial: true})

  await page.locator('#forceTarget').click({force: true, scroll: 'none'})




});