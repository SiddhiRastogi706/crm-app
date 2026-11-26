import React, { useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Clock,
  AlertCircle,
  X,
  FileText,
  Video,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { apiClient } from '@/lib/api/axios';
import { toast } from 'sonner';

interface FollowUpSchedulerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: {
    id: string;
    name: string;
    company: string;
  };
  onScheduled?: () => void;
}

export const FollowUpSchedulerModal: React.FC<FollowUpSchedulerModalProps> = ({
  open,
  onOpenChange,
  contact,
  onScheduled,
}) => {
  const [followUpType, setFollowUpType] = useState('call');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high');

  // Default to tomorrow 10:00 AM
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(10, 0, 0, 0);
  const [dueDate, setDueDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('10:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const setPreset = (daysAhead: number, hour: number) => {
    const target = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
    target.setHours(hour, 0, 0, 0);
    setDueDate(target.toISOString().split('T')[0]);
    setDueTime(`${hour.toString().padStart(2, '0')}:00`);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const typeLabels: Record<string, string> = {
        call: 'Follow-up Call',
        demo: 'KCIS Product Demo',
        quote: 'Quotation Review Discussion',
        renewal: 'License Renewal Check',
      };

      const title = `[Follow-up] ${typeLabels[followUpType] || 'Callback'}: ${contact.name} (${contact.company})`;
      const desc = notes || `Scheduled follow-up with ${contact.name} from ${contact.company}. Time: ${dueTime}.`;

      await apiClient.post('/tasks', {
        title,
        description: desc,
        dueDate,
        priority,
        status: 'pending',
        contactId: contact.id,
        contactName: contact.name,
      });

      toast.success(`Follow-up scheduled for ${dueDate} at ${dueTime}!`);
      if (onScheduled) onScheduled();
      onOpenChange(false);
    } catch {
      toast.error('Failed to schedule follow-up');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-primary/5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              <CalendarClock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Schedule Client Follow-up</h3>
              <p className="text-[11px] text-muted-foreground">{contact.name} • {contact.company}</p>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={() => onOpenChange(false)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Quick Timing Presets:</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setPreset(0, 15)}
                className="py-1.5 px-2 rounded-lg border border-border hover:bg-muted font-medium text-center transition-colors"
              >
                Today 3 PM
              </button>
              <button
                type="button"
                onClick={() => setPreset(1, 10)}
                className="py-1.5 px-2 rounded-lg border border-border hover:bg-muted font-medium text-center transition-colors"
              >
                Tomorrow 10 AM
              </button>
              <button
                type="button"
                onClick={() => setPreset(3, 11)}
                className="py-1.5 px-2 rounded-lg border border-border hover:bg-muted font-medium text-center transition-colors"
              >
                In 3 Days
              </button>
            </div>
          </div>

          {/* Type selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Follow-up Activity Type:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'call', label: 'Phone Call', icon: PhoneCall },
                { id: 'demo', label: 'Technical Demo', icon: Video },
                { id: 'quote', label: 'Review Quote', icon: FileText },
                { id: 'renewal', label: 'Renewal Discussion', icon: Clock },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = followUpType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFollowUpType(t.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-border bg-card text-foreground hover:bg-muted/40'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Date:</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Time (IST):</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Priority:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
            >
              <option value="high">🔴 High Priority (Urgent Deal)</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Agenda / Client Context:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Call Brandon to review 500-seat EDR license pricing and answer technical SOC-2 questions."
              className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-muted/20">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSubmitting} className="gap-1.5 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" /> Save Follow-up
          </Button>
        </div>
      </div>
    </div>
  );
};
