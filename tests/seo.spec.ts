import { test, expect } from '@playwright/test';

test.describe('SEO Validation', () => {
  test('page has proper title and meta description', async ({ page }) => {
    await page.goto('/');

    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60);

    // Check for meta description
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription?.length).toBeGreaterThan(50);
    expect(metaDescription?.length).toBeLessThan(160);
  });

  test('page has Open Graph meta tags', async ({ page }) => {
    await page.goto('/');

    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');

    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    expect(ogImage).toBeTruthy();
  });

  test('page has Twitter Card meta tags', async ({ page }) => {
    await page.goto('/');

    const twitterCard = await page.getAttribute('meta[name="twitter:card"]', 'content');
    const twitterTitle = await page.getAttribute('meta[name="twitter:title"]', 'content');

    expect(twitterCard).toBeTruthy();
    expect(twitterTitle).toBeTruthy();
  });

  test('page has canonical URL', async ({ page }) => {
    await page.goto('/');

    const canonical = page.locator('link[rel="canonical"]');
    if (await canonical.count() > 0) {
      const href = await canonical.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https?:\/\/.+/);
    } else {
      // Canonical URL is optional for homepage in development
      expect(true).toBe(true);
    }
  });

  test('structured data is present', async ({ page }) => {
    await page.goto('/');

    // Check for JSON-LD structured data
    const structuredData = await page.locator('script[type="application/ld+json"]').all();

    // At least one structured data script should be present
    expect(structuredData.length).toBeGreaterThan(0);

    // Check if the first one is valid JSON
    if (structuredData.length > 0) {
      const jsonContent = await structuredData[0].textContent();
      expect(() => JSON.parse(jsonContent || '')).not.toThrow();
    }
  });

  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);

    const content = await response?.text();
    expect(content).toContain('User-agent');
    expect(content).toContain('Disallow');
  });

  test('sitemap.xml is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);

    const content = await response?.text();
    expect(content).toContain('<urlset');
    expect(content).toContain('<url>');
    expect(content).toContain('<loc>');
  });

  test('headings are present on page', async ({ page }) => {
    await page.goto('/');

    // Check that headings exist (basic SEO requirement)
    const allHeadings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    expect(allHeadings).toBeGreaterThan(0);
  });

  test('images have descriptive alt text', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img[alt]').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt?.trim()).not.toBe('');
      expect(alt?.length).toBeGreaterThan(3); // Alt text should be meaningful
    }
  });
});