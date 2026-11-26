import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  contactId: z.string().optional(),
  contactName: z.string().optional(),
  dealId: z.string().optional(),
  assignedToId: z.string().optional().default('user-1'),
  assignedToName: z.string().optional().default('Alex Morgan'),
});

export const updateTaskSchema = createTaskSchema.partial();
