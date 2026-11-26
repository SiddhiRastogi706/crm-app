export interface SeedUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'sales_rep';
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface SeedContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  status: 'lead' | 'active' | 'inactive' | 'customer';
  source: 'website' | 'referral' | 'linkedin' | 'outbound' | 'conference';
  ownerId: string;
  ownerName: string;
  value: number;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeedLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title?: string;
  status: 'new' | 'contacted' | 'qualified' | 'disqualified';
  source: 'organic' | 'referral' | 'linkedin' | 'adwords' | 'outbound';
  score: number;
  ownerId: string;
  ownerName: string;
  estimatedValue: number;
  notes?: string;
  createdAt: string;
}

export interface SeedDeal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  company: string;
  value: number;
  stage: 'new' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';
  probability: number;
  expectedCloseDate: string;
  ownerId: string;
  ownerName: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeedTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  contactId?: string;
  contactName?: string;
  dealId?: string;
  assignedToId: string;
  assignedToName: string;
  createdAt: string;
}

export interface SeedActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
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

export interface SeedTicketComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

export interface SeedTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  contactId: string;
  contactName: string;
  company: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'pending' | 'resolved' | 'closed';
  assignedToId: string;
  assignedToName: string;
  comments: SeedTicketComment[];
  createdAt: string;
  updatedAt: string;
}

export interface SeedCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent';
  segment: 'all_leads' | 'hot_leads' | 'existing_customers' | 'inactive_30d';
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

export interface SeedAutomationRule {
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

export interface SeedNotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'deal' | 'lead' | 'task' | 'ticket' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export const USERS: SeedUser[] = [
  {
    id: 'user-1',
    name: 'Alex Morgan',
    email: 'admin@pulsecrm.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Jordan Taylor',
    email: 'manager@pulsecrm.com',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'user-3',
    name: 'Sam Rivera',
    email: 'sales@pulsecrm.com',
    role: 'sales_rep',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-03-10T08:30:00Z',
  },
  {
    id: 'user-4',
    name: 'Emily Chen',
    email: 'emily@pulsecrm.com',
    role: 'sales_rep',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-03-12T11:15:00Z',
  },
];

// Generate 55 realistic contacts
const rawFirstNames = ['Sarah', 'Marcus', 'Elena', 'David', 'Rachel', 'James', 'Aria', 'Thomas', 'Chloe', 'Daniel', 'Priya', 'Lucas', 'Maya', 'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia', 'Benjamin', 'Amelia', 'Henry', 'Isabella', 'Alexander', 'Mia', 'Jackson', 'Evelyn', 'Sebastian', 'Harper', 'Jack', 'Camila', 'Aiden', 'Gianna', 'Owen', 'Abigail', 'Samuel', 'Luna', 'Matthew', 'Ella', 'Joseph', 'Elizabeth', 'Levi', 'Sofia', 'Mateo', 'Emily', 'David', 'Avery', 'John', 'Mila', 'Wyatt', 'Scarlett'];
const rawLastNames = ['Jenkins', 'Vance', 'Rostova', 'Kim', 'Zimmerman', 'Sterling', 'Novak', 'Wright', 'Bennett', 'Hayes', 'Patel', 'Brooks', 'Lin', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams'];
const rawCompanies = ['TechFlow Solutions', 'Apex Global Industries', 'CloudScale Systems', 'Quantum Labs AI', 'Nexus Digital Media', 'Starlight Logistics', 'Horizon Health Partners', 'Vanguard CyberSec', 'BluePeak Capital', 'Evergreen Solar', 'Acro Dynamics', 'Symphony Software', 'Beacon Analytics', 'Cobalt Networks', 'Pioneer BioTech', 'Veritas Media', 'Summit Financial', 'Crestview Health', 'Altair Robotics', 'Krypton Labs'];
const rawTitles = ['VP of Engineering', 'Director of Operations', 'Product Lead', 'Chief Financial Officer', 'Head of Security', 'VP of Supply Chain', 'Medical Informatics Lead', 'CISO', 'Managing Partner', 'Head of Infrastructure', 'Solutions Architect', 'Chief Technology Officer', 'Procurement Director', 'Chief Executive Officer'];

export const CONTACTS: SeedContact[] = Array.from({ length: 55 }, (_, i) => {
  const fName = rawFirstNames[i % rawFirstNames.length];
  const lName = rawLastNames[i % rawLastNames.length];
  const name = `${fName} ${lName}`;
  const company = rawCompanies[i % rawCompanies.length];
  const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  const owner = USERS[i % USERS.length];
  const statuses: Array<'lead' | 'active' | 'inactive' | 'customer'> = ['customer', 'active', 'lead', 'inactive'];
  const sources: Array<'website' | 'referral' | 'linkedin' | 'outbound' | 'conference'> = ['website', 'referral', 'linkedin', 'outbound', 'conference'];

  return {
    id: `cnt-${i + 1}`,
    name,
    email,
    phone: `+1 (555) ${100 + i}-${2000 + i * 7}`,
    company,
    title: rawTitles[i % rawTitles.length],
    status: statuses[i % statuses.length],
    source: sources[i % sources.length],
    ownerId: owner.id,
    ownerName: owner.name,
    value: 15000 + (i * 3500) % 90000,
    tags: [i % 2 === 0 ? 'Enterprise' : 'Mid-Market', i % 3 === 0 ? 'Decision Maker' : 'High Priority'],
    notes: `Key enterprise account representative for ${company}.`,
    createdAt: new Date(Date.now() - (60 - i) * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - (5 - (i % 5)) * 86400000).toISOString(),
  };
});

// Generate 35 realistic leads
export const LEADS: SeedLead[] = Array.from({ length: 35 }, (_, i) => {
  const fName = rawFirstNames[(i + 10) % rawFirstNames.length];
  const lName = rawLastNames[(i + 15) % rawLastNames.length];
  const name = `${fName} ${lName}`;
  const company = `${rawCompanies[(i + 5) % rawCompanies.length]} Corp`;
  const email = `${fName.toLowerCase()}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.io`;
  const owner = USERS[i % USERS.length];
  const statuses: Array<'new' | 'contacted' | 'qualified' | 'disqualified'> = ['new', 'contacted', 'qualified', 'qualified'];
  const sources: Array<'organic' | 'referral' | 'linkedin' | 'adwords' | 'outbound'> = ['organic', 'referral', 'linkedin', 'adwords', 'outbound'];
  const score = 40 + (i * 7) % 58;

  return {
    id: `lead-${i + 1}`,
    name,
    email,
    phone: `+1 (555) ${300 + i}-${4000 + i * 3}`,
    company,
    title: rawTitles[(i + 2) % rawTitles.length],
    status: statuses[i % statuses.length],
    source: sources[i % sources.length],
    score,
    ownerId: owner.id,
    ownerName: owner.name,
    estimatedValue: 20000 + (i * 4500) % 75000,
    notes: `Requested demo during Q4 expansion evaluation. Score calculated at ${score}.`,
    createdAt: new Date(Date.now() - (35 - i) * 86400000).toISOString(),
  };
});

// Generate 25 realistic deals across all stages
export const DEALS: SeedDeal[] = Array.from({ length: 25 }, (_, i) => {
  const stages: Array<'new' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost'> = [
    'new', 'contacted', 'proposal', 'negotiation', 'won', 'lost', 'proposal', 'negotiation', 'won'
  ];
  const stage = stages[i % stages.length];
  const contact = CONTACTS[i % CONTACTS.length];
  const owner = USERS[i % USERS.length];
  const probabilities = { new: 20, contacted: 40, proposal: 60, negotiation: 80, won: 100, lost: 0 };
  const val = 30000 + (i * 8500) % 180000;

  return {
    id: `deal-${i + 1}`,
    title: `${contact.company} - Platform License & Expansion`,
    contactId: contact.id,
    contactName: contact.name,
    company: contact.company,
    value: val,
    stage,
    probability: probabilities[stage],
    expectedCloseDate: new Date(Date.now() + (i - 10) * 86400000).toISOString().split('T')[0],
    ownerId: owner.id,
    ownerName: owner.name,
    priority: val > 80000 ? 'high' : val > 40000 ? 'medium' : 'low',
    notes: `Multi-year CRM rollout contract with SLA guarantees.`,
    createdAt: new Date(Date.now() - (40 - i) * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - (i % 7) * 86400000).toISOString(),
  };
});

// Tasks
export const TASKS: SeedTask[] = Array.from({ length: 20 }, (_, i) => {
  const contact = CONTACTS[i % CONTACTS.length];
  const owner = USERS[i % USERS.length];
  const statuses: Array<'pending' | 'in_progress' | 'completed'> = ['pending', 'in_progress', 'completed'];
  const dueDays = (i - 7) * 2; // mix of overdue, today, future

  return {
    id: `task-${i + 1}`,
    title: i % 3 === 0 ? `Prepare executive proposal for ${contact.company}` : i % 2 === 0 ? `Follow-up product demo call with ${contact.name}` : `Finalize contract terms with ${contact.company}`,
    description: `Coordinate with technical architects and deliver customized documentation.`,
    dueDate: new Date(Date.now() + dueDays * 86400000).toISOString().split('T')[0],
    priority: i % 3 === 0 ? 'high' : 'medium',
    status: statuses[i % statuses.length],
    contactId: contact.id,
    contactName: contact.name,
    dealId: DEALS[i % DEALS.length].id,
    assignedToId: owner.id,
    assignedToName: owner.name,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  };
});

// Activities
export const ACTIVITIES: SeedActivity[] = Array.from({ length: 25 }, (_, i) => {
  const contact = CONTACTS[i % CONTACTS.length];
  const owner = USERS[i % USERS.length];
  const types: Array<'call' | 'email' | 'meeting' | 'note' | 'status_change'> = ['call', 'email', 'meeting', 'note', 'status_change'];
  const type = types[i % types.length];

  return {
    id: `act-${i + 1}`,
    type,
    contactId: contact.id,
    contactName: contact.name,
    title: type === 'call' ? `Quarterly review call with ${contact.name}` : type === 'meeting' ? `Solution architecture alignment workshop` : `Sent updated product pricing matrix`,
    description: `Reviewed customer goals, addressed migration questions, agreed on next milestones.`,
    performedBy: owner.name,
    performedById: owner.id,
    date: new Date(Date.now() - (i * 2 + 1) * 86400000).toISOString(),
    durationMinutes: type === 'call' ? 25 : type === 'meeting' ? 45 : undefined,
    outcome: type === 'call' ? 'Interested - Sent follow-up proposal' : undefined,
  };
});

// Support Tickets
export const TICKETS: SeedTicket[] = Array.from({ length: 15 }, (_, i) => {
  const contact = CONTACTS[i % CONTACTS.length];
  const owner = USERS[i % USERS.length];
  const statuses: Array<'open' | 'pending' | 'resolved' | 'closed'> = ['open', 'pending', 'resolved', 'closed'];
  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['medium', 'high', 'urgent', 'low'];

  return {
    id: `tck-${i + 1}`,
    ticketNumber: `TCK-${1000 + i + 1}`,
    subject: i % 3 === 0 ? `API Webhook intermittent latency during batch sync` : i % 2 === 0 ? `SAML SSO login configuration inquiry` : `Custom field export missing headers in CSV`,
    description: `Customer reported unexpected behavior in production instance. Root cause analysis requested.`,
    contactId: contact.id,
    contactName: contact.name,
    company: contact.company,
    priority: priorities[i % priorities.length],
    status: statuses[i % statuses.length],
    assignedToId: owner.id,
    assignedToName: owner.name,
    comments: [
      {
        id: `cm-${i + 1}-1`,
        authorId: owner.id,
        authorName: owner.name,
        content: 'Investigating server response logs and reproducing in staging environment.',
        isInternal: true,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: `cm-${i + 1}-2`,
        authorId: 'user-1',
        authorName: 'Alex Morgan',
        content: 'Fix deployed in patch v2.4.1. Monitoring error rates.',
        isInternal: false,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  };
});

// Marketing Campaigns
export const CAMPAIGNS: SeedCampaign[] = [
  {
    id: 'cmp-1',
    name: 'Q4 Product Innovation Showcase',
    subject: 'Introducing Pulse CRM Next-Gen Workflows & AI Intelligence',
    status: 'sent',
    segment: 'all_leads',
    sentAt: '2026-10-15T14:00:00Z',
    stats: { sent: 1240, opened: 680, clicked: 310, bounced: 12 },
    createdAt: '2026-10-10T10:00:00Z',
  },
  {
    id: 'cmp-2',
    name: 'Enterprise Early Adopter Webinar',
    subject: 'Exclusive Invitation: Modern Sales Operations at Scale',
    status: 'sent',
    segment: 'hot_leads',
    sentAt: '2026-11-05T15:30:00Z',
    stats: { sent: 480, opened: 395, clicked: 210, bounced: 3 },
    createdAt: '2026-11-01T09:30:00Z',
  },
  {
    id: 'cmp-3',
    name: 'Customer Re-engagement Nurture',
    subject: 'New features waiting in your Pulse workspace',
    status: 'scheduled',
    segment: 'inactive_30d',
    scheduledAt: '2026-12-01T12:00:00Z',
    stats: { sent: 0, opened: 0, clicked: 0, bounced: 0 },
    createdAt: '2026-11-18T16:00:00Z',
  },
];

// Automations
export const AUTOMATIONS: SeedAutomationRule[] = [
  {
    id: 'auto-1',
    name: 'Auto-assign High-Value Leads',
    trigger: 'lead_created',
    conditionField: 'score',
    conditionOperator: 'greater_than',
    conditionValue: '75',
    actionType: 'assign_owner',
    actionTarget: 'user-3',
    enabled: true,
    executionCount: 42,
    lastExecutedAt: '2026-11-22T14:15:00Z',
  },
  {
    id: 'auto-2',
    name: 'Create Onboarding Task on Deal Won',
    trigger: 'deal_won',
    conditionField: 'value',
    conditionOperator: 'greater_than',
    conditionValue: '25000',
    actionType: 'create_task',
    actionTarget: 'Kickoff Customer Onboarding Call',
    actionPayload: 'Immediate welcome outreach within 24h of contract signing.',
    enabled: true,
    executionCount: 18,
    lastExecutedAt: '2026-11-21T09:40:00Z',
  },
  {
    id: 'auto-3',
    name: 'Escalate Urgent Support Tickets',
    trigger: 'ticket_created',
    conditionField: 'priority',
    conditionOperator: 'equals',
    conditionValue: 'urgent',
    actionType: 'create_task',
    actionTarget: 'user-1',
    enabled: true,
    executionCount: 9,
    lastExecutedAt: '2026-11-20T17:12:00Z',
  },
];

// Notifications
export const NOTIFICATIONS: SeedNotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Deal Won! 🎉',
    message: 'Apex Global Industries closed a deal worth $85,000.',
    type: 'deal',
    read: false,
    createdAt: '2026-11-23T10:15:00Z',
    link: '/deals',
  },
  {
    id: 'notif-2',
    title: 'New High Priority Lead',
    message: 'Elena Rostova from CloudScale Systems has a lead score of 92.',
    type: 'lead',
    read: false,
    createdAt: '2026-11-23T08:30:00Z',
    link: '/leads',
  },
  {
    id: 'notif-3',
    title: 'Upcoming Task Due Today',
    message: 'Prepare executive proposal for TechFlow Solutions is due today.',
    type: 'task',
    read: true,
    createdAt: '2026-11-22T16:00:00Z',
    link: '/tasks',
  },
  {
    id: 'notif-4',
    title: 'Urgent Ticket Submitted',
    message: 'Ticket #TCK-1003 reported: API Webhook intermittent latency.',
    type: 'ticket',
    read: true,
    createdAt: '2026-11-21T11:20:00Z',
    link: '/tickets',
  },
];
