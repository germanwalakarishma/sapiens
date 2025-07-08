import { test, expect } from '@playwright/test';

test.describe('API Integration Tests', () => {
    test('should handle API errors gracefully', async ({ page }) => {
        // Intercept API calls and simulate errors
        await page.route('**/api/users', route => {
            if (route.request().method() === 'POST') {
                route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({ error: 'Internal server error' })
                });
            } else {
                route.continue();
            }
        });

        await page.goto('/create');

        // Fill and submit form
        await page.getByTestId('first-name-input').fill('Test');
        await page.getByTestId('last-name-input').fill('User');
        await page.getByTestId('email-input').fill('test.user@example.com');
        await page.getByTestId('submit-button').click();

        // Should show error message
        await expect(page.getByTestId('general-error')).toBeVisible();
    });

    test('should handle network timeout', async ({ page }) => {
        // Simulate slow network
        await page.route('**/api/users', route => {
            if (route.request().method() === 'GET') {
                // Delay response
                setTimeout(() => {
                    route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify([])
                    });
                }, 3000);
            } else {
                route.continue();
            }
        });

        await page.goto('/');

        // should show loading state
        await expect(page.getByTestId('loading-state')).toBeVisible();
    });

    test('should handle malformed API response', async ({ page }) => {
        await page.route('**/api/users', route => {
            if (route.request().method() === 'GET') {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: 'invalid json'
                });
            } else {
                route.continue();
            }
        });

        await page.goto('/');
        await page.waitForTimeout(2000);
    });

    test('should send correct data in POST request', async ({ page }) => {

        let requestBody: any;
        // Intercept POST request to capture data
        await page.route('**/api/users', async (route, request) => {
            if (request.method() === 'POST') {
                requestBody = await request.postDataJSON();
                route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: '123',
                        ...requestBody,
                        createdAt: new Date().toISOString()
                    })
                });
            } else {
                route.continue();
            }
        });

        await page.goto('/create');

        const testData = {
            firstName: 'API',
            lastName: 'test',
            email: `api.test.${Date.now()}@example.com`
        }

        await page.getByTestId('first-name-input').fill(testData.firstName);
        await page.getByTestId('last-name-input').fill(testData.lastName);
        await page.getByTestId('email-input').fill(testData.email);
        await page.getByTestId('submit-button').click();


        await expect(page.getByTestId('success-message')).toBeVisible();
        expect(requestBody).toEqual(testData);

    });
});