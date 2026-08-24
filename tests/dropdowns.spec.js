import { test, expect } from '@playwright/test';


test('1. Select option using label index and value', async ({ page }) => {
    await page.goto('file:///C:/Users/Girish%20Kulkarni/OneDrive/Desktop/Playwright%20learning/PW_Dropdown_Practice.html');


    const dropdodnw = page.locator('#environment');

    dropdodnw.selectOption('qa');

    dropdodnw.selectOption({ value: 'qa' });

    dropdodnw.selectOption({ index: 2 });

    dropdodnw.selectOption({ label: 'Staging' })

    await expect(dropdodnw).toHaveValue('stage');

    await page.locator('#country').toHaveValue('india')

});

test('Fetch all dropdown values using loop', async ({ page }) => {
    await page.goto('file:///C:/Users/Girish%20Kulkarni/OneDrive/Desktop/Playwright%20learning/PW_Dropdown_Practice.html');

    const options = page.locator('#department option');


    console.log("Values" + await options.allTextContents())

    const count = await options.count();

    console.log("count" + count)

    for (let i = 0; i < count; i++) {

        const text = await options.nth(i).textContent();

        console.log("Dropddown values" + text)
    }

    const dropdownEnv = page.locator('#environment option').filter({ hasText: 'qa' })

    const dropdownEnv1 = page.locator('#environment option[value="qa"]');

    await expect(dropdownEnv1).toHaveCount(1);


})


test('Select custom dropdown option', async ({ page }) => {
    await page.goto('file:///C:/Users/Girish%20Kulkarni/OneDrive/Desktop/Playwright%20learning/PW_Dropdown_Practice.html');

    await page.locator('#frameworkDropdown').click();

    const wdiovalue = page.getByText('WebdriverIO').first();

    await expect(wdiovalue).toBeVisible();

    await wdiovalue.click();

    await expect(page.locator('#frameworkDropdown')).toHaveText('WebdriverIO');


});



test('Multi select dropdown', async ({ page }) => {
    await page.goto('file:///C:/Users/Girish%20Kulkarni/OneDrive/Desktop/Playwright%20learning/PW_Dropdown_Practice.html');

    await page.locator('#skills').selectOption(['typescript', 'appium'])

    await expect(page.locator('#skills')).toHaveValues(['typescript', 'appium'])

    await page.locator('#terms').check()
    await page.locator('#terms').uncheck()

    await expect(page.locator('#terms')).toBeChecked()

});






