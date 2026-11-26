import { dealRepository } from '../../repositories/deal.repository';
import { AppError } from '../../utils/AppError';

export class DealService {
  async getDeals(userRole?: string, userId?: string) {
    const deals = await dealRepository.findAll();
    if (userRole === 'SALES_REP' && userId) {
      return deals.filter((d) => d.ownerId === userId);
    }
    return deals;
  }

  async getDealById(id: string) {
    const deal = await dealRepository.findById(id);
    if (!deal) throw new AppError('Deal not found', 404);
    return deal;
  }

  async createDeal(data: any) {
    return dealRepository.create(data);
  }

  async updateDeal(id: string, updates: any, changedById?: string) {
    const existing = await dealRepository.findById(id);
    if (!existing) throw new AppError('Deal not found', 404);

    const updated = await dealRepository.update(id, updates, changedById);
    return updated;
  }

  async deleteDeal(id: string) {
    const existing = await dealRepository.findById(id);
    if (!existing) throw new AppError('Deal not found', 404);

    await dealRepository.softDelete(id);
    return { success: true };
  }

  async getPipelineSummary() {
    return dealRepository.getPipelineSummary();
  }
}

export const dealService = new DealService();
