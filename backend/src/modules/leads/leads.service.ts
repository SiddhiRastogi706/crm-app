import { leadRepository } from '../../repositories/lead.repository';
import { AppError } from '../../utils/AppError';
import { SeedLead } from '../../data/seedData';

export class LeadService {
  calculateLeadScore(lead: Partial<SeedLead>): number {
    let score = 35;
    const title = (lead.title || '').toLowerCase();
    const company = (lead.company || '').toLowerCase();
    const source = (lead.source || '').toLowerCase();
    const val = Number(lead.estimatedValue || 0);

    // Title seniority
    if (title.includes('chief') || title.includes('cto') || title.includes('cfo') || title.includes('ceo') || title.includes('vp') || title.includes('director')) {
      score += 30;
    } else if (title.includes('lead') || title.includes('manager') || title.includes('head')) {
      score += 15;
    }

    // Company profile
    if (company.includes('global') || company.includes('enterprise') || company.includes('tech') || company.includes('systems') || company.includes('corp')) {
      score += 15;
    }

    // High intent acquisition source
    if (source === 'referral') score += 20;
    else if (source === 'linkedin') score += 15;
    else if (source === 'organic') score += 10;

    // Deal potential
    if (val > 60000) score += 15;
    else if (val > 30000) score += 10;

    return Math.min(Math.max(score, 10), 98);
  }

  async getLeads(userRole?: string, userId?: string) {
    const leads = await leadRepository.findAll();
    if (userRole === 'SALES_REP' && userId) {
      return leads.filter((l) => l.ownerId === userId);
    }
    return leads;
  }

  async getLeadById(id: string) {
    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return lead;
  }

  async createLead(data: any) {
    if (data.score === undefined) {
      data.score = this.calculateLeadScore(data);
    }
    return leadRepository.create(data);
  }

  async updateLead(id: string, updates: any) {
    const existing = await leadRepository.findById(id);
    if (!existing) {
      throw new AppError('Lead not found', 404);
    }

    // Recalculate score if factors changed and score was not explicitly passed
    if (updates.score === undefined && (updates.title || updates.company || updates.source || updates.estimatedValue)) {
      updates.score = this.calculateLeadScore({ ...existing, ...updates });
    }

    const updated = await leadRepository.update(id, updates);
    return updated;
  }

  async deleteLead(id: string) {
    const existing = await leadRepository.findById(id);
    if (!existing) {
      throw new AppError('Lead not found', 404);
    }
    await leadRepository.softDelete(id);
    return { success: true };
  }

  async convertLead(id: string, dealData?: { title?: string; value?: number; stage?: string }) {
    const existing = await leadRepository.findById(id);
    if (!existing) {
      throw new AppError('Lead not found', 404);
    }

    const result = await leadRepository.convertLead(id, dealData);
    if (!result) {
      throw new AppError('Failed to convert lead', 400);
    }

    return result;
  }
}

export const leadService = new LeadService();
