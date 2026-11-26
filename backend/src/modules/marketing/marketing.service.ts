import { marketingRepository } from '../../repositories/marketing.repository';

export class MarketingService {
  async getCampaigns() {
    return marketingRepository.findAll();
  }

  async createCampaign(data: any) {
    return marketingRepository.create(data);
  }

  async getSegments() {
    return [
      { id: 'all_leads', name: 'All Leads', count: 35, description: 'Every registered lead currently in system' },
      { id: 'hot_leads', name: 'Hot Leads (Score > 75)', count: 14, description: 'Leads with score >= 75 ready for closing' },
      { id: 'existing_customers', name: 'Existing Customers', count: 28, description: 'Accounts with won deals and active status' },
      { id: 'inactive_30d', name: 'Inactive 30+ Days', count: 12, description: 'Contacts with no activity in over 30 days' },
    ];
  }
}

export const marketingService = new MarketingService();
