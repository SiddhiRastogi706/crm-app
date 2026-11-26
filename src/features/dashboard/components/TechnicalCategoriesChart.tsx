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
import { Wrench } from 'lucide-react';

export interface CategoryDataPoint {
  category: string;
  count: number;
  color: string;
}

export const defaultTechnicalCategories: CategoryDataPoint[] = [
  { category: 'Cloud DevOps', count: 86, color: '#3B82F6' },
  { category: 'Hardware Spares', count: 64, color: '#10B981' },
  { category: 'Network Routing', count: 52, color: '#F59E0B' },
  { category: 'Managed SOC', count: 38, color: '#8B5CF6' },
  { category: 'Licenses', count: 24, color: '#EC4899' },
];

interface TechnicalCategoriesChartProps {
  data?: CategoryDataPoint[];
  height?: number;
}

export const TechnicalCategoriesChart: React.FC<TechnicalCategoriesChartProps> = ({
  data = defaultTechnicalCategories,
  height = 240,
}) => {
  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
          <Wrench className="h-4 w-4 text-emerald-600" />
          <span>Incident Breakdown by Category</span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Distribution of technical support cases across systems
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div style={{ height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.6} />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="category"
                stroke="var(--muted-foreground)"
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                }}
                formatter={(value: any) => [`${value} incidents`, 'Resolved / Logged']}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
