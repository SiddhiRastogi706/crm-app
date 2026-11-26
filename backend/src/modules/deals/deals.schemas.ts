import { z } from 'zod';

export const createDealSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  contactId: z.string().min(1, 'Contact is required'),
  contactName: z.string().optional().default('Primary Contact'),
  company: z.string().min(1, 'Company is required'),
  value: z.coerce.number().min(0, 'Value must be positive'),
  stage: z.enum(['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost']).default('new'),
  probability: z.coerce.number().min(0).max(100).optional().default(20),
  expectedCloseDate: z.string().optional(),
  ownerId: z.string().optional().default('user-3'),
  ownerName: z.string().optional().default('Sam Rivera'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  lostReason: z.string().optional(),
  notes: z.string().optional(),
});

export const updateDealSchema = createDealSchema.partial();
