import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Campaign, AudienceSegment, CampaignStatus } from '@/lib/api/types';

const campaignSchema = z.object({
  name: z.string().min(2, 'Campaign name is required'),
  subject: z.string().min(3, 'Email subject line is required'),
  segment: z.enum(['all_leads', 'hot_leads', 'existing_customers', 'inactive_30d']),
  status: z.enum(['draft', 'scheduled', 'sent']),
  scheduledAt: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

interface CampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Partial<Campaign>) => Promise<void>;
  isLoading?: boolean;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      subject: '',
      segment: 'all_leads',
      status: 'sent',
    },
  });

  const selectedStatus = watch('status');

  const handleFormSubmit = async (values: CampaignFormValues) => {
    await onSubmit(values);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Email Campaign</DialogTitle>
          <DialogDescription>
            Broadcast product announcements, nurture leads, or re-engage past clients.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Campaign Name *</label>
            <Input
              placeholder="e.g. Q4 Enterprise AI Webinar Announcement"
              error={errors.name?.message}
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Email Subject Line *</label>
            <Input
              placeholder="e.g. Exclusive Invite: Accelerate Sales Velocity with AI"
              error={errors.subject?.message}
              {...register('subject')}
            />
            {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Target Audience Segment</label>
            <select
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              {...register('segment')}
            >
              <option value="all_leads">All Qualified Leads (2,450 accounts)</option>
              <option value="hot_leads">Hot Leads (Score ≥ 75) (340 accounts)</option>
              <option value="existing_customers">Existing Customers & Renewals (820 accounts)</option>
              <option value="inactive_30d">Inactive Prospects &gt; 30 Days (510 accounts)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Delivery Schedule</label>
            <select
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              {...register('status')}
            >
              <option value="sent">Send Immediately (Simulate Blast)</option>
              <option value="scheduled">Schedule for Later</option>
              <option value="draft">Save as Draft</option>
            </select>
          </div>

          {selectedStatus === 'scheduled' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Send Date & Time</label>
              <Input type="datetime-local" {...register('scheduledAt')} />
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {selectedStatus === 'sent' ? 'Launch Campaign' : 'Save Campaign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
