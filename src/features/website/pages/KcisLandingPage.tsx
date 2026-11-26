import React, { useState } from 'react';
import { WebsiteNavbar } from '../components/WebsiteNavbar';
import { WebsiteHero } from '../components/WebsiteHero';
import { WebsiteSolutions } from '../components/WebsiteSolutions';
import { WebsiteEstimator } from '../components/WebsiteEstimator';
import { WebsitePartners } from '../components/WebsitePartners';
import { WebsiteConsultationModal } from '../components/WebsiteConsultationModal';
import { WebsiteFooter } from '../components/WebsiteFooter';

export const KcisLandingPage: React.FC = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [prefilledPlan, setPrefilledPlan] = useState<{
    endpoints: number;
    services: string[];
    estimatedMonthly: number;
  } | null>(null);

  const handleOpenConsultation = () => {
    setPrefilledPlan(null);
    setIsConsultationOpen(true);
  };

  const handleOpenConsultationWithPlan = (plan: {
    endpoints: number;
    services: string[];
    estimatedMonthly: number;
  }) => {
    setPrefilledPlan(plan);
    setIsConsultationOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white font-sans antialiased">
      {/* Top Navigation with Sign In on the Right */}
      <WebsiteNavbar onOpenConsultation={handleOpenConsultation} />

      {/* Main Corporate Sections */}
      <main className="flex-1">
        {/* Hero with KCIS Tagline & Badges */}
        <WebsiteHero onOpenConsultation={handleOpenConsultation} />

        {/* Enterprise Solutions & AMC SLA Matrix */}
        <WebsiteSolutions onOpenConsultation={handleOpenConsultation} />

        {/* Interactive CPQ SLA & Cost Estimator */}
        <WebsiteEstimator onOpenConsultationWithPlan={handleOpenConsultationWithPlan} />

        {/* Global Authorized Partners */}
        <WebsitePartners />
      </main>

      {/* Corporate Legal Footer */}
      <WebsiteFooter />

      {/* Direct CRM Lead Consultation Modal */}
      <WebsiteConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        prefilledPlan={prefilledPlan}
      />
    </div>
  );
};
