import React, { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/shared/ui/drawer';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Ticket, TicketStatus } from '@/lib/api/types';
import { formatDateTime } from '@/utils/formatters';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { ticketService } from '../services/ticketService';
import { Lock, Send, User, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TicketDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
  onTicketUpdated: () => void;
}

export const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({
  open,
  onOpenChange,
  ticket,
  onTicketUpdated,
}) => {
  const user = useAuthStore((state) => state.user);
  const [commentText, setCommentText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!ticket) return null;

  const handleStatusChange = async (newStatus: TicketStatus) => {
    try {
      await ticketService.updateTicket(ticket.id, { status: newStatus });
      toast.success(`Ticket marked as ${newStatus}`);
      onTicketUpdated();
    } catch {
      toast.error('Failed to update ticket status');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await ticketService.addComment(ticket.id, {
        authorId: user?.id || 'agent',
        authorName: user?.name || 'Support Agent',
        content: commentText.trim(),
        isInternal,
      });

      setCommentText('');
      toast.success(isInternal ? 'Internal note added' : 'Reply posted to ticket');
      onTicketUpdated();
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent size="xl">
        <DrawerHeader>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-primary">{ticket.ticketNumber}</span>
            <div className="flex items-center gap-2">
              <Badge
                variant={ticket.priority === 'urgent' ? 'destructive' : 'outline'}
                className="text-[10px] uppercase font-bold"
              >
                {ticket.priority}
              </Badge>
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                className="h-7 rounded-md border border-input bg-background px-2 text-xs font-semibold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          <DrawerTitle className="text-base">{ticket.subject}</DrawerTitle>
          <DrawerDescription>
            {ticket.company} • Contact: <strong className="text-foreground">{ticket.contactName}</strong>
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {/* Initial ticket request */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Client Inquiry</span>
              <span>{formatDateTime(ticket.createdAt)}</span>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">
              {ticket.description}
            </p>
          </div>

          {/* Conversation & Internal Notes Thread */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Thread ({ticket.comments.length} updates)
            </p>

            {ticket.comments.map((comm) => (
              <div
                key={comm.id}
                className={`rounded-xl p-3.5 border text-xs space-y-1.5 transition-colors ${
                  comm.isInternal
                    ? 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/60'
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {comm.isInternal && <Lock className="h-3 w-3 text-amber-600" />}
                    <span className="font-semibold text-foreground">{comm.authorName}</span>
                    {comm.isInternal && (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                        [Internal Note]
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDateTime(comm.createdAt)}
                  </span>
                </div>

                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {comm.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comment input area */}
        <div className="pt-3 border-t border-border mt-auto">
          <form onSubmit={handleAddComment} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="internalNote"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="internalNote" className="text-xs font-medium text-foreground cursor-pointer flex items-center gap-1">
                  <Lock className="h-3 w-3 text-amber-600" /> Internal Team Note (Hidden from client)
                </label>
              </div>

              <span className="text-[11px] text-muted-foreground">
                Replying as {user?.name}
              </span>
            </div>

            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={isInternal ? 'Type internal note for support & sales reps...' : 'Write reply to send to client...'}
              className={`flex w-full rounded-lg border px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 ${
                isInternal
                  ? 'border-amber-300 bg-amber-50/30 focus-visible:ring-amber-500'
                  : 'border-input bg-background focus-visible:ring-primary'
              }`}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={!commentText.trim()}
                isLoading={isSubmitting}
                className={`text-xs gap-1.5 ${isInternal ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}`}
              >
                <Send className="h-3.5 w-3.5" /> {isInternal ? 'Post Internal Note' : 'Post Reply'}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
