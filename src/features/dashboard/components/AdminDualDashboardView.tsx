import React from 'react';
import {
  Wrench,
  DollarSign,
  Ticket,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  Target,
  Briefcase,
  FileText,
  Clock,
  Layers,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { TicketResolutionChart } from './TicketResolutionChart';
import { SalesRevenueChart } from './SalesRevenueChart';
import { TechnicalCategoriesChart } from './TechnicalCategoriesChart';
import { PipelineFunnelChart } from './PipelineFunnelChart';
import { formatCurrency } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

interface AdminDualDashboardViewProps {
  metrics: any;
}

export const AdminDualDashboardView: React.FC<AdminDualDashboardViewProps> = ({
  metrics,
}) => {
  const navigate = useNavigate();

  const totalRevenue = metrics?.revenue.current || 495000;
  const totalRaised = 284;
  const totalSolved = 261;
  const solveRate = Math.round((totalSolved / totalRaised) * 100);

  return (
    <div className="space-y-6">
      {/* 👑 Executive Unified High-Level KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-blue-200 bg-gradient-to-br from-blue-50/60 via-card to-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company Revenue</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">{formatCurrency(totalRevenue)}</span>
            <span className="text-xs text-emerald-600 font-semibold">+18.4%</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Sales revenue booked this period</p>
        </Card>

        <Card className="p-4 border-indigo-200 bg-gradient-to-br from-indigo-50/60 via-card to-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Pipeline</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">₹84.0 Lakhs</span>
            <span className="text-xs text-indigo-600 font-semibold">24 Deals</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Weighted in-flight proposals</p>
        </Card>

        <Card className="p-4 border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-card to-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Problems Solved Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">{solveRate}%</span>
            <span className="text-xs text-muted-foreground font-medium">261 of 284</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Technical issues resolved successfully</p>
        </Card>

        <Card className="p-4 border-sky-200 bg-gradient-to-br from-sky-50/60 via-card to-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">NOC SLA Health</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">99.99%</span>
            <span className="text-xs text-emerald-600 font-semibold">Platinum SLA</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Faridabad NOC uptime active</p>
        </Card>
      </div>

      {/* =========================================================================
          🔥 SPLIT DUAL SCREEN: LEFT SIDE TECH, RIGHT SIDE SALES
          ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* ==============================================
            LEFT SIDE: TECHNICAL OPERATIONS & NOC DESK
            ============================================== */}
        <div className="space-y-6 p-5 sm:p-6 rounded-2xl border-2 border-emerald-500/20 bg-card shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span>Technical & NOC Desk</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                    Live Telemetry
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">Support tickets raised vs problems solved</p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/tickets')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border-emerald-200"
            >
              Support Tickets <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {/* 4 Mini Tech KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">Tickets Raised</p>
              <p className="text-lg font-black text-foreground mt-0.5">{totalRaised}</p>
              <p className="text-[10px] text-blue-600 font-semibold">+14% MoM</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">Problems Solved</p>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{totalSolved}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">{solveRate}% Solved</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">In Progress</p>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">23</p>
              <p className="text-[10px] text-muted-foreground">L2/L3 queue</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">Avg MTTR</p>
              <p className="text-lg font-black text-foreground mt-0.5">1.8 hrs</p>
              <p className="text-[10px] text-emerald-600 font-semibold">&lt; 4h SLA</p>
            </div>
          </div>

          {/* Tech Graph 1: Tickets Raised vs Solved */}
          <TicketResolutionChart
            height={240}
            title="Tickets Raised vs Solved (Trajectory)"
            description="Continuous daily resolution velocity"
          />

          {/* Tech Graph 2: Problem Categories */}
          <TechnicalCategoriesChart height={200} />

          {/* Recent Technical Escalation Alerts */}
          <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-muted-foreground">Standby Spares Depot: <strong className="text-foreground">14 Units Available</strong> (Cisco & Fortinet)</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate('/tickets')}
              className="text-xs font-semibold text-primary h-7 px-2"
            >
              Open Ticket Desk →
            </Button>
          </div>
        </div>

        {/* ==============================================
            RIGHT SIDE: SALES & REVENUE DESK
            ============================================== */}
        <div className="space-y-6 p-5 sm:p-6 rounded-2xl border-2 border-blue-500/20 bg-card shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span>Sales & Revenue Desk</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200">
                    Deal Flow
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">Enterprise revenue, pipeline & proposals</p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/deals')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:bg-blue-50 border-blue-200"
            >
              Deals Pipeline <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {/* 4 Mini Sales KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">Closed Rev</p>
              <p className="text-lg font-black text-foreground mt-0.5">{formatCurrency(totalRevenue)}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">+18.4%</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">Pipeline</p>
              <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">₹84.0 L</p>
              <p className="text-[10px] text-indigo-600 font-semibold">24 Deals</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">Won Deals</p>
              <p className="text-lg font-black text-foreground mt-0.5">34</p>
              <p className="text-[10px] text-emerald-600 font-semibold">89% Win Rate</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">GST Quotes</p>
              <p className="text-lg font-black text-foreground mt-0.5">52</p>
              <p className="text-[10px] text-amber-600 font-semibold">18% GST PDF</p>
            </div>
          </div>

          {/* Sales Graph 1: Revenue vs Target */}
          <SalesRevenueChart data={metrics?.salesTrend} />

          {/* Sales Graph 2: Pipeline Funnel */}
          <PipelineFunnelChart data={metrics?.pipelineFunnel} />

          {/* High-Value Deal Spotlight */}
          <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-muted-foreground">Top Won Deal: <strong className="text-foreground">Apex Global Industries (₹14.5 Lakhs)</strong></span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate('/deals')}
              className="text-xs font-semibold text-primary h-7 px-2"
            >
              Open Deals Pipeline →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
