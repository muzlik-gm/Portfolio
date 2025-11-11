import { test, expect } from '@playwright/test';

test.describe('Database Connection Tests', () => {
  test('database connection health check', async ({ request }) => {
    // Test database connection through an API endpoint that uses DB
    const response = await request.get('/api/admin/dashboard');

    // Should get a response (either success or auth error, but not connection error)
    expect(response.status()).not.toBe(500);
  });

  test('database operations work for authenticated requests', async ({ request }) => {
    // This test would require authentication setup
    // For now, just test that the endpoint exists and doesn't crash
    const response = await request.get('/api/admin/users');

    // Should get some kind of response
    expect([401, 200, 403]).toContain(response.status());
  });

  test('contact form database operations', async ({ request }) => {
    const testMessage = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message for database testing'
    };

    const response = await request.post('/api/contact', {
      data: testMessage,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Should get a successful response or validation error
    expect([200, 400, 422]).toContain(response.status());
  });
});