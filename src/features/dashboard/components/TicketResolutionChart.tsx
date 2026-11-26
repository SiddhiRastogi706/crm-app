import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { CheckCircle2, Ticket, TrendingUp } from 'lucide-react';

interface TicketTrendPoint {
  date: string;
  raised: number;
  solved: number;
}

interface TicketResolutionChartProps {
  data?: TicketTrendPoint[];
  title?: string;
  description?: string;
  height?: number;
}

export const defaultTicketTrendData: TicketTrendPoint[] = [
  { date: 'Mon', raised: 24, solved: 22 },
  { date: 'Tue', raised: 38, solved: 36 },
  { date: 'Wed', raised: 45, solved: 42 },
  { date: 'Thu', raised: 52, solved: 49 },
  { date: 'Fri', raised: 48, solved: 46 },
  { date: 'Sat', raised: 18, solved: 18 },
  { date: 'Sun', raised: 14, solved: 14 },
];

export const TicketResolutionChart: React.FC<TicketResolutionChartProps> = ({
  data = defaultTicketTrendData,
  title = 'Tickets Raised vs Problems Solved',
  description = 'Weekly volume resolution trajectory (91.9% SLA Success Rate)',
  height = 280,
}) => {
  const totalRaised = data.reduce((acc, curr) => acc + curr.raised, 0);
  const totalSolved = data.reduce((acc, curr) => acc + curr.solved, 0);
  const solveRate = totalRaised > 0 ? Math.round((totalSolved / totalRaised) * 100) : 100;

  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Ticket className="h-4 w-4 text-blue-600" />
            <span>{title}</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            {description}
          </CardDescription>
        </div>

        {/* Quick Resolution Metric Pill */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{solveRate}% Solved</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Metric Summary Counters */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              Total Tickets Raised:
            </span>
            <span className="font-extrabold text-foreground text-sm">{totalRaised}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Problems Solved:
            </span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{totalSolved}</span>
          </div>
        </div>

        <div style={{ height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="raisedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="solvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: '0.75rem', paddingBottom: '8px' }}
              />

              <Area
                type="monotone"
                dataKey="raised"
                name="Tickets Raised"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#raisedGradient)"
              />
              <Area
                type="monotone"
                dataKey="solved"
                name="Problems Solved"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#solvedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
