import cron from 'node-cron';
import { automationRepository } from '../../repositories/automation.repository';
import { leadRepository } from '../../repositories/lead.repository';
import { taskRepository } from '../../repositories/task.repository';
import { logger } from '../../config/logger';

export class AutomationWorker {
  private scheduledTask: cron.ScheduledTask | null = null;

  start() {
    // Run every 5 minutes in production, or periodically
    this.scheduledTask = cron.schedule('*/5 * * * *', async () => {
      await this.runAutomationCycle();
    });
    logger.info('Automation worker scheduled (every 5 minutes)');
  }

  stop() {
    if (this.scheduledTask) {
      this.scheduledTask.stop();
      logger.info('Automation worker stopped');
    }
  }

  async runAutomationCycle() {
    try {
      const rules = await automationRepository.findAll();
      const activeRules = rules.filter((r) => r.enabled);
      if (activeRules.length === 0) return;

      const leads = await leadRepository.findAll();

      for (const rule of activeRules) {
        if (rule.trigger === 'lead_created') {
          for (const lead of leads) {
            let matched = false;
            const fieldVal = (lead as any)[rule.conditionField];

            if (rule.conditionOperator === 'greater_than') {
              matched = Number(fieldVal) > Number(rule.conditionValue);
            } else if (rule.conditionOperator === 'equals') {
              matched = String(fieldVal).toLowerCase() === String(rule.conditionValue).toLowerCase();
            } else if (rule.conditionOperator === 'contains') {
              matched = String(fieldVal).toLowerCase().includes(String(rule.conditionValue).toLowerCase());
            }

            if (matched && lead.ownerId !== rule.actionTarget) {
              if (rule.actionType === 'assign_owner') {
                await leadRepository.update(lead.id, {
                  ownerId: rule.actionTarget,
                  ownerName: rule.actionTarget === 'user-3' ? 'Sam Rivera' : 'Alex Morgan',
                });
                await automationRepository.update(rule.id, {
                  executionCount: rule.executionCount + 1,
                  lastExecutedAt: new Date().toISOString(),
                });
              } else if (rule.actionType === 'create_task') {
                await taskRepository.create({
                  title: rule.actionTarget,
                  description: rule.actionPayload || 'Automated task created by rule',
                  dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                  priority: 'high',
                  assignedToId: lead.ownerId || 'user-1',
                });
                await automationRepository.update(rule.id, {
                  executionCount: rule.executionCount + 1,
                  lastExecutedAt: new Date().toISOString(),
                });
              }
            }
          }
        }
      }
    } catch (err) {
      logger.error({ err }, 'Error running automation cycle');
    }
  }
}

export const automationWorker = new AutomationWorker();
