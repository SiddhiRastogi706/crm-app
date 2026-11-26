import React, { useEffect, useState } from 'react';
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
import { Deal, DealStage, DealPriority } from '@/lib/api/types';
import { SEED_USERS } from '@/lib/mocks/seedData';
import { useQuery } from '@tanstack/react-query';
import { contactService } from '@/features/contacts/services/contactService';

const dealFormSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  company: z.string().min(2, 'Company is required'),
  contactId: z.string().min(1, 'Contact is required'),
  value: z.coerce.number().min(0, 'Value must be positive'),
  stage: z.enum(['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost']),
  probability: z.coerce.number().min(0).max(100),
  expectedCloseDate: z.string().min(1, 'Close date required'),
  priority: z.enum(['low', 'medium', 'high']),
  ownerId: z.string().min(1, 'Owner required'),
  notes: z.string().optional(),
});

type DealFormValues = z.infer<typeof dealFormSchema>;

interface DealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal?: Deal | null;
  defaultStage?: DealStage;
  onSubmit: (values: Partial<Deal>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const DealModal: React.FC<DealModalProps> = ({
  open,
  onOpenChange,
  deal,
  defaultStage = 'new',
  onSubmit,
  onDelete,
  isLoading = false,
}) => {
  const isEditing = !!deal;

  const { data: contactsData } = useQuery({
    queryKey: ['contacts-dropdown'],
    queryFn: () => contactService.getContacts({ limit: 50 }),
  });
  const contacts = contactsData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: '',
      company: '',
      contactId: '',
      value: 50000,
      stage: defaultStage,
      probability: 50,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'medium',
      ownerId: 'user-3',
      notes: '',
    },
  });

  useEffect(() => {
    if (deal) {
      reset({
        title: deal.title,
        company: deal.company,
        contactId: deal.contactId,
        value: deal.value,
        stage: deal.stage,
        probability: deal.probability,
        expectedCloseDate: deal.expectedCloseDate,
        priority: deal.priority,
        ownerId: deal.ownerId,
        notes: deal.notes || '',
      });
    } else {
      reset({
        title: '',
        company: '',
        contactId: contacts[0]?.id || '',
        value: 50000,
        stage: defaultStage,
        probability: 50,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium',
        ownerId: 'user-3',
        notes: '',
      });
    }
  }, [deal, defaultStage, reset, open]);

  // When contact changes, update company
  const selectedContactId = watch('contactId');
  useEffect(() => {
    if (selectedContactId) {
      const match = contacts.find((c) => c.id === selectedContactId);
      if (match && !isEditing) {
        setValue('company', match.company);
        setValue('title', `${match.company} - Platform License`);
      }
    }
  }, [selectedContactId, contacts, isEditing, setValue]);

  const handleFormSubmit = async (values: DealFormValues) => {
    const owner = SEED_USERS.find((u) => u.id === values.ownerId);
    const contact = contacts.find((c) => c.id === values.contactId);

    await onSubmit({
      ...values,
      ownerName: owner?.name || 'Sales Rep',
      contactName: contact?.name || 'Primary Contact',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Deal Opportunity Details' : 'Create New Deal'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update deal value, stage progression, probability, and target close dates.'
              : 'Add an active sales opportunity to your pipeline Kanban.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Deal Title *</label>
              <Input placeholder="e.g. Acme Corp - Enterprise Expansion" error={errors.title?.message} {...register('title')} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Associated Contact *</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                {...register('contactId')}
              >
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Company Name *</label>
              <Input placeholder="Company" error={errors.company?.message} {...register('company')} />
              {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Deal Value ($) *</label>
              <Input type="number" error={errors.value?.message} {...register('value')} />
              {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Pipeline Stage</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary capitalize"
                {...register('stage')}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Closed Won</option>
                <option value="lost">Closed Lost</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Probability (%)</label>
              <Input type="number" min={0} max={100} error={errors.probability?.message} {...register('probability')} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Target Close Date *</label>
              <Input type="date" error={errors.expectedCloseDate?.message} {...register('expectedCloseDate')} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Priority</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                {...register('priority')}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Account Owner</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                {...register('ownerId')}
              >
                {SEED_USERS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Notes & Strategic Overview</label>
              <textarea
                rows={3}
                placeholder="RFP deliverables, technical requirements, legal review status..."
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                {...register('notes')}
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between pt-2">
            {isEditing && onDelete ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onDelete(deal.id);
                  onOpenChange(false);
                }}
                disabled={isLoading}
              >
                Delete Deal
              </Button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                {isEditing ? 'Save Deal' : 'Create Deal'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
