import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Contact } from '@/lib/api/types';
import { contactFormSchema, ContactFormValues } from '../schemas/contactSchema';
import { SEED_USERS } from '@/lib/mocks/seedData';

interface ContactDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact | null;
  onSubmit: (values: Partial<Contact>) => Promise<void>;
  isLoading?: boolean;
}

export const ContactDrawer: React.FC<ContactDrawerProps> = ({
  open,
  onOpenChange,
  contact,
  onSubmit,
  isLoading = false,
}) => {
  const isEditing = !!contact;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      status: 'lead',
      source: 'website',
      ownerId: 'user-3',
      value: 0,
      tags: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (contact) {
      reset({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        title: contact.title,
        status: contact.status,
        source: contact.source,
        ownerId: contact.ownerId,
        value: contact.value,
        tags: contact.tags ? contact.tags.join(', ') : '',
        notes: contact.notes || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        status: 'lead',
        source: 'website',
        ownerId: 'user-3',
        value: 0,
        tags: '',
        notes: '',
      });
    }
  }, [contact, reset, open]);

  const handleFormSubmit = async (data: ContactFormValues) => {
    const owner = SEED_USERS.find((u) => u.id === data.ownerId);
    const tagsArray = data.tags
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    await onSubmit({
      ...data,
      ownerName: owner?.name || 'Account Executive',
      tags: tagsArray,
    });
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent size="lg">
        <DrawerHeader>
          <DrawerTitle>{isEditing ? 'Edit Contact' : 'Create New Contact'}</DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? 'Update contact details, company information and assigned owner.'
              : 'Add a new business contact to your organization pipeline.'}
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="name">
                Full Name *
              </label>
              <Input id="name" placeholder="e.g. Sarah Jenkins" error={errors.name?.message} {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="email">
                Work Email *
              </label>
              <Input id="email" type="email" placeholder="sarah@company.com" error={errors.email?.message} {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="company">
                Company *
              </label>
              <Input id="company" placeholder="e.g. Acme Corp" error={errors.company?.message} {...register('company')} />
              {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="title">
                Job Title *
              </label>
              <Input id="title" placeholder="e.g. CTO / Director" error={errors.title?.message} {...register('title')} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="phone">
                Phone Number *
              </label>
              <Input id="phone" placeholder="+1 (555) 000-0000" error={errors.phone?.message} {...register('phone')} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="value">
                Estimated Lifetime Value ($)
              </label>
              <Input id="value" type="number" error={errors.value?.message} {...register('value')} />
              {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                {...register('status')}
              >
                <option value="lead">Lead</option>
                <option value="active">Active Opportunity</option>
                <option value="customer">Paying Customer</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="source">
                Acquisition Source
              </label>
              <select
                id="source"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                {...register('source')}
              >
                <option value="website">Website Inbound</option>
                <option value="referral">Customer Referral</option>
                <option value="linkedin">LinkedIn</option>
                <option value="outbound">Outbound Sales</option>
                <option value="conference">Conference / Event</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground" htmlFor="ownerId">
                Account Owner *
              </label>
              <select
                id="ownerId"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
              <label className="text-xs font-semibold text-foreground" htmlFor="tags">
                Tags (comma separated)
              </label>
              <Input id="tags" placeholder="Enterprise, Decision Maker, VIP" {...register('tags')} />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground" htmlFor="notes">
                Notes & Context
              </label>
              <textarea
                id="notes"
                rows={3}
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Background notes, strategic requirements, budget notes..."
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
              {isEditing ? 'Save Changes' : 'Create Contact'}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
