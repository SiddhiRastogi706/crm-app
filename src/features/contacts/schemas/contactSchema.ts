import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Valid email required'),
  phone: z.string().min(5, 'Phone number is required'),
  company: z.string().min(2, 'Company name is required'),
  title: z.string().min(2, 'Job title is required'),
  status: z.enum(['lead', 'active', 'inactive', 'customer']),
  source: z.enum(['website', 'referral', 'linkedin', 'outbound', 'conference']),
  ownerId: z.string().min(1, 'Please assign an account owner'),
  ownerName: z.string().optional(),
  value: z.coerce.number().min(0, 'Value must be positive'),
  tags: z.string().optional(), // Comma-separated in form
  notes: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
