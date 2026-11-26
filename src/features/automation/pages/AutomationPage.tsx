import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Zap, CheckCircle2, Play, Trash2, ArrowRight } from 'lucide-react';
import { automationService } from '../services/automationService';
import { AutomationRule } from '@/lib/api/types';
import { Button } from '@/shared/ui/button';
import { Switch } from '@/shared/ui/switch';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { AutomationRuleModal } from '../components/AutomationRuleModal';
import { formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const AutomationPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['automations'],
    queryFn: automationService.getAutomations,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AutomationRule> }) =>
      automationService.updateAutomation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: automationService.createAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast.success('Automation rule activated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: automationService.deleteAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast.success('Rule deleted');
    },
  });

  const handleToggle = async (rule: AutomationRule) => {
    const newEnabled = !rule.enabled;
    queryClient.setQueryData<AutomationRule[]>(['automations'], (old = []) =>
      old.map((r) => (r.id === rule.id ? { ...r, enabled: newEnabled } : r))
    );

    try {
      await updateMutation.mutateAsync({ id: rule.id, data: { enabled: newEnabled } });
      toast.success(newEnabled ? 'Automation enabled' : 'Automation paused');
    } catch {
      toast.error('Failed to toggle automation');
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    }
  };

  const getTriggerLabel = (trigger: string) => {
    switch (trigger) {
      case 'lead_created':
        return 'When Lead is Created';
      case 'deal_won':
        return 'When Deal is Won';
      case 'ticket_created':
        return 'When Ticket is Created';
      default:
        return 'When Deal Advances';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Workflow Automations</h1>
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              <Zap className="h-3 w-3 fill-amber-500" /> Active Engine
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Event triggers that route hot leads, generate task reminders, and dispatch team alerts automatically.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} className="h-9 gap-1.5 text-xs shadow-xs">
          <Plus className="h-4 w-4" /> Create Rule
        </Button>
      </div>

      {/* Rules list */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 w-full rounded-xl bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : (
          rules.map((rule) => (
            <Card
              key={rule.id}
              className={`transition-all ${
                rule.enabled ? 'border-border shadow-xs' : 'border-border/50 bg-muted/20 opacity-70'
              }`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                          rule.enabled ? 'bg-amber-100 dark:bg-amber-950 text-amber-600' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Zap className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold text-sm text-foreground">{rule.name}</h3>
                      <Badge variant={rule.enabled ? 'success' : 'cold'} className="text-[10px]">
                        {rule.enabled ? 'Active' : 'Paused'}
                      </Badge>
                    </div>

                    {/* Rule logic visualization */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                        {getTriggerLabel(rule.trigger)}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                        IF {rule.conditionField} {rule.conditionOperator.replace('_', ' ')} {rule.conditionValue}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                        THEN {rule.actionType.replace('_', ' ')}: {rule.actionTarget}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                      <span>Triggered: <strong className="text-foreground">{rule.executionCount} times</strong></span>
                      {rule.lastExecutedAt && (
                        <span>Last run: {formatDate(rule.lastExecutedAt)}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Toggle */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center space-x-2">
                      <label className="text-xs font-medium text-muted-foreground select-none">
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </label>
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggle(rule)}
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMutation.mutate(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* New Rule Modal */}
      <AutomationRuleModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
        }}
        isLoading={createMutation.isPending}
      />
    </motion.div>
  );
};
