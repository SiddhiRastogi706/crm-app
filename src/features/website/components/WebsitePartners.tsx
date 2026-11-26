import React from 'react';
import { Award, Handshake } from 'lucide-react';

export const WebsitePartners: React.FC = () => {
  const partners = [
    { name: 'Cisco Systems', tier: 'Premier Partner', desc: 'Catalyst Switching, Core Routing & SD-WAN' },
    { name: 'Fortinet', tier: 'Advanced Integrator', desc: 'FortiGate Firewalls & Unified Threat Protection' },
    { name: 'Microsoft', tier: 'CSP Partner', desc: 'Microsoft 365, Azure Cloud & Active Directory' },
    { name: 'VMware', tier: 'Enterprise Cloud', desc: 'vSphere Virtualization & vSAN Data Center' },
    { name: 'CrowdStrike', tier: 'Falcon Elite', desc: 'Managed EDR & Next-Gen Endpoint Defense' },
    { name: 'AWS', tier: 'Consulting Partner', desc: 'EC2, Kubernetes Clusters & Hybrid Migration' },
    { name: 'Dell Technologies', tier: 'Solutions Partner', desc: 'PowerEdge Servers & PowerVault Storage' },
    { name: 'Sophos', tier: 'Security Partner', desc: 'Intercept X Endpoint & XGS Threat Defense' },
  ];

  return (
    <section id="partners" className="py-20 bg-slate-50/70 text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 shadow-sm">
            <Handshake className="w-3.5 h-3.5 text-blue-600" />
            <span>OEM ALLIANCE NETWORK</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Authorized Tier-1 Partnerships
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Direct OEM authorizations guaranteeing authentic software licensing and priority engineering escalations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {partners.map((partner, idx) => (
            <div 
              key={idx}
              className="rounded-xl border border-slate-200/90 bg-white p-4 text-center hover:border-blue-400 hover:shadow-md transition-all shadow-sm"
            >
              <p className="font-extrabold text-sm text-slate-900 tracking-tight">
                {partner.name}
              </p>
              <span className="inline-block text-[9px] font-bold text-blue-700 uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 border border-blue-200 mt-1 mb-1.5">
                {partner.tier}
              </span>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                {partner.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
