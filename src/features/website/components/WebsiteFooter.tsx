import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';

export const WebsiteFooter: React.FC = () => {
  return (
    <footer id="contact" className="border-t border-slate-800 bg-[#0A192F] text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 p-1.5 border border-white/15 flex items-center justify-center">
                <img
                  src="/kcis-icon.png"
                  alt="KCIS Info Solution Pvt Ltd"
                  className="h-full w-full object-contain filter drop-shadow"
                />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight block text-white">
                  KCIS Info Solution Pvt Ltd
                </span>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest block">
                  We Breathe Technology
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              India's enterprise IT systems integrator and managed cloud partner. 
              Engineering resilient multi-cloud architecture, 24x7 SOC-governed cybersecurity, 
              and legally guaranteed AMC contracts.
            </p>

            <div className="p-3.5 rounded-xl border border-slate-700/80 bg-slate-900/60 text-[11px] font-mono text-slate-300 space-y-1">
              <p><strong className="text-white">CIN:</strong> U72900DL2018PTC334512</p>
              <p><strong className="text-white">GSTIN:</strong> 07AAACK8892F1Z4 (18% IGST/CGST+SGST)</p>
              <p><strong className="text-white">ISO:</strong> 27001:2022 Certified Information Security</p>
            </div>
          </div>

          {/* Solutions Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#solutions" className="hover:text-blue-400 transition-colors">
                  Managed EDR & SOC
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-blue-400 transition-colors">
                  Hybrid Cloud & DevOps
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-blue-400 transition-colors">
                  M365 & VMware Licensing
                </a>
              </li>
              <li>
                <a href="#amc-tiers" className="hover:text-blue-400 transition-colors">
                  24x7 Platinum AMC SLAs
                </a>
              </li>
              <li>
                <a href="#estimator" className="hover:text-blue-400 transition-colors">
                  CPQ Retainer Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* CRM Quick Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200">
              CRM Portal
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-semibold">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sign In | CRM Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">
                  Admin Control Center
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">
                  Sales Lead & Deals Desk
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">
                  Technical AMC & Asset Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate Office & NOC */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Corporate Office & NOC
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Office No. 221, Second Floor, Vardhman Star Shop Mall, Sector 19, Faridabad, Haryana 121002</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 120 456 7890 (NOC Desk)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>sales@kcisindia.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>billing@kcisindia.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} KCIS Info Solution Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Security Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">SLA Terms</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Notice</span>
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
              Employee Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
