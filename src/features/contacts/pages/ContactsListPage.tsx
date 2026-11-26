import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Mail,
  Phone,
  Building2,
  UserCheck,
} from 'lucide-react';
import { contactService, GetContactsParams } from '../services/contactService';
import { Contact, ContactStatus, ContactSource } from '@/lib/api/types';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { ContactDrawer } from '../components/ContactDrawer';
import { ContactCsvModal } from '../components/ContactCsvModal';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { EmptyState } from '@/shared/ui/empty-state';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { downloadCSV } from '@/utils/export';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const ContactsListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { canDeleteContacts } = usePermissions();

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const limit = 8;

  // Selected for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawers
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  // Fetch contacts
  const queryParams: GetContactsParams = {
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    source: sourceFilter !== 'all' ? sourceFilter : undefined,
    sortBy,
    sortOrder,
    page,
    limit,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['contacts', queryParams],
    queryFn: () => contactService.getContacts(queryParams),
  });

  const contacts = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit, total: 0, totalPages: 1 };

  // Mutations
  const createMutation = useMutation({
    mutationFn: contactService.createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact created successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contact> }) =>
      contactService.updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: contactService.deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact deleted');
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: contactService.bulkDeleteContacts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setSelectedIds([]);
      toast.success('Selected contacts deleted');
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(contacts.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleExportCSV = () => {
    const exportData = selectedIds.length > 0
      ? contacts.filter((c) => selectedIds.includes(c.id))
      : contacts;

    const headers = ['Name', 'Email', 'Phone', 'Company', 'Title', 'Status', 'Source', 'Owner', 'Value ($)'];
    const rows = exportData.map((c) => [
      c.name,
      c.email,
      c.phone,
      c.company,
      c.title,
      c.status,
      c.source,
      c.ownerName,
      c.value,
    ]);

    downloadCSV('pulse-crm-contacts', headers, rows);
    toast.success(`Exported ${exportData.length} contacts to CSV`);
  };

  const handleCsvImport = async (parsedContacts: Partial<Contact>[]) => {
    for (const c of parsedContacts) {
      await contactService.createContact(c);
    }
    queryClient.invalidateQueries({ queryKey: ['contacts'] });
  };

  const getStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case 'customer':
        return <Badge variant="success">Customer</Badge>;
      case 'active':
        return <Badge variant="info">Active Deal</Badge>;
      case 'lead':
        return <Badge variant="warning">Lead</Badge>;
      case 'inactive':
        return <Badge variant="cold">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Contacts Directory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage relationships, accounts, activity histories and deal opportunities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCsvModalOpen(true)}
            className="h-9 gap-1.5 text-xs"
          >
            <Upload className="h-3.5 w-3.5" /> Import CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditingContact(null);
              setDrawerOpen(true);
            }}
            className="h-9 gap-1.5 text-xs shadow-xs"
          >
            <Plus className="h-4 w-4" /> Add Contact
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search by name, company, email..."
            leftIcon={<Search className="h-4 w-4" />}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="customer">Customer</option>
            <option value="active">Active Opportunity</option>
            <option value="lead">Lead</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <option value="all">All Sources</option>
            <option value="referral">Referral</option>
            <option value="website">Website</option>
            <option value="linkedin">LinkedIn</option>
            <option value="outbound">Outbound</option>
            <option value="conference">Conference</option>
          </select>

          {/* Bulk delete action when selected */}
          {selectedIds.length > 0 && canDeleteContacts && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteConfirmOpen(true)}
              className="h-9 gap-1 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Main Table / Mobile Cards */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full rounded-md bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <EmptyState
            title="No contacts found"
            description={
              searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters or search keywords.'
                : 'Get started by creating your first contact or importing from CSV.'
            }
            actionLabel="Add Contact"
            onAction={() => {
              setEditingContact(null);
              setDrawerOpen(true);
            }}
            className="m-4"
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border">
                  <tr>
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === contacts.length && contacts.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Contact Name</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('company')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Company & Title</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Status</th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('value')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Est. Value</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Account Owner</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="hover:bg-muted/40 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/contacts/${contact.id}`)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(contact.id)}
                          onChange={(e) => handleSelectRow(contact.id, e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-semibold text-xs flex items-center justify-center shrink-0">
                            {contact.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {contact.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{contact.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{contact.company}</p>
                        <p className="text-xs text-muted-foreground">{contact.title}</p>
                      </td>

                      <td className="px-4 py-3">{getStatusBadge(contact.status)}</td>

                      <td className="px-4 py-3 font-semibold text-foreground">
                        {formatCurrency(contact.value)}
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                          {contact.ownerName}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-primary"
                            onClick={() => {
                              setEditingContact(contact);
                              setDrawerOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          {canDeleteContacts && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setContactToDelete(contact.id);
                                setDeleteConfirmOpen(true);
                              }}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-border/60">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 space-y-2.5 hover:bg-muted/30 transition-colors"
                  onClick={() => navigate(`/contacts/${contact.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 font-semibold text-xs flex items-center justify-center">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.company}</p>
                      </div>
                    </div>
                    {getStatusBadge(contact.status)}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span>Value: <strong className="text-foreground">{formatCurrency(contact.value)}</strong></span>
                    <span>Owner: {contact.ownerName}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Server-Style Pagination Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border gap-3 text-xs text-muted-foreground">
              <p>
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                <strong>{pagination.total}</strong> contacts
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </Button>
                <span className="px-2 font-medium text-foreground">
                  Page {pagination.page} of {pagination.totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Contact Drawer */}
      <ContactDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        contact={editingContact}
        onSubmit={async (values) => {
          if (editingContact) {
            await updateMutation.mutateAsync({ id: editingContact.id, data: values });
          } else {
            await createMutation.mutateAsync(values);
          }
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* CSV Import Modal */}
      <ContactCsvModal
        open={csvModalOpen}
        onOpenChange={setCsvModalOpen}
        onImport={handleCsvImport}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={contactToDelete ? 'Delete Contact' : 'Bulk Delete Contacts'}
        description={
          contactToDelete
            ? 'Are you sure you want to delete this contact? This action cannot be undone.'
            : `Are you sure you want to delete ${selectedIds.length} selected contacts?`
        }
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending || bulkDeleteMutation.isPending}
        onConfirm={async () => {
          if (contactToDelete) {
            await deleteMutation.mutateAsync(contactToDelete);
            setContactToDelete(null);
          } else {
            await bulkDeleteMutation.mutateAsync(selectedIds);
          }
          setDeleteConfirmOpen(false);
        }}
      />
    </motion.div>
  );
};
