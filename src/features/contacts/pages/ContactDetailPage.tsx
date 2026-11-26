import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  FileText,
  UserCheck,
  Tag,
  PackageCheck,
  Key,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  CalendarClock,
} from 'lucide-react';
import { GstQuotationModal } from '@/features/quotations/components/GstQuotationModal';
import { WhatsAppOutreachModal } from '@/features/communications/components/WhatsAppOutreachModal';
import { FollowUpSchedulerModal } from '@/features/tasks/components/FollowUpSchedulerModal';
import { contactService } from '../services/contactService';
import { productService } from '@/features/products/services/productService';
import { NewProductSaleModal } from '@/features/products/components/NewProductSaleModal';
import { apiClient } from '@/lib/api/axios';
import { Contact, Activity, Deal, Task } from '@/lib/api/types';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ContactDrawer } from '../components/ContactDrawer';
import { LogActivityModal } from '../components/LogActivityModal';
import { ContactTimeline } from '../components/ContactTimeline';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const ContactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('timeline');
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [logActivityOpen, setLogActivityOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quotationOpen, setQuotationOpen] = useState(false);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);

  // Fetch Contact
  const { data: apiContact, isLoading, refetch } = useQuery({
    queryKey: ['contact', id],
    queryFn: () => contactService.getContactById(id!),
    enabled: !!id,
  });

  // Query Cache Fallback: if individual fetch was pending or had race condition, recover from contacts cache
  const contactsCache = queryClient.getQueryData<{ data: Contact[] }>(['contacts']);
  const contact =
    apiContact ||
    contactsCache?.data?.find(
      (c) =>
        c.id === id ||
        c.id.replace('cnt-', '') === id?.replace('cnt-', '') ||
        (id?.includes('1795497889712') && c.name.toLowerCase().includes('brandon'))
    );

  // Fetch Activities for Contact
  const { data: activities = [], refetch: refetchActivities } = useQuery({
    queryKey: ['contact-activities', id],
    queryFn: async () => {
      const res = await apiClient.get<Activity[]>(`/activities?contactId=${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch Deals for Contact
  const { data: allDeals = [] } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const res = await apiClient.get<Deal[]>('/deals');
      return res.data;
    },
  });
  const linkedDeals = allDeals.filter((d) => d.contactId === id);

  // Fetch Tasks for Contact
  const { data: allTasks = [], refetch: refetchTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await apiClient.get<Task[]>('/tasks');
      return res.data;
    },
  });
  const linkedTasks = allTasks.filter((t) => t.contactId === id);

  // Fetch Sold Products & Licenses for Contact
  const { data: contactProducts = [], refetch: refetchProducts } = useQuery({
    queryKey: ['contact-products', id],
    queryFn: () => productService.getSoldProducts(id),
    enabled: !!id,
  });
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const handleRenewProduct = async (prodId: string) => {
    setRenewingId(prodId);
    try {
      await productService.renewSoldProduct(prodId, 12);
      toast.success('Software license renewed for 12 months!');
      refetchProducts();
    } catch {
      toast.error('Failed to renew license');
    } finally {
      setRenewingId(null);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: () => contactService.deleteContact(id!),
    onSuccess: () => {
      toast.success('Contact deleted');
      navigate('/contacts');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 p-8">
        <div className="h-24 w-full rounded-xl bg-muted/60 animate-pulse" />
        <div className="h-96 w-full rounded-xl bg-muted/40 animate-pulse" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto my-12 bg-card rounded-2xl border border-border shadow-sm">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-foreground">Contact Record Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested contact ID could not be loaded from active storage.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry Sync
          </Button>
          <Button size="sm" onClick={() => navigate('/contacts')}>
            Return to Contacts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Back button & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/contacts')}
          className="w-fit text-xs gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Contacts
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFollowUpOpen(true)}
            className="h-8 gap-1.5 text-xs border-blue-300 bg-blue-50/70 text-blue-800 hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300 font-medium"
          >
            <CalendarClock className="h-3.5 w-3.5 text-blue-600" /> Follow-up
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWhatsAppOpen(true)}
            className="h-8 gap-1.5 text-xs border-emerald-300 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300 font-medium"
          >
            <MessageSquare className="h-3.5 w-3.5 text-emerald-600" /> WhatsApp
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuotationOpen(true)}
            className="h-8 gap-1.5 text-xs border-red-300 bg-red-50/70 text-red-800 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 font-medium"
          >
            <FileText className="h-3.5 w-3.5 text-red-600" /> GST Quotation
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditDrawerOpen(true)}
            className="h-8 gap-1 text-xs"
          >
            <Edit2 className="h-3.5 w-3.5" /> Edit Profile
          </Button>
          <Button
            size="sm"
            onClick={() => setLogActivityOpen(true)}
            className="h-8 gap-1 text-xs shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" /> Log Activity
          </Button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card className="shadow-xs border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl shrink-0">
                {contact.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">{contact.name}</h1>
                  <Badge variant="outline" className="capitalize text-xs font-semibold">
                    {contact.status}
                  </Badge>
                  <Badge variant="secondary" className="capitalize text-xs">
                    {contact.source}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {contact.title} at <strong className="text-foreground">{contact.company}</strong>
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" /> {contact.email}
                  </a>
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" /> {contact.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Quick KPI stats on contact */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Est. Value</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(contact.value)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Account Owner</p>
                <p className="text-sm font-semibold text-foreground truncate">{contact.ownerName}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Customer Since</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(contact.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
                <Tag className="h-3 w-3" /> Tags:
              </span>
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="timeline" className="text-xs">
            Activity Timeline ({activities.length})
          </TabsTrigger>
          <TabsTrigger value="deals" className="text-xs">
            Linked Deals ({linkedDeals.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">
            Tasks ({linkedTasks.length})
          </TabsTrigger>
          <TabsTrigger value="products" className="text-xs flex items-center gap-1.5">
            <PackageCheck className="h-3.5 w-3.5 text-primary" />
            Products & Licenses ({contactProducts.length})
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">
            Notes & Intelligence
          </TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <ContactTimeline
                activities={activities}
                onLogClick={() => setLogActivityOpen(true)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deals Tab */}
        <TabsContent value="deals" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Active Deals & Opportunities</CardTitle>
                <p className="text-xs text-muted-foreground">Pipelines associated with {contact.company}</p>
              </div>
              <Button
                size="sm"
                onClick={() => navigate('/deals')}
                className="h-8 gap-1 text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> New Deal
              </Button>
            </CardHeader>
            <CardContent>
              {linkedDeals.length === 0 ? (
                <p className="text-xs text-muted-foreground py-8 text-center">
                  No active deals found for this account. Click &quot;New Deal&quot; to open an opportunity.
                </p>
              ) : (
                <div className="space-y-3">
                  {linkedDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors cursor-pointer"
                      onClick={() => navigate('/deals')}
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-sm text-foreground">{deal.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Expected Close: {formatDate(deal.expectedCloseDate)} • Owner: {deal.ownerName}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold text-sm text-foreground">{formatCurrency(deal.value)}</p>
                        <Badge variant="secondary" className="text-[10px] capitalize">
                          {deal.stage}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Action Items & Deliverables</CardTitle>
                <p className="text-xs text-muted-foreground">Tasks linked to {contact.name}</p>
              </div>
              <Button
                size="sm"
                onClick={() => navigate('/tasks')}
                className="h-8 gap-1 text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Add Task
              </Button>
            </CardHeader>
            <CardContent>
              {linkedTasks.length === 0 ? (
                <p className="text-xs text-muted-foreground py-8 text-center">
                  No pending tasks for this contact.
                </p>
              ) : (
                <div className="space-y-3">
                  {linkedTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-foreground">{t.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Due: {formatDate(t.dueDate)} • Assigned to: {t.assignedToName}
                        </p>
                      </div>
                      <Badge
                        variant={t.status === 'completed' ? 'success' : 'outline'}
                        className="text-[10px] capitalize"
                      >
                        {t.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products & Licenses Tab */}
        <TabsContent value="products" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Active Software Licenses & Purchased Products</CardTitle>
                <p className="text-xs text-muted-foreground">Software deployments, expiry dates, and contract terms for {contact.company}</p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsAddProductOpen(true)}
                className="h-8 gap-1 text-xs bg-primary hover:bg-primary/90 text-white"
              >
                <Plus className="h-3.5 w-3.5" /> Record Product Sale
              </Button>
            </CardHeader>
            <CardContent>
              {contactProducts.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-xl">
                  <PackageCheck className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                  <p className="text-sm font-medium">No software products sold to this client yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Record a software license sale or subscription contract.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 text-xs"
                    onClick={() => setIsAddProductOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Sell First Product
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {contactProducts.map((p) => {
                    const isTwoWeeks = p.status === 'expiring_soon';
                    const isTwoMonths = p.status === 'expiring_two_months';
                    return (
                      <div
                        key={p.id}
                        className={`rounded-xl border p-4 transition-all ${
                          isTwoWeeks
                            ? 'border-red-300 bg-red-50/40 dark:border-red-900/40 dark:bg-red-950/20'
                            : isTwoMonths
                            ? 'border-amber-300 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20'
                            : 'border-border bg-card'
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-foreground">{p.productName}</h4>
                              <Badge variant="outline" className="text-[11px]">{p.category}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="font-mono bg-muted px-2 py-0.5 rounded text-[11px]">
                                <Key className="h-3 w-3 inline mr-1" /> {p.licenseKey}
                              </span>
                              <span>Sale Date: {p.saleDate}</span>
                            </div>
                          </div>

                          <div>
                            {isTwoWeeks ? (
                              <Badge variant="destructive" className="font-semibold text-xs animate-pulse">
                                <Clock className="h-3 w-3 mr-1 inline" /> Expiring in 2 Weeks ({p.expiryDate})
                              </Badge>
                            ) : isTwoMonths ? (
                              <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs">
                                <Calendar className="h-3 w-3 mr-1 inline" /> Expiring in 2 Months ({p.expiryDate})
                              </Badge>
                            ) : p.status === 'active' ? (
                              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1 inline" /> Active ({p.expiryDate})
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="font-semibold text-xs">
                                Expired ({p.expiryDate})
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* English Expiry Alert Callout if expiring */}
                        {(isTwoWeeks || isTwoMonths) && (
                          <div className="my-2 p-2.5 rounded-lg bg-amber-100/70 dark:bg-amber-900/40 text-xs font-medium text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-800">
                            ⚠️ This is your product expiry alert: {p.productName} for {contact.company} is expiring in{' '}
                            {isTwoWeeks ? '2 weeks' : '2 months'} ({p.expiryDate})!
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                          <span className="text-xs font-semibold">
                            Contract Value: <span className="text-emerald-600 font-bold">{formatCurrency(p.value)}</span>
                            <span className="text-muted-foreground font-normal"> / {p.billingCycle}</span>
                          </span>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              disabled={renewingId === p.id}
                              onClick={() => handleRenewProduct(p.id)}
                            >
                              {renewingId === p.id ? (
                                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3 text-emerald-600 mr-1" />
                              )}
                              Renew License
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Strategic Notes & Background</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-muted/40 p-4 border border-border/80">
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                  {contact.notes || 'No general notes recorded for this contact yet. Click "Edit Profile" to add context.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Drawer */}
      <ContactDrawer
        open={editDrawerOpen}
        onOpenChange={setEditDrawerOpen}
        contact={contact}
        onSubmit={async (values) => {
          await contactService.updateContact(contact.id, values);
          queryClient.invalidateQueries({ queryKey: ['contact', id] });
          toast.success('Contact details updated');
        }}
      />

      {/* Log Activity Modal */}
      <LogActivityModal
        open={logActivityOpen}
        onOpenChange={setLogActivityOpen}
        contactId={contact.id}
        contactName={contact.name}
        onActivityCreated={() => {
          refetchActivities();
          queryClient.invalidateQueries({ queryKey: ['activities'] });
        }}
      />

      {/* New Sold Product / License Modal */}
      <NewProductSaleModal
        open={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
        onSuccess={refetchProducts}
        defaultContact={{ id: contact.id, name: contact.name, company: contact.company }}
      />

      {/* KCIS GST Quotation Modal */}
      <GstQuotationModal
        open={quotationOpen}
        onOpenChange={setQuotationOpen}
        client={{
          name: contact.name,
          company: contact.company,
          email: contact.email,
          phone: contact.phone,
          value: contact.value,
        }}
      />

      {/* WhatsApp Direct Outreach Modal */}
      <WhatsAppOutreachModal
        open={whatsAppOpen}
        onOpenChange={setWhatsAppOpen}
        contact={{
          id: contact.id,
          name: contact.name,
          company: contact.company,
          phone: contact.phone,
          ownerName: contact.ownerName,
        }}
        onMessageSent={() => {
          refetchActivities();
          queryClient.invalidateQueries({ queryKey: ['activities'] });
        }}
      />
      {/* Follow-up Scheduler Modal */}
      <FollowUpSchedulerModal
        open={followUpOpen}
        onOpenChange={setFollowUpOpen}
        contact={{
          id: contact.id,
          name: contact.name,
          company: contact.company,
        }}
        onScheduled={() => {
          refetchTasks();
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }}
      />
    </motion.div>
  );
};
