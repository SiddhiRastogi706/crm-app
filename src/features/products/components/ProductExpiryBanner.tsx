import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, X, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { productService } from '../services/productService';
import { SoldProduct } from '@/lib/api/types';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useNavigate } from 'react-router-dom';

interface ProductExpiryBannerProps {
  onOpenModal: () => void;
}

export const ProductExpiryBanner: React.FC<ProductExpiryBannerProps> = ({ onOpenModal }) => {
  const [expiring, setExpiring] = useState<SoldProduct[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    productService
      .getExpiringProducts()
      .then((items) => setExpiring(items))
      .catch(() => {});
  }, []);

  if (dismissed) return null;

  // Tech-specific alert banner
  if (user?.role === 'technical') {
    return (
      <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 text-white px-4 py-2 text-xs font-medium shadow-xs flex items-center justify-between transition-all">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
            <AlertCircle className="h-3.5 w-3.5 animate-pulse" />
          </span>
          <span className="truncate">
            <strong>Urgent Tech Incident Alert:</strong> 1 Critical problem left breaching SLA (SSO Okta 403) & 23 support tickets active in queue.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            className="h-7 text-xs bg-white text-rose-950 hover:bg-white/90 font-bold px-2.5 shadow-xs cursor-pointer"
            onClick={() => navigate('/tickets')}
          >
            Resolve Urgent Problem <ArrowRight className="h-3 w-3 ml-1" />
          </Button>

          <button
            onClick={() => setDismissed(true)}
            className="text-white/80 hover:text-white p-1 rounded-sm hover:bg-white/10 cursor-pointer"
            title="Dismiss banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (expiring.length === 0) return null;

  const urgentCount = expiring.filter((p) => p.status === 'expiring_soon').length;
  const twoMonthsCount = expiring.filter((p) => p.status === 'expiring_two_months').length;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-2 text-xs font-medium shadow-xs flex items-center justify-between transition-all">
      <div className="flex items-center gap-2.5 overflow-hidden">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
          <Clock className="h-3 w-3 animate-spin" />
        </span>
        <span className="truncate">
          <strong>Software License Alert:</strong> You have{' '}
          {urgentCount > 0 && <span className="underline decoration-white font-bold">{urgentCount} software product(s) expiring in 2 weeks</span>}
          {urgentCount > 0 && twoMonthsCount > 0 && ' and '}
          {twoMonthsCount > 0 && <span>{twoMonthsCount} expiring in 2 months</span>}.
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant="secondary"
          className="h-7 text-xs bg-white text-amber-900 hover:bg-white/90 font-semibold px-2.5 shadow-xs"
          onClick={onOpenModal}
        >
          Review & Renew Now <ArrowRight className="h-3 w-3 ml-1" />
        </Button>

        <button
          onClick={() => setDismissed(true)}
          className="text-white/80 hover:text-white p-1 rounded-sm hover:bg-white/10"
          title="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
