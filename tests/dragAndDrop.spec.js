import { test, expect } from '@playwright/test';


const htmlPath ='C:\\Users\\Girish Kulkarni\\OneDrive\\Desktop\\Playwright learning\\pw_mouse_actions.html';

test('has title', async ({ page }) => {
  await page.goto(htmlPath);

  // Right or left click
 const dragable = page.locator('#dragItem');
 const dropable = page.locator('#dropZone');

 await dragable.dragTo(dropable);

const source = page.locator('#dragItem');
const target = page.locator('#dropZone');

await source.dragTo(target, {
    sourcePosition: { x: 20, y: 20 },
    targetPosition: { x: 30, y: 30 }
});

await source.dragTo(target, {steps: 20});

await source.dragTo(target, {force: true});

await source.dragTo(target, {timeout: 5000});

await source.dragTo(target, {trial: true});

});