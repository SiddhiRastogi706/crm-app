import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  Server, 
  Cloud, 
  KeyRound, 
  Sparkles, 
  FileCheck,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useCurrencyStore } from '@/shared/stores/currencyStore';
import { formatCurrency } from '@/utils/formatters';

interface WebsiteEstimatorProps {
  onOpenConsultationWithPlan: (planDetails: {
    endpoints: number;
    services: string[];
    estimatedMonthly: number;
  }) => void;
}

export const WebsiteEstimator: React.FC<WebsiteEstimatorProps> = ({ onOpenConsultationWithPlan }) => {
  const { currency, setCurrency } = useCurrencyStore();

  const [endpoints, setEndpoints] = useState<number>(150);
  const [selectedServices, setSelectedServices] = useState<{ [key: string]: boolean }>({
    cybersecurity: true,
    amc: true,
    cloud: false,
    licensing: true,
  });

  const toggleService = (key: string) => {
    setSelectedServices((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const calculateEstimate = () => {
    let baseInr = 25000;

    if (selectedServices.cybersecurity) {
      baseInr += endpoints * 350;
    }
    if (selectedServices.amc) {
      baseInr += 35000 + endpoints * 150;
    }
    if (selectedServices.cloud) {
      baseInr += 45000;
    }
    if (selectedServices.licensing) {
      baseInr += endpoints * 200;
    }

    if (currency === 'USD') {
      return Math.round(baseInr / 85);
    }
    return baseInr;
  };

  const estimatedMonthly = calculateEstimate();
  const gstAmount = Math.round(estimatedMonthly * 0.18);
  const totalWithGst = estimatedMonthly + gstAmount;

  const handleProceed = () => {
    const serviceNames = Object.entries(selectedServices)
      .filter(([_, active]) => active)
      .map(([key]) => {
        if (key === 'cybersecurity') return 'Managed EDR Cybersecurity';
        if (key === 'amc') return '24x7 Platinum AMC SLA';
        if (key === 'cloud') return 'Hybrid Multi-Cloud DevOps';
        if (key === 'licensing') return 'Software License Governance';
        return key;
      });

    onOpenConsultationWithPlan({
      endpoints,
      services: serviceNames,
      estimatedMonthly: totalWithGst,
    });
  };

  return (
    <section id="estimator" className="py-20 lg:py-24 bg-white text-slate-900 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>TRANSPARENT CPQ CALCULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Estimate Your Infrastructure Retainer
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Select your seat count and technology modules. Instant estimation with 18% GST calculation.
          </p>
        </div>

        {/* Estimator Card */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/40 via-white to-slate-50/60 p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900">
                    Organization Endpoints:
                  </label>
                  <span className="text-sm font-mono font-bold text-blue-700 px-3 py-1 rounded-lg bg-blue-100/70 border border-blue-200 shadow-sm">
                    {endpoints} Seats
                  </span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="1000"
                  step="25"
                  value={endpoints}
                  onChange={(e) => setEndpoints(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono font-medium">
                  <span>25</span>
                  <span>250</span>
                  <span>500</span>
                  <span>1000+ Seats</span>
                </div>
              </div>

              {/* Modules Grid */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 block">
                  Select Modules:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <button
                    type="button"
                    onClick={() => toggleService('cybersecurity')}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedServices.cybersecurity
                        ? 'border-blue-600 bg-blue-50/90 text-blue-950 shadow-sm ring-1 ring-blue-600/30'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${selectedServices.cybersecurity ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-900">EDR Cybersecurity</p>
                      <p className="text-[11px] text-slate-500">CrowdStrike/Fortinet SOC</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleService('amc')}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedServices.amc
                        ? 'border-blue-600 bg-blue-50/90 text-blue-950 shadow-sm ring-1 ring-blue-600/30'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Server className={`w-5 h-5 shrink-0 mt-0.5 ${selectedServices.amc ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-900">24x7 Platinum AMC</p>
                      <p className="text-[11px] text-slate-500">4hr MTTR & Standby Spares</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleService('cloud')}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedServices.cloud
                        ? 'border-blue-600 bg-blue-50/90 text-blue-950 shadow-sm ring-1 ring-blue-600/30'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Cloud className={`w-5 h-5 shrink-0 mt-0.5 ${selectedServices.cloud ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Multi-Cloud DevOps</p>
                      <p className="text-[11px] text-slate-500">AWS/Azure 99.99% Uptime</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleService('licensing')}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedServices.licensing
                        ? 'border-blue-600 bg-blue-50/90 text-blue-950 shadow-sm ring-1 ring-blue-600/30'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <KeyRound className={`w-5 h-5 shrink-0 mt-0.5 ${selectedServices.licensing ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-900">License Governance</p>
                      <p className="text-[11px] text-slate-500">M365 & VMware Renewals</p>
                    </div>
                  </button>

                </div>
              </div>

            </div>

            {/* Right Summary */}
            <div className="lg:col-span-5 rounded-2xl border border-blue-100 bg-white p-6 space-y-6 shadow-md">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-500">Invoicing Currency:</span>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                    ₹ INR (Official GST)
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Monthly Retainer:</span>
                    <span className="font-mono font-semibold text-slate-900">{formatCurrency(estimatedMonthly)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (18% IGST / CGST+SGST):</span>
                    <span className="font-mono font-semibold text-slate-900">{formatCurrency(gstAmount)}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900">Total Estimated (Mo):</span>
                    <span className="text-2xl font-black text-blue-600 font-mono">
                      {formatCurrency(totalWithGst)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  onClick={handleProceed}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Lock In Quote & Request Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">
                  Generates instant formal quote reference in KCIS CRM under GSTIN 07AAACK8892F1Z4.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
