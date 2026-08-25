import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { pathToFileURL } from 'url';

const folder =
    'C:/Users/Girish Kulkarni/Downloads/fileflow-playwright-demo';

const htmlPath =
    path.join(folder, 'file-upload-download-demo.html');

test.describe('File Upload Download', () => {

    test.beforeEach(async ({ page }) => {

        const url = pathToFileURL(htmlPath).href;

        console.log('Opening:', url);

        await page.goto(url);
    });


    test('Single file upload', async ({ page }) => {

        await page.locator('#fileInput')
            .setInputFiles(
                path.join(folder, 'sample.txt')
            );

        await expect(
            page.locator('#fileList')
        ).toContainText('sample.txt');

    });


    test('Multiple file upload', async ({ page }) => {

        await page.locator('#fileInput')
            .setInputFiles([
                path.join(folder, 'sample.txt'),
                path.join(folder, 'users.csv')
            ]);

        await expect(
            page.locator('#fileList')
        ).toContainText('sample.txt');

        await expect(
            page.locator('#fileList')
        ).toContainText('users.csv');

    });


    test('File chooser upload', async ({ page }) => {

        const fileChooserPromise =
            page.waitForEvent('filechooser');

        await page.getByText('Browse Files').click();

        const fileChooser =
            await fileChooserPromise;

        await fileChooser.setFiles(
            path.join(folder, 'sample.txt')
        );

        await expect(
            page.locator('#fileList')
        ).toContainText('sample.txt');

    });


    test('Download file', async ({ page }) => {

        const downloadPromise =
            page.waitForEvent('download');

        await page.getByRole('button', {
            name: 'Download'
        }).first().click();

        const download =
            await downloadPromise;

        expect(
            download.suggestedFilename()
        ).toBe('sample.txt');

    });


    test('Download and save file', async ({ page }) => {

        const downloadPromise =
            page.waitForEvent('download');

        await page.getByRole('button', {
            name: 'Download'
        }).first().click();

        const download =
            await downloadPromise;

        const downloadFolder =
            path.join(folder, 'downloads');

        fs.mkdirSync(downloadFolder, {
            recursive: true
        });

        const downloadPath =
            path.join(
                downloadFolder,
                download.suggestedFilename()
            );

        await download.saveAs(downloadPath);

        expect(
            fs.existsSync(downloadPath)
        ).toBeTruthy();

    });

});