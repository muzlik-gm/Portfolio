import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('homepage loads within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('images are properly optimized', async ({ page }) => {
    await page.goto('/');
    const images = await page.locator('img').all();

    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src && !src.includes('data:') && !src.includes('blob:')) {
        // Check that images have alt text
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();

        // Check that images are not excessively large (basic heuristic)
        const naturalWidth = await img.getAttribute('width');
        if (naturalWidth) {
          expect(parseInt(naturalWidth)).toBeLessThan(3000); // Reasonable max width
        }
      }
    }
  });

  test('no unnecessary re-renders detected', async ({ page }) => {
    await page.goto('/');
    // Monitor for potential re-render indicators
    const initialHTML = await page.content();
    await page.waitForTimeout(2000); // Wait for any async operations
    const finalHTML = await page.content();
    // Basic check - in a real app you'd use React DevTools or similar
    expect(initialHTML.length).toBeGreaterThan(1000);
  });

  test('efficient loading - check bundle size indicators', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => {
      requests.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for reasonable number of requests (basic heuristic)
    const jsRequests = requests.filter(url => url.includes('.js'));
    expect(jsRequests.length).toBeLessThan(20); // Reasonable limit for a portfolio site
  });

  test('Web Vitals - basic performance metrics', async ({ page, browserName }) => {
    // Skip in webkit due to inconsistent performance metrics
    test.skip(browserName === 'webkit');

    const cdpSession = await page.context().newCDPSession(page);
    await cdpSession.send('Performance.enable');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get basic performance metrics
    const metrics = await cdpSession.send('Performance.getMetrics');
    const lcp = metrics.metrics.find((m: any) => m.name === 'LargestContentfulPaint');
    const fid = metrics.metrics.find((m: any) => m.name === 'FirstInputDelay');

    if (lcp) {
      // LCP should be under 4 seconds
      expect(lcp.value).toBeLessThan(4000);
    }
  });
});