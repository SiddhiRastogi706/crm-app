import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  subject: z.string().min(2, 'Subject is required'),
  status: z.enum(['draft', 'scheduled', 'sent']).default('draft'),
  segment: z.enum(['all_leads', 'hot_leads', 'existing_customers', 'inactive_30d']).default('all_leads'),
  scheduledAt: z.string().optional(),
  sentAt: z.string().optional(),
  stats: z
    .object({
      sent: z.number().default(0),
      opened: z.number().default(0),
      clicked: z.number().default(0),
      bounced: z.number().default(0),
    })
    .optional(),
});
