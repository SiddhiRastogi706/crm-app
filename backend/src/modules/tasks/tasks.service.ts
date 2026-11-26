import { taskRepository, TaskFilterOptions } from '../../repositories/task.repository';
import { AppError } from '../../utils/AppError';

export class TaskService {
  async getTasks(options: TaskFilterOptions, userRole?: string, userId?: string) {
    if (userRole === 'SALES_REP' && userId && !options.assignedToId) {
      options.assignedToId = userId;
    }
    return taskRepository.findAll(options);
  }

  async getTaskById(id: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError('Task not found', 404);
    return task;
  }

  async createTask(data: any) {
    return taskRepository.create(data);
  }

  async updateTask(id: string, updates: any) {
    const existing = await taskRepository.findById(id);
    if (!existing) throw new AppError('Task not found', 404);

    const updated = await taskRepository.update(id, updates);
    return updated;
  }

  async deleteTask(id: string) {
    const existing = await taskRepository.findById(id);
    if (!existing) throw new AppError('Task not found', 404);

    await taskRepository.delete(id);
    return { success: true };
  }

  async getCalendarEvents(options: TaskFilterOptions) {
    const tasks = await taskRepository.findAll(options);
    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      start: `${t.dueDate}T09:00:00`,
      end: `${t.dueDate}T10:00:00`,
      allDay: true,
      priority: t.priority,
      status: t.status,
      contactName: t.contactName,
      assignedToName: t.assignedToName,
      isOverdue: t.status !== 'completed' && new Date(t.dueDate) < new Date(),
    }));
  }
}

export const taskService = new TaskService();
