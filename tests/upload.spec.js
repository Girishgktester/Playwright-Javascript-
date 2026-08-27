import { test, expect } from '@playwright/test';

test.describe('File Upload', () => {

    const uploadPage = 'https://the-internet.herokuapp.com/upload';

    const filePath =
        'C:/Users/Girish Kulkarni/Downloads/Test.txt';


    // 1. Upload a file using setInputFiles()
    test('Upload a file', async ({ page }) => {

        await page.goto(uploadPage);

        await page.locator('#file-upload')
            .setInputFiles(filePath);

        await page.locator('#file-submit')
            .click();

        await expect(page.locator('#uploaded-files'))
            .toContainText('Test.txt');
    });


   
    // 4. Upload using filechooser
    test('Upload using filechooser', async ({ page }) => {

        await page.goto(uploadPage);

        const fileChooserPromise = page.waitForEvent('filechooser');

        await page.locator('#file-upload').click();

        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(filePath);
        await page.locator('#file-submit') .click();

        await expect(page.locator('#uploaded-files')) .toContainText('Test.txt');
    });

    // await page.locator('input[type="file"]').setInputFiles([
    //     'C:/Users/Girish Kulkarni/Downloads/Test1.txt',
    //     'C:/Users/Girish Kulkarni/Downloads/Test2.txt',
    //     'C:/Users/Girish Kulkarni/Downloads/Test3.txt'
    // ]);

    test('Clear uploaded file', async ({ page }) => {

        await page.goto('https://the-internet.herokuapp.com/upload');

        const fileInput = page.locator('#file-upload');

        // Select file
        await fileInput.setInputFiles('C:/Users/Girish Kulkarni/Downloads/Test.txt'
        );

        // Verify file is selected
        await expect(fileInput) .toHaveValue(/Test\.txt/);

        // Clear file
        await fileInput.setInputFiles([]);

        // Verify file is cleared
        await expect(fileInput).toHaveValue('');
    });

    test('Drag and drop file upload', async ({ page }) => {

    await page.goto('https://the-internet.herokuapp.com/upload');

    const dropZone = page.locator('#drag-drop-upload');

    const fileChooserPromise =page.waitForEvent('filechooser');

    await dropZone.click();

    const fileChooser = await fileChooserPromise;

    // Select file
    await fileChooser.setFiles('C:/Users/Girish Kulkarni/Downloads/Test.txt');

    // Verify file appears in Dropzone
    await expect(dropZone).toContainText('Test.txt');
});

});