import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();
let authToken: string;

beforeAll(async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@pulsecrm.com', password: 'password123' });
  authToken = loginRes.body.accessToken;
});

describe('Contacts Integration Tests', () => {
  it('should return paginated contacts matching frontend pagination shape', async () => {
    const res = await request(app)
      .get('/api/contacts?page=1&limit=5')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.length).toBe(5);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(5);
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(50);
  });

  it('should filter contacts by search term', async () => {
    const res = await request(app)
      .get('/api/contacts?search=TechFlow')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].company).toContain('TechFlow');
  });

  it('should create a contact successfully', async () => {
    const newContact = {
      name: 'Michael Scott',
      email: 'm.scott@dundermifflin.com',
      company: 'Dunder Mifflin',
      title: 'Regional Manager',
      status: 'customer',
      source: 'referral',
      value: 45000,
    };

    const res = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newContact);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Michael Scott');
  });

  it('should reject contact creation with invalid email', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Invalid Email Person',
        email: 'not-an-email',
        company: 'Acme',
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should update an existing contact', async () => {
    const res = await request(app)
      .patch('/api/contacts/cnt-1')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Promoted Senior VP' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Promoted Senior VP');
  });

  it('should delete a contact', async () => {
    const res = await request(app)
      .delete('/api/contacts/cnt-2')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should bulk delete contacts', async () => {
    const res = await request(app)
      .post('/api/contacts/bulk-delete')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ ids: ['cnt-3', 'cnt-4'] });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should export contacts as CSV', async () => {
    const res = await request(app)
      .get('/api/contacts/export')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text).toContain('Name');
    expect(res.text).toContain('Email');
  });
});
