import React from 'react';
import { 
  ShieldAlert, 
  Cloud, 
  KeyRound, 
  Wrench, 
  Network, 
  BarChart3, 
  Check, 
  ArrowRight,
  Clock,
  ShieldCheck,
  Zap,
  Server
} from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface WebsiteSolutionsProps {
  onOpenConsultation: () => void;
}

export const WebsiteSolutions: React.FC<WebsiteSolutionsProps> = ({ onOpenConsultation }) => {
  return (
    <section id="solutions" className="py-20 lg:py-24 bg-slate-50/60 text-slate-900 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading - Clean & Authoritative */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>ENTERPRISE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Engineered for Zero Downtime
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Full-lifecycle technology management — from high-throughput networks and cybersecurity to legally binding AMC SLAs.
          </p>
        </div>

        {/* Bento Grid Layout - Clean Blue & White */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Tile 1: 2-Column Featured AMC & SLA (Blue Theme with Wrench Watermark) */}
          <div className="md:col-span-2 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/60 via-white to-blue-50/30 p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-blue-400 hover:bg-blue-50/80 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
            {/* Corner Watermark on Hover */}
            <Wrench className="absolute -bottom-8 -right-8 w-48 h-48 text-blue-600 pointer-events-none opacity-0 group-hover:opacity-[0.08] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 ease-out" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200">
                  Mission Critical SLA
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  24x7 Platinum AMC & Standby Hardware Spares
                </h3>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed max-w-xl">
                  Guaranteed 4-hour on-site MTTR response across Delhi-NCR & major enterprise hubs. 
                  Includes certified L3 engineers on standby 24/7/365, preventive quarterly audits, and free standby replacement spares.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-blue-100 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-blue-100/80 shadow-sm group-hover:border-blue-200 transition-colors">
                  <p className="font-extrabold text-slate-900 text-sm">&lt; 4 Hours</p>
                  <p className="text-slate-500 mt-0.5 font-medium">On-Site MTTR Resolution</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-blue-100/80 shadow-sm group-hover:border-blue-200 transition-colors">
                  <p className="font-extrabold text-slate-900 text-sm">Standby Spares</p>
                  <p className="text-slate-500 mt-0.5 font-medium">Switches, Routers & PSUs</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-blue-100/80 shadow-sm group-hover:border-blue-200 transition-colors">
                  <p className="font-extrabold text-slate-900 text-sm">Quarterly Audits</p>
                  <p className="text-slate-500 mt-0.5 font-medium">Preventive Health Scans</p>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 relative z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenConsultation}
                className="border-blue-200 bg-white hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-semibold shadow-sm transition-all"
              >
                <span>Request AMC Service Agreement</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Bento Tile 2: Managed Cybersecurity & SOC (Indigo/Blue Theme with ShieldAlert Watermark) */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-7 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 shadow-sm">
            {/* Corner Watermark on Hover */}
            <ShieldAlert className="absolute -bottom-8 -right-8 w-40 h-40 text-indigo-600 pointer-events-none opacity-0 group-hover:opacity-[0.09] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 ease-out" />

            <div className="space-y-4 relative z-10">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-110 transition-all duration-300">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Managed EDR & 24x7 SOC
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                  Next-generation endpoint defense powered by CrowdStrike Falcon & FortiGate firewalls with automated ransomware rollback.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>24x7 Real-Time SOC Telemetry</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Zero-Trust Network Enforcement</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>SOC-2 & ISO 27001 Audit Ready</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={onOpenConsultation}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Explore SOC Defense</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Tile 3: Multi-Cloud Infrastructure (Sky Blue Theme with Cloud Watermark) */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-7 flex flex-col justify-between relative overflow-hidden group hover:border-sky-300 hover:bg-sky-50/60 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 shadow-sm">
            {/* Corner Watermark on Hover */}
            <Cloud className="absolute -bottom-8 -right-8 w-40 h-40 text-sky-600 pointer-events-none opacity-0 group-hover:opacity-[0.09] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 ease-out" />

            <div className="space-y-4 relative z-10">
              <div className="h-12 w-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-100 group-hover:scale-110 transition-all duration-300">
                <Cloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  Hybrid Multi-Cloud DevOps
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                  High-availability AWS, Azure & VMware deployments with automated Kubernetes orchestration and zero-downtime DR.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>99.99% Uptime Architecture</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Automated Disaster Recovery</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Bare-Metal & Hyper-V Clusters</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={onOpenConsultation}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Cloud Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Tile 4: Software Licensing & Lifecycle (Yellow / Amber Theme with KeyRound Watermark) */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-7 flex flex-col justify-between relative overflow-hidden group hover:border-amber-300 hover:bg-amber-50/60 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 shadow-sm">
            {/* Corner Watermark on Hover */}
            <KeyRound className="absolute -bottom-8 -right-8 w-40 h-40 text-amber-600 pointer-events-none opacity-0 group-hover:opacity-[0.09] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 ease-out" />

            <div className="space-y-4 relative z-10">
              <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 group-hover:scale-110 transition-all duration-300">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Software License Governance
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                  Official Tier-1 partner pricing for Microsoft 365, VMware vSphere, Cisco Meraki, and Fortinet with automated 30-day renewal notices.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Tier-1 Partner Volume Pricing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Audit Defense & True-Up Protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Automated Renewal Quoting</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={onOpenConsultation}
                className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Check License Pricing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Tile 5: Proprietary KCIS CRM & CPQ Engine (Emerald / Green Theme with BarChart3 Watermark) */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-7 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-300 hover:bg-emerald-50/60 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 shadow-sm">
            {/* Corner Watermark on Hover */}
            <BarChart3 className="absolute -bottom-8 -right-8 w-40 h-40 text-emerald-600 pointer-events-none opacity-0 group-hover:opacity-[0.09] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 ease-out" />

            <div className="space-y-4 relative z-10">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 group-hover:scale-110 transition-all duration-300">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Integrated CRM & CPQ
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                  In-house customer intelligence platform generating formal 18% GST quotations, WhatsApp alerts, and multi-currency billing.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>1-Click Formal GST Proposal PDF</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>WhatsApp Outreach Templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Role-Based (Admin/Sales/Tech)</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={onOpenConsultation}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Access CRM Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Clean SLA Comparison Cards */}
        <div id="amc-tiers" className="mt-20 pt-16 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Transparent SLA Contracts
            </h3>
            <p className="text-slate-600 text-sm">
              Legally binding uptime and response time agreements backed by certified L3 engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Silver Tier */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-lg transition-all duration-300">
              <Clock className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-400 pointer-events-none opacity-0 group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500 ease-out" />
              <div className="relative z-10">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block font-semibold">Standard</span>
                <h4 className="text-xl font-bold text-slate-900 mt-1">Silver NBD</h4>
                <p className="text-xs text-slate-500 mt-2">Next Business Day response for non-critical corporate offices.</p>
                <div className="mt-6 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>NBD On-Site Resolution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>8x5 Remote Helpdesk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Monthly Security Patching</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onOpenConsultation} 
                className="mt-6 w-full text-xs border-slate-200 text-slate-700 hover:bg-white hover:text-blue-600 relative z-10 transition-colors"
              >
                Inquire Silver
              </Button>
            </div>

            {/* Gold Tier */}
            <div className="rounded-2xl border border-blue-200 bg-white p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
              <ShieldCheck className="absolute -bottom-6 -right-6 w-32 h-32 text-amber-500 pointer-events-none opacity-0 group-hover:opacity-[0.09] group-hover:scale-110 transition-all duration-500 ease-out" />
              <div className="relative z-10">
                <span className="text-xs font-mono text-amber-600 uppercase tracking-wider block font-semibold">Professional</span>
                <h4 className="text-xl font-bold text-slate-900 mt-1 group-hover:text-amber-800 transition-colors">8x5 Gold Support</h4>
                <p className="text-xs text-slate-500 mt-2">Business-hours coverage for production servers and clusters.</p>
                <div className="mt-6 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>8-Hour Guaranteed MTTR</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Dedicated Technical Lead</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Quarterly Preventive Audits</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onOpenConsultation} 
                className="mt-6 w-full text-xs border-amber-200 text-amber-800 hover:bg-amber-100/60 relative z-10 transition-colors"
              >
                Inquire Gold
              </Button>
            </div>

            {/* Platinum Tier (Featured) */}
            <div className="rounded-2xl border-2 border-blue-600 bg-gradient-to-b from-blue-700 to-indigo-800 text-white p-6 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-blue-600/25 group hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
              <Zap className="absolute -bottom-8 -right-8 w-40 h-40 text-white pointer-events-none opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 ease-out" />
              <span className="absolute -top-3 right-6 bg-white text-blue-700 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-md tracking-wider border border-blue-200 z-10">
                Recommended
              </span>
              <div className="relative z-10">
                <span className="text-xs font-mono text-blue-200 uppercase tracking-wider block font-semibold">Zero Downtime</span>
                <h4 className="text-xl font-bold text-white mt-1">24x7 Platinum</h4>
                <p className="text-xs text-blue-100 mt-2">Mission-critical SLA for data centers, banking & healthcare.</p>
                <div className="mt-6 space-y-2.5 text-xs text-white">
                  <div className="flex items-center gap-2 font-bold text-blue-100">
                    <Clock className="w-4 h-4 text-amber-300" />
                    <span>4-Hour MTTR & 24/7/365 Standby NOC</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>On-Site Standby Replacement Spares</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Direct OEM Priority Escalation</span>
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={onOpenConsultation} 
                className="mt-6 w-full text-xs bg-white text-blue-700 hover:bg-blue-50 font-bold h-9 shadow-md relative z-10 transition-colors"
              >
                Inquire 24x7 Platinum
              </Button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
