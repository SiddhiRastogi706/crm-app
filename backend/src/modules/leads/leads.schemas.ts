import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional().default(''),
  company: z.string().min(1, 'Company is required'),
  title: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'disqualified']).optional().default('new'),
  source: z.enum(['organic', 'referral', 'linkedin', 'adwords', 'outbound']).optional().default('organic'),
  score: z.coerce.number().min(0).max(100).optional(),
  ownerId: z.string().optional().default('user-3'),
  ownerName: z.string().optional().default('Sam Rivera'),
  estimatedValue: z.coerce.number().optional().default(15000),
  notes: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const convertLeadSchema = z.object({
  title: z.string().optional(),
  value: z.coerce.number().optional(),
  stage: z.enum(['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost']).optional(),
});
