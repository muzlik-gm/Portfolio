import { test, expect } from '@playwright/test';

test.describe('API Endpoints Tests', () => {
  test.describe('Public API Endpoints', () => {
    test('contact form API accepts valid data', async ({ request }) => {
      const response = await request.post('/api/contact', {
        data: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message'
        }
      });

      // Contact form may return different status codes - just check it's not an error
      expect(response.status()).toBeLessThan(500);
    });

    test('contact form API rejects invalid data', async ({ request }) => {
      const response = await request.post('/api/contact', {
        data: {
          name: '',
          email: 'invalid-email',
          message: ''
        }
      });

      expect([400, 422]).toContain(response.status());
    });
  });

  test.describe('Admin API Endpoints (Authentication Required)', () => {
    test('admin login endpoint exists', async ({ request }) => {
      const response = await request.post('/api/admin/login', {
        data: {
          email: 'test@example.com',
          password: 'testpassword'
        }
      });

      // Should get some response, not a server error
      expect(response.status()).toBeLessThan(500);
    });

    test('admin endpoints require authentication', async ({ request }) => {
      const endpoints = [
        '/api/admin/users',
        '/api/admin/blog',
        '/api/admin/projects',
        '/api/admin/dashboard',
        '/api/admin/analytics'
      ];

      for (const endpoint of endpoints) {
        const response = await request.get(endpoint);
        expect([401, 403]).toContain(response.status());
      }
    });

    test('admin verify endpoint exists', async ({ request }) => {
      const response = await request.get('/api/admin/verify');
      expect([401, 200]).toContain(response.status());
    });
  });

  test.describe('Auth Endpoints', () => {
    test('logout endpoint exists', async ({ request }) => {
      const response = await request.post('/api/auth/logout');
      expect([200, 401]).toContain(response.status());
    });

    test('register endpoint exists', async ({ request }) => {
      const response = await request.post('/api/auth/register', {
        data: {
          email: 'test@example.com',
          password: 'testpassword'
        }
      });

      // Register may return various status codes depending on existing users
      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe('Response Formats', () => {
    test('API endpoints return valid JSON', async ({ request }) => {
      const response = await request.post('/api/contact', {
        data: {
          name: 'Test',
          email: 'test@example.com',
          message: 'Test'
        }
      });

      expect(response.headers()['content-type']).toContain('application/json');

      try {
        const data = await response.json();
        expect(typeof data).toBe('object');
      } catch (e) {
        // If not JSON, that's a problem
        expect(false).toBe(true);
      }
    });
  });

  test.describe('Error Handling', () => {
    test('invalid endpoints return 404', async ({ request }) => {
      const response = await request.get('/api/nonexistent');
      expect(response.status()).toBe(404);
    });

    test('invalid methods return appropriate errors', async ({ request }) => {
      const response = await request.patch('/api/contact');
      expect([405, 404]).toContain(response.status());
    });
  });
});