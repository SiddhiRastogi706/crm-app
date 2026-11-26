import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/shared/ui/drawer';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Lead } from '@/lib/api/types';
import { SEED_USERS } from '@/lib/mocks/seedData';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Valid email required'),
  phone: z.string().min(5, 'Phone number is required'),
  company: z.string().min(2, 'Company is required'),
  title: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'disqualified']),
  source: z.enum(['organic', 'referral', 'linkedin', 'adwords', 'outbound']),
  score: z.coerce.number().min(0).max(100),
  ownerId: z.string().min(1, 'Owner is required'),
  estimatedValue: z.coerce.number().min(0),
  notes: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
  onSubmit: (data: Partial<Lead>) => Promise<void>;
  isLoading?: boolean;
}

export const LeadDrawer: React.FC<LeadDrawerProps> = ({
  open,
  onOpenChange,
  lead,
  onSubmit,
  isLoading = false,
}) => {
  const isEditing = !!lead;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      status: 'new',
      source: 'organic',
      score: 50,
      ownerId: 'user-3',
      estimatedValue: 25000,
      notes: '',
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        title: lead.title || '',
        status: lead.status,
        source: lead.source,
        score: lead.score,
        ownerId: lead.ownerId,
        estimatedValue: lead.estimatedValue,
        notes: lead.notes || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        status: 'new',
        source: 'organic',
        score: 50,
        ownerId: 'user-3',
        estimatedValue: 25000,
        notes: '',
      });
    }
  }, [lead, reset, open]);

  const handleFormSubmit = async (values: LeadFormValues) => {
    const owner = SEED_USERS.find((u) => u.id === values.ownerId);
    await onSubmit({
      ...values,
      ownerName: owner?.name || 'Sales Rep',
    });
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent size="lg">
        <DrawerHeader>
          <DrawerTitle>{isEditing ? 'Edit Lead' : 'Create Inbound Lead'}</DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? 'Update lead qualification score, ownership and contact information.'
              : 'Add an inbound or prospect lead to track discovery and qualification.'}
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Lead Contact Name *</label>
              <Input placeholder="e.g. Brandon Cole" error={errors.name?.message} {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Work Email *</label>
              <Input type="email" placeholder="bcole@company.com" error={errors.email?.message} {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Company Name *</label>
              <Input placeholder="e.g. Beacon Cybersecurity" error={errors.company?.message} {...register('company')} />
              {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Phone Number *</label>
              <Input placeholder="+1 (555) 000-0000" error={errors.phone?.message} {...register('phone')} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Lead Score (0 - 100)</label>
              <Input type="number" min={0} max={100} error={errors.score?.message} {...register('score')} />
              {errors.score && <p className="text-xs text-destructive">{errors.score.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Est. Deal Value ($)</label>
              <Input type="number" error={errors.estimatedValue?.message} {...register('estimatedValue')} />
              {errors.estimatedValue && <p className="text-xs text-destructive">{errors.estimatedValue.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Status</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                {...register('status')}
              >
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="disqualified">Disqualified</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Source</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                {...register('source')}
              >
                <option value="organic">Organic Search</option>
                <option value="referral">Customer Referral</option>
                <option value="linkedin">LinkedIn Campaign</option>
                <option value="adwords">Google Ads</option>
                <option value="outbound">Outbound SDR</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Assigned Sales Owner</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                {...register('ownerId')}
              >
                {SEED_USERS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Qualification Notes</label>
              <textarea
                rows={3}
                placeholder="Product interest, budget, timeline, key stakeholder contacts..."
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                {...register('notes')}
              />
            </div>
          </div>

          <DrawerFooter className="px-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {isEditing ? 'Save Changes' : 'Create Lead'}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
