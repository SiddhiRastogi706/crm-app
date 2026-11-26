import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { 
  Mail, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  User, 
  Clock, 
  Inbox, 
  ShieldAlert,
  Flame,
  ArrowRight,
  Server
} from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { Ticket, TicketPriority } from '@/lib/api/types';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { apiClient } from '@/lib/api/axios';
import { mockDb } from '@/lib/mocks/db';
import { playNotificationChime } from '@/utils/sound';
import { toast } from 'sonner';

interface InboundEmailSimulatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated?: (ticket: Ticket) => void;
}

const PRESET_SCENARIOS = [
  {
    id: 'outage',
    label: '🚨 Production Database Outage (Critical)',
    senderName: 'Sarah Jenkins',
    senderEmail: 'sarah.jenkins@techflow.io',
    company: 'TechFlow Solutions Pvt Ltd',
    subject: 'URGENT: Database Cluster Down in Mumbai DC - Error 500 & Connection Refused',
    body: 'Hi KCIS Support Team,\n\nOur primary PostgreSQL database cluster in the Mumbai Data Center became unresponsive at 14:15 IST. All customer-facing web services are throwing HTTP 500 errors. We cannot establish SSH to node-01.\n\nThis is affecting over 45,000 active sessions. Need urgent L3 incident intervention under our Platinum 24x7 SLA.\n\nRegards,\nSarah Jenkins\nDirector of Infrastructure, TechFlow Solutions',
  },
  {
    id: 'sso',
    label: '⚠️ Okta SAML 2.0 Auth Failure (High)',
    senderName: 'Dr. Rajesh Gupta',
    senderEmail: 'r.gupta@apexhealth.com',
    company: 'Apex Health Systems',
    subject: 'SSO Okta SAML 2.0 integration failing with error 403 for Hospital Staff',
    body: 'Hello Support,\n\nDoctors and medical billing operators at our Gurgaon campus are unable to log in via Okta Single Sign-On. Error code 403 Forbidden is displayed after token exchange.\n\nPlease inspect the identity provider certificate renewal and webhook logs immediately.\n\nThank you,\nDr. Rajesh Gupta\nChief Medical Information Officer',
  },
  {
    id: 'webhook',
    label: '📋 API Webhook Sync Request (Medium)',
    senderName: 'Marcus Vance',
    senderEmail: 'marcus@vancecloud.com',
    company: 'Vance Cloud Corp',
    subject: 'Requesting webhook payload documentation for CRM v2 API sync',
    body: 'Hi Team,\n\nWe are integrating our ERP billing system with the new Pulse CRM v2 endpoints. Could you share the webhook secret validation guide and JSON signature schema?\n\nBest,\nMarcus Vance\nLead Integration Engineer',
  },
];

export const InboundEmailSimulatorModal: React.FC<InboundEmailSimulatorModalProps> = ({
  open,
  onOpenChange,
  onTicketCreated,
}) => {
  const user = useAuthStore((state) => state.user);

  const [fromName, setFromName] = useState(PRESET_SCENARIOS[0].senderName);
  const [fromEmail, setFromEmail] = useState(PRESET_SCENARIOS[0].senderEmail);
  const [company, setCompany] = useState(PRESET_SCENARIOS[0].company);
  const [subject, setSubject] = useState(PRESET_SCENARIOS[0].subject);
  const [body, setBody] = useState(PRESET_SCENARIOS[0].body);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Intelligent SLA Priority Detection based on email content
  const detectedPriority: TicketPriority = useMemo(() => {
    const text = (subject + ' ' + body).toLowerCase();
    if (
      text.includes('urgent') ||
      text.includes('down') ||
      text.includes('outage') ||
      text.includes('crash') ||
      text.includes('error 500') ||
      text.includes('critical') ||
      text.includes('emergency')
    ) {
      return 'urgent';
    }
    if (
      text.includes('fail') ||
      text.includes('403') ||
      text.includes('sso') ||
      text.includes('high') ||
      text.includes('security') ||
      text.includes('breach')
    ) {
      return 'high';
    }
    if (text.includes('feature') || text.includes('docs') || text.includes('question') || text.includes('low')) {
      return 'low';
    }
    return 'medium';
  }, [subject, body]);

  const handleApplyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setFromName(preset.senderName);
    setFromEmail(preset.senderEmail);
    setCompany(preset.company);
    setSubject(preset.subject);
    setBody(preset.body);
  };

  const handleSendInboundEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim() || !fromEmail.trim()) {
      toast.error('Please fill in all email fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedTicketNumber = `TICK-${Math.floor(1040 + Math.random() * 8900)}`;

      // Prepare initial email thread comments
      const initialComments = [
        {
          id: `cmt-inbound-${Date.now()}`,
          authorId: 'client-inbound',
          authorName: `${fromName} (${fromEmail})`,
          authorAvatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
          content: `📩 [Inbound Email via support@kcisindia.com]\n\nSubject: ${subject}\n\n${body}`,
          isInternal: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: `cmt-ack-${Date.now() + 1}`,
          authorId: 'system-bot',
          authorName: 'KCIS Support Auto-Responder',
          content: `🤖 Automated Email Sent to ${fromEmail}:\n"Dear ${fromName},\nThank you for contacting KCIS Tech Support. Your case #${generatedTicketNumber} has been logged under your 24x7 SLA.\nPriority: ${detectedPriority.toUpperCase()} | Assigned to: Tier-2 NOC Engineering."`,
          isInternal: true,
          createdAt: new Date(Date.now() + 1000).toISOString(),
        },
      ];

      const ticketPayload = {
        subject: subject.trim(),
        description: body.trim(),
        company: company.trim() || 'Enterprise Client',
        contactName: fromName.trim() || fromEmail.split('@')[0],
        priority: detectedPriority,
        status: 'open' as const,
        assignedToId: user?.id || 'user-1',
        assignedToName: user?.name || 'Alex Morgan',
        comments: initialComments,
      };

      const createdTicket = await ticketService.createTicket(ticketPayload as any);

      // Create live real-time notification for all technical and admin team members
      const ticketNum = createdTicket.ticketNumber || generatedTicketNumber;
      const notifData = {
        type: 'ticket' as const,
        title: `📩 Inbound Email Ticket #${ticketNum}`,
        message: `${company.trim() || 'Client'} (${fromName || fromEmail}): "${subject}"`,
        link: `/tickets?ticket=${ticketNum}`,
        read: false,
      };

      try {
        await apiClient.post('/notifications', notifData);
      } catch {
        mockDb.createNotification(notifData);
      }

      // Dispatch global events for instant reactive UI updates
      window.dispatchEvent(new CustomEvent('pulse:notification-created', { detail: notifData }));
      window.dispatchEvent(new CustomEvent('pulse:ticket-created', { detail: createdTicket }));

      // 🔔 Play audible bell notification chime
      playNotificationChime(detectedPriority === 'urgent' ? 'urgent' : 'ticket');

      toast.success(
        `📩 Inbound email received from ${fromEmail}! Ticket #${ticketNum} generated on Tech Dashboard & Notifications updated.`,
        { duration: 5000 }
      );

      onOpenChange(false);
      if (onTicketCreated) {
        onTicketCreated(createdTicket);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to simulate inbound email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-0 rounded-2xl border-border bg-card">
        
        {/* Header with Mail Branding */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-5 sm:p-6 rounded-t-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <span>Inbound Email-to-Ticket Ingestion Engine</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Live Listener
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-100/90 mt-0.5">
                Simulate enterprise customers emailing <strong className="text-white">support@kcisindia.com</strong>. The CRM automatically parses the body, extracts metadata, evaluates SLA priority, and creates a live ticket thread.
              </DialogDescription>
            </div>
          </div>

          {/* Recipient Address Pill */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
            <span className="text-blue-200 font-medium">Inbound Mailbox:</span>
            <span className="font-mono font-bold text-white bg-blue-500/30 px-2 py-0.5 rounded-md border border-blue-400/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              support@kcisindia.com
            </span>
            <span className="text-slate-300 text-[11px] ml-auto hidden sm:inline">
              Port 587 TLS • Auto SLA Tagging
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSendInboundEmail} className="p-5 sm:p-6 space-y-4">
          
          {/* Quick Scenario Preset Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Select Sample Client Email Scenario:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_SCENARIOS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="text-left p-2.5 rounded-xl border border-border/80 hover:border-blue-400 bg-muted/30 hover:bg-muted/70 text-xs transition-all cursor-pointer group"
                >
                  <p className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {preset.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {preset.company}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Sender Credentials Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Client Sender Name
              </label>
              <Input
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                leftIcon={<User className="w-3.5 h-3.5 text-slate-400" />}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                From Email Address
              </label>
              <Input
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="sarah@client.com"
                leftIcon={<Mail className="w-3.5 h-3.5 text-slate-400" />}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Client Enterprise
              </label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. TechFlow Solutions"
                leftIcon={<Building2 className="w-3.5 h-3.5 text-slate-400" />}
                className="h-9 text-xs"
                required
              />
            </div>
          </div>

          {/* Email Subject */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Subject
              </label>
              <span className="text-[11px] text-muted-foreground">Will become Ticket Title</span>
            </div>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Production Cluster Outage in Mumbai DC"
              className="h-9 text-xs font-medium"
              required
            />
          </div>

          {/* Email Message Body */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Message Body
              </label>
              <span className="text-[11px] text-muted-foreground">Detailed problem description</span>
            </div>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe the issue reported by the client..."
              className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 resize-y"
              required
            />
          </div>

          {/* Smart AI / Rule SLA Priority Preview Callout */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/40 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-muted-foreground">Automated SLA Priority Analysis:</span>
            </div>
            <div className="flex items-center gap-2">
              {detectedPriority === 'urgent' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[11px] shadow-xs animate-pulse">
                  <Flame className="w-3 h-3" /> URGENT SLA (&lt; 1 hr resolution)
                </span>
              )}
              {detectedPriority === 'high' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[11px]">
                  <AlertTriangle className="w-3 h-3" /> HIGH SLA (&lt; 4 hrs resolution)
                </span>
              )}
              {detectedPriority === 'medium' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500 text-white font-bold text-[11px]">
                  <Clock className="w-3 h-3" /> MEDIUM SLA (&lt; 24 hrs)
                </span>
              )}
              {detectedPriority === 'low' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-500 text-white font-medium text-[11px]">
                  LOW (Scheduled Release)
                </span>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-2 flex items-center justify-between sm:justify-between gap-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs gap-2 px-5 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Email to support@kcisindia.com &amp; Generate Ticket</span>
            </Button>
          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
};
