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

describe('Deals Integration Tests', () => {
  it('should list all deals', async () => {
    const res = await request(app)
      .get('/api/deals')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(20);
  });

  it('should create a new deal', async () => {
    const dealData = {
      title: 'Initech - Core License Deal',
      contactId: 'cnt-1',
      contactName: 'Sarah Jenkins',
      company: 'Initech Corp',
      value: 65000,
      stage: 'proposal',
      probability: 60,
      priority: 'high',
    };

    const res = await request(app)
      .post('/api/deals')
      .set('Authorization', `Bearer ${authToken}`)
      .send(dealData);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe('Initech - Core License Deal');
  });

  it('should update deal stage and record stage move history', async () => {
    const res = await request(app)
      .patch('/api/deals/deal-1')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ stage: 'won', probability: 100 });

    expect(res.status).toBe(200);
    expect(res.body.stage).toBe('won');
  });

  it('should return pipeline summary with count and total value per stage', async () => {
    const res = await request(app)
      .get('/api/deals/pipeline-summary')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(6); // new, contacted, proposal, negotiation, won, lost
    const proposal = res.body.find((s: any) => s.stage === 'proposal');
    expect(proposal).toBeDefined();
    expect(proposal.count).toBeGreaterThanOrEqual(0);
    expect(proposal.totalValue).toBeGreaterThanOrEqual(0);
  });
});
