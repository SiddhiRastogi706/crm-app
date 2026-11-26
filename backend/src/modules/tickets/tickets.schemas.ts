import { z } from 'zod';

export const createTicketSchema = z.object({
  subject: z.string().min(2, 'Subject is required'),
  description: z.string().min(2, 'Description is required'),
  contactId: z.string().min(1, 'Contact is required'),
  contactName: z.string().optional().default('Sarah Jenkins'),
  company: z.string().min(1, 'Company is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['open', 'pending', 'resolved', 'closed']).default('open'),
  assignedToId: z.string().optional().default('user-1'),
  assignedToName: z.string().optional().default('Alex Morgan'),
});

export const updateTicketSchema = createTicketSchema.partial();

export const addCommentSchema = z.object({
  authorId: z.string().min(1, 'Author ID is required'),
  authorName: z.string().min(1, 'Author name is required'),
  content: z.string().min(1, 'Content is required'),
  isInternal: z.boolean().default(false),
});
