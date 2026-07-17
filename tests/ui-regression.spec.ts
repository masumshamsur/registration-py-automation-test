import { test, expect } from '@playwright/test';

test.describe('Registration UI regression suite', () => {
  test('loads the registration screen and completes a valid submission', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Registration Form/i);
    await expect(page.getByRole('heading', { name: /Welcome to the Registration Page/i })).toBeVisible();

    await page.getByLabel('First Name:').fill('Playwright');
    await page.getByLabel('Last Name:').fill('Regression');
    await page.getByLabel('Country:').selectOption('India');
    await page.locator('input[name="gender"][value="Female"]').check();

    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByRole('heading', { name: /Success!/i })).toBeVisible();
    await expect(page.locator('body')).toContainText('Your data has been saved successfully.');
    await expect(page.locator('body')).toContainText('Playwright');
    await expect(page.locator('body')).toContainText('Regression');
    await expect(page.locator('body')).toContainText('India');
  });

  test('opens the saved users page', async ({ page }) => {
    await page.goto('/users');

    await expect(page.getByRole('heading', { name: /List of Users/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Go back to the form/i })).toBeVisible();
  });

  test('deletes a user record from the list of users', async ({ page }) => {
    const uniqueName = `DeleteUser-${Date.now()}`;

    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Welcome to the Registration Page/i })).toBeVisible();

    await page.getByLabel('First Name:').fill(uniqueName);
    await page.getByLabel('Last Name:').fill('Delete');
    await page.getByLabel('Country:').selectOption('Canada');
    await page.locator('input[name="gender"][value="Male"]').check();
    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByRole('heading', { name: /Success!/i })).toBeVisible();
    await expect(page.locator('body')).toContainText(uniqueName);

    await page.goto('/users');
    await expect(page.getByRole('heading', { name: /List of Users/i })).toBeVisible();

    const userRow = page.getByRole('row').filter({ has: page.getByText(uniqueName) });
    await expect(userRow).toBeVisible();

    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await userRow.getByRole('button', { name: /delete/i }).click();

    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('row').filter({ has: page.getByText(uniqueName) })).toHaveCount(0);
  });
});
