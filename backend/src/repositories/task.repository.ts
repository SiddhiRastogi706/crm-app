import { prisma, isPrismaConnected } from '../lib/prisma';
import { dbStore } from './dbStore';
import { SeedTask } from '../data/seedData';
import { logger } from '../config/logger';

export interface TaskFilterOptions {
  contactId?: string;
  status?: string;
  assignedToId?: string;
  startDate?: string;
  endDate?: string;
}

export class TaskRepository {
  async findAll(options: TaskFilterOptions = {}): Promise<SeedTask[]> {
    if (isPrismaConnected()) {
      try {
        const where: any = {};
        if (options.contactId) where.contactId = options.contactId;
        if (options.status) where.status = options.status.toUpperCase();
        if (options.assignedToId) where.assignedToId = options.assignedToId;
        if (options.startDate || options.endDate) {
          where.dueDate = {};
          if (options.startDate) where.dueDate.gte = new Date(options.startDate);
          if (options.endDate) where.dueDate.lte = new Date(options.endDate);
        }

        const tasks = await prisma.task.findMany({
          where,
          orderBy: { dueDate: 'asc' },
        });

        if (tasks) {
          return tasks.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description || undefined,
            dueDate: t.dueDate.toISOString().split('T')[0],
            priority: t.priority.toLowerCase() as any,
            status: t.status.toLowerCase() as any,
            contactId: t.contactId || undefined,
            contactName: t.contactName || undefined,
            dealId: t.dealId || undefined,
            assignedToId: t.assignedToId || '',
            assignedToName: t.assignedToName || '',
            createdAt: t.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma task findAll fallback');
      }
    }

    let list = [...dbStore.tasks];
    if (options.contactId) list = list.filter((t) => t.contactId === options.contactId);
    if (options.status) list = list.filter((t) => t.status === options.status);
    if (options.assignedToId) list = list.filter((t) => t.assignedToId === options.assignedToId);
    if (options.startDate) list = list.filter((t) => t.dueDate >= options.startDate!);
    if (options.endDate) list = list.filter((t) => t.dueDate <= options.endDate!);

    return list;
  }

  async findById(id: string): Promise<SeedTask | null> {
    if (isPrismaConnected()) {
      try {
        const t = await prisma.task.findUnique({ where: { id } });
        if (t) {
          return {
            id: t.id,
            title: t.title,
            description: t.description || undefined,
            dueDate: t.dueDate.toISOString().split('T')[0],
            priority: t.priority.toLowerCase() as any,
            status: t.status.toLowerCase() as any,
            contactId: t.contactId || undefined,
            contactName: t.contactName || undefined,
            dealId: t.dealId || undefined,
            assignedToId: t.assignedToId || '',
            assignedToName: t.assignedToName || '',
            createdAt: t.createdAt.toISOString(),
          };
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma task findById fallback');
      }
    }
    const found = dbStore.tasks.find((t) => t.id === id);
    return found || null;
  }

  async create(data: Partial<SeedTask>): Promise<SeedTask> {
    const id = data.id || `task-${Date.now()}`;
    const newTask: SeedTask = {
      id,
      title: data.title || 'New Task',
      description: data.description,
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      priority: data.priority || 'medium',
      status: data.status || 'pending',
      contactId: data.contactId,
      contactName: data.contactName,
      dealId: data.dealId,
      assignedToId: data.assignedToId || 'user-1',
      assignedToName: data.assignedToName || 'Alex Morgan',
      createdAt: new Date().toISOString(),
    };

    if (isPrismaConnected()) {
      try {
        await prisma.task.create({
          data: {
            id: newTask.id,
            title: newTask.title,
            description: newTask.description,
            dueDate: new Date(newTask.dueDate),
            priority: newTask.priority.toUpperCase() as any,
            status: newTask.status.toUpperCase() as any,
            contactId: newTask.contactId,
            contactName: newTask.contactName,
            dealId: newTask.dealId,
            assignedToId: newTask.assignedToId,
            assignedToName: newTask.assignedToName,
          },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma create task fallback to dbStore');
      }
    }

    dbStore.tasks.unshift(newTask);
    return newTask;
  }

  async update(id: string, updates: Partial<SeedTask>): Promise<SeedTask | null> {
    if (isPrismaConnected()) {
      try {
        const prismaUpdates: any = { ...updates };
        if (updates.priority) prismaUpdates.priority = updates.priority.toUpperCase();
        if (updates.status) prismaUpdates.status = updates.status.toUpperCase();
        if (updates.dueDate) prismaUpdates.dueDate = new Date(updates.dueDate);

        await prisma.task.update({
          where: { id },
          data: prismaUpdates,
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma update task fallback');
      }
    }

    const idx = dbStore.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    dbStore.tasks[idx] = { ...dbStore.tasks[idx], ...updates };
    return dbStore.tasks[idx];
  }

  async delete(id: string): Promise<boolean> {
    if (isPrismaConnected()) {
      try {
        await prisma.task.delete({ where: { id } });
      } catch (err) {
        logger.debug({ err }, 'Prisma delete task fallback');
      }
    }
    const lenBefore = dbStore.tasks.length;
    dbStore.tasks = dbStore.tasks.filter((t) => t.id !== id);
    return dbStore.tasks.length < lenBefore;
  }
}

export const taskRepository = new TaskRepository();
