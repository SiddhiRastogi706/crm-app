import React, { useState } from 'react';
import { Phone, Mail, Calendar, FileText } from 'lucide-react';
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
import { ActivityType } from '@/lib/api/types';
import { apiClient } from '@/lib/api/axios';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { toast } from 'sonner';

interface LogActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  onActivityCreated: () => void;
}

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  open,
  onOpenChange,
  contactId,
  contactName,
  onActivityCreated,
}) => {
  const user = useAuthStore((state) => state.user);
  const [type, setType] = useState<ActivityType>('call');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('15');
  const [outcome, setOutcome] = useState('Connected - Positive');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/activities', {
        type,
        contactId,
        contactName,
        title,
        description,
        performedBy: user?.name || 'Sales Rep',
        performedById: user?.id,
        date: new Date().toISOString(),
        durationMinutes: type === 'call' || type === 'meeting' ? Number(durationMinutes) : undefined,
        outcome: type === 'call' ? outcome : undefined,
      });

      toast.success('Activity logged to timeline');
      setTitle('');
      setDescription('');
      onActivityCreated();
      onOpenChange(false);
    } catch {
      toast.error('Failed to log activity');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Log Activity with {contactName}</DialogTitle>
          <DialogDescription>
            Record call notes, email communications, meetings or internal notes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Type selector pills */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'call', label: 'Call', icon: Phone },
              { id: 'email', label: 'Email', icon: Mail },
              { id: 'meeting', label: 'Meeting', icon: Calendar },
              { id: 'note', label: 'Note', icon: FileText },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as ActivityType)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    type === t.id
                      ? 'border-primary bg-primary/10 text-primary shadow-xs'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Subject / Title *
            </label>
            <Input
              placeholder={
                type === 'call'
                  ? 'e.g. Discovery call regarding Q1 license rollout'
                  : type === 'email'
                  ? 'e.g. Followed up with security whitepaper'
                  : type === 'meeting'
                  ? 'e.g. Executive demonstration & pricing review'
                  : 'e.g. Key account insights'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {type === 'call' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Duration (minutes)</label>
                <Input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Call Outcome</label>
                <select
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                >
                  <option value="Connected - Positive">Connected - Positive</option>
                  <option value="Demo Scheduled">Demo Scheduled</option>
                  <option value="Left Voicemail">Left Voicemail</option>
                  <option value="Gatekeeper">Gatekeeper</option>
                  <option value="Unreachable">Unreachable</option>
                </select>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Details & Notes</label>
            <textarea
              rows={4}
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="Summary of discussion points, action items, next steps..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Save Activity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
