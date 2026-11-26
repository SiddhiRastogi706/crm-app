import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  FileCheck, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Server, 
  Terminal,
  Zap
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useCurrencyStore } from '@/shared/stores/currencyStore';

interface WebsiteHeroProps {
  onOpenConsultation: () => void;
}

export const WebsiteHero: React.FC<WebsiteHeroProps> = ({ onOpenConsultation }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { currency } = useCurrencyStore();

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello KCIS Info Solution! I am visiting your website and would like an enterprise IT consultation and formal GST quotation.`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <section className="relative w-full overflow-hidden bg-white text-slate-900 border-b border-slate-100">
      
      {/* Full-Bleed Boardroom CRM Banner with Increased Height and Transparent Light Blue Bottom Badge */}
      <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[540px] overflow-hidden">
        
        {/* Full Unobstructed Boardroom Presentation Image */}
        <img
          src="/hero-crm-boardroom.jpg"
          alt="KCIS CRM Boardroom Presentation"
          className="absolute inset-0 w-full h-full object-cover object-[center_20%] select-none"
        />

        {/* Soft subtle bottom edge gradient for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-black/10 to-transparent pointer-events-none" />

        {/* Transparent Light Blue Badge positioned at the bottom ("neech") */}
        <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 inset-x-0 flex items-center justify-center z-20">
          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-sky-500/25 hover:bg-sky-500/40 text-white font-extrabold text-sm sm:text-base shadow-2xl shadow-blue-950/50 backdrop-blur-xl border border-sky-300/50 hover:border-sky-200/80 transition-all duration-300 hover:scale-105 cursor-pointer group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400" />
            <Lock className="w-4 h-4 text-sky-200 group-hover:text-white transition-colors" />
            <span className="drop-shadow-sm font-bold">CRM Portal</span>
            <ArrowRight className="w-4 h-4 text-sky-200 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        </div>

      </div>

      {/* Live Operations Console */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sleek Live Operations Terminal / Console Preview */}
        <div className="max-w-5xl mx-auto relative">
          <div className="rounded-2xl border border-slate-800 bg-[#0B132B] shadow-2xl overflow-hidden text-white">
            
            {/* Top Terminal Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0F172A]/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90"></span>
                <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  kcis-command-center // live-telemetry
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  24x7 Platinum NOC Active
                </span>
                <span className="hidden sm:inline-block font-mono text-slate-400 text-[11px]">Faridabad Sec-19</span>
              </div>
            </div>

            {/* Console Content */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Card 1: Live Defense */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    EDR SOC Defense
                  </span>
                  <span className="text-emerald-400 font-mono">100% Protected</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Active Endpoints:</span>
                    <span className="font-mono text-white">12,480 Seats</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Zero-Day Threats:</span>
                    <span className="font-mono text-emerald-400">0 Blocked (24h)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">MTTR Resolution:</span>
                    <span className="font-mono text-sky-400">14 Mins (L3 Lead)</span>
                  </div>
                </div>
              </div>

              {/* Card 2: License Renewal Watch */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-amber-400" />
                    Asset License Monitor
                  </span>
                  <span className="text-amber-400 font-mono">Auto-Alerts</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Beacon Cybersecurity:</span>
                    <span className="font-mono text-amber-300">14 Days Left</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">TechFlow Solutions:</span>
                    <span className="font-mono text-amber-300">45 Days Left</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Quotation Status:</span>
                    <span className="font-mono text-emerald-400">GST Ready (18%)</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Revenue & SLA CPQ */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    Revenue & CPQ Engine
                  </span>
                  <span className="text-blue-300 font-mono">Q4 High</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Won Enterprise Deals:</span>
                    <span className="font-mono text-white font-bold">
                      ₹ 4,95,000
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Contract Format:</span>
                    <span className="font-mono text-slate-200">1-Click GST PDF</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Client Outreach:</span>
                    <span className="font-mono text-emerald-400">WhatsApp Direct API</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
