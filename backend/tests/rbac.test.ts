import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('RBAC Middleware Integration Tests', () => {
  it('should forbid Sales Rep from creating users (Admin only)', async () => {
    // Login as sales rep
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'sales@pulsecrm.com', password: 'password123' });

    const token = loginRes.body.accessToken;

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Unauthorized User',
        email: 'unauth@pulsecrm.com',
        role: 'sales_rep',
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('Insufficient permissions');
  });

  it('should allow Admin to create users', async () => {
    // Login as admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@pulsecrm.com', password: 'password123' });

    const token = loginRes.body.accessToken;

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Authorized Rep',
        email: 'rep.created@pulsecrm.com',
        role: 'sales_rep',
      });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('rep.created@pulsecrm.com');
  });

  it('should forbid unauthenticated request to protected route', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });
});
