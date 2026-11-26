import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Copy,
  CheckCircle2,
  Phone,
  Sparkles,
  X,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { toast } from 'sonner';

interface WhatsAppOutreachModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: {
    id: string;
    name: string;
    company: string;
    phone?: string;
    ownerName?: string;
  };
  productName?: string;
  onMessageSent?: () => void;
}

export const WhatsAppOutreachModal: React.FC<WhatsAppOutreachModalProps> = ({
  open,
  onOpenChange,
  contact,
  productName = 'KCIS Endpoint Security & Managed Cloud',
  onMessageSent,
}) => {
  const [phone, setPhone] = useState(
    contact.phone ? contact.phone.replace(/[^0-9]/g, '') : '919876543210'
  );
  const [selectedTemplate, setSelectedTemplate] = useState('expiry');

  const templates: Record<string, { title: string; text: string; icon: any }> = {
    expiry: {
      title: '🚨 License Expiry Alert',
      icon: Clock,
      text:
        `Hello ${contact.name},\n\n` +
        `This is ${contact.ownerName || 'Emily Chen'} from *KCIS Info Solution Pvt Ltd*.\n\n` +
        `This is an alert regarding your *${productName}* subscription for *${contact.company}*, which is approaching its renewal deadline.\n\n` +
        `To ensure zero downtime for your team's IT infrastructure, we have prepared your renewed enterprise contract. Please let us know when we can connect for a brief 5-minute review.\n\n` +
        `Best regards,\n` +
        `*KCIS Info Solution Pvt Ltd*\n` +
        `"We Breathe Technology"`,
    },
    quotation: {
      title: '📄 GST Quotation & Proposal',
      icon: FileText,
      text:
        `Hi ${contact.name},\n\n` +
        `Greetings from *KCIS Info Solution Pvt Ltd*!\n\n` +
        `Following our discussion, we have finalized the formal GST quotation for *${contact.company}* covering your software licensing and 24x7 SLA support.\n\n` +
        `We have emailed the official proforma PDF to you. Please let us know if you need any adjustments or technical clarifications.\n\n` +
        `Warm regards,\n` +
        `*KCIS Sales Team* • www.kcisindia.com`,
    },
    intro: {
      title: '✨ Enterprise Solutions Intro',
      icon: Sparkles,
      text:
        `Dear ${contact.name},\n\n` +
        `Hope you are having a productive week!\n\n` +
        `I am reaching out from *KCIS Info Solution Pvt Ltd (We Breathe Technology)*. We help enterprises optimize their cybersecurity, cloud deployments, and 24x7 managed IT infrastructure.\n\n` +
        `Would you be open for a brief 10-minute technical discovery call this week to explore how we can support *${contact.company}*?\n\n` +
        `Regards,\n` +
        `*KCIS Info Solution Pvt Ltd*`,
    },
    amc: {
      title: '🛡️ AMC & SLA Check-in',
      icon: ShieldCheck,
      text:
        `Hi ${contact.name},\n\n` +
        `This is a scheduled quarterly service check-in from *KCIS Info Solution Pvt Ltd* regarding the Annual Maintenance Contract (AMC) and SLA services for *${contact.company}*.\n\n` +
        `Our technical operations desk is on standby. Please confirm if everything is running smoothly or if any preventive maintenance visit is required.\n\n` +
        `Regards,\n` +
        `*KCIS Technical Support Desk*`,
    },
  };

  const [customMessage, setCustomMessage] = useState(templates.expiry.text);

  if (!open) return null;

  const handleTemplateSelect = (key: string) => {
    setSelectedTemplate(key);
    setCustomMessage(templates[key].text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    toast.success('WhatsApp message template copied to clipboard!');
  };

  const handleSend = () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(customMessage);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank');
    toast.success(`Opening WhatsApp chat for ${contact.name}!`);
    if (onMessageSent) onMessageSent();
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-emerald-500/10 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                KCIS WhatsApp Client Outreach
                <Badge className="bg-emerald-600 text-white text-[10px]">Direct API</Badge>
              </h3>
              <p className="text-xs text-muted-foreground">
                Instant B2B outreach to {contact.name} ({contact.company})
              </p>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={() => onOpenChange(false)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Phone input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-emerald-600" />
              Recipient WhatsApp Mobile (with country code):
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-2 rounded-lg border border-border">
                +
              </span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 919876543210"
                className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-mono text-foreground focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Template pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Select KCIS Message Template:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(templates).map(([key, t]) => {
                const Icon = t.icon;
                const isSelected = selectedTemplate === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTemplateSelect(key)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 font-semibold text-emerald-950 dark:text-emerald-200'
                        : 'border-border bg-card hover:bg-muted/40 text-foreground'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                    <span className="truncate">{t.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Message Preview & Customization:</label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1"
              >
                <Copy className="h-3 w-3" /> Copy Text
              </button>
            </div>
            <textarea
              rows={8}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-3 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-emerald-600"
            />
            <p className="text-[11px] text-muted-foreground">
              Formatting: *bold*, _italic_, ~strikethrough~. Message opens directly in WhatsApp Web or desktop app.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-muted/20">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs gap-1.5">
              <Copy className="h-3.5 w-3.5" /> Copy Template
            </Button>
            <Button size="sm" onClick={handleSend} className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm">
              <Send className="h-3.5 w-3.5" /> Launch WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
