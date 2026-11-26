import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  FileText,
  Award,
  Layers,
  ArrowRight,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { SalesRevenueChart } from './SalesRevenueChart';
import { PipelineFunnelChart } from './PipelineFunnelChart';
import { SalesLeaderboardWidget } from './SalesLeaderboardWidget';
import { TodayTasksCard } from './TodayTasksCard';
import { LeadsSourceDonutChart } from './LeadsSourceDonutChart';
import { formatCurrency } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api/axios';
import { Deal } from '@/lib/api/types';

interface SalesDashboardViewProps {
  metrics: any;
  tasks: any[];
  refetchTasks: () => void;
  dateRange: string;
}

export const SalesDashboardView: React.FC<SalesDashboardViewProps> = ({
  metrics,
  tasks,
  refetchTasks,
  dateRange,
}) => {
  const navigate = useNavigate();

  // Fetch recent deals for active pipeline preview
  const { data: deals = [] } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const res = await apiClient.get<Deal[]>('/deals');
      return res.data;
    },
  });

  const totalRevenue = metrics?.revenue.current || 495000;
  const pipelineValue = 8400000;

  return (
    <div className="space-y-6">
      {/* 💰 Sales KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Closed Revenue */}
        <Card className="p-4 bg-card border-border/80 shadow-xs relative overflow-hidden group hover:border-blue-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Closed Revenue</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">{formatCurrency(totalRevenue)}</span>
            <span className="text-xs text-emerald-600 font-semibold">+18.4%</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Total revenue booked to date</p>
        </Card>

        {/* Metric 2: Active Pipeline Value */}
        <Card className="p-4 bg-card border-border/80 shadow-xs relative overflow-hidden group hover:border-indigo-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Pipeline</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">₹84.0 L</span>
            <span className="text-xs text-indigo-600 font-semibold">24 Deals</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Weighted negotiation pipeline</p>
        </Card>

        {/* Metric 3: Leads Converted */}
        <Card className="p-4 bg-card border-border/80 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conversion Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">68%</span>
            <span className="text-xs text-emerald-600 font-semibold">+6.2%</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">148 qualified enterprise leads</p>
        </Card>

        {/* Metric 4: 1-Click GST Proposals Sent */}
        <Card className="p-4 bg-card border-border/80 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">GST Proposals</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">52 Quotes</span>
            <span className="text-xs text-amber-600 font-semibold">18% GST</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Official formal PDF proposals</p>
        </Card>

        {/* Metric 5: Deals Won */}
        <Card className="p-4 bg-card border-border/80 shadow-xs relative overflow-hidden group hover:border-blue-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deals Won</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">34 Won</span>
            <span className="text-xs text-emerald-600 font-semibold">89% Win Rate</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Executed AMC & SLA agreements</p>
        </Card>

        {/* Metric 6: Average Deal Size */}
        <Card className="p-4 bg-card border-border/80 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Deal Size</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">₹14.5 L</span>
            <span className="text-xs text-emerald-600 font-semibold">Enterprise</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Multi-cloud and AMC contracts</p>
        </Card>
      </div>

      {/* 📈 Charts Grid: Sales Revenue Trend & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesRevenueChart data={metrics?.salesTrend} />
        <PipelineFunnelChart data={metrics?.pipelineFunnel} />
      </div>

      {/* 🏆 Sales Team Leaderboard & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesLeaderboardWidget />
        </div>
        <div className="lg:col-span-1">
          <TodayTasksCard tasks={tasks} onTaskUpdated={refetchTasks} />
        </div>
      </div>

      {/* 💼 Active Enterprise Deals Pipeline Table */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>High-Value Enterprise Deals Pipeline</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Deals currently in active proposal & negotiation stages
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/deals')}
            className="text-xs gap-1.5"
          >
            <span>View Full Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground">
                  <th className="pb-2.5 font-semibold">Deal Title</th>
                  <th className="pb-2.5 font-semibold">Client Company</th>
                  <th className="pb-2.5 font-semibold">Value</th>
                  <th className="pb-2.5 font-semibold">Stage</th>
                  <th className="pb-2.5 font-semibold">Win Probability</th>
                  <th className="pb-2.5 font-semibold">Account Exec</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {deals.slice(0, 5).map((d) => (
                  <tr key={d.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 font-semibold text-foreground">{d.title}</td>
                    <td className="py-3 text-muted-foreground">{d.company}</td>
                    <td className="py-3 font-extrabold text-blue-600 dark:text-blue-400">
                      {formatCurrency(d.value)}
                    </td>
                    <td className="py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        {d.stage}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${d.probability || 70}%` }}
                          />
                        </div>
                        <span>{d.probability || 70}%</span>
                      </div>
                    </td>
                    <td className="py-3 font-medium text-foreground">{d.ownerName || 'Sam Rivera'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
