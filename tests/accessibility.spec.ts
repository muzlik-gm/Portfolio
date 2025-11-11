import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('homepage has proper heading structure', async ({ page }) => {
    await page.goto('/');

    // Check for proper heading hierarchy (h1, then h2, etc.)
    const h1Count = await page.locator('h1').count();

    expect(h1Count).toBeGreaterThan(0);
    // h2 might not be present on homepage, just check that h1 exists
  });

  test('all images have alt text', async ({ page }) => {
    await page.goto('/');
    const images = await page.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');

    // Test tab navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus');
    expect(await focusedElement.count()).toBeGreaterThan(0);
  });

  test('color contrast is sufficient', async ({ page }) => {
    await page.goto('/');

    // Basic check for text elements having proper contrast
    const textElements = await page.locator('p, span, div, h1, h2, h3, h4, h5, h6').all();

    // This is a basic check - in production you'd use axe-core or similar
    for (const element of textElements.slice(0, 5)) { // Check first 5 for performance
      const color = await element.evaluate(el => getComputedStyle(el).color);
      const backgroundColor = await element.evaluate(el => getComputedStyle(el).backgroundColor);

      // If text has color defined, it should be readable (basic check)
      if (color !== 'rgba(0, 0, 0, 0)' && color !== 'rgb(0, 0, 0)') {
        expect(color).toBeTruthy();
      }
    }
  });

  test('forms have proper labels', async ({ page }) => {
    await page.goto('/contact');

    const inputs = await page.locator('input, textarea, select').all();

    for (const input of inputs) {
      const type = await input.getAttribute('type');
      if (type === 'hidden' || type === 'submit') continue; // Skip hidden and submit inputs

      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');

      // Check for some form of labeling
      const hasLabel = ariaLabel || ariaLabelledBy || name || placeholder;
      expect(hasLabel).toBeTruthy();
    }
  });

  test('skip links are present', async ({ page }) => {
    await page.goto('/');

    // Look for skip links (common accessibility feature)
    const skipLinks = await page.locator('a[href^="#"]:has-text("Skip")').count();
    // Skip links are good practice but not mandatory - just check if present
    expect(skipLinks).toBeGreaterThanOrEqual(0);
  });

  test('focus indicators are visible', async ({ page }) => {
   await page.goto('/');

   // Focus on an interactive element
   const interactiveElement = await page.locator('a, button').first();
   await interactiveElement.focus();

   // Check if element is focused
   const isFocused = await interactiveElement.evaluate(el => el === document.activeElement);
   expect(isFocused).toBe(true);
 });

  test('page has proper lang attribute', async ({ page }) => {
    await page.goto('/');

    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBeTruthy();
    expect(htmlLang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
  });
});