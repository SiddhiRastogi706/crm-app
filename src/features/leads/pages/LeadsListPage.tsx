import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Sparkles, UserCheck, Trash2, Edit2, ArrowRight } from 'lucide-react';
import { leadService } from '../services/leadService';
import { Lead, LeadStatus } from '@/lib/api/types';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { LeadScoreBadge } from '../components/LeadScoreBadge';
import { LeadDrawer } from '../components/LeadDrawer';
import { ConvertLeadModal } from '../components/ConvertLeadModal';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { EmptyState } from '@/shared/ui/empty-state';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { SEED_USERS } from '@/lib/mocks/seedData';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const LeadsListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { canAssignLeads } = usePermissions();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: leadService.getLeads,
  });

  const createMutation = useMutation({
    mutationFn: leadService.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      leadService.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: leadService.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead removed');
    },
  });

  const handleOwnerChange = async (leadId: string, newOwnerId: string) => {
    const owner = SEED_USERS.find((u) => u.id === newOwnerId);
    await updateMutation.mutateAsync({
      id: leadId,
      data: {
        ownerId: newOwnerId,
        ownerName: owner?.name || 'Sales Rep',
      },
    });
    toast.success(`Lead reassigned to ${owner?.name}`);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !searchTerm ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'qualified':
        return <Badge variant="success">Qualified</Badge>;
      case 'contacted':
        return <Badge variant="info">Contacted</Badge>;
      case 'new':
        return <Badge variant="default">New</Badge>;
      case 'disqualified':
        return <Badge variant="destructive">Disqualified</Badge>;
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inbound Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Score prospects, assign sales representatives, and convert qualified leads into deals.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingLead(null);
            setDrawerOpen(true);
          }}
          className="h-9 gap-1.5 text-xs shadow-xs"
        >
          <Plus className="h-4 w-4" /> Add Lead
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search leads by name, company, email..."
            leftIcon={<Search className="h-4 w-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="disqualified">Disqualified</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-full rounded-md bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <EmptyState
            title="No leads matching your filters"
            description="Create a new lead or adjust your search keywords to view prospects."
            actionLabel="Add Lead"
            onAction={() => {
              setEditingLead(null);
              setDrawerOpen(true);
            }}
            className="m-4"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3">Lead Contact</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Lead Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Est. Value</th>
                  <th className="px-4 py-3">Assigned Owner</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-foreground">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-medium text-foreground">{lead.company}</td>

                    <td className="px-4 py-3">
                      <LeadScoreBadge score={lead.score} />
                    </td>

                    <td className="px-4 py-3">{getStatusBadge(lead.status)}</td>

                    <td className="px-4 py-3">
                      <Badge variant="outline" className="capitalize text-xs">
                        {lead.source}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 font-semibold text-foreground">
                      {formatCurrency(lead.estimatedValue)}
                    </td>

                    <td className="px-4 py-3">
                      {canAssignLeads ? (
                        <select
                          value={lead.ownerId}
                          onChange={(e) => handleOwnerChange(lead.id, e.target.value)}
                          className="h-8 rounded-md border border-input bg-background px-2 py-0.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                        >
                          {SEED_USERS.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs font-medium text-foreground">
                          {lead.ownerName}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          className="h-8 px-2.5 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => setConvertingLead(lead)}
                        >
                          <Sparkles className="h-3 w-3" /> Convert
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => {
                            setEditingLead(lead);
                            setDrawerOpen(true);
                          }}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setLeadToDelete(lead.id);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Drawer */}
      <LeadDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        lead={editingLead}
        onSubmit={async (values) => {
          if (editingLead) {
            await updateMutation.mutateAsync({ id: editingLead.id, data: values });
          } else {
            await createMutation.mutateAsync(values);
          }
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Convert Lead Modal */}
      <ConvertLeadModal
        open={!!convertingLead}
        onOpenChange={(open) => !open && setConvertingLead(null)}
        lead={convertingLead}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['leads'] });
          queryClient.invalidateQueries({ queryKey: ['contacts'] });
          queryClient.invalidateQueries({ queryKey: ['deals'] });
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Lead"
        description="Are you sure you want to remove this lead? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (leadToDelete) {
            await deleteMutation.mutateAsync(leadToDelete);
            setLeadToDelete(null);
          }
          setDeleteConfirmOpen(false);
        }}
      />
    </motion.div>
  );
};
