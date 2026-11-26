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
import { Ticket, TicketPriority, TicketStatus } from '@/lib/api/types';
import { useQuery } from '@tanstack/react-query';
import { contactService } from '@/features/contacts/services/contactService';
import { SEED_USERS } from '@/lib/mocks/seedData';

const ticketSchema = z.object({
  subject: z.string().min(3, 'Subject is required'),
  description: z.string().min(5, 'Description is required'),
  contactId: z.string().min(1, 'Contact is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['open', 'pending', 'resolved', 'closed']),
  assignedToId: z.string().min(1, 'Assignee is required'),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

interface TicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Ticket>) => Promise<void>;
  isLoading?: boolean;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}) => {
  const { data: contactsData } = useQuery({
    queryKey: ['contacts-dropdown'],
    queryFn: () => contactService.getContacts({ limit: 50 }),
  });
  const contacts = contactsData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: '',
      description: '',
      contactId: '',
      priority: 'medium',
      status: 'open',
      assignedToId: 'user-1',
    },
  });

  const handleFormSubmit = async (values: TicketFormValues) => {
    const contact = contacts.find((c) => c.id === values.contactId);
    const assignee = SEED_USERS.find((u) => u.id === values.assignedToId);

    await onSubmit({
      ...values,
      contactName: contact?.name || 'Customer',
      company: contact?.company || 'Organization',
      assignedToName: assignee?.name || 'Support Agent',
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Support Case</DialogTitle>
          <DialogDescription>
            Open an issue or inquiry ticket for an account with priority tracking.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Subject *</label>
            <Input placeholder="e.g. SSO Okta SAML 2.0 configuration issue" error={errors.subject?.message} {...register('subject')} />
            {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Client Contact *</label>
            <select
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              {...register('contactId')}
            >
              <option value="">Select account contact...</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company})
                </option>
              ))}
            </select>
            {errors.contactId && <p className="text-xs text-destructive">{errors.contactId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Priority</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary uppercase text-xs"
                {...register('priority')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Assigned Agent</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                {...register('assignedToId')}
              >
                {SEED_USERS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Issue Description *</label>
            <textarea
              rows={4}
              placeholder="Describe client inquiry, reproduction steps, or error codes..."
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
