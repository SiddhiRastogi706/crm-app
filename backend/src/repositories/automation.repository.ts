import { prisma, isPrismaConnected } from '../lib/prisma';
import { dbStore } from './dbStore';
import { SeedAutomationRule } from '../data/seedData';
import { logger } from '../config/logger';

export class AutomationRepository {
  async findAll(): Promise<SeedAutomationRule[]> {
    if (isPrismaConnected()) {
      try {
        const rules = await prisma.automationRule.findMany({ orderBy: { createdAt: 'desc' } });
        if (rules) {
          return rules.map((r) => ({
            id: r.id,
            name: r.name,
            trigger: r.trigger.toLowerCase() as any,
            conditionField: r.conditionField,
            conditionOperator: r.conditionOperator.toLowerCase() as any,
            conditionValue: r.conditionValue,
            actionType: r.actionType.toLowerCase() as any,
            actionTarget: r.actionTarget,
            actionPayload: r.actionPayload || undefined,
            enabled: r.enabled,
            executionCount: r.executionCount,
            lastExecutedAt: r.lastExecutedAt ? r.lastExecutedAt.toISOString() : undefined,
          }));
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma automation findAll fallback');
      }
    }

    return dbStore.automations;
  }

  async findById(id: string): Promise<SeedAutomationRule | null> {
    if (isPrismaConnected()) {
      try {
        const r = await prisma.automationRule.findUnique({ where: { id } });
        if (r) {
          return {
            id: r.id,
            name: r.name,
            trigger: r.trigger.toLowerCase() as any,
            conditionField: r.conditionField,
            conditionOperator: r.conditionOperator.toLowerCase() as any,
            conditionValue: r.conditionValue,
            actionType: r.actionType.toLowerCase() as any,
            actionTarget: r.actionTarget,
            actionPayload: r.actionPayload || undefined,
            enabled: r.enabled,
            executionCount: r.executionCount,
            lastExecutedAt: r.lastExecutedAt ? r.lastExecutedAt.toISOString() : undefined,
          };
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma automation findById fallback');
      }
    }

    const found = dbStore.automations.find((a) => a.id === id);
    return found || null;
  }

  async create(data: Partial<SeedAutomationRule>): Promise<SeedAutomationRule> {
    const id = data.id || `auto-${Date.now()}`;
    const newRule: SeedAutomationRule = {
      id,
      name: data.name || 'New Automation Rule',
      trigger: data.trigger || 'lead_created',
      conditionField: data.conditionField || 'score',
      conditionOperator: data.conditionOperator || 'greater_than',
      conditionValue: data.conditionValue || '70',
      actionType: data.actionType || 'assign_owner',
      actionTarget: data.actionTarget || 'user-3',
      actionPayload: data.actionPayload,
      enabled: data.enabled !== undefined ? data.enabled : true,
      executionCount: 0,
    };

    if (isPrismaConnected()) {
      try {
        await prisma.automationRule.create({
          data: {
            id: newRule.id,
            name: newRule.name,
            trigger: newRule.trigger.toUpperCase() as any,
            conditionField: newRule.conditionField,
            conditionOperator: newRule.conditionOperator.toUpperCase() as any,
            conditionValue: newRule.conditionValue,
            actionType: newRule.actionType.toUpperCase() as any,
            actionTarget: newRule.actionTarget,
            actionPayload: newRule.actionPayload,
            enabled: newRule.enabled,
            executionCount: 0,
          },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma create automation fallback to dbStore');
      }
    }

    dbStore.automations.unshift(newRule);
    return newRule;
  }

  async update(id: string, updates: Partial<SeedAutomationRule>): Promise<SeedAutomationRule | null> {
    if (isPrismaConnected()) {
      try {
        const prismaUpdates: any = { ...updates };
        if (updates.trigger) prismaUpdates.trigger = updates.trigger.toUpperCase();
        if (updates.conditionOperator) prismaUpdates.conditionOperator = updates.conditionOperator.toUpperCase();
        if (updates.actionType) prismaUpdates.actionType = updates.actionType.toUpperCase();

        await prisma.automationRule.update({
          where: { id },
          data: prismaUpdates,
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma update automation fallback');
      }
    }

    const idx = dbStore.automations.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    dbStore.automations[idx] = { ...dbStore.automations[idx], ...updates };
    return dbStore.automations[idx];
  }

  async delete(id: string): Promise<boolean> {
    if (isPrismaConnected()) {
      try {
        await prisma.automationRule.delete({ where: { id } });
      } catch (err) {
        logger.debug({ err }, 'Prisma delete automation fallback');
      }
    }
    const lenBefore = dbStore.automations.length;
    dbStore.automations = dbStore.automations.filter((a) => a.id !== id);
    return dbStore.automations.length < lenBefore;
  }
}

export const automationRepository = new AutomationRepository();
