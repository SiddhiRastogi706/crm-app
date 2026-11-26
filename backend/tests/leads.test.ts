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

describe('Leads Integration Tests', () => {
  it('should list all leads', async () => {
    const res = await request(app)
      .get('/api/leads')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(30);
  });

  it('should calculate lead score automatically based on title and company profile', async () => {
    const highValueLead = {
      name: 'Dr. Gregory House',
      email: 'house@princetonplainsboro.org',
      company: 'Global Health Enterprise Systems',
      title: 'Chief of Diagnostic Medicine',
      source: 'referral',
      estimatedValue: 85000,
    };

    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${authToken}`)
      .send(highValueLead);

    expect(res.status).toBe(201);
    expect(res.body.score).toBeGreaterThanOrEqual(80);
  });

  it('should atomically convert lead into contact and deal in single transaction', async () => {
    // 1. First create a lead to convert
    const leadRes = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Rachel Zane',
        email: 'rachel.zane@pearsonhardman.com',
        company: 'Pearson Hardman Law',
        title: 'Managing Partner',
        source: 'linkedin',
        estimatedValue: 50000,
      });

    const leadId = leadRes.body.id;

    // 2. Convert lead
    const convertRes = await request(app)
      .post(`/api/leads/${leadId}/convert`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Pearson Hardman - CRM Modernization',
        value: 50000,
        stage: 'proposal',
      });

    expect(convertRes.status).toBe(200);
    expect(convertRes.body.contact).toBeDefined();
    expect(convertRes.body.contact.name).toBe('Rachel Zane');
    expect(convertRes.body.contact.status).toBe('customer');
    expect(convertRes.body.deal).toBeDefined();
    expect(convertRes.body.deal.title).toBe('Pearson Hardman - CRM Modernization');
    expect(convertRes.body.deal.stage).toBe('proposal');

    // 3. Verify lead is no longer in active leads list (soft deleted)
    const listRes = await request(app)
      .get('/api/leads')
      .set('Authorization', `Bearer ${authToken}`);

    const foundLead = listRes.body.find((l: any) => l.id === leadId);
    expect(foundLead).toBeUndefined();
  });
});
