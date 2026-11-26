import React from 'react';
import { Flame, Sun, Snowflake } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

interface LeadScoreBadgeProps {
  score: number; // 0-100
}

export const LeadScoreBadge: React.FC<LeadScoreBadgeProps> = ({ score }) => {
  if (score >= 75) {
    return (
      <Badge variant="hot" className="gap-1 font-bold">
        <Flame className="h-3 w-3 fill-rose-500 text-rose-500" /> Hot ({score})
      </Badge>
    );
  }

  if (score >= 40) {
    return (
      <Badge variant="warm" className="gap-1 font-semibold">
        <Sun className="h-3 w-3 text-amber-500" /> Warm ({score})
      </Badge>
    );
  }

  return (
    <Badge variant="cold" className="gap-1 font-medium">
      <Snowflake className="h-3 w-3 text-slate-400" /> Cold ({score})
    </Badge>
  );
};
