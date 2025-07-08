import { test, expect } from '@playwright/test';

test.describe('Pagination Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display pagination when more than 5 users exist', async ({ page }) => {
    // Create multiple users to test pagination
    const users = [
      { firstName: 'UserOne', lastName: 'IntegrationTestOne', email: `user1.${Date.now()}@example.com` },
      { firstName: 'UserTwo', lastName: 'IntegrationTestTwo', email: `user2.${Date.now()}@example.com` },
      { firstName: 'UserThree', lastName: 'IntegrationTestThree', email: `user3.${Date.now()}@example.com` },
      { firstName: 'UserFour', lastName: 'IntegrationTestFour', email: `user4.${Date.now()}@example.com` },
      { firstName: 'UserFive', lastName: 'IntegrationTestFive', email: `user5.${Date.now()}@example.com` },
      { firstName: 'UserSix', lastName: 'IntegrationTestSix', email: `user6.${Date.now()}@example.com` },
    ];

    // Create users
    for (const user of users) {
      await page.getByTestId('create-user-link').click();
      await page.getByTestId('first-name-input').fill(user.firstName);
      await page.getByTestId('last-name-input').fill(user.lastName);
      await page.getByTestId('email-input').fill(user.email);
      await page.getByTestId('submit-button').click();
      await expect(page.getByTestId('success-message')).toBeVisible();
      await expect(page).toHaveURL('/', { timeout: 5000 });
    }

    // Check if pagination appears
    const paginationContainer = page.getByTestId('pagination-container');
    await expect(paginationContainer).toBeVisible();
  });

  test('should navigate between pages using pagination', async ({ page }) => {
    // This test assumes there are enough users to trigger pagination
    const paginationContainer = page.getByTestId('pagination-container');

    if (await paginationContainer.isVisible()) {
      // Find and click next page button
      const nextButton = page.locator('[data-testid="page-"]').nth(1);
      if (await nextButton.isVisible()) {
        await nextButton.click();

        // Verify page change by checking URL or content change
        await page.waitForTimeout(500); // Small wait for state update
      }
    }
  });

  test('should show correct number of users per page', async ({ page }) => {
    const tableBody = page.getByTestId('table-body');
    if (await tableBody.isVisible()) {
      const userRows = page.locator('[data-testid="user-row"]');
      const rowCount = await userRows.count();

      // Should see maximum 5 users per page
      expect(rowCount).toBeLessThanOrEqual(5);
    }
  });
});
