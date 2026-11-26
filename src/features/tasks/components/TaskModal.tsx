import React, { useEffect } from 'react';
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
import { Task, TaskPriority, TaskStatus } from '@/lib/api/types';
import { SEED_USERS } from '@/lib/mocks/seedData';
import { useQuery } from '@tanstack/react-query';
import { contactService } from '@/features/contacts/services/contactService';

const taskSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'in_progress', 'completed']),
  contactId: z.string().optional(),
  assignedToId: z.string().min(1, 'Assignee is required'),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultDate?: string;
  onSubmit: (values: Partial<Task>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onOpenChange,
  task,
  defaultDate,
  onSubmit,
  onDelete,
  isLoading = false,
}) => {
  const isEditing = !!task;

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
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: defaultDate || new Date().toISOString().split('T')[0],
      priority: 'medium',
      status: 'pending',
      contactId: '',
      assignedToId: 'user-3',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        contactId: task.contactId || '',
        assignedToId: task.assignedToId,
      });
    } else {
      reset({
        title: '',
        description: '',
        dueDate: defaultDate || new Date().toISOString().split('T')[0],
        priority: 'medium',
        status: 'pending',
        contactId: '',
        assignedToId: 'user-3',
      });
    }
  }, [task, defaultDate, reset, open]);

  const handleFormSubmit = async (values: TaskFormValues) => {
    const assignee = SEED_USERS.find((u) => u.id === values.assignedToId);
    const contact = contacts.find((c) => c.id === values.contactId);

    await onSubmit({
      ...values,
      assignedToName: assignee?.name || 'Sales Rep',
      contactName: contact?.name,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Task Details' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update priority, due date and status for this follow-up.'
              : 'Schedule a call, follow-up or meeting deliverable.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Task Title *</label>
            <Input placeholder="e.g. Follow up on proposal with Sarah Jenkins" error={errors.title?.message} {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Due Date *</label>
              <Input type="date" error={errors.dueDate?.message} {...register('dueDate')} />
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Status</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                {...register('status')}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Assigned To</label>
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
            <label className="text-xs font-semibold text-foreground">Associated Contact (Optional)</label>
            <select
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              {...register('contactId')}
            >
              <option value="">None / Internal Task</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Description & Notes</label>
            <textarea
              rows={3}
              placeholder="Action items, background context, phone numbers..."
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              {...register('description')}
            />
          </div>

          <DialogFooter className="flex items-center justify-between pt-2">
            {isEditing && onDelete ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onDelete(task.id);
                  onOpenChange(false);
                }}
                disabled={isLoading}
              >
                Delete
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
                {isEditing ? 'Save Task' : 'Create Task'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
