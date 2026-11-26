import { dealRepository } from '../../repositories/deal.repository';
import { leadRepository } from '../../repositories/lead.repository';
import { userRepository } from '../../repositories/user.repository';
import { generateCsv } from '../../utils/csv';

export class ReportsService {
  async getSalesRepPerformance() {
    const deals = await dealRepository.findAll();
    const users = await userRepository.findAll();
    const reps = users.filter((u) => u.role === 'sales_rep' || u.role === 'manager');

    return reps.map((rep) => {
      const repDeals = deals.filter((d) => d.ownerId === rep.id);
      const wonDeals = repDeals.filter((d) => d.stage === 'won');
      const totalWonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
      const quota = 100000;
      const attainment = Math.round((totalWonValue / quota) * 100);

      return {
        repId: rep.id,
        repName: rep.name,
        avatar: rep.avatar,
        dealsCount: repDeals.length,
        dealsWon: wonDeals.length,
        totalWonValue,
        quota,
        attainment,
        winRate: repDeals.length > 0 ? Math.round((wonDeals.length / repDeals.length) * 100) : 0,
      };
    });
  }

  async getConversionReport() {
    const leads = await leadRepository.findAll();
    const deals = await dealRepository.findAll();

    const sources = ['organic', 'referral', 'linkedin', 'adwords', 'outbound'];
    return sources.map((source) => {
      const sourceLeads = leads.filter((l) => l.source === source);
      const qualified = sourceLeads.filter((l) => l.status === 'qualified');
      return {
        source,
        totalLeads: sourceLeads.length,
        qualifiedCount: qualified.length,
        conversionRate: sourceLeads.length > 0 ? Math.round((qualified.length / sourceLeads.length) * 100) : 0,
      };
    });
  }

  async getForecastReport() {
    const deals = await dealRepository.findAll();
    const activeDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');

    const totalPipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
    const weightedForecastValue = activeDeals.reduce(
      (sum, d) => sum + Math.round(d.value * (d.probability / 100)),
      0
    );

    return {
      activeDealCount: activeDeals.length,
      totalPipelineValue,
      weightedForecastValue,
      stages: [
        { stage: 'new', probability: 20, deals: activeDeals.filter((d) => d.stage === 'new').length },
        { stage: 'contacted', probability: 40, deals: activeDeals.filter((d) => d.stage === 'contacted').length },
        { stage: 'proposal', probability: 60, deals: activeDeals.filter((d) => d.stage === 'proposal').length },
        { stage: 'negotiation', probability: 80, deals: activeDeals.filter((d) => d.stage === 'negotiation').length },
      ],
    };
  }

  async exportReportCsv() {
    const repData = await this.getSalesRepPerformance();
    const rows = repData.map((r) => ({
      SalesRep: r.repName,
      DealsAssigned: r.dealsCount,
      DealsWon: r.dealsWon,
      TotalWonValue: `$${r.totalWonValue.toLocaleString()}`,
      Quota: `$${r.quota.toLocaleString()}`,
      QuotaAttainment: `${r.attainment}%`,
      WinRate: `${r.winRate}%`,
    }));
    return generateCsv(rows);
  }
}

export const reportsService = new ReportsService();
