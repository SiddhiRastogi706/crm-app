import { z } from 'zod';

export const createActivitySchema = z.object({
  type: z.enum(['call', 'email', 'meeting', 'note', 'status_change']),
  contactId: z.string().optional(),
  contactName: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  performedBy: z.string().optional().default('Alex Morgan'),
  performedById: z.string().optional(),
  date: z.string().optional(),
  durationMinutes: z.coerce.number().optional(),
  outcome: z.string().optional(),
});
