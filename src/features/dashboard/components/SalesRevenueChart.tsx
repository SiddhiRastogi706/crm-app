import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { formatCurrency, formatCompactNumber } from '@/utils/formatters';

interface SalesRevenueChartProps {
  data?: Array<{ date: string; revenue: number; target: number }>;
}

export const SalesRevenueChart: React.FC<SalesRevenueChartProps> = ({ data = [] }) => {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base font-semibold">Sales Revenue vs Target</CardTitle>
          <CardDescription className="text-xs">
            Performance trajectory across selected timeline
          </CardDescription>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 inline-block" />
            <span className="text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400 inline-block" />
            <span className="text-muted-foreground">Target</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${formatCompactNumber(val)}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-border bg-popover p-2.5 shadow-md text-xs">
                        <p className="font-semibold text-foreground mb-1">{label}</p>
                        <p className="text-blue-600 font-medium">
                          Revenue: {formatCurrency(payload[0].value as number)}
                        </p>
                        {payload[1] && (
                          <p className="text-muted-foreground">
                            Target: {formatCurrency(payload[1].value as number)}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#94A3B8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
