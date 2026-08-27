import { test, expect } from '@playwright/test';

test.describe('File Download', () => {

    const downloadPage = 'https://the-internet.herokuapp.com/download';

    // 1. Basic file download
    test('Download file', async ({ page }) => {

        await page.goto(downloadPage);

        const downloadPromise = page.waitForEvent('download');

        await page.getByText('test13.txt', { exact: true }).click();

        const download = await downloadPromise;

        expect(download.suggestedFilename()).toBe('test13.txt');
    });


    // 2. Download and save file
    test('Download and save file', async ({ page }) => {

        await page.goto(downloadPage);

        const downloadPromise = page.waitForEvent('download');

        await page.getByText('test13.txt', { exact: true }).click();

        const download = await downloadPromise;

        await download.saveAs('downloads/test13.txt');
    });


    // 3. Verify downloaded file name
    test('Verify downloaded file name', async ({ page }) => {

        await page.goto(downloadPage);

        const downloadPromise = page.waitForEvent('download');

        await page.getByText('testfile1.pdf', { exact: true }).click();

        const download = await downloadPromise;

        expect(download.suggestedFilename()).toBe('testfile1.pdf');
    });


    // 4. Verify download was successful
    test('Verify download success', async ({ page }) => {

        await page.goto(downloadPage);

        const downloadPromise = page.waitForEvent('download');

        await page.getByText('testfile1.pdf', { exact: true }).click();

        const download = await downloadPromise;

        expect(await download.failure()).toBeNull();
    });

});

