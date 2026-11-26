import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { formatCurrency, formatCompactNumber } from '@/utils/formatters';
import { DealStage } from '@/lib/api/types';

interface PipelineFunnelChartProps {
  data?: Array<{ stage: DealStage; count: number; value: number }>;
}

const STAGE_COLORS: Record<string, string> = {
  new: '#94A3B8',
  contacted: '#60A5FA',
  proposal: '#3B82F6',
  negotiation: '#2563EB',
  won: '#10B981',
  lost: '#EF4444',
};

const STAGE_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

export const PipelineFunnelChart: React.FC<PipelineFunnelChartProps> = ({ data = [] }) => {
  const chartData = data.map((d) => ({
    ...d,
    label: STAGE_LABELS[d.stage] || d.stage,
  }));

  return (
    <Card className="col-span-1 shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Deals Pipeline Funnel</CardTitle>
        <CardDescription className="text-xs">
          Stage breakdown by deal volume & pipeline value
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${formatCompactNumber(val)}`}
              />
              <YAxis
                type="category"
                dataKey="label"
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-border bg-popover p-2.5 shadow-md text-xs">
                        <p className="font-semibold text-foreground mb-1">{item.label}</p>
                        <p className="text-primary font-medium">
                          Value: {formatCurrency(item.value)}
                        </p>
                        <p className="text-muted-foreground">
                          Deals: {item.count} opportunities
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.stage}
                    fill={STAGE_COLORS[entry.stage] || '#2563EB'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
