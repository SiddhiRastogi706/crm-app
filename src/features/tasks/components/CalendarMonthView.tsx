import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Task } from '@/lib/api/types';
import { Button } from '@/shared/ui/button';

interface CalendarMonthViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddOnDate: (dateStr: string) => void;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  tasks,
  onTaskClick,
  onAddOnDate,
}) => {
  // Current view center: November 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // Nov 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calendar cells
  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getTasksForDate = (day: number) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter((t) => t.dueDate === formatted);
  };

  const todayStr = '2026-11-23';

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-lg font-bold text-foreground">{monthName}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setCurrentDate(new Date(2026, 10, 1))}
          >
            Today
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {/* Day Header row */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-xs font-semibold text-muted-foreground py-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-border/60">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="bg-muted/10 min-h-[90px] sm:min-h-[110px]" />;
            }

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const dayTasks = getTasksForDate(day);

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[90px] sm:min-h-[110px] p-1.5 flex flex-col justify-between group transition-colors hover:bg-muted/20 ${
                  isToday ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isToday
                        ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                        : 'text-foreground'
                    }`}
                  >
                    {day}
                  </span>

                  <button
                    onClick={() => onAddOnDate(dateStr)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-0.5 rounded transition-opacity"
                    aria-label={`Add task on ${dateStr}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Day Tasks */}
                <div className="space-y-1 mt-1 overflow-y-auto max-h-20">
                  {dayTasks.map((task) => {
                    const isCompleted = task.status === 'completed';
                    const isOverdue = task.dueDate < todayStr && !isCompleted;

                    return (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className={`px-1.5 py-0.5 rounded text-[10px] truncate font-medium cursor-pointer transition-all ${
                          isCompleted
                            ? 'bg-muted text-muted-foreground line-through'
                            : isOverdue
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : task.priority === 'high'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
