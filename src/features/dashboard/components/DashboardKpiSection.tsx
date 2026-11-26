import React from 'react';
import { DollarSign, Target, Award, LifeBuoy } from 'lucide-react';
import { StatCard } from '@/shared/ui/stat-card';
import { DashboardMetrics } from '@/lib/api/types';
import { formatCurrency } from '@/utils/formatters';

interface DashboardKpiSectionProps {
  metrics?: DashboardMetrics;
  isLoading: boolean;
  dateRange: string;
}

export const DashboardKpiSection: React.FC<DashboardKpiSectionProps> = ({
  metrics,
  isLoading,
  dateRange,
}) => {
  const periodLabel =
    dateRange === 'today'
      ? 'vs yesterday'
      : dateRange === '7d'
      ? 'vs prior 7 days'
      : dateRange === 'quarter'
      ? 'vs prior quarter'
      : dateRange === 'year'
      ? 'vs prior year'
      : 'vs last month';

  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-xl border border-border bg-card animate-pulse p-6" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Revenue"
        value={formatCurrency(metrics.revenue.current)}
        change={metrics.revenue.change}
        changePeriod={periodLabel}
        icon={DollarSign}
        iconBgColor="bg-blue-100/70 dark:bg-blue-950/70"
        iconColor="text-blue-600 dark:text-blue-400"
        accentBorderColor="border-t-blue-500"
      />
      <StatCard
        title="New Leads"
        value={metrics.newLeads.current}
        change={metrics.newLeads.change}
        changePeriod={periodLabel}
        icon={Target}
        iconBgColor="bg-emerald-100/70 dark:bg-emerald-950/70"
        iconColor="text-emerald-600 dark:text-emerald-400"
        accentBorderColor="border-t-emerald-500"
      />
      <StatCard
        title="Deals Won"
        value={metrics.dealsWon.current}
        change={metrics.dealsWon.change}
        changePeriod={periodLabel}
        icon={Award}
        iconBgColor="bg-indigo-100/70 dark:bg-indigo-950/70"
        iconColor="text-indigo-600 dark:text-indigo-400"
        accentBorderColor="border-t-indigo-500"
      />
      <StatCard
        title="Open Tickets"
        value={metrics.openTickets.current}
        change={metrics.openTickets.change}
        changePeriod={periodLabel}
        icon={LifeBuoy}
        iconBgColor="bg-amber-100/70 dark:bg-amber-950/70"
        iconColor="text-amber-600 dark:text-amber-400"
        accentBorderColor="border-t-amber-500"
      />
    </div>
  );
};
