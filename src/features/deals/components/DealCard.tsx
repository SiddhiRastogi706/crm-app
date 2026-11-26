import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, DollarSign, GripVertical, User } from 'lucide-react';
import { Deal } from '@/lib/api/types';
import { Badge } from '@/shared/ui/badge';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface DealCardProps {
  deal: Deal;
  onClick: (deal: Deal) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.id,
    data: {
      type: 'Deal',
      deal,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-[10px] uppercase">High</Badge>;
      case 'medium':
        return <Badge variant="warning" className="text-[10px] uppercase">Medium</Badge>;
      default:
        return <Badge variant="cold" className="text-[10px] uppercase">Low</Badge>;
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-40 border-2 border-dashed border-primary rounded-xl p-4 bg-primary/5 min-h-[120px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative rounded-xl border border-border bg-card p-3.5 shadow-2xs hover:shadow-md hover:border-primary/50 transition-all duration-150 cursor-pointer select-none space-y-2.5"
      onClick={() => onClick(deal)}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {deal.title}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">{deal.company}</p>
        </div>

        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="text-muted-foreground/50 hover:text-foreground cursor-grab active:cursor-grabbing p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Drag deal card"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Value & Priority */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-foreground">
          {formatCurrency(deal.value)}
        </span>
        {getPriorityBadge(deal.priority)}
      </div>

      {/* Bottom Footer: Close Date & Owner */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(deal.expectedCloseDate)}
        </span>

        <span className="flex items-center gap-1 truncate max-w-[100px] font-medium text-foreground/80">
          <span className="h-4 w-4 rounded-full bg-primary/10 text-primary text-[9px] flex items-center justify-center font-bold">
            {deal.ownerName.charAt(0)}
          </span>
          {deal.ownerName.split(' ')[0]}
        </span>
      </div>
    </div>
  );
};
