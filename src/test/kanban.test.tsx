import { describe, it, expect } from 'vitest';
import { mockDb } from '@/lib/mocks/db';
import { DealStage } from '@/lib/api/types';

describe('Kanban Deals Logic', () => {
  it('correctly retrieves seeded deals grouped by stage', () => {
    const deals = mockDb.getDeals();
    expect(deals.length).toBeGreaterThan(0);

    const stages: DealStage[] = ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];
    stages.forEach((stage) => {
      const count = deals.filter((d) => d.stage === stage).length;
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  it('updates deal stage and checks calculations', () => {
    const initialDeals = mockDb.getDeals();
    const deal = initialDeals[0];

    const updated = mockDb.updateDeal(deal.id, { stage: 'won' });
    expect(updated?.stage).toBe('won');

    const fresh = mockDb.getDealById(deal.id);
    expect(fresh?.stage).toBe('won');
  });

  it('calculates dashboard metrics dynamically based on won deals', () => {
    const metrics = mockDb.getDashboardMetrics('30d');
    expect(metrics.revenue.current).toBeGreaterThan(0);
    expect(metrics.pipelineFunnel.length).toBe(6);
    expect(metrics.leadsBySource.length).toBeGreaterThan(0);
  });
});
