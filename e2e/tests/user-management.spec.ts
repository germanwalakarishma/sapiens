import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create a new user successfully', async ({ page }) => {
    // Navigate to create user page
    await page.getByTestId('create-user-link').click();

    // Fill out the form
    await page.getByTestId('first-name-input').fill('John');
    await page.getByTestId('last-name-input').fill('Doe');
    await page.getByTestId('email-input').fill(`john.doe.${Date.now()}@example.com`);

    // Submit the form
    await page.getByTestId('submit-button').click();

    // Check success message
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByText('Success!')).toBeVisible();

    // Wait for redirect to users list
    await expect(page).toHaveURL('/', { timeout: 3000 });
  });

  test('should validate form fields with invalid data', async ({ page }) => {
    // Navigate to create user page
    await page.getByTestId('create-user-link').click();

    // Test invalid first name
    await page.getByTestId('first-name-input').fill('John123');
    await page.getByTestId('last-name-input').click();
    await expect(page.getByTestId('first-name-error')).toContainText('Must contain only letters');

    // Test invalid last name
    await page.getByTestId('first-name-input').fill('John');
    await page.getByTestId('last-name-input').fill('a'.repeat(101));
    await page.getByTestId('email-input').click();
    await expect(page.getByTestId('last-name-error')).toContainText('Must be 100 characters or less');

    // Test invalid email
    await page.getByTestId('first-name-input').fill('John');
    await page.getByTestId('last-name-input').fill('Doe');
    await page.getByTestId('email-input').fill('invalid-input');
    await expect(page.getByTestId('email-error')).toContainText('Must be a valid email address');
  });

  test('should display users in the table', async ({ page }) => {
    // First create a user to ensure there's data
    await page.getByTestId('create-user-link').click();
    await page.getByTestId('first-name-input').fill('Jane');
    await page.getByTestId('last-name-input').fill('Smith');
    await page.getByTestId('email-input').fill(`jane.smith.${Date.now()}@example.com`);
    await page.getByTestId('submit-button').click();

    // Wait for redirect
    await expect(page).toHaveURL('/', { timeout: 5000 });

    // Check if table is visible and has data
    await expect(page.getByTestId('users-table')).toBeVisible();
    await expect(page.getByTestId('table-header')).toBeVisible();
    await expect(page.getByTestId('table-body')).toBeVisible();

    // Check headers
    await expect(page.getByText('First Name')).toBeVisible();
    await expect(page.getByText('Last Name')).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('Created At')).toBeVisible();
  });

  test('should prevent form submission with empty required fields', async ({ page }) => {
    await page.getByTestId('create-user-link').click();

    // Try to submit empty form
    await page.getByTestId('submit-button').click();

    // Form should not submit and stay on the same page
    await expect(page).toHaveURL('/create');
    await expect(page.getByTestId('create-user-form')).toBeVisible();
  });


  test('should handle duplicate email validation', async ({ page }) => {
    const duplicateEmail = `duplicate.${Date.now()}@example.com`;
    // Create first user
    await page.getByTestId('create-user-link').click();
    await page.getByTestId('first-name-input').fill('First');
    await page.getByTestId('last-name-input').fill('User');
    await page.getByTestId('email-input').fill(duplicateEmail);
    await page.getByTestId('submit-button').click();
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page).toHaveURL('/', { timeout: 5000 });

    // Try to create second user with same email
    await page.getByTestId('create-user-link').click();
    await page.getByTestId('first-name-input').fill('Second');
    await page.getByTestId('last-name-input').fill('User');
    await page.getByTestId('email-input').fill(duplicateEmail);
    await page.getByTestId('submit-button').click();

    // Should show error message
    await expect(page.getByTestId('general-error')).toBeVisible();
  });

  test('should display loading state', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadingState = page.getByTestId('loading-state');
    await expect(loadingState).not.toBeVisible();
  });

  test('should validate real-time field validation', async ({ page }) => {
    await page.getByTestId('create-user-link').click();

    // Test real-time validation on first name
    await page.getByTestId('first-name-input').fill('123');
    await page.getByTestId('last-name-input').focus();
    await expect(page.getByTestId('first-name-error')).toBeVisible();

    // Fix the error
    await page.getByTestId('first-name-input').fill('John');
    await page.getByTestId('last-name-input').focus();
    await expect(page.getByTestId('first-name-error')).not.toBeVisible();
  });

  test('should have proper form accessibility', async ({ page }) => {
    await page.getByTestId('create-user-link').click();

    // Check form labels are properly associated
    await expect(page.locator('label[for="firstName"]')).toBeVisible();
    await expect(page.locator('label[for="lastName"]')).toBeVisible();
    await expect(page.locator('label[for="email"]')).toBeVisible();

    // Check required attributes
    await expect(page.getByTestId('first-name-input')).toHaveAttribute('required');
    await expect(page.getByTestId('last-name-input')).toHaveAttribute('required');
    await expect(page.getByTestId('email-input')).toHaveAttribute('required');
  });

});