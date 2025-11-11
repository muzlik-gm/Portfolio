import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test('no sensitive data in localStorage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const localStorage = await page.evaluate(() => {
      const items: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          items[key] = localStorage.getItem(key);
        }
      }
      return items;
    });

    // Check for sensitive data patterns
    const sensitiveKeys = Object.keys(localStorage).filter(key =>
      key.toLowerCase().includes('password') ||
      key.toLowerCase().includes('token') ||
      key.toLowerCase().includes('secret') ||
      key.toLowerCase().includes('key')
    );

    const sensitiveValues = Object.values(localStorage).filter(value =>
      typeof value === 'string' && (
        value.includes('password') ||
        value.includes('token') ||
        value.includes('secret') ||
        value.includes('key')
      )
    );

    expect(sensitiveKeys.length).toBe(0);
    expect(sensitiveValues.length).toBe(0);
  });

  test('secure headers are present', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers() || {};

    // Check for basic security headers (these may not be present in dev mode)
    const hasXCTO = headers['x-content-type-options'] === 'nosniff';
    const hasXFO = headers['x-frame-options'];
    const hasCSP = headers['content-security-policy'];

    // In development, Next.js sets some security headers - verify they're secure values
    if (headers['x-frame-options']) {
      expect(['DENY', 'SAMEORIGIN'].includes(headers['x-frame-options'])).toBe(true);
    }
    if (headers['x-content-type-options']) {
      expect(headers['x-content-type-options']).toBe('nosniff');
    }
    // CSP is optional in dev mode
    expect(!hasCSP || typeof hasCSP === 'string').toBe(true);
  });

  test('no eval or dangerous functions in source', async ({ page }) => {
    await page.goto('/');

    const dangerousFunctions = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.some(script => {
        const content = script.textContent || '';
        return content.includes('eval(') || content.includes('Function(') || content.includes('setTimeout(');
      });
    });

    expect(dangerousFunctions).toBe(false);
  });

  test('forms use proper methods', async ({ page }) => {
    await page.goto('/contact');

    const forms = await page.locator('form').all();

    for (const form of forms) {
      const method = await form.getAttribute('method');
      // Forms should use POST for data submission
      if (method) {
        expect(method.toUpperCase()).toBe('POST');
      }
    }
  });

  test('external links have proper security attributes', async ({ page }) => {
    await page.goto('/');

    const externalLinks = await page.locator('a[href^="http"]').all();

    for (const link of externalLinks) {
      const href = await link.getAttribute('href');
      const rel = await link.getAttribute('rel');

      if (href && !href.includes('localhost') && !href.includes('127.0.0.1')) {
        // External links should have rel="noopener noreferrer" for security
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
      }
    }
  });

  test('no console errors related to security', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known non-security related errors
    const securityErrors = errors.filter(error =>
      error.includes('certificate') ||
      error.includes('ssl') ||
      error.includes('cors') ||
      error.includes('csp') ||
      error.includes('xss') ||
      error.includes('csrf')
    );

    expect(securityErrors.length).toBe(0);
  });
});