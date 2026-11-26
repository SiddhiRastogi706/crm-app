import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Megaphone, Users, MailCheck, MousePointerClick, Calendar, BarChart2 } from 'lucide-react';
import { marketingService } from '../services/marketingService';
import { Campaign, AudienceSegment, CampaignStatus } from '@/lib/api/types';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { CampaignModal } from '../components/CampaignModal';
import { formatDate } from '@/utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const MarketingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: marketingService.getCampaigns,
  });

  const createMutation = useMutation({
    mutationFn: marketingService.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign configured successfully');
    },
  });

  const segments = [
    { title: 'All Qualified Leads', count: 2450, desc: 'Engaged website and referral leads' },
    { title: 'Hot Leads (Score ≥ 75)', count: 340, desc: 'High intent decision makers' },
    { title: 'Active Customer Accounts', count: 820, desc: 'Renewals, upsells and expansions' },
    { title: 'Inactive > 30 Days', count: 510, desc: 'Targeted win-back campaigns' },
  ];

  // Performance chart data
  const chartData = campaigns
    .filter((c) => c.status === 'sent')
    .map((c) => ({
      name: c.name.length > 18 ? c.name.substring(0, 18) + '...' : c.name,
      sent: c.stats.sent,
      opened: c.stats.opened,
      clicked: c.stats.clicked,
    }));

  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case 'sent':
        return <Badge variant="success">Sent</Badge>;
      case 'scheduled':
        return <Badge variant="info">Scheduled</Badge>;
      case 'draft':
        return <Badge variant="cold">Draft</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Marketing & Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Launch email blasts, target audience segments, and track open and click-through rates.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} className="h-9 gap-1.5 text-xs shadow-xs">
          <Plus className="h-4 w-4" /> New Campaign
        </Button>
      </div>

      {/* Audience Segments Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {segments.map((s, idx) => (
          <Card key={idx} className="shadow-xs hover:border-primary/40 transition-colors">
            <CardContent className="p-5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Segment
                </span>
                <Users className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.count.toLocaleString()}</p>
              <p className="text-xs font-medium text-foreground">{s.title}</p>
              <p className="text-[11px] text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart: Campaign Performance */}
      {chartData.length > 0 && (
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Email Campaign Engagement Analytics</CardTitle>
            <CardDescription className="text-xs">
              Delivery volume, open engagement, and click-through metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border bg-popover p-2.5 shadow-md text-xs">
                            <p className="font-semibold text-foreground mb-1">{label}</p>
                            <p className="text-blue-600">Sent: {payload[0]?.value}</p>
                            <p className="text-indigo-600">Opened: {payload[1]?.value}</p>
                            <p className="text-emerald-600">Clicked: {payload[2]?.value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="sent" fill="#2563EB" radius={[4, 4, 0, 0]} name="Emails Sent" />
                  <Bar dataKey="opened" fill="#6366F1" radius={[4, 4, 0, 0]} name="Emails Opened" />
                  <Bar dataKey="clicked" fill="#10B981" radius={[4, 4, 0, 0]} name="Links Clicked" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns Table */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Campaign History & Schedules</h2>
          <span className="text-xs text-muted-foreground">{campaigns.length} campaigns</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3">Campaign Name & Subject</th>
                <th className="px-4 py-3">Target Segment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sent Count</th>
                <th className="px-4 py-3">Open Rate</th>
                <th className="px-4 py-3">Click Rate</th>
                <th className="px-4 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {campaigns.map((c) => {
                const openRate = c.stats.sent > 0 ? Math.round((c.stats.opened / c.stats.sent) * 100) : 0;
                const clickRate = c.stats.sent > 0 ? Math.round((c.stats.clicked / c.stats.sent) * 100) : 0;

                return (
                  <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.subject}</p>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[11px] capitalize">
                        {c.segment.replace(/_/g, ' ')}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">{getStatusBadge(c.status)}</td>

                    <td className="px-4 py-3 font-semibold text-foreground">
                      {c.stats.sent > 0 ? c.stats.sent.toLocaleString() : '-'}
                    </td>

                    <td className="px-4 py-3">
                      {c.stats.sent > 0 ? (
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">
                          {openRate}% ({c.stats.opened})
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {c.stats.sent > 0 ? (
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {clickRate}% ({c.stats.clicked})
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                      {formatDate(c.sentAt || c.scheduledAt || c.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Campaign Modal */}
      <CampaignModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
        }}
        isLoading={createMutation.isPending}
      />
    </motion.div>
  );
};
