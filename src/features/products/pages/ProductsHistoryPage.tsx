import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PackageCheck,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Key,
  Building,
  DollarSign,
  Mail,
  RefreshCw,
  BellRing,
  ExternalLink,
} from 'lucide-react';
import { productService } from '../services/productService';
import { SoldProduct, LicenseStatus } from '@/lib/api/types';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { ProductExpiryModal } from '../components/ProductExpiryModal';
import { NewProductSaleModal } from '../components/NewProductSaleModal';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export const ProductsHistoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['sold-products'],
    queryFn: () => productService.getSoldProducts(),
  });

  const handleRenew = async (prod: SoldProduct) => {
    setRenewingId(prod.id);
    try {
      await productService.renewSoldProduct(prod.id, 12);
      toast.success(`License renewed! ${prod.productName} extended by 12 months.`);
      refetch();
    } catch {
      toast.error('Failed to renew license.');
    } finally {
      setRenewingId(null);
    }
  };

  const handleSendReminder = (prod: SoldProduct) => {
    toast.success(`Renewal notice email dispatched to ${prod.contactName} at ${prod.company}!`);
  };

  // Metrics calculations
  const totalValue = products.reduce((acc, p) => acc + p.value, 0);
  const expiringTwoWeeks = products.filter((p) => p.status === 'expiring_soon');
  const expiringTwoMonths = products.filter((p) => p.status === 'expiring_two_months');
  const activeCount = products.filter((p) => p.status === 'active').length;
  const expiredCount = products.filter((p) => p.status === 'expired').length;

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.licenseKey.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || prod.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || prod.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: LicenseStatus, expiryDate: string) => {
    switch (status) {
      case 'expiring_soon':
        return (
          <Badge variant="destructive" className="flex items-center gap-1 font-semibold text-xs animate-pulse">
            <Clock className="h-3 w-3" />
            Expiring in 2 Weeks ({expiryDate})
          </Badge>
        );
      case 'expiring_two_months':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 font-semibold text-xs">
            <Calendar className="h-3 w-3" />
            Expiring in 2 Months ({expiryDate})
          </Badge>
        );
      case 'active':
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1 font-semibold text-xs">
            <CheckCircle2 className="h-3 w-3" />
            Active ({expiryDate})
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="secondary" className="text-muted-foreground flex items-center gap-1 font-semibold text-xs">
            <XCircle className="h-3 w-3" />
            Expired ({expiryDate})
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PackageCheck className="h-7 w-7 text-primary" />
            Sold Products & Software Licenses
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track customer software purchases, contract values, license keys, and renewal expirations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            className="border-amber-300 bg-amber-50/60 hover:bg-amber-100 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
            onClick={() => setIsAlertModalOpen(true)}
          >
            <BellRing className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
            Expiry Alerts ({expiringTwoWeeks.length + expiringTwoMonths.length})
          </Button>

          <Button onClick={() => setIsNewSaleOpen(true)} className="bg-primary hover:bg-primary/90 text-white shadow-xs">
            <Plus className="h-4 w-4 mr-1.5" />
            Record New Sale
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Total Sold Portfolio</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">{products.length} active software contracts</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-red-700 dark:text-red-400">Expiring in 2 Weeks</CardTitle>
            <Clock className="h-4 w-4 text-red-600 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{expiringTwoWeeks.length}</div>
            <p className="text-xs text-red-600/80 font-medium mt-1">
              {formatCurrency(expiringTwoWeeks.reduce((acc, p) => acc + p.value, 0))} urgent renewal pipeline
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-amber-700 dark:text-amber-400">Expiring in 2 Months</CardTitle>
            <Calendar className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{expiringTwoMonths.length}</div>
            <p className="text-xs text-amber-600/80 font-medium mt-1">
              {formatCurrency(expiringTwoMonths.reduce((acc, p) => acc + p.value, 0))} renewal pool
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Healthy Active Licenses</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1">{expiredCount} past expiration / churned</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 rounded-lg border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search product, company, key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-2.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Expiry Statuses</option>
            <option value="expiring_soon">Expiring in 2 Weeks (Urgent)</option>
            <option value="expiring_two_months">Expiring in 2 Months</option>
            <option value="active">Active Licenses</option>
            <option value="expired">Expired</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-2.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Categories</option>
            <option value="Enterprise SaaS">Enterprise SaaS</option>
            <option value="Security Suite">Security Suite</option>
            <option value="Cloud Infrastructure">Cloud Infrastructure</option>
            <option value="AI Modules">AI Modules</option>
            <option value="API License">API License</option>
            <option value="Annual Maintenance Contract (AMC)">Annual Maintenance Contract (AMC)</option>
          </select>
        </div>
      </div>

      {/* Products & Licenses Table */}
      <Card className="shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground font-semibold">
                <th className="p-3.5">Software / Product</th>
                <th className="p-3.5">Client & Company</th>
                <th className="p-3.5">License Key</th>
                <th className="p-3.5">Sale Date</th>
                <th className="p-3.5">Expiry Status</th>
                <th className="p-3.5">Contract Value</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">
                    Loading sales history and licenses...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">
                    No software products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 font-medium">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{prod.productName}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-muted-foreground">{prod.category}</span>
                        {prod.slaTier && (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-indigo-300 text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30">
                            🛡️ {prod.slaTier}
                          </Badge>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <Link
                        to={`/contacts/${prod.contactId}`}
                        className="font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        {prod.company} <ExternalLink className="h-3 w-3 opacity-60" />
                      </Link>
                      <div className="text-[11px] text-muted-foreground">{prod.contactName}</div>
                    </td>

                    <td className="p-3.5 font-mono text-[11px]">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-border">
                        {prod.licenseKey}
                      </span>
                    </td>

                    <td className="p-3.5 text-muted-foreground">{prod.saleDate}</td>

                    <td className="p-3.5">{getStatusBadge(prod.status, prod.expiryDate)}</td>

                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(prod.value)}
                      <span className="text-[11px] font-normal text-muted-foreground">/{prod.billingCycle}</span>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs px-2"
                          title="Send Email Alert to Client"
                          onClick={() => handleSendReminder(prod)}
                        >
                          <Mail className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={renewingId === prod.id}
                          className="h-7 text-xs px-2.5 font-medium"
                          onClick={() => handleRenew(prod)}
                        >
                          {renewingId === prod.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3 text-emerald-600 mr-1" />
                          )}
                          Renew
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Dialogs */}
      <ProductExpiryModal forceOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)} />
      <NewProductSaleModal
        open={isNewSaleOpen}
        onOpenChange={setIsNewSaleOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
};
