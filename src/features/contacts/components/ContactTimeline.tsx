import React from 'react';
import { Phone, Mail, Calendar, FileText, CheckCircle2, Clock, Plus } from 'lucide-react';
import { Activity } from '@/lib/api/types';
import { formatDateTime } from '@/utils/formatters';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';

interface ContactTimelineProps {
  activities: Activity[];
  onLogClick: () => void;
}

export const ContactTimeline: React.FC<ContactTimelineProps> = ({
  activities,
  onLogClick,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4 text-blue-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-indigo-600" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-amber-600" />;
      case 'note':
        return <FileText className="h-4 w-4 text-emerald-600" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Activity Timeline</h3>
          <p className="text-xs text-muted-foreground">Historical communications and notes</p>
        </div>
        <Button size="sm" onClick={onLogClick} className="h-8 gap-1 text-xs">
          <Plus className="h-3.5 w-3.5" /> Log Activity
        </Button>
      </div>

      {activities.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-border bg-card">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-xs font-semibold text-foreground">No activities recorded yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Log your first sales call, email, or meeting note with this contact.
          </p>
          <Button size="sm" variant="outline" onClick={onLogClick} className="mt-3 text-xs">
            Log Activity
          </Button>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-px before:bg-border">
          {activities.map((act) => (
            <div key={act.id} className="relative group">
              <div className="absolute -left-6 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border shadow-2xs group-hover:border-primary transition-colors">
                {getIcon(act.type)}
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{act.title}</span>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                      {act.type}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDateTime(act.date)}
                  </span>
                </div>

                <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                  {act.description}
                </p>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/60 text-[11px] text-muted-foreground">
                  <span>Logged by: <strong className="text-foreground font-medium">{act.performedBy}</strong></span>
                  {act.outcome && (
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      Outcome: {act.outcome}
                    </span>
                  )}
                  {act.durationMinutes && (
                    <span>Duration: {act.durationMinutes} mins</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
