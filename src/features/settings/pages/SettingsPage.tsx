import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  Shield, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  Server, 
  Database, 
  Lock, 
  Globe, 
  Mail, 
  Inbox, 
  RefreshCw, 
  Sparkles, 
  ArrowRight,
  Sliders,
  Check,
  Building2,
  Cpu
} from 'lucide-react';
import { userService } from '../services/userService';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Badge } from '@/shared/ui/badge';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [orgName, setOrgName] = useState('Pulse Global Technologies');
  const [currency, setCurrency] = useState('USD');
  const [timeZone, setTimeZone] = useState('America/New_York');
  const [leadThreshold, setLeadThreshold] = useState('75');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Email & Inbox Integration States
  const [gmailSyncEnabled, setGmailSyncEnabled] = useState(true);
  const [outlookSyncEnabled, setOutlookSyncEnabled] = useState(true);
  const [autoCreateCompany, setAutoCreateCompany] = useState(true);
  const [autoSlaDetection, setAutoSlaDetection] = useState(true);
  const [autoAcknowledgeEmail, setAutoAcknowledgeEmail] = useState(true);
  const [supportMailbox, setSupportMailbox] = useState('support@kcisindia.com');
  const [secondaryMailbox, setSecondaryMailbox] = useState('helpdesk@kcisindia.com');

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Organization settings updated successfully');
  };

  const handleResetDb = async () => {
    setIsResetting(true);
    try {
      await userService.resetDatabase();
      queryClient.clear();
      toast.success('Mock Database reset to original seeds!');
      setResetDialogOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch {
      toast.error('Failed to reset database');
    } finally {
      setIsResetting(false);
    }
  };

  const auditLogs = [
    { event: 'User Login', user: 'Alex Morgan (Admin)', ip: '192.168.1.104', date: '2026-11-23 08:30:14' },
    { event: 'Deal Closed Won ($240,000)', user: 'Sam Rivera', ip: '10.0.4.12', date: '2026-11-17 16:00:22' },
    { event: 'Lead Converted to Account', user: 'Jordan Taylor', ip: '10.0.4.15', date: '2026-11-19 13:40:00' },
    { event: 'Role Elevation (Manager -> Admin)', user: 'Alex Morgan', ip: '192.168.1.104', date: '2026-11-15 09:12:00' },
    { event: 'Bulk Contact Export', user: 'Emily Chen', ip: '10.0.4.88', date: '2026-11-10 14:15:40' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-5xl"
    >
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Organization Settings</h1>
          <Badge variant="hot" className="text-xs">
            <Shield className="h-3 w-3 mr-1" /> Admin Access
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure enterprise CRM parameters, lead scoring rules, API connectors, and security audit logs.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="general" className="text-xs">General & Branding</TabsTrigger>
          <TabsTrigger value="email" className="text-xs flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-500" />
            <span>Email & Inbox Sync</span>
          </TabsTrigger>
          <TabsTrigger value="backend" className="text-xs">Mock Backend & API</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs">Security & Audit Logs</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <form onSubmit={handleSaveGeneral} className="space-y-6">
            <Card className="shadow-xs">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">CRM Workspace Profile</CardTitle>
                <CardDescription className="text-xs">
                  Company details and default business currencies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Organization Legal Name</label>
                    <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Primary Operating Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    >
                      <option value="USD">USD ($ - United States Dollar)</option>
                      <option value="EUR">EUR (€ - Euro)</option>
                      <option value="GBP">GBP (£ - British Pound)</option>
                      <option value="JPY">JPY (¥ - Japanese Yen)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Default Timezone</label>
                    <select
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    >
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="Europe/London">London / GMT</option>
                      <option value="Asia/Tokyo">Tokyo / JST</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Hot Lead Score Threshold (0 - 100)
                    </label>
                    <Input
                      type="number"
                      value={leadThreshold}
                      onChange={(e) => setLeadThreshold(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <Button type="submit" className="gap-1.5 text-xs shadow-xs">
                    <Save className="h-3.5 w-3.5" /> Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* Email & Inbox Integrations Tab */}
        <TabsContent value="email">
          <div className="space-y-6">
            {/* Header Banner */}
            <Card className="shadow-xs border-border bg-gradient-to-r from-blue-900/10 via-sky-900/5 to-transparent">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <span>Omnichannel Inbound Email Ingestion</span>
                        <Badge variant="success" className="text-[10px] font-bold">
                          2 Gateways Active
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Automatically fetch, parse, and convert incoming client emails from Gmail & Outlook into assigned tickets.
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success('Sync complete! Connected inboxes polled with zero delay.')}
                    className="text-xs gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                    <span>Sync Inboxes Now</span>
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Inboxes Grid: Gmail / Google Workspace & Outlook / Office 365 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Google Workspace / Gmail Connector */}
              <Card className="shadow-xs border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-sm border border-red-500/20">
                        G
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">Google Workspace / Gmail API</CardTitle>
                        <CardDescription className="text-[11px]">OAuth 2.0 Webhook Push Listener</CardDescription>
                      </div>
                    </div>
                    <Badge variant={gmailSyncEnabled ? "success" : "outline"} className="text-[10px]">
                      {gmailSyncEnabled ? "Connected 🟢" : "Disconnected"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Primary Support Mailbox
                    </label>
                    <Input
                      value={supportMailbox}
                      onChange={(e) => setSupportMailbox(e.target.value)}
                      className="h-8 font-mono text-xs"
                    />
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/80 space-y-1.5 text-[11px] text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Sync Latency:</span>
                      <span className="font-semibold text-foreground">Real-time (&lt; 2s Pub/Sub)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>TLS Encryption:</span>
                      <span className="font-semibold text-emerald-500">Port 587 SSL/TLS Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sender Extraction:</span>
                      <span className="font-semibold text-foreground">RFC-2822 Header Parsing</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-medium">Automatic Mailbox Ingestion</span>
                    <input
                      type="checkbox"
                      checked={gmailSyncEnabled}
                      onChange={(e) => {
                        setGmailSyncEnabled(e.target.checked);
                        toast.success(`Google Workspace sync ${e.target.checked ? 'enabled' : 'disabled'}`);
                      }}
                      className="h-4 w-4 rounded border-border text-primary cursor-pointer accent-blue-600"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Microsoft 365 / Outlook Connector */}
              <Card className="shadow-xs border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-sm border border-blue-500/20">
                        O
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">Microsoft 365 / Outlook API</CardTitle>
                        <CardDescription className="text-[11px]">Azure Graph API Delta Sync</CardDescription>
                      </div>
                    </div>
                    <Badge variant={outlookSyncEnabled ? "success" : "outline"} className="text-[10px]">
                      {outlookSyncEnabled ? "Connected 🟢" : "Disconnected"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Secondary Helpdesk Mailbox
                    </label>
                    <Input
                      value={secondaryMailbox}
                      onChange={(e) => setSecondaryMailbox(e.target.value)}
                      className="h-8 font-mono text-xs"
                    />
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/80 space-y-1.5 text-[11px] text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Sync Latency:</span>
                      <span className="font-semibold text-foreground">Delta Feed (~3s)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Azure Tenant:</span>
                      <span className="font-semibold text-foreground font-mono">kcis-cloud-prod</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Graph Scopes:</span>
                      <span className="font-semibold text-emerald-500">Mail.ReadWrite, Mail.Send</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-medium">Automatic Outlook Ingestion</span>
                    <input
                      type="checkbox"
                      checked={outlookSyncEnabled}
                      onChange={(e) => {
                        setOutlookSyncEnabled(e.target.checked);
                        toast.success(`Outlook 365 sync ${e.target.checked ? 'enabled' : 'disabled'}`);
                      }}
                      className="h-4 w-4 rounded border-border text-primary cursor-pointer accent-blue-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Smart Processing & Auto-Mapping Rules */}
            <Card className="shadow-xs border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Smart Client Resolution & Auto-Routing Rules</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  How the CRM interprets client emails, matches company accounts, and flags SLA severity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-border bg-card/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-foreground">Domain Matching</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Matches incoming sender domain (e.g. <code className="text-primary font-mono">@techflow.io</code>) with registered CRM accounts, linking the problem to the client's profile automatically.
                    </p>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={autoCreateCompany}
                        onChange={(e) => setAutoCreateCompany(e.target.checked)}
                        className="rounded accent-blue-600"
                      />
                      <span>Auto-provision new clients</span>
                    </label>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-foreground">AI SLA Classifier</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Scans keywords like <em>outage, error 500, crash, urgent</em> and sets ticket SLA to <strong>URGENT</strong> with high-priority audio & notification triggers.
                    </p>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={autoSlaDetection}
                        onChange={(e) => setAutoSlaDetection(e.target.checked)}
                        className="rounded accent-blue-600"
                      />
                      <span>Enable Intelligent SLA</span>
                    </label>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-foreground">2-Way Email Threading</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      When your tech engineer types a reply in CRM, client receives it on their phone/Gmail. When client replies, it updates this ticket thread instantly.
                    </p>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={autoAcknowledgeEmail}
                        onChange={(e) => setAutoAcknowledgeEmail(e.target.checked)}
                        className="rounded accent-blue-600"
                      />
                      <span>Send auto-responder receipt</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => toast.success('Email integration settings saved successfully!')}
                    className="gap-1.5 text-xs shadow-xs cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" /> Save Email Rules
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Backend & MSW Tab */}
        <TabsContent value="backend">
          <div className="space-y-4">
            <Card className="shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base font-semibold">MSW Mock Service Worker Engine</CardTitle>
                      <CardDescription className="text-xs">
                        Production-grade realistic network interception and stateful storage
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Active & Intercepting
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pulse CRM runs in realistic offline/standalone mode using Mock Service Worker (MSW). All network requests go through a standard Axios HTTP client and are intercepted with realistic network latency (150–350ms) and persistence in localStorage.
                </p>

                <div className="rounded-xl bg-muted/40 p-4 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Reset Mock Database</p>
                      <p className="text-[11px] text-muted-foreground">
                        Re-seeds all contacts, leads, deals, tickets, activities, and tasks to default initial data.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setResetDialogOpen(true)}
                      className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset Database
                    </Button>
                  </div>
                </div>

                {/* Connecting to a real backend guide */}
                <div className="rounded-xl bg-blue-50/50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-900 space-y-2">
                  <p className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <Server className="h-4 w-4" /> Seamless Real Backend Integration
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                    To connect to a live Spring Boot, NestJS, FastAPI, or Node backend: simply set <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900 font-mono text-[11px]">VITE_USE_MSW=false</code> and configure <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900 font-mono text-[11px]">VITE_API_URL=https://api.yourdomain.com</code> in <code className="font-mono">.env</code>. The typed service files and Axios interceptors are completely decoupled and ready.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit">
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Security Audit Trails</CardTitle>
              <CardDescription className="text-xs">
                Immutable security logs for compliance and session access monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-4 py-3">Security Event</th>
                      <th className="px-4 py-3">Performed By</th>
                      <th className="px-4 py-3">IP Address</th>
                      <th className="px-4 py-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {auditLogs.map((log, i) => (
                      <tr key={i} className="hover:bg-muted/40 transition-colors text-xs">
                        <td className="px-4 py-3 font-semibold text-foreground">{log.event}</td>
                        <td className="px-4 py-3 text-muted-foreground">{log.user}</td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">{log.ip}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{log.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="Reset Mock Database"
        description="Are you sure you want to reset all mock records? All added contacts, leads, and moved deals will be restored to original seed fixtures."
        confirmLabel="Reset Database"
        variant="destructive"
        isLoading={isResetting}
        onConfirm={handleResetDb}
      />
    </motion.div>
  );
};
