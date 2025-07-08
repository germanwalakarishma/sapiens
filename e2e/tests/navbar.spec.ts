import { test, expect } from '@playwright/test';

test.describe('Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the homepage with navbar and users list', async ({ page }) => {
    // Check navbar
    await expect(page.getByTestId('navbar')).toBeVisible();
    await expect(page.getByTestId('navbar-logo')).toContainText('User Management');
    await expect(page.getByTestId('users-list-link')).toBeVisible();
    await expect(page.getByTestId('create-user-link')).toBeVisible();

    // Check users list container
    await expect(page.getByTestId('user-list-container')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Users List' })).toBeVisible();
  });

  test('should navigate between pages using navbar', async ({ page }) => {
    // Navigate to Create User page
    await page.getByTestId('create-user-link').click();
    await expect(page).toHaveURL('/create');
    await expect(page.getByTestId('create-user-form')).toBeVisible();

    // Navigate back to Users List
    await page.getByTestId('users-list-link').click();
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('user-list-container')).toBeVisible();
  });

});
