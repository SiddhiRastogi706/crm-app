import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Plus,
  Download,
  Calendar as CalendarIcon,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  PackageCheck,
  BellRing,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  Wrench,
  Briefcase,
  Columns
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { productService } from '@/features/products/services/productService';
import { apiClient } from '@/lib/api/axios';
import { Task } from '@/lib/api/types';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useNavigate } from 'react-router-dom';
import { downloadCSV } from '@/utils/export';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Specialized Role Dashboards
import { TechDashboardView } from '../components/TechDashboardView';
import { SalesDashboardView } from '../components/SalesDashboardView';
import { AdminDualDashboardView } from '../components/AdminDualDashboardView';

export const DashboardPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = useAuthStore((state) => state.user);
  const { role, isAdmin, isTechnical, isSalesRep } = usePermissions();
  const navigate = useNavigate();

  // Strict role classification:
  // Technical -> Only Tech Dashboard
  // Sales Rep -> Only Sales Dashboard
  // Admin -> Dual Dashboard (Left Tech, Right Sales)
  const isTech = role === 'technical';
  const isSales = role === 'sales_rep';

  // Live real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Dashboard Metrics with selected range
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics', dateRange],
    queryFn: () => dashboardService.getMetrics(dateRange),
  });

  // Fetch expiring products for proactive alerts
  const { data: expiringProducts = [] } = useQuery({
    queryKey: ['expiring-products'],
    queryFn: () => productService.getExpiringProducts(),
  });

  // Fetch tasks
  const { data: tasks = [], refetch: refetchTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await apiClient.get<Task[]>('/tasks');
      return res.data;
    },
  });

  const urgentCount = expiringProducts.filter((p) => p.status === 'expiring_soon').length;
  const twoMonthsCount = expiringProducts.filter((p) => p.status === 'expiring_two_months').length;

  const handleOpenExpiryAlerts = () => {
    window.dispatchEvent(new CustomEvent('pulse:open-expiry-modal'));
  };

  const handleExportSummary = () => {
    if (!metrics) return;
    const headers = ['Metric', 'Current Value', 'Growth Rate'];
    const rows = [
      ['Total Revenue', formatCurrency(metrics.revenue.current), `${metrics.revenue.change}%`],
      ['Total Tickets Raised', '284', '+14%'],
      ['Problems Solved', '261', '91.9% resolution'],
      ['Deals Won', metrics.dealsWon.current, `${metrics.dealsWon.change}%`],
      ['NOC SLA Uptime', '99.99%', 'Platinum Guaranteed'],
    ];
    downloadCSV(`kcis-crm-kpi-summary-${dateRange}`, headers, rows);
    toast.success('KPI summary exported to CSV');
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const ranges = [
    { label: 'Today', value: 'today' },
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: 'Quarter', value: 'quarter' },
    { label: 'This Year', value: 'year' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* 🚀 Dynamic Hero Command Center Header */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-5 sm:p-6 shadow-sm">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Greeting & Live Clock */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Live Command Center
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3 inline text-primary" />
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {getGreeting()}, {user?.name.split(' ')[0] || 'Team'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              KCIS Info Solution Pvt Ltd &bull; <span className="text-primary font-semibold">We Breathe Technology</span>
            </p>
          </div>

          {/* Role-Specific Identity Badge (NO manual view switcher buttons) */}
          <div className="flex items-center">
            {isTech ? (
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                <Wrench className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">Technical NOC & Support Desk</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Incident Queue, Tickets & Telemetry</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
              </div>
            ) : isSales ? (
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300">
                <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">Enterprise Sales & Deal Desk</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Pipeline Trajectory & GST Proposals</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse ml-1" />
              </div>
            ) : (
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Columns className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">Executive Operations Desk</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Dual View: Technical NOC + Sales Pipeline</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Pills & Timeline Filters */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2">
            {!isTech && (
              <>
                <Button
                  size="sm"
                  onClick={() => navigate('/leads')}
                  className="h-8 text-xs bg-primary hover:bg-primary/90 text-white shadow-xs gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> New Lead
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/deals')}
                  className="h-8 text-xs gap-1.5 bg-background hover:bg-muted"
                >
                  <Layers className="h-3.5 w-3.5 text-blue-600" /> Deals Pipeline
                </Button>
              </>
            )}

            {!isSales && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/tickets')}
                className="h-8 text-xs gap-1.5 bg-background hover:bg-muted"
              >
                <Wrench className="h-3.5 w-3.5 text-emerald-600" /> Support Tickets
              </Button>
            )}

            {isTech ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/tickets')}
                className="h-8 text-xs gap-1.5 bg-rose-50/80 hover:bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300/80 animate-pulse cursor-pointer"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                Urgent Incidents (1)
              </Button>
            ) : (urgentCount > 0 || twoMonthsCount > 0) && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpenExpiryAlerts}
                className="h-8 text-xs gap-1.5 bg-amber-50/80 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300/80 animate-pulse"
              >
                <BellRing className="h-3.5 w-3.5 text-amber-600" />
                Expiry Alerts ({urgentCount + twoMonthsCount})
              </Button>
            )}
          </div>

          {/* Timeline Filter Controls */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-border bg-background p-1 shadow-2xs">
              {ranges.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setDateRange(r.value)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                    dateRange === r.value
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportSummary}
              className="h-8 gap-1.5 text-xs bg-background"
              title="Export KPI Summary to CSV"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* ⚠️ Proactive Alert Action Strip: Role-Specific (Technical vs Sales Renewals) */}
      {isTech ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-rose-500/15 via-amber-500/10 to-rose-500/5 border border-rose-400/40 dark:border-rose-800 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
              <AlertTriangle className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground flex items-center gap-2">
                <span>Urgent Support Ticket: 1 Critical Problem Pending & 23 Active Cases Left!</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-600 text-white tracking-wide">
                  Critical SLA
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                TechFlow Solutions Okta SSO SAML 2.0 error 403 requires immediate L2/L3 resolution before SLA breach.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => navigate('/tickets')}
            className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white shrink-0 gap-1.5 font-bold shadow-xs cursor-pointer"
          >
            Resolve Urgent Problem <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      ) : (urgentCount > 0 || twoMonthsCount > 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/5 border border-amber-400/40 dark:border-amber-800 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <AlertTriangle className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Urgent Client Renewals: {urgentCount} license(s) expiring within 2 weeks and {twoMonthsCount} within 2 months!
              </p>
              <p className="text-xs text-muted-foreground">
                Proactively follow up with TechFlow Solutions & Apex Health Systems to protect recurring revenue.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleOpenExpiryAlerts}
            className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white shrink-0 gap-1.5 font-semibold"
          >
            Review & Renew Now <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      )}

      {/* =========================================================================
          🔥 STRICT ROLE-BASED DASHBOARD RENDERING:
          - Tech User -> Only Tech Dashboard (Tickets Raised/Solved, MTTR, Telemetry)
          - Sales User -> Only Sales Dashboard (Revenue, Pipeline, Deals)
          - Admin User -> Dual Dashboard (Left Side Tech, Right Side Sales)
          ========================================================================= */}
      {isTech ? (
        <TechDashboardView dateRange={dateRange} />
      ) : isSales ? (
        <SalesDashboardView
          metrics={metrics}
          tasks={tasks}
          refetchTasks={refetchTasks}
          dateRange={dateRange}
        />
      ) : (
        <AdminDualDashboardView metrics={metrics} />
      )}
    </motion.div>
  );
};

export default DashboardPage;
