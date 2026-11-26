import React from 'react';
import { Task } from '@/lib/api/types';
import { Badge } from '@/shared/ui/badge';
import { formatDate } from '@/utils/formatters';
import { Clock, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface CalendarWeekViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddOnDate: (dateStr: string) => void;
}

export const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
  tasks,
  onTaskClick,
  onAddOnDate,
}) => {
  // Current active week: Nov 22 - Nov 28, 2026
  const weekDays = [
    { name: 'Sun', date: '2026-11-22' },
    { name: 'Mon', date: '2026-11-23' }, // Today
    { name: 'Tue', date: '2026-11-24' },
    { name: 'Wed', date: '2026-11-25' },
    { name: 'Thu', date: '2026-11-26' },
    { name: 'Fri', date: '2026-11-27' },
    { name: 'Sat', date: '2026-11-28' },
  ];

  const todayStr = '2026-11-23';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Week of Nov 22 - Nov 28, 2026</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((col) => {
          const isToday = col.date === todayStr;
          const dayTasks = tasks.filter((t) => t.dueDate === col.date);

          return (
            <div
              key={col.date}
              className={`rounded-xl border p-3 flex flex-col min-h-[300px] ${
                isToday ? 'border-primary/60 bg-primary/5' : 'border-border bg-card'
              }`}
            >
              {/* Day header */}
              <div className="flex items-center justify-between pb-2 border-b border-border/80 mb-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">{col.name}</p>
                  <p className="text-sm font-bold text-foreground">{col.date.split('-')[2]}</p>
                </div>

                <button
                  onClick={() => onAddOnDate(col.date)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
                  aria-label={`Add task on ${col.date}`}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Task Cards in this day */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                {dayTasks.map((t) => {
                  const isCompleted = t.status === 'completed';
                  const isOverdue = t.dueDate < todayStr && !isCompleted;

                  return (
                    <div
                      key={t.id}
                      onClick={() => onTaskClick(t)}
                      className={`p-2.5 rounded-lg border text-xs space-y-1.5 cursor-pointer transition-shadow hover:shadow-xs ${
                        isCompleted
                          ? 'bg-muted/40 border-transparent opacity-60'
                          : isOverdue
                          ? 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/30'
                          : 'bg-background border-border hover:border-primary/40'
                      }`}
                    >
                      <p className={`font-semibold ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {t.title}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <Badge
                          variant={t.priority === 'high' ? 'destructive' : 'outline'}
                          className="text-[9px] px-1 py-0 uppercase"
                        >
                          {t.priority}
                        </Badge>
                        <span className="truncate max-w-[80px]">{t.assignedToName.split(' ')[0]}</span>
                      </div>
                    </div>
                  );
                })}

                {dayTasks.length === 0 && (
                  <p className="text-[11px] text-muted-foreground/60 text-center py-6">
                    No scheduled items
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
