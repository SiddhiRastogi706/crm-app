import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { productService } from '../services/productService';
import { toast } from 'sonner';

const newSaleSchema = z.object({
  productName: z.string().min(2, 'Product name is required'),
  category: z.enum([
    'Enterprise SaaS',
    'Security Suite',
    'Cloud Infrastructure',
    'AI Modules',
    'API License',
    'Annual Maintenance Contract (AMC)',
  ]),
  slaTier: z.enum(['24x7 Platinum', '8x5 Gold', 'Silver NBD']).optional(),
  company: z.string().min(2, 'Company name is required'),
  contactName: z.string().min(2, 'Contact person name is required'),
  contactId: z.string().optional().default('cnt-1'),
  licenseKey: z.string().min(3, 'License key is required'),
  value: z.coerce.number().min(1, 'Value must be greater than 0'),
  billingCycle: z.enum(['monthly', 'annual', 'multi_year']),
  saleDate: z.string().min(1, 'Sale date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  autoRenew: z.boolean().default(false),
  notes: z.string().optional(),
});

type NewSaleFormValues = z.infer<typeof newSaleSchema>;

interface NewProductSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  defaultContact?: { id: string; name: string; company: string };
}

export const NewProductSaleModal: React.FC<NewProductSaleModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  defaultContact,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewSaleFormValues>({
    resolver: zodResolver(newSaleSchema),
    defaultValues: {
      category: 'Enterprise SaaS',
      billingCycle: 'annual',
      autoRenew: false,
      saleDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      company: defaultContact?.company || '',
      contactName: defaultContact?.name || '',
      contactId: defaultContact?.id || 'cnt-1',
      licenseKey: `LIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`,
    },
  });

  const onSubmit = async (data: NewSaleFormValues) => {
    try {
      await productService.createSoldProduct(data as any);
      toast.success(`Sold product license ${data.productName} recorded successfully!`);
      reset();
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error('Failed to log product sale. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Record New Product Sale / License</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Product / Software Name</label>
              <Input placeholder="e.g. CyberSec Shield Pro" {...register('productName')} />
              {errors.productName && <p className="text-[11px] text-destructive">{errors.productName.message}</p>}
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
              <select
                {...register('category')}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Enterprise SaaS">Enterprise SaaS</option>
                <option value="Security Suite">Security Suite</option>
                <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                <option value="AI Modules">AI Modules</option>
                <option value="API License">API License</option>
                <option value="Annual Maintenance Contract (AMC)">Annual Maintenance Contract (AMC)</option>
              </select>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">SLA Tier</label>
              <select
                {...register('slaTier')}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="24x7 Platinum">24x7 Platinum (2h Critical Response)</option>
                <option value="8x5 Gold">8x5 Gold (4h Business Response)</option>
                <option value="Silver NBD">Silver NBD (Next Business Day)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Client Company</label>
              <Input placeholder="e.g. TechFlow Solutions" {...register('company')} />
              {errors.company && <p className="text-[11px] text-destructive">{errors.company.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contact Person</label>
              <Input placeholder="e.g. Sarah Jenkins" {...register('contactName')} />
              {errors.contactName && <p className="text-[11px] text-destructive">{errors.contactName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contract Value ($)</label>
              <Input type="number" placeholder="48000" {...register('value')} />
              {errors.value && <p className="text-[11px] text-destructive">{errors.value.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">License Key</label>
              <Input {...register('licenseKey')} />
              {errors.licenseKey && <p className="text-[11px] text-destructive">{errors.licenseKey.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sale Date</label>
              <Input type="date" {...register('saleDate')} />
              {errors.saleDate && <p className="text-[11px] text-destructive">{errors.saleDate.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Expiry / Renewal Date</label>
              <Input type="date" {...register('expiryDate')} />
              {errors.expiryDate && <p className="text-[11px] text-destructive">{errors.expiryDate.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Notes & License Terms</label>
            <Input placeholder="Multi-year SLA, 100 seats, premier support..." {...register('notes')} />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white">
              {isSubmitting ? 'Recording...' : 'Record License Sale'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
