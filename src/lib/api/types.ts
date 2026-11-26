export type Role = 'admin' | 'technical' | 'manager' | 'sales_rep';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export type ContactStatus = 'lead' | 'active' | 'inactive' | 'customer';
export type ContactSource = 'website' | 'referral' | 'linkedin' | 'outbound' | 'conference';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  status: ContactStatus;
  source: ContactSource;
  ownerId: string;
  ownerName: string;
  value: number;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'disqualified';
export type LeadSource = 'organic' | 'referral' | 'linkedin' | 'adwords' | 'outbound';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title?: string;
  status: LeadStatus;
  source: LeadSource;
  score: number; // 0-100
  ownerId: string;
  ownerName: string;
  estimatedValue: number;
  notes?: string;
  createdAt: string;
}

export type DealStage = 'new' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type DealPriority = 'low' | 'medium' | 'high';

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  company: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  ownerId: string;
  ownerName: string;
  priority: DealPriority;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'status_change';

export interface Activity {
  id: string;
  type: ActivityType;
  contactId?: string;
  contactName?: string;
  title: string;
  description: string;
  performedBy: string;
  performedById?: string;
  date: string;
  durationMinutes?: number;
  outcome?: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  contactId?: string;
  contactName?: string;
  dealId?: string;
  assignedToId: string;
  assignedToName: string;
  createdAt: string;
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';

export interface TicketComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  contactId: string;
  contactName: string;
  company: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedToId: string;
  assignedToName: string;
  comments: TicketComment[];
  createdAt: string;
  updatedAt: string;
}

export type CampaignStatus = 'draft' | 'scheduled' | 'sent';
export type AudienceSegment = 'all_leads' | 'hot_leads' | 'existing_customers' | 'inactive_30d';

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  segment: AudienceSegment;
  scheduledAt?: string;
  sentAt?: string;
  stats: {
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
  };
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'lead_created' | 'deal_won' | 'ticket_created' | 'deal_stage_changed';
  conditionField: string;
  conditionOperator: 'equals' | 'greater_than' | 'contains';
  conditionValue: string;
  actionType: 'assign_owner' | 'create_task' | 'send_email';
  actionTarget: string;
  actionPayload?: string;
  enabled: boolean;
  executionCount: number;
  lastExecutedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'deal' | 'lead' | 'task' | 'ticket' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface DashboardMetrics {
  revenue: { current: number; change: number };
  newLeads: { current: number; change: number };
  dealsWon: { current: number; change: number };
  openTickets: { current: number; change: number };
  salesTrend: Array<{ date: string; revenue: number; target: number }>;
  pipelineFunnel: Array<{ stage: DealStage; count: number; value: number }>;
  leadsBySource: Array<{ source: string; count: number; percentage: number }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type LicenseStatus = 'active' | 'expiring_soon' | 'expiring_two_months' | 'expired';

export interface SoldProduct {
  id: string;
  productName: string;
  category: 'Enterprise SaaS' | 'Security Suite' | 'Cloud Infrastructure' | 'AI Modules' | 'API License' | 'Annual Maintenance Contract (AMC)';
  contactId: string;
  contactName: string;
  company: string;
  saleDate: string;
  expiryDate: string; // ISO date YYYY-MM-DD
  licenseKey: string;
  value: number;
  billingCycle: 'monthly' | 'annual' | 'multi_year';
  status: LicenseStatus;
  autoRenew: boolean;
  assignedRep: string;
  slaTier?: '24x7 Platinum' | '8x5 Gold' | 'Silver NBD';
  notes?: string;
}
