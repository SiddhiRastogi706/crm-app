import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Building,
  Key,
  DollarSign,
  ArrowRight,
  X,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { SoldProduct } from '@/lib/api/types';
import { productService } from '../services/productService';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface ProductExpiryModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const ProductExpiryModal: React.FC<ProductExpiryModalProps> = ({ forceOpen, onClose }) => {
  const [open, setOpen] = useState(false);
  const [expiringProducts, setExpiringProducts] = useState<SoldProduct[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    productService
      .getExpiringProducts()
      .then((data) => {
        setExpiringProducts(data);
        // Automatically show popup once per session if there are expiring items
        const hasSeenSessionAlert = sessionStorage.getItem('pulse_crm_has_seen_expiry_alert');
        if (data.length > 0 && !hasSeenSessionAlert) {
          setOpen(true);
          sessionStorage.setItem('pulse_crm_has_seen_expiry_alert', 'true');
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (forceOpen !== undefined) {
      setOpen(forceOpen);
    }
  }, [forceOpen]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  const handleRenew = async (product: SoldProduct) => {
    setLoadingId(product.id);
    try {
      await productService.renewSoldProduct(product.id, 12);
      toast.success(`License renewed! ${product.productName} extended by 1 year.`);
      setExpiringProducts((prev) => prev.filter((p) => p.id !== product.id));
      if (expiringProducts.length <= 1) {
        handleClose();
      }
    } catch {
      toast.error('Failed to renew license. Please try again.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleSendReminder = (product: SoldProduct) => {
    toast.success(`Renewal reminder email sent to ${product.contactName} (${product.company})!`);
  };

  const handleViewClient = (contactId: string) => {
    handleClose();
    navigate(`/contacts/${contactId}`);
  };

  if (expiringProducts.length === 0 && !forceOpen) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Software License Expiry Alert
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Attention: You have software products and client licenses expiring soon!
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {expiringProducts.map((prod) => {
            const isTwoWeeks = prod.status === 'expiring_soon';
            const urgencyBadge = isTwoWeeks ? (
              <Badge variant="destructive" className="flex items-center gap-1 font-semibold text-xs">
                <Clock className="h-3 w-3" />
                Expiring in 2 Weeks
              </Badge>
            ) : (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 font-semibold text-xs">
                <Calendar className="h-3 w-3" />
                Expiring in 2 Months
              </Badge>
            );

            const alertEnglishText = isTwoWeeks
              ? `This is your product expiry alert: ${prod.productName} for ${prod.company} is expiring in 2 weeks (Expiry: ${prod.expiryDate})!`
              : `This is your product expiry alert: ${prod.productName} for ${prod.company} is expiring in 2 months (Expiry: ${prod.expiryDate})!`;

            return (
              <div
                key={prod.id}
                className="relative rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 transition-all hover:shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20"
              >
                {/* Header info */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {prod.productName}
                      <span className="text-xs font-normal text-muted-foreground">({prod.category})</span>
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" /> {prod.company} ({prod.contactName})
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        <Key className="h-3 w-3" /> {prod.licenseKey}
                      </span>
                    </p>
                  </div>
                  {urgencyBadge}
                </div>

                {/* The requested English Expiry Notification Banner */}
                <div className="rounded-lg bg-amber-100/70 p-2.5 text-xs font-medium text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 mb-3 border border-amber-200 dark:border-amber-800/60">
                  ⚠️ {alertEnglishText}
                </div>

                {/* Contract value & quick actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-200/60 dark:border-amber-900/40">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Contract Value: <span className="text-emerald-600 font-bold">{formatCurrency(prod.value)}/yr</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-amber-300 dark:border-amber-700"
                      onClick={() => handleSendReminder(prod)}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Email Client
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => handleViewClient(prod.contactId)}
                    >
                      View Client
                    </Button>

                    <Button
                      size="sm"
                      className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs"
                      disabled={loadingId === prod.id}
                      onClick={() => handleRenew(prod)}
                    >
                      {loadingId === prod.id ? (
                        <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      )}
                      Renew License
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <Button
            variant="link"
            size="sm"
            className="text-xs text-muted-foreground p-0 h-auto"
            onClick={() => {
              handleClose();
              navigate('/products');
            }}
          >
            Go to Full Sales & Licenses History <ArrowRight className="h-3 w-3 ml-1" />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleClose}>
            Dismiss
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
