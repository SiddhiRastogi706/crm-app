import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';

interface LeadsSourceDonutChartProps {
  data?: Array<{ source: string; count: number; percentage: number }>;
}

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

export const LeadsSourceDonutChart: React.FC<LeadsSourceDonutChartProps> = ({ data = [] }) => {
  const totalLeads = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="col-span-1 shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Leads by Acquisition Source</CardTitle>
        <CardDescription className="text-xs">
          Channels driving current pipeline conversion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative h-56 w-56 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-border bg-popover p-2 shadow-md text-xs">
                          <p className="font-semibold text-foreground">{item.source}</p>
                          <p className="text-primary">
                            {item.count} leads ({item.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-foreground">{totalLeads}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-medium">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full space-y-2 text-xs">
            {data.map((item, index) => (
              <div key={item.source} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{item.source}</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-foreground">{item.count}</span>
                  <span className="text-muted-foreground text-[11px]">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
