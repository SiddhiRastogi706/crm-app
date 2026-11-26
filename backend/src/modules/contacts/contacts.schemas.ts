import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional().default(''),
  company: z.string().min(1, 'Company is required'),
  title: z.string().optional().default(''),
  status: z.enum(['lead', 'active', 'inactive', 'customer']).optional().default('lead'),
  source: z.enum(['website', 'referral', 'linkedin', 'outbound', 'conference']).optional().default('website'),
  ownerId: z.string().optional().default('user-1'),
  ownerName: z.string().optional().default('Alex Morgan'),
  value: z.coerce.number().optional().default(0),
  tags: z.array(z.string()).optional().default([]),
  notes: z.string().optional(),
});

export const updateContactSchema = createContactSchema.partial();

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one ID is required'),
});

export const contactQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  ownerId: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});
