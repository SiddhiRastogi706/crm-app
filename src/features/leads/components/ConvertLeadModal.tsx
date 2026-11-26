import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
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
import { Lead, DealStage } from '@/lib/api/types';
import { leadService } from '../services/leadService';
import { toast } from 'sonner';

interface ConvertLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onSuccess: () => void;
}

export const ConvertLeadModal: React.FC<ConvertLeadModalProps> = ({
  open,
  onOpenChange,
  lead,
  onSuccess,
}) => {
  const [dealTitle, setDealTitle] = useState('');
  const [dealValue, setDealValue] = useState<number>(0);
  const [dealStage, setDealStage] = useState<DealStage>('proposal');
  const [createDeal, setCreateDeal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (lead) {
      setDealTitle(`${lead.company} - Expansion Deal`);
      setDealValue(lead.estimatedValue || 50000);
      setDealStage(lead.score >= 75 ? 'proposal' : 'contacted');
      setCreateDeal(true);
    }
  }, [lead, open]);

  if (!lead) return null;

  const handleConvert = async () => {
    setIsLoading(true);
    try {
      await leadService.convertLead(
        lead.id,
        createDeal
          ? {
              title: dealTitle,
              value: Number(dealValue),
              stage: dealStage,
            }
          : undefined
      );

      // Trigger celebration confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      toast.success(`Lead successfully converted to Contact!`);
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error('Failed to convert lead');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4" /> Opportunity Conversion
          </div>
          <DialogTitle>Convert &quot;{lead.name}&quot; to Customer & Deal</DialogTitle>
          <DialogDescription>
            This action creates a permanent Contact record and optionally initializes an Opportunity Deal in your Kanban pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Summary of conversion */}
          <div className="rounded-xl bg-muted/40 p-3.5 border border-border/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account / Company:</span>
              <strong className="text-foreground">{lead.company}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Lead Score:</span>
              <span className="font-bold text-primary">{lead.score} / 100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Assigned Owner:</span>
              <span className="text-foreground font-medium">{lead.ownerName}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="createDeal"
              checked={createDeal}
              onChange={(e) => setCreateDeal(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="createDeal" className="text-xs font-semibold text-foreground cursor-pointer">
              Also create an active Deal in Pipeline
            </label>
          </div>

          {createDeal && (
            <div className="space-y-3 pl-6 border-l-2 border-primary/30 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Opportunity Title</label>
                <Input
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  placeholder="e.g. Acme Corp Enterprise License"
                  className="text-xs h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Estimated Deal Value ($)</label>
                  <Input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="text-xs h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Initial Stage</label>
                  <select
                    value={dealStage}
                    onChange={(e) => setDealStage(e.target.value as DealStage)}
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConvert} isLoading={isLoading} className="gap-1.5">
            Convert Lead <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
