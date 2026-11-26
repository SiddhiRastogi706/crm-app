import { PrismaClient, Role, UserStatus, ContactStatus, ContactSource, LeadStatus, LeadSource, DealStage, DealPriority, TaskPriority, TaskStatus, TicketPriority, TicketStatus, CampaignStatus, AudienceSegment, AutomationTrigger, ConditionOperator, AutomationAction, ActivityType, NotificationType } from '@prisma/client';
import bcrypt from 'bcrypt';
import { USERS, CONTACTS, LEADS, DEALS, TASKS, ACTIVITIES, TICKETS, CAMPAIGNS, AUTOMATIONS, NOTIFICATIONS } from '../src/data/seedData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PostgreSQL database with Pulse CRM demo dataset...');

  // 1. Clear existing records in correct relation order
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.ticketComment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.task.deleteMany();
  await prisma.dealStageHistory.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.segment.deleteMany();
  await prisma.automationRule.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  const hashedPassword = await bcrypt.hash('password123', 12);
  const userMap = new Map<string, string>();

  for (const u of USERS) {
    const roleEnum = u.role === 'admin' ? Role.ADMIN : u.role === 'manager' ? Role.MANAGER : Role.SALES_REP;
    const created = await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: roleEnum,
        avatar: u.avatar,
        status: u.status === 'active' ? UserStatus.ACTIVE : UserStatus.INACTIVE,
      },
    });
    userMap.set(u.id, created.id);
  }
  console.log(`Seeded ${USERS.length} demo users`);

  // 3. Seed Companies
  const uniqueCompanies = Array.from(new Set(CONTACTS.map((c) => c.company)));
  const companyMap = new Map<string, string>();

  for (const compName of uniqueCompanies) {
    const comp = await prisma.company.create({
      data: {
        name: compName,
        domain: `${compName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        industry: 'Technology & Enterprise',
      },
    });
    companyMap.set(compName, comp.id);
  }
  console.log(`Seeded ${uniqueCompanies.length} companies`);

  // 4. Seed Contacts
  for (const c of CONTACTS) {
    const statusMap: Record<string, ContactStatus> = {
      lead: ContactStatus.LEAD,
      active: ContactStatus.ACTIVE,
      inactive: ContactStatus.INACTIVE,
      customer: ContactStatus.CUSTOMER,
    };
    const sourceMap: Record<string, ContactSource> = {
      website: ContactSource.WEBSITE,
      referral: ContactSource.REFERRAL,
      linkedin: ContactSource.LINKEDIN,
      outbound: ContactSource.OUTBOUND,
      conference: ContactSource.CONFERENCE,
    };

    await prisma.contact.create({
      data: {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        company: c.company,
        companyId: companyMap.get(c.company),
        title: c.title,
        status: statusMap[c.status] || ContactStatus.ACTIVE,
        source: sourceMap[c.source] || ContactSource.WEBSITE,
        ownerId: c.ownerId,
        ownerName: c.ownerName,
        value: c.value,
        tags: c.tags,
        notes: c.notes,
        createdAt: new Date(c.createdAt),
      },
    });
  }
  console.log(`Seeded ${CONTACTS.length} contacts`);

  // 5. Seed Leads
  for (const l of LEADS) {
    const statusMap: Record<string, LeadStatus> = {
      new: LeadStatus.NEW,
      contacted: LeadStatus.CONTACTED,
      qualified: LeadStatus.QUALIFIED,
      disqualified: LeadStatus.DISQUALIFIED,
    };
    const sourceMap: Record<string, LeadSource> = {
      organic: LeadSource.ORGANIC,
      referral: LeadSource.REFERRAL,
      linkedin: LeadSource.LINKEDIN,
      adwords: LeadSource.ADWORDS,
      outbound: LeadSource.OUTBOUND,
    };

    await prisma.lead.create({
      data: {
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        company: l.company,
        title: l.title,
        status: statusMap[l.status] || LeadStatus.NEW,
        source: sourceMap[l.source] || LeadSource.ORGANIC,
        score: l.score,
        ownerId: l.ownerId,
        ownerName: l.ownerName,
        estimatedValue: l.estimatedValue,
        notes: l.notes,
        createdAt: new Date(l.createdAt),
      },
    });
  }
  console.log(`Seeded ${LEADS.length} leads`);

  // 6. Seed Deals & Stage History
  for (const d of DEALS) {
    const stageMap: Record<string, DealStage> = {
      new: DealStage.NEW,
      contacted: DealStage.CONTACTED,
      proposal: DealStage.PROPOSAL,
      negotiation: DealStage.NEGOTIATION,
      won: DealStage.WON,
      lost: DealStage.LOST,
    };
    const priorityMap: Record<string, DealPriority> = {
      low: DealPriority.LOW,
      medium: DealPriority.MEDIUM,
      high: DealPriority.HIGH,
    };

    const createdDeal = await prisma.deal.create({
      data: {
        id: d.id,
        title: d.title,
        contactId: d.contactId,
        contactName: d.contactName,
        company: d.company,
        companyId: companyMap.get(d.company),
        value: d.value,
        stage: stageMap[d.stage] || DealStage.PROPOSAL,
        probability: d.probability,
        expectedCloseDate: d.expectedCloseDate ? new Date(d.expectedCloseDate) : null,
        ownerId: d.ownerId,
        ownerName: d.ownerName,
        priority: priorityMap[d.priority] || DealPriority.MEDIUM,
        notes: d.notes,
        createdAt: new Date(d.createdAt),
      },
    });

    // Record initial stage history
    await prisma.dealStageHistory.create({
      data: {
        dealId: createdDeal.id,
        fromStage: null,
        toStage: stageMap[d.stage] || DealStage.NEW,
        changedById: d.ownerId,
      },
    });
  }
  console.log(`Seeded ${DEALS.length} deals`);

  // 7. Seed Tasks
  for (const t of TASKS) {
    await prisma.task.create({
      data: {
        id: t.id,
        title: t.title,
        description: t.description,
        dueDate: new Date(t.dueDate),
        priority: t.priority === 'high' ? TaskPriority.HIGH : TaskPriority.MEDIUM,
        status: t.status === 'completed' ? TaskStatus.COMPLETED : t.status === 'in_progress' ? TaskStatus.IN_PROGRESS : TaskStatus.PENDING,
        contactId: t.contactId,
        contactName: t.contactName,
        dealId: t.dealId,
        assignedToId: t.assignedToId,
        assignedToName: t.assignedToName,
      },
    });
  }
  console.log(`Seeded ${TASKS.length} tasks`);

  // 8. Seed Activities
  for (const a of ACTIVITIES) {
    const typeMap: Record<string, ActivityType> = {
      call: ActivityType.CALL,
      email: ActivityType.EMAIL,
      meeting: ActivityType.MEETING,
      note: ActivityType.NOTE,
      status_change: ActivityType.STATUS_CHANGE,
    };
    await prisma.activity.create({
      data: {
        id: a.id,
        type: typeMap[a.type] || ActivityType.NOTE,
        contactId: a.contactId,
        contactName: a.contactName,
        title: a.title,
        description: a.description,
        performedBy: a.performedBy,
        performedById: a.performedById,
        date: new Date(a.date),
        durationMinutes: a.durationMinutes,
        outcome: a.outcome,
      },
    });
  }

  // 9. Seed Tickets & Comments
  for (const tk of TICKETS) {
    const priorityMap: Record<string, TicketPriority> = {
      low: TicketPriority.LOW,
      medium: TicketPriority.MEDIUM,
      high: TicketPriority.HIGH,
      urgent: TicketPriority.URGENT,
    };
    const statusMap: Record<string, TicketStatus> = {
      open: TicketStatus.OPEN,
      pending: TicketStatus.PENDING,
      resolved: TicketStatus.RESOLVED,
      closed: TicketStatus.CLOSED,
    };

    const createdTicket = await prisma.ticket.create({
      data: {
        id: tk.id,
        ticketNumber: tk.ticketNumber,
        subject: tk.subject,
        description: tk.description,
        contactId: tk.contactId,
        contactName: tk.contactName,
        company: tk.company,
        priority: priorityMap[tk.priority] || TicketPriority.MEDIUM,
        status: statusMap[tk.status] || TicketStatus.OPEN,
        assignedToId: tk.assignedToId,
        assignedToName: tk.assignedToName,
      },
    });

    for (const cm of tk.comments) {
      await prisma.ticketComment.create({
        data: {
          id: cm.id,
          ticketId: createdTicket.id,
          authorId: cm.authorId,
          authorName: cm.authorName,
          authorAvatar: cm.authorAvatar,
          content: cm.content,
          isInternal: cm.isInternal,
          createdAt: new Date(cm.createdAt),
        },
      });
    }
  }

  // 10. Seed Campaigns
  for (const cmp of CAMPAIGNS) {
    await prisma.campaign.create({
      data: {
        id: cmp.id,
        name: cmp.name,
        subject: cmp.subject,
        status: cmp.status === 'sent' ? CampaignStatus.SENT : cmp.status === 'scheduled' ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
        segment: cmp.segment === 'hot_leads' ? AudienceSegment.HOT_LEADS : cmp.segment === 'inactive_30d' ? AudienceSegment.INACTIVE_30D : AudienceSegment.ALL_LEADS,
        scheduledAt: cmp.scheduledAt ? new Date(cmp.scheduledAt) : null,
        sentAt: cmp.sentAt ? new Date(cmp.sentAt) : null,
        sentCount: cmp.stats.sent,
        openedCount: cmp.stats.opened,
        clickedCount: cmp.stats.clicked,
        bouncedCount: cmp.stats.bounced,
      },
    });
  }

  // 11. Seed Automations
  for (const auto of AUTOMATIONS) {
    await prisma.automationRule.create({
      data: {
        id: auto.id,
        name: auto.name,
        trigger: auto.trigger === 'deal_won' ? AutomationTrigger.DEAL_WON : auto.trigger === 'ticket_created' ? AutomationTrigger.TICKET_CREATED : AutomationTrigger.LEAD_CREATED,
        conditionField: auto.conditionField,
        conditionOperator: auto.conditionOperator === 'equals' ? ConditionOperator.EQUALS : ConditionOperator.GREATER_THAN,
        conditionValue: auto.conditionValue,
        actionType: auto.actionType === 'create_task' ? AutomationAction.CREATE_TASK : AutomationAction.ASSIGN_OWNER,
        actionTarget: auto.actionTarget,
        actionPayload: auto.actionPayload,
        enabled: auto.enabled,
        executionCount: auto.executionCount,
      },
    });
  }

  // 12. Seed Notifications
  for (const n of NOTIFICATIONS) {
    const typeMap: Record<string, NotificationType> = {
      deal: NotificationType.DEAL,
      lead: NotificationType.LEAD,
      task: NotificationType.TASK,
      ticket: NotificationType.TICKET,
      system: NotificationType.SYSTEM,
    };
    await prisma.notification.create({
      data: {
        id: n.id,
        userId: 'user-1',
        title: n.title,
        message: n.message,
        type: typeMap[n.type] || NotificationType.SYSTEM,
        read: n.read,
        link: n.link,
      },
    });
  }

  console.log('Seeding completed successfully! 🚀');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
