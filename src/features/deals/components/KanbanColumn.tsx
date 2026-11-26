import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Deal, DealStage } from '@/lib/api/types';
import { DealCard } from './DealCard';
import { formatCurrency } from '@/utils/formatters';

interface KanbanColumnProps {
  id: DealStage;
  title: string;
  color: string;
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
  onAddDeal: (stage: DealStage) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  deals,
  onDealClick,
  onAddDeal,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      stage: id,
    },
  });

  const columnValue = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-72 sm:w-80 shrink-0 rounded-2xl bg-muted/40 border transition-colors ${
        isOver ? 'border-primary/60 bg-primary/5' : 'border-border/80'
      }`}
    >
      {/* Column Header */}
      <div className="p-3.5 border-b border-border/80 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {title}
            </h3>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border text-[11px] font-semibold text-muted-foreground">
              {deals.length}
            </span>
          </div>

          <button
            onClick={() => onAddDeal(id)}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
            aria-label={`Add deal to ${title}`}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Column Value Sum */}
        <p className="text-xs font-semibold text-muted-foreground">
          Total: <strong className="text-foreground">{formatCurrency(columnValue)}</strong>
        </p>
      </div>

      {/* Cards List */}
      <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[160px]">
        <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onClick={onDealClick} />
          ))}
        </SortableContext>

        {deals.length === 0 && (
          <div className="h-24 flex items-center justify-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground/60 select-none">
            Drop deal here
          </div>
        )}
      </div>
    </div>
  );
};
