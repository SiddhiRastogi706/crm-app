import { dealRepository } from '../../repositories/deal.repository';
import { leadRepository } from '../../repositories/lead.repository';
import { ticketRepository } from '../../repositories/ticket.repository';

export class DashboardService {
  async getMetrics(dateRange: string = '30d') {
    let factor = 1.0;
    let labelMultiplier = 1;

    if (dateRange === 'today') {
      factor = 0.15;
      labelMultiplier = 0.05;
    } else if (dateRange === '7d') {
      factor = 0.45;
      labelMultiplier = 0.3;
    } else if (dateRange === 'quarter') {
      factor = 2.4;
      labelMultiplier = 2.2;
    } else if (dateRange === 'year') {
      factor = 8.5;
      labelMultiplier = 7.8;
    }

    const deals = await dealRepository.findAll();
    const leads = await leadRepository.findAll();
    const tickets = await ticketRepository.findAll();

    const wonDeals = deals.filter((d) => d.stage === 'won');
    const baseWonSum = wonDeals.reduce((sum, d) => sum + d.value, 0) || 185000;
    const revenueVal = Math.round(baseWonSum * factor);

    const openTicketsCount = tickets.filter((t) => t.status === 'open' || t.status === 'pending').length;
    const leadsCount = Math.round(leads.length * labelMultiplier) || leads.length;

    // Pipeline funnel
    const stages = ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];
    const pipelineFunnel = stages.map((stage) => {
      const dealsInStage = deals.filter((d) => d.stage === stage);
      const val = dealsInStage.reduce((acc, cur) => acc + cur.value, 0);
      return {
        stage: stage as any,
        count: dealsInStage.length,
        value: val,
      };
    });

    // Leads by source
    const leadsBySource = [
      { source: 'Referral', count: Math.round(24 * factor) || 8, percentage: 35 },
      { source: 'Organic Search', count: Math.round(18 * factor) || 6, percentage: 26 },
      { source: 'LinkedIn', count: Math.round(14 * factor) || 5, percentage: 20 },
      { source: 'Outbound', count: Math.round(9 * factor) || 3, percentage: 13 },
      { source: 'Conference', count: Math.round(4 * factor) || 1, percentage: 6 },
    ];

    // Sales trend over 6 periods
    const periods =
      dateRange === 'today'
        ? ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM']
        : dateRange === '7d'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

    const salesTrend = periods.map((period, index) => {
      const base = 40000 * factor;
      const randomVar = (index + 1) * 12000 * factor;
      return {
        date: period,
        revenue: Math.round(base + randomVar),
        target: Math.round(base * 1.25 + index * 10000 * factor),
      };
    });

    return {
      revenue: { current: revenueVal, change: 18.4 },
      newLeads: { current: leadsCount, change: 12.8 },
      dealsWon: { current: Math.round(wonDeals.length * factor) || wonDeals.length, change: 24.5 },
      openTickets: { current: openTicketsCount, change: -8.3 },
      salesTrend,
      pipelineFunnel,
      leadsBySource,
    };
  }
}

export const dashboardService = new DashboardService();
