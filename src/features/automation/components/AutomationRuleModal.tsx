import React, { useState } from 'react';
import { Zap, ArrowDown, Sparkles } from 'lucide-react';
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
import { AutomationRule } from '@/lib/api/types';
import { SEED_USERS } from '@/lib/mocks/seedData';

interface AutomationRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rule: Partial<AutomationRule>) => Promise<void>;
  isLoading?: boolean;
}

export const AutomationRuleModal: React.FC<AutomationRuleModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState<AutomationRule['trigger']>('lead_created');
  const [conditionField, setConditionField] = useState('score');
  const [conditionOperator, setConditionOperator] = useState<AutomationRule['conditionOperator']>('greater_than');
  const [conditionValue, setConditionValue] = useState('75');
  const [actionType, setActionType] = useState<AutomationRule['actionType']>('assign_owner');
  const [actionTarget, setActionTarget] = useState('user-3');
  const [actionPayload, setActionPayload] = useState('Immediate VIP Routing');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onSubmit({
      name,
      trigger,
      conditionField,
      conditionOperator,
      conditionValue,
      actionType,
      actionTarget,
      actionPayload,
      enabled: true,
    });

    setName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" /> Automation Rule Builder
          </DialogTitle>
          <DialogDescription>
            Configure event-driven CRM triggers, conditional thresholds, and automated actions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Rule Name *</label>
            <Input
              placeholder="e.g. Auto-assign Hot Leads to Senior Rep"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Visual Block 1: WHEN TRIGGER */}
          <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              <span>1. WHEN (Trigger Event)</span>
            </div>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value as any)}
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary font-medium"
            >
              <option value="lead_created">A new inbound lead is created</option>
              <option value="deal_won">A deal is marked as &apos;Won&apos;</option>
              <option value="deal_stage_changed">Deal stage advances to Negotiation</option>
              <option value="ticket_created">A new customer support ticket is opened</option>
            </select>
          </div>

          <div className="flex justify-center text-muted-foreground/60">
            <ArrowDown className="h-4 w-4" />
          </div>

          {/* Visual Block 2: IF CONDITION */}
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              <span>2. IF (Condition Check)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={conditionField}
                onChange={(e) => setConditionField(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-2 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="score">Lead Score</option>
                <option value="estimatedValue">Est. Value ($)</option>
                <option value="value">Deal Value ($)</option>
                <option value="priority">Priority</option>
              </select>

              <select
                value={conditionOperator}
                onChange={(e) => setConditionOperator(e.target.value as any)}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-2 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="greater_than">Is greater than</option>
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
              </select>

              <Input
                value={conditionValue}
                onChange={(e) => setConditionValue(e.target.value)}
                placeholder="Value"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-center text-muted-foreground/60">
            <ArrowDown className="h-4 w-4" />
          </div>

          {/* Visual Block 3: THEN ACTION */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              <span>3. THEN (Automated Action)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as any)}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="assign_owner">Assign Account Owner</option>
                <option value="create_task">Create Follow-up Task</option>
                <option value="send_email">Dispatch Notification Alert</option>
              </select>

              {actionType === 'assign_owner' ? (
                <select
                  value={actionTarget}
                  onChange={(e) => setActionTarget(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  {SEED_USERS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  value={actionTarget}
                  onChange={(e) => setActionTarget(e.target.value)}
                  placeholder="Task title or recipient email"
                  className="h-9 text-xs"
                />
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Save Automation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
