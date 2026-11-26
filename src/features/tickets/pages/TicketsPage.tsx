
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, LifeBuoy, AlertCircle, MessageSquare, Mail } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { Ticket, TicketStatus, TicketPriority } from '@/lib/api/types';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { TicketModal } from '../components/TicketModal';
import { TicketDetailDrawer } from '../components/TicketDetailDrawer';
import { InboundEmailSimulatorModal } from '../components/InboundEmailSimulatorModal';
import { EmptyState } from '@/shared/ui/empty-state';
import { formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const TicketsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const ticketIdParam = searchParams.get('ticket') || searchParams.get('id');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [emailSimulatorOpen, setEmailSimulatorOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { data: tickets = [], isLoading, refetch } = useQuery({
    queryKey: ['tickets'],
    queryFn: ticketService.getTickets,
  });

  // Listen for global ticket created events (e.g. from simulator or webhook)
  useEffect(() => {
    const handleTicketCreated = () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      refetch();
    };

    window.addEventListener('pulse:ticket-created', handleTicketCreated);
    window.addEventListener('storage', handleTicketCreated);

    return () => {
      window.removeEventListener('pulse:ticket-created', handleTicketCreated);
      window.removeEventListener('storage', handleTicketCreated);
    };
  }, [queryClient, refetch]);

  // Automatically open ticket detail drawer if URL contains ticket param
  useEffect(() => {
    if (ticketIdParam && tickets.length > 0) {
      const match = tickets.find(
        (t) => t.id === ticketIdParam || t.ticketNumber.toLowerCase() === ticketIdParam.toLowerCase()
      );
      if (match) {
        setSelectedTicket(match);
      }
    }
  }, [ticketIdParam, tickets]);

  const createMutation = useMutation({
    mutationFn: ticketService.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket created');
    },
  });

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      !searchTerm ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive" className="uppercase font-bold">Urgent</Badge>;
      case 'high':
        return <Badge variant="warning" className="uppercase">High</Badge>;
      case 'medium':
        return <Badge variant="info" className="uppercase">Medium</Badge>;
      default:
        return <Badge variant="outline" className="uppercase">Low</Badge>;
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return <Badge variant="default">Open</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'closed':
        return <Badge variant="cold">Closed</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Support Tickets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Resolve customer cases, track SLA priority, and maintain communication threads.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => setEmailSimulatorOpen(true)}
            className="h-9 gap-2 text-xs border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 shadow-xs font-semibold cursor-pointer"
          >
            <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span>Simulate Client Email</span>
          </Button>

          <Button onClick={() => setModalOpen(true)} className="h-9 gap-1.5 text-xs shadow-xs cursor-pointer">
            <Plus className="h-4 w-4" /> Open Case
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search tickets by subject, #ID, or company..."
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
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full rounded-md bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          <EmptyState
            title="No support tickets found"
            description="All client inquiries have been resolved or no tickets match the current filters."
            actionLabel="Open Case"
            onAction={() => setModalOpen(true)}
            className="m-4"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3">Ticket ID</th>
                  <th className="px-4 py-3">Subject & Account</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assigned Agent</th>
                  <th className="px-4 py-3">Activity</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-muted/40 transition-colors cursor-pointer group"
                    onClick={() => setSelectedTicket(t)}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-xs text-primary">
                      {t.ticketNumber}
                    </td>

                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {t.subject}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.company} • {t.contactName}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3">{getPriorityBadge(t.priority)}</td>

                    <td className="px-4 py-3">{getStatusBadge(t.status)}</td>

                    <td className="px-4 py-3 text-xs font-medium text-foreground">
                      {t.assignedToName}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {t.comments.length}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(t);
                        }}
                      >
                        View Thread
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      <TicketModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
        }}
        isLoading={createMutation.isPending}
      />

      {/* Inbound Client Email Simulator Modal */}
      <InboundEmailSimulatorModal
        open={emailSimulatorOpen}
        onOpenChange={setEmailSimulatorOpen}
        onTicketCreated={(ticket) => {
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          setSelectedTicket(ticket);
        }}
      />

      {/* Ticket Detail Drawer */}
      <TicketDetailDrawer
        open={!!selectedTicket}
        onOpenChange={(open) => !open && setSelectedTicket(null)}
        ticket={selectedTicket}
        onTicketUpdated={() => {
          refetch();
          if (selectedTicket) {
            ticketService.getTicketById(selectedTicket.id).then(setSelectedTicket);
          }
        }}
      />
    </motion.div>
  );
};
