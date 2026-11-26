import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Ticket,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Server,
  Activity,
  HardDrive,
  Cpu,
  ArrowUpRight,
  ShieldAlert,
  Wrench,
  Layers,
  ArrowRight,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { TicketResolutionChart } from './TicketResolutionChart';
import { TechnicalCategoriesChart } from './TechnicalCategoriesChart';
import { ticketService } from '@/features/tickets/services/ticketService';
import { InboundEmailSimulatorModal } from '@/features/tickets/components/InboundEmailSimulatorModal';
import { useNavigate } from 'react-router-dom';

interface TechDashboardViewProps {
  dateRange: string;
}

export const TechDashboardView: React.FC<TechDashboardViewProps> = ({ dateRange }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [emailSimulatorOpen, setEmailSimulatorOpen] = useState(false);

  // Fetch real tickets from ticketService
  const { data: tickets = [], isLoading: ticketsLoading, refetch } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketService.getTickets(),
  });

  useEffect(() => {
    const handleTicketCreated = () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      refetch();
    };

    window.addEventListener('pulse:ticket-created', handleTicketCreated);
    window.addEventListener('storage', handleTicketCreated);

    return () => {
      window.removeEventListener('pulse:ticket-created', handleTicketCreated);
      window.removeEventListener('storage', handleTicketCreated);
    };
  }, [queryClient, refetch]);

  const totalRaised = 284;
  const totalSolved = 261;
  const solveRate = Math.round((totalSolved / totalRaised) * 100);

  return (
    <div className="space-y-6">
      {/* 🚀 Tech KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Total Tickets Raised */}
        <Card className="p-4 bg-card border-border/80 shadow-xs relative overflow-hidden group hover:border-blue-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tickets Raised</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">{totalRaised}</span>
            <span className="text-xs text-blue-600 font-semibold flex items-center">+14% MoM</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Total incoming client support cases</p>
        </Card>

        {/* Metric 2: Problems Solved */}
        <Card className="p-4 bg-card border-border/80 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Problems Solved</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">{totalSolved}</span>
            <span className="text-xs text-emerald-600 font-semibold">{solveRate}% Solved</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Successfully resolved technical issues</p>
        </Card>

        {/* Metric 3: Pending Incidents */}
        <Card className="p-4 bg-card border-border/80 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active / Pending</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">23</span>
            <span className="text-xs text-muted-foreground font-medium">18 in-progress</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Assigned to L2/L3 engineers</p>
        </Card>

        {/* Metric 4: MTTR Resolution Speed */}
        <Card className="p-4 bg-card border-border/80 shadow-xs relative overflow-hidden group hover:border-indigo-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg MTTR</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">1.8 hrs</span>
            <span className="text-xs text-emerald-600 font-semibold">&lt; 4h SLA</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Mean time to resolution</p>
        </Card>

        {/* Metric 5: Guaranteed SLA Uptime */}
        <Card className="p-4 bg-card border-border/80 shadow-xs relative overflow-hidden group hover:border-sky-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SLA Uptime</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">99.99%</span>
            <span className="text-xs text-emerald-600 font-semibold">Platinum</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Zero unplanned NOC downtime</p>
        </Card>

        {/* Metric 6: Hardware Spares Deployed */}
        <Card className="p-4 bg-card border-border/80 shadow-xs relative overflow-hidden group hover:border-blue-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Standby Spares</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">14 Units</span>
            <span className="text-xs text-blue-600 font-semibold">Active</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Hot-swap switches & routers</p>
        </Card>
      </div>

      {/* 📊 Technical Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TicketResolutionChart
            title="Incident Resolution Trend (Raised vs Solved)"
            description="Daily comparison of incoming support tickets vs resolved engineering solutions"
          />
        </div>
        <div className="lg:col-span-1">
          <TechnicalCategoriesChart />
        </div>
      </div>

      {/* ⚡ Live NOC Infrastructure Diagnostics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-900/10 via-card to-emerald-900/10 border border-border/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-600">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">NOC Latency</p>
            <p className="text-sm font-bold text-foreground">14ms <span className="text-xs text-emerald-600 font-semibold">(Ultra Low)</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Core Cluster Load</p>
            <p className="text-sm font-bold text-foreground">34% <span className="text-xs text-muted-foreground font-normal">(Optimal)</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-600">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Storage IOPS</p>
            <p className="text-sm font-bold text-foreground">98.2k <span className="text-xs text-emerald-600 font-semibold">(NVMe Fast)</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">EDR SOC Defense</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Zero Active Threats</p>
          </div>
        </div>
      </div>

      {/* 🎫 Technical Incident Queue / Recent Tickets Table */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>Active Technical Support Queue</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Live tickets escalated from enterprise client deployments
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEmailSimulatorOpen(true)}
              className="text-xs gap-1.5 border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer font-medium"
            >
              <Mail className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>Simulate Inbound Email</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/tickets')}
              className="text-xs gap-1.5"
            >
              <span>All Tickets ({tickets.length || 15})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground">
                  <th className="pb-2.5 font-semibold">Ticket ID</th>
                  <th className="pb-2.5 font-semibold">Client Company</th>
                  <th className="pb-2.5 font-semibold">Technical Subject</th>
                  <th className="pb-2.5 font-semibold">Priority</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                  <th className="pb-2.5 font-semibold">Assigned Tech</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {tickets.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-primary">{t.ticketNumber}</td>
                    <td className="py-3 font-semibold text-foreground">{t.company}</td>
                    <td className="py-3 text-muted-foreground max-w-xs truncate">{t.subject}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          t.priority === 'urgent'
                            ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                            : t.priority === 'high'
                            ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          t.status === 'resolved' || t.status === 'closed'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : t.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                        }`}
                      >
                        {t.status === 'resolved' ? 'Solved' : t.status}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-foreground">{t.assignedToName || 'Alex Morgan'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Inbound Client Email Simulator Modal */}
      <InboundEmailSimulatorModal
        open={emailSimulatorOpen}
        onOpenChange={setEmailSimulatorOpen}
        onTicketCreated={() => {
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
        }}
      />
    </div>
  );
};
