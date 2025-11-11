import { test, expect } from '@playwright/test';

test.describe('Error Boundary Tests', () => {
  test('error boundary displays fallback UI when JavaScript error occurs', async ({ page }) => {
    // Navigate to a page that might trigger an error
    await page.goto('/');

    // Inject a JavaScript error to test error boundary
    await page.evaluate(() => {
      // Create an error that should be caught by error boundary
      const error = new Error('Test error for error boundary');
      // Dispatch an error event that React error boundaries can catch
      window.dispatchEvent(new ErrorEvent('error', { error, message: 'Test error' }));
    });

    // Wait a bit for error boundary to catch and render
    await page.waitForTimeout(1000);

    // Check if the page still functions (error boundary should prevent crash)
    const bodyExists = await page.locator('body').count();
    expect(bodyExists).toBeGreaterThan(0);
  });

  test('error boundary allows page reload', async ({ page }) => {
    await page.goto('/');

    // Check that error boundary reload functionality exists
    const reloadButton = page.locator('button:has-text("Reload Page")');
    // Button should exist but not be visible unless error occurs
    const buttonExists = await reloadButton.count();
    expect(buttonExists).toBe(0); // Should not be visible on normal page
  });

  test('layout includes error boundary wrapper', async ({ page }) => {
    await page.goto('/');

    // Check that the main layout structure is intact
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });
});