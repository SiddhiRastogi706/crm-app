import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Code2,
  Users,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Check,
  TrendingUp,
  FileCheck2,
  Headphones,
  Sparkles,
  BarChart3,
  BadgeCheck,
  Flame
} from 'lucide-react';
import { loginSchema, LoginFormValues } from '../schemas/authSchemas';
import { useAuthStore } from '../stores/authStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'technical' | 'sales'>('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const handleSelectRole = (role: 'admin' | 'technical' | 'sales') => {
    setSelectedRole(role);
    // Manual by default: does NOT automatically overwrite credentials!
  };

  const handleFillDemoCredentials = () => {
    if (selectedRole === 'admin') {
      setValue('email', 'admin@kcisindia.com', { shouldValidate: true });
    } else if (selectedRole === 'technical') {
      setValue('email', 'tech@kcisindia.com', { shouldValidate: true });
    } else if (selectedRole === 'sales') {
      setValue('email', 'sales@kcisindia.com', { shouldValidate: true });
    }
    setValue('password', 'password123', { shouldValidate: true });
    toast.info(`Filled sample ${selectedRole} credentials`);
  };

  const onSubmit = async (data: LoginFormValues) => {
    clearError();
    try {
      await login(data);
      toast.success('Successfully logged in');
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    }
  };

  const roleMeta = {
    admin: {
      title: 'Super Administrator',
      desc: 'Dual executive overview, full RBAC security, sales pipelines & tech queues.',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
      iconColor: 'text-blue-600',
    },
    technical: {
      title: 'Technical Support & NOC',
      desc: 'Incident resolution desk, hardware spares inventory & client SLA telemetry.',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      iconColor: 'text-indigo-600',
    },
    sales: {
      title: 'Sales & Deal Executive',
      desc: 'Enterprise deals pipeline, lead qualification & 1-click 18% GST quotations.',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      iconColor: 'text-emerald-600',
    },
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* LEFT COLUMN: Dedicated CRM Capabilities & Deal Intelligence Showcase      */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[54%] relative flex-col justify-between p-10 xl:p-14 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white shadow-2xl">
        
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-400/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        {/* Top Header: Brand Identity & CRM Status */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="h-11 w-11 rounded-xl bg-white p-2 shadow-lg shadow-black/20 flex items-center justify-center border border-white/30 group-hover:scale-105 transition-transform duration-200">
              <img
                src="/kcis-icon.png"
                alt="KCIS Info Solution Pvt Ltd Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block">
                KCIS Info Solution Pvt Ltd
              </span>
              <span className="text-[11px] font-bold text-sky-300 tracking-wider uppercase block">
                We Breathe Technology
              </span>
            </div>
          </Link>

          {/* Dedicated CRM Cloud Active Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] tracking-wide">CRM Cloud Active</span>
          </div>
        </div>

        {/* Center Content: Specific CRM Headline & Deal Desk Mockup */}
        <div className="relative z-10 py-4 my-auto space-y-6">
          <div className="space-y-2.5 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 border border-sky-300/30 text-sky-200 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>KCIS ENTERPRISE CRM & CPQ PLATFORM</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-[1.2]">
              Accelerate Every Deal.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-200 to-white">
                Nurture Client Trust.
              </span>
            </h2>
            <p className="text-sm xl:text-base text-blue-100/90 font-normal leading-relaxed">
              Centralized pipeline governance, automated 18% GST quotations, real-time ticket escalation, and client intelligence — built specifically for KCIS enterprise operations.
            </p>
          </div>

          {/* Visual Showcase: CRM Interface with Floating Pipeline Telemetry */}
          <div className="relative max-w-lg xl:max-w-xl group">
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-blue-950/60 bg-blue-900/40 backdrop-blur-md">
              <img
                src="/login-crm-hero.jpg"
                alt="KCIS CRM Pipeline Command"
                className="w-full h-52 xl:h-60 object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/85 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-white/90">
                <span className="font-semibold flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  Live Deal Velocity
                </span>
                <span className="font-mono text-[11px] text-sky-200 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  24 Active Pipelines In Progress
                </span>
              </div>
            </div>

            {/* Floating CRM KPI Badge 1: Top-Right (Active Pipeline) */}
            <div className="absolute -top-3.5 -right-3.5 bg-white text-slate-900 rounded-xl px-3.5 py-2 shadow-xl border border-blue-100 flex items-center gap-2.5 animate-in fade-in zoom-in duration-300">
              <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-slate-900">₹84.0 Lakhs</div>
                <div className="text-[10px] font-semibold text-slate-500">Active Deals Pipeline</div>
              </div>
            </div>

            {/* Floating CRM KPI Badge 2: Bottom-Left (GST Quotes & Conversion) */}
            <div className="absolute -bottom-3.5 -left-3.5 bg-white text-slate-900 rounded-xl px-3.5 py-2 shadow-xl border border-blue-100 flex items-center gap-2.5 animate-in fade-in zoom-in duration-300">
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-slate-900">52 GST Quotes</div>
                <div className="text-[10px] font-semibold text-slate-500">68% Win Conversion</div>
              </div>
            </div>
          </div>

          {/* CRM Capability Features List */}
          <div className="grid grid-cols-2 gap-2.5 max-w-lg xl:max-w-xl pt-1">
            <div className="flex items-center gap-2 text-xs text-blue-100/90 font-medium">
              <Check className="w-4 h-4 text-sky-300 shrink-0" />
              <span>Interactive Kanban Deal Funnel</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-100/90 font-medium">
              <Check className="w-4 h-4 text-sky-300 shrink-0" />
              <span>1-Click 18% GST Quotation PDF</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-100/90 font-medium">
              <Check className="w-4 h-4 text-sky-300 shrink-0" />
              <span>Role-Based Dashboards (Admin/Tech/Sales)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-100/90 font-medium">
              <Check className="w-4 h-4 text-sky-300 shrink-0" />
              <span>Strict ₹ INR Accounting & Audit Logs</span>
            </div>
          </div>

          {/* 3 Dedicated CRM Metrics Row */}
          <div className="grid grid-cols-3 gap-3 max-w-lg xl:max-w-xl pt-1">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
              <div className="text-lg xl:text-xl font-black text-white">₹4.95 L</div>
              <div className="text-[11px] font-medium text-sky-200">Closed Sales Revenue</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
              <div className="text-lg xl:text-xl font-black text-white">34 Deals</div>
              <div className="text-[11px] font-medium text-sky-200">Won Enterprise Contracts</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
              <div className="text-lg xl:text-xl font-black text-white">&lt; 1.8 hrs</div>
              <div className="text-[11px] font-medium text-sky-200">Avg Resolution MTTR</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Security & Compliance */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs text-blue-200/90 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <LockKeyhole className="w-3.5 h-3.5 text-sky-300" />
              SOC-2 Type II Certified
            </span>
            <span>•</span>
            <span>AES-256 Data Encryption</span>
          </div>
          <span className="text-[11px] text-blue-200/70">
            Faridabad, Haryana 121002
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: Elevated, Clean Authentication Desk                         */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 xl:w-[46%] flex flex-col justify-between p-6 sm:p-10 xl:p-14 bg-white relative overflow-y-auto">
        
        {/* Top Navbar: Back to website & Version Badge */}
        <div className="flex items-center justify-between pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors group px-3 py-1.5 rounded-lg hover:bg-slate-50 border border-slate-200/80 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to KCIS Website</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
              SOC-2 Ready
            </span>
            <span className="text-[11px] font-mono text-slate-400 font-semibold">Portal v2.4</span>
          </div>
        </div>

        {/* Central Form Container */}
        <div className="max-w-md w-full mx-auto space-y-6 my-auto py-4">
          
          {/* Header Brand Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-blue-50 p-2 border border-blue-200/80 shadow-sm flex items-center justify-center">
                <img
                  src="/kcis-icon.png"
                  alt="KCIS Info Solution Pvt Ltd Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  KCIS Info Solution Pvt Ltd
                </h1>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  We Breathe Technology
                </p>
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Sign in to CRM Portal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Access your leads, active deals, client contracts, and technical support desk.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium flex items-center gap-2 animate-in fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            
            {/* 3 Role Quick Selector Tabs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Select CRM Role / Desk
                </label>
                <span className="text-[11px] font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                  @kcisindia.com
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleSelectRole('admin')}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    selectedRole === 'admin'
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white"
                  )}
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('technical')}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    selectedRole === 'technical'
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white"
                  )}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>Tech</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('sales')}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    selectedRole === 'sales'
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white"
                  )}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>Sales</span>
                </button>
              </div>

              {/* Dynamic Role Detail Callout */}
              <div className={cn("p-2.5 rounded-xl border text-[11px] flex items-start gap-2 transition-all", roleMeta[selectedRole].badgeColor)}>
                <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", roleMeta[selectedRole].iconColor)} />
                <div className="leading-tight">
                  <span className="font-bold">{roleMeta[selectedRole].title}:</span>{' '}
                  <span className="opacity-90">{roleMeta[selectedRole].desc}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] px-0.5 pt-0.5">
                <span className="text-slate-500 font-medium">Enter your credentials manually below:</span>
                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer"
                >
                  Fill sample {selectedRole} login
                </button>
              </div>
            </div>

            {/* Work Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="email">
                Work Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@kcisindia.com"
                leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
                error={errors.email?.message}
                {...register('email')}
                className="bg-slate-50/70 border-slate-200 focus:bg-white text-slate-900 rounded-xl h-11 text-xs sm:text-sm font-medium"
              />
              {errors.email ? (
                <p className="text-xs text-rose-600 font-medium mt-1">{errors.email.message}</p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3 text-blue-600" />
                  Official KCIS domain (<span className="text-blue-600 font-semibold">@kcisindia.com</span>) required
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700" htmlFor="password">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
                className="bg-slate-50/70 border-slate-200 focus:bg-white text-slate-900 rounded-xl h-11 text-xs sm:text-sm font-medium"
              />
              {errors.password && (
                <p className="text-xs text-rose-600 font-medium mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Keep Signed In Checkbox */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer select-none font-medium">
                Keep me signed in on this device
              </label>
            </div>

            {/* Primary Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer border border-blue-400/20"
              isLoading={isLoading}
            >
              <span>Sign In to CRM Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Registration Link */}
          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        {/* Bottom Security Assurance & Address */}
        <div className="text-center pt-6 border-t border-slate-100 space-y-1">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <LockKeyhole className="w-3.5 h-3.5 text-slate-400" />
            Protected by enterprise-grade SOC-2 and AES-256 encryption.
          </p>
          <p className="text-[10px] text-slate-400">
            Office No. 221, Second Floor, Vardhman Star Shop Mall, Sector 19, Faridabad, Haryana 121002
          </p>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
