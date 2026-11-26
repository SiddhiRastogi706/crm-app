import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Printer, Filter, TrendingUp, Award, BarChart3, Target } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { formatCurrency } from '@/utils/formatters';
import { downloadCSV } from '@/utils/export';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState('q4');

  const repPerformance = [
    { name: 'Sam Rivera', role: 'Enterprise AE', quota: 500000, closed: 545000, dealsWon: 5, winRate: 64 },
    { name: 'Emily Chen', role: 'Commercial AE', quota: 400000, closed: 342000, dealsWon: 4, winRate: 58 },
    { name: 'Jordan Taylor', role: 'Technical Lead', quota: 300000, closed: 327000, dealsWon: 3, winRate: 75 },
    { name: 'Alex Morgan', role: 'Executive Sponsor', quota: 200000, closed: 240000, dealsWon: 2, winRate: 80 },
  ];

  const forecastData = [
    { month: 'Jul', actual: 180000, forecast: 160000 },
    { month: 'Aug', actual: 240000, forecast: 220000 },
    { month: 'Sep', actual: 310000, forecast: 290000 },
    { month: 'Oct', actual: 390000, forecast: 360000 },
    { month: 'Nov', actual: 485000, forecast: 450000 },
    { month: 'Dec (Proj)', actual: 0, forecast: 590000 },
  ];

  const conversionFunnel = [
    { stage: 'Inbound Lead to Contacted', rate: 78, baseline: '70% industry avg' },
    { stage: 'Contacted to Demo / Proposal', rate: 64, baseline: '50% industry avg' },
    { stage: 'Proposal to Contract Negotiation', rate: 52, baseline: '40% industry avg' },
    { stage: 'Negotiation to Closed Won', rate: 72, baseline: '60% industry avg' },
  ];

  const handleExportCSV = () => {
    const headers = ['Sales Representative', 'Role', 'Quota Target ($)', 'Closed Revenue ($)', 'Quota Attainment (%)', 'Deals Won', 'Win Rate (%)'];
    const rows = repPerformance.map((r) => [
      r.name,
      r.role,
      r.quota,
      r.closed,
      Math.round((r.closed / r.quota) * 100),
      r.dealsWon,
      r.winRate,
    ]);

    downloadCSV(`pulse-crm-sales-performance-${period}`, headers, rows);
    toast.success('Performance report exported to CSV');
  };

  const handlePrint = () => {
    window.print();
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sales Performance & Forecasting</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Representative attainment, conversion velocity, and forward revenue projections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <option value="q4">Q4 2026 (Current)</option>
            <option value="q3">Q3 2026</option>
            <option value="ytd">Year to Date 2026</option>
          </select>

          <Button variant="outline" size="sm" onClick={handlePrint} className="h-9 gap-1.5 text-xs">
            <Printer className="h-3.5 w-3.5" /> Print / PDF
          </Button>

          <Button size="sm" onClick={handleExportCSV} className="h-9 gap-1.5 text-xs shadow-xs">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Rep Performance Table */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Sales Representative Quota Attainment</CardTitle>
          <CardDescription className="text-xs">
            Individual target achievement and win rates for {period.toUpperCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3">Sales Representative</th>
                  <th className="px-4 py-3">Quota Target</th>
                  <th className="px-4 py-3">Closed Revenue</th>
                  <th className="px-4 py-3">Attainment %</th>
                  <th className="px-4 py-3">Deals Won</th>
                  <th className="px-4 py-3">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {repPerformance.map((rep) => {
                  const attainment = Math.round((rep.closed / rep.quota) * 100);
                  const isOverQuota = attainment >= 100;

                  return (
                    <tr key={rep.name} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{rep.name}</p>
                        <p className="text-xs text-muted-foreground">{rep.role}</p>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {formatCurrency(rep.quota)}
                      </td>

                      <td className="px-4 py-3 font-bold text-foreground">
                        {formatCurrency(rep.closed)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Progress
                            value={Math.min(100, attainment)}
                            className="w-24 h-2"
                            indicatorClassName={isOverQuota ? 'bg-emerald-500' : 'bg-primary'}
                          />
                          <span
                            className={`font-semibold text-xs ${
                              isOverQuota ? 'text-emerald-600 font-bold' : 'text-foreground'
                            }`}
                          >
                            {attainment}%
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-semibold text-foreground">
                        {rep.dealsWon} deals
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs font-semibold">
                          {rep.winRate}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attainment Chart */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Quota Target vs Closed Revenue</CardTitle>
            <CardDescription className="text-xs">Attainment visual comparison by rep</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repPerformance} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border bg-popover p-2.5 shadow-md text-xs">
                            <p className="font-semibold text-foreground mb-1">{label}</p>
                            <p className="text-blue-600">Quota: {formatCurrency(payload[0]?.value as number)}</p>
                            <p className="text-emerald-600">Closed: {formatCurrency(payload[1]?.value as number)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="quota" fill="#94A3B8" name="Target Quota" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="closed" fill="#2563EB" name="Closed Revenue" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Forecast Chart */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Cumulative Revenue Forecast</CardTitle>
            <CardDescription className="text-xs">Historical run-rate vs Q4 projection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border bg-popover p-2.5 shadow-md text-xs">
                            <p className="font-semibold text-foreground mb-1">{label}</p>
                            <p className="text-indigo-600">Forecast: {formatCurrency(payload[0]?.value as number)}</p>
                            {payload[1] && <p className="text-blue-600">Actual: {formatCurrency(payload[1]?.value as number)}</p>}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="forecast" stroke="#6366F1" strokeWidth={2.5} fill="url(#forecastGrad)" name="Forecast Projection" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stage Conversion Rates */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Funnel Conversion Velocity</CardTitle>
          <CardDescription className="text-xs">Step-by-step conversion rates between sales stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {conversionFunnel.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-card space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">{item.stage}</span>
                <p className="text-2xl font-bold text-foreground">{item.rate}%</p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Above {item.baseline}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
