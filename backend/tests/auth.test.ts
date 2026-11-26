import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Auth Integration Tests', () => {
  it('should login successfully with valid demo credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@pulsecrm.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('admin@pulsecrm.com');
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('should return 401 on incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@pulsecrm.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Invalid email or password');
  });

  it('should register a new user successfully', async () => {
    const newUser = {
      name: 'New Tester',
      email: 'tester@pulsecrm.com',
      password: 'password123',
      role: 'sales_rep',
    };

    const res = await request(app).post('/api/auth/register').send(newUser);

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('tester@pulsecrm.com');
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it('should reject registration with already used email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Alex Duplicate',
        email: 'admin@pulsecrm.com',
        password: 'password123',
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain('already exists');
  });

  it('should refresh access token using valid refresh token', async () => {
    // 1. Login to get refresh token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'sales@pulsecrm.com', password: 'password123' });

    const { refreshToken } = loginRes.body;

    // 2. Refresh
    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.accessToken).toBeDefined();
    expect(refreshRes.body.refreshToken).toBeDefined();
  });

  it('should return current user with valid Bearer token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'manager@pulsecrm.com', password: 'password123' });

    const { accessToken } = loginRes.body;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('manager@pulsecrm.com');
  });

  it('should return 401 when accessing /me without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
