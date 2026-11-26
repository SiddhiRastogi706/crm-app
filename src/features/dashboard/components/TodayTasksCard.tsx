import React, { useState } from 'react';
import { CheckSquare, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Task } from '@/lib/api/types';
import { formatDate } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import { apiClient } from '@/lib/api/axios';
import { toast } from 'sonner';

interface TodayTasksCardProps {
  tasks?: Task[];
  onTaskUpdated?: () => void;
}

export const TodayTasksCard: React.FC<TodayTasksCardProps> = ({
  tasks = [],
  onTaskUpdated,
}) => {
  const [taskList, setTaskList] = useState<Task[]>(tasks);

  React.useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const handleToggle = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Optimistic update
    setTaskList((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );

    try {
      await apiClient.patch(`/tasks/${task.id}`, { status: newStatus });
      toast.success(newStatus === 'completed' ? 'Task completed!' : 'Task reopened');
      if (onTaskUpdated) onTaskUpdated();
    } catch {
      toast.error('Failed to update task');
      // Rollback
      setTaskList(tasks);
    }
  };

  const todayStr = '2026-11-23';

  return (
    <Card className="col-span-1 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">Today&apos;s Priorities</CardTitle>
          <CardDescription className="text-xs">Follow-ups and scheduled deliverables</CardDescription>
        </div>
        <Link to="/tasks" className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
          Calendar <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="px-6 pb-4">
        {taskList.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">All caught up! No tasks pending today.</p>
        ) : (
          <div className="space-y-3">
            {taskList.slice(0, 5).map((task) => {
              const isOverdue = task.dueDate < todayStr && task.status !== 'completed';
              const isCompleted = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                    isCompleted
                      ? 'bg-muted/30 border-transparent opacity-60'
                      : isOverdue
                      ? 'bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40'
                      : 'bg-card border-border hover:border-primary/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => handleToggle(task)}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <p
                      className={`text-xs font-medium leading-tight ${
                        isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(task.dueDate)}
                      </span>
                      {isOverdue && (
                        <span className="flex items-center gap-0.5 text-rose-600 font-semibold text-[10px]">
                          <AlertTriangle className="h-3 w-3" /> Overdue
                        </span>
                      )}
                      <span>•</span>
                      <span>{task.assignedToName}</span>
                    </div>
                  </div>

                  <Badge
                    variant={
                      task.priority === 'high'
                        ? 'destructive'
                        : task.priority === 'medium'
                        ? 'warning'
                        : 'outline'
                    }
                    className="text-[10px] uppercase font-semibold shrink-0"
                  >
                    {task.priority}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
