import { automationRepository } from '../../repositories/automation.repository';
import { AppError } from '../../utils/AppError';

export class AutomationService {
  async getAutomations() {
    return automationRepository.findAll();
  }

  async getAutomationById(id: string) {
    const auto = await automationRepository.findById(id);
    if (!auto) throw new AppError('Automation rule not found', 404);
    return auto;
  }

  async createAutomation(data: any) {
    return automationRepository.create(data);
  }

  async updateAutomation(id: string, updates: any) {
    const existing = await automationRepository.findById(id);
    if (!existing) throw new AppError('Automation rule not found', 404);

    const updated = await automationRepository.update(id, updates);
    return updated;
  }

  async deleteAutomation(id: string) {
    const existing = await automationRepository.findById(id);
    if (!existing) throw new AppError('Automation rule not found', 404);

    await automationRepository.delete(id);
    return { success: true };
  }
}

export const automationService = new AutomationService();
