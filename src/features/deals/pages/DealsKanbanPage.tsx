import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, DollarSign, Filter, Sparkles, Layers } from 'lucide-react';
import { dealService } from '../services/dealService';
import { Deal, DealStage } from '@/lib/api/types';
import { KanbanBoard } from '../components/KanbanBoard';
import { DealModal } from '../components/DealModal';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { formatCurrency } from '@/utils/formatters';
import { SEED_USERS } from '@/lib/mocks/seedData';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const DealsKanbanPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [defaultStage, setDefaultStage] = useState<DealStage>('new');

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: dealService.getDeals,
  });

  const createMutation = useMutation({
    mutationFn: dealService.createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success('Deal created successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Deal> }) =>
      dealService.updateDeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: dealService.deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success('Deal deleted');
    },
  });

  // Optimistic Move Handler
  const handleDealMove = async (dealId: string, newStage: DealStage) => {
    // 1. Optimistically update local query cache
    queryClient.setQueryData<Deal[]>(['deals'], (old = []) =>
      old.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );

    try {
      await updateMutation.mutateAsync({
        id: dealId,
        data: { stage: newStage },
      });
      toast.success(`Moved deal to ${newStage.toUpperCase()}`);
    } catch {
      toast.error('Failed to move deal');
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    }
  };

  // Filter deals
  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      !searchTerm ||
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOwner = ownerFilter === 'all' || deal.ownerId === ownerFilter;
    const matchesPriority = priorityFilter === 'all' || deal.priority === priorityFilter;

    return matchesSearch && matchesOwner && matchesPriority;
  });

  // Pipeline totals
  const totalPipelineValue = filteredDeals
    .filter((d) => d.stage !== 'lost')
    .reduce((sum, d) => sum + d.value, 0);

  const wonValue = filteredDeals
    .filter((d) => d.stage === 'won')
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Deals Pipeline</h1>
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <Sparkles className="h-3 w-3" /> Drag & Drop Active
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visualize deal velocity, manage opportunities across stages, and forecast revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs text-muted-foreground">Active Pipeline</span>
            <span className="text-sm font-bold text-foreground">{formatCurrency(totalPipelineValue)}</span>
          </div>
          <Button
            onClick={() => {
              setSelectedDeal(null);
              setDefaultStage('new');
              setDealModalOpen(true);
            }}
            className="h-9 gap-1.5 text-xs shadow-xs"
          >
            <Plus className="h-4 w-4" /> Add Opportunity
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search deals by title or company..."
            leftIcon={<Search className="h-4 w-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Owner Filter */}
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <option value="all">All Sales Owners</option>
            {SEED_USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Container */}
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-80 h-[480px] rounded-2xl bg-muted/40 animate-pulse shrink-0" />
          ))}
        </div>
      ) : (
        <KanbanBoard
          deals={filteredDeals}
          onDealMove={handleDealMove}
          onDealClick={(deal) => {
            setSelectedDeal(deal);
            setDealModalOpen(true);
          }}
          onAddDeal={(stage) => {
            setSelectedDeal(null);
            setDefaultStage(stage);
            setDealModalOpen(true);
          }}
        />
      )}

      {/* Deal Detail / Create Modal */}
      <DealModal
        open={dealModalOpen}
        onOpenChange={setDealModalOpen}
        deal={selectedDeal}
        defaultStage={defaultStage}
        onSubmit={async (values) => {
          if (selectedDeal) {
            await updateMutation.mutateAsync({ id: selectedDeal.id, data: values });
            toast.success('Deal updated');
          } else {
            await createMutation.mutateAsync(values);
          }
        }}
        onDelete={async (id) => {
          await deleteMutation.mutateAsync(id);
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </motion.div>
  );
};
