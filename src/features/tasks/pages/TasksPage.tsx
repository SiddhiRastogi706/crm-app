import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Calendar,
  ListTodo,
  CalendarDays,
  AlertTriangle,
  Clock,
  Trash2,
  Edit2,
  CheckCircle2,
} from 'lucide-react';
import { taskService } from '../services/taskService';
import { Task } from '@/lib/api/types';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { TaskModal } from '../components/TaskModal';
import { CalendarMonthView } from '../components/CalendarMonthView';
import { CalendarWeekView } from '../components/CalendarWeekView';
import { EmptyState } from '@/shared/ui/empty-state';
import { formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const TasksPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<'list' | 'month' | 'week'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getTasks(),
  });

  const createMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task removed');
    },
  });

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Optimistic update
    queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
      old.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );

    try {
      await updateMutation.mutateAsync({ id: task.id, data: { status: newStatus } });
      toast.success(newStatus === 'completed' ? 'Task completed!' : 'Task reopened');
    } catch {
      toast.error('Failed to update task');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  };

  const todayStr = '2026-11-23';

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      !searchTerm ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.contactName && t.contactName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleOpenCreateOnDate = (dateStr: string) => {
    setSelectedTask(null);
    setDefaultDate(dateStr);
    setModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tasks & Calendar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize follow-ups, meetings, client commitments and deadlines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View mode toggle */}
          <div className="inline-flex rounded-lg border border-border bg-card p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ListTodo className="h-3.5 w-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === 'month'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" /> Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === 'week'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" /> Week
            </button>
          </div>

          <Button
            onClick={() => {
              setSelectedTask(null);
              setDefaultDate(undefined);
              setModalOpen(true);
            }}
            className="h-9 gap-1.5 text-xs shadow-xs"
          >
            <Plus className="h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      {/* Conditional View: List vs Month vs Week */}
      {viewMode === 'month' ? (
        <CalendarMonthView
          tasks={tasks}
          onTaskClick={(t) => {
            setSelectedTask(t);
            setModalOpen(true);
          }}
          onAddOnDate={handleOpenCreateOnDate}
        />
      ) : viewMode === 'week' ? (
        <CalendarWeekView
          tasks={tasks}
          onTaskClick={(t) => {
            setSelectedTask(t);
            setModalOpen(true);
          }}
          onAddOnDate={handleOpenCreateOnDate}
        />
      ) : (
        /* List View */
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
            <div className="relative flex-1 max-w-sm">
              <Input
                placeholder="Search tasks..."
                leftIcon={<Search className="h-4 w-4" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Task list container */}
          <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
            {isLoading ? (
              <div className="p-8 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 w-full rounded-md bg-muted/60 animate-pulse" />
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              <EmptyState
                title="No tasks found"
                description="Everything looks clear! Create a new task to stay organized."
                actionLabel="Create Task"
                onAction={() => {
                  setSelectedTask(null);
                  setModalOpen(true);
                }}
                className="m-4"
              />
            ) : (
              <div className="divide-y divide-border/60">
                {filteredTasks.map((task) => {
                  const isCompleted = task.status === 'completed';
                  const isOverdue = task.dueDate < todayStr && !isCompleted;

                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-4 transition-colors hover:bg-muted/30 ${
                        isCompleted ? 'bg-muted/10 opacity-70' : isOverdue ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0 pr-4">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => handleToggleStatus(task)}
                          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                        />

                        <div className="space-y-1 min-w-0">
                          <p
                            className={`font-semibold text-sm leading-snug truncate ${
                              isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                            }`}
                          >
                            {task.title}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className={`flex items-center gap-1 ${isOverdue ? 'text-rose-600 font-semibold' : ''}`}>
                              {isOverdue ? <AlertTriangle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                              Due {formatDate(task.dueDate)} {isOverdue ? '(Overdue)' : ''}
                            </span>
                            <span>•</span>
                            <span>Assigned to: <strong className="text-foreground">{task.assignedToName}</strong></span>
                            {task.contactName && (
                              <>
                                <span>•</span>
                                <span className="text-primary truncate">{task.contactName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant={
                            task.priority === 'high'
                              ? 'destructive'
                              : task.priority === 'medium'
                              ? 'warning'
                              : 'outline'
                          }
                          className="text-[10px] uppercase font-semibold"
                        >
                          {task.priority}
                        </Badge>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedTask(task);
                            setModalOpen(true);
                          }}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        task={selectedTask}
        defaultDate={defaultDate}
        onSubmit={async (values) => {
          if (selectedTask) {
            await updateMutation.mutateAsync({ id: selectedTask.id, data: values });
            toast.success('Task updated');
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
