import { z } from 'zod';

export const createAutomationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  trigger: z.enum(['lead_created', 'deal_won', 'ticket_created', 'deal_stage_changed']),
  conditionField: z.string().min(1, 'Condition field is required'),
  conditionOperator: z.enum(['equals', 'greater_than', 'contains']),
  conditionValue: z.string().min(1, 'Condition value is required'),
  actionType: z.enum(['assign_owner', 'create_task', 'send_email']),
  actionTarget: z.string().min(1, 'Action target is required'),
  actionPayload: z.string().optional(),
  enabled: z.boolean().default(true),
});

export const updateAutomationSchema = createAutomationSchema.partial();
