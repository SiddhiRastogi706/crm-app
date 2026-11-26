import { test, expect } from '@playwright/test';

test.describe('Authentication & Login Flow', () => {
  test('logs in successfully and redirects to dashboard', async ({ page }) => {
    await page.goto('/login');

    // Check login page elements
    await expect(page.getByRole('heading', { name: /Sign in to your account/i })).toBeVisible();
    await expect(page.getByLabel(/Work Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();

    // Fill credentials
    await page.getByLabel(/Work Email/i).fill('admin@pulsecrm.com');
    await page.getByLabel(/Password/i).fill('password123');

    // Click Sign In
    await page.getByRole('button', { name: /Sign In/i }).click();

    // Verify redirected to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
  });

  test('shows validation error for invalid email', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/Work Email/i).fill('not-an-email');
    await page.getByRole('button', { name: /Sign In/i }).click();

    await expect(page.getByText(/valid email address/i)).toBeVisible();
  });
});
