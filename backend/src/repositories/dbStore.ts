import { USERS, CONTACTS, LEADS, DEALS, TASKS, ACTIVITIES, TICKETS, CAMPAIGNS, AUTOMATIONS, NOTIFICATIONS, SeedUser, SeedContact, SeedLead, SeedDeal, SeedTask, SeedActivity, SeedTicket, SeedCampaign, SeedAutomationRule, SeedNotificationItem } from '../data/seedData';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve(__dirname, '../../data/crm_store.json');

export interface StoredUser extends SeedUser {
  passwordHash: string;
  failedLoginAttempts: number;
  lockoutUntil?: Date;
}

export interface StoredRefreshToken {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  revoked: boolean;
}

export class DbStore {
  public users: StoredUser[] = [];
  public contacts: SeedContact[] = [];
  public leads: SeedLead[] = [];
  public deals: SeedDeal[] = [];
  public tasks: SeedTask[] = [];
  public activities: SeedActivity[] = [];
  public tickets: SeedTicket[] = [];
  public campaigns: SeedCampaign[] = [];
  public automations: SeedAutomationRule[] = [];
  public notifications: SeedNotificationItem[] = [];
  public refreshTokens: StoredRefreshToken[] = [];
  public auditLogs: any[] = [];
  public stageHistories: Array<{ id: string; dealId: string; fromStage: string | null; toStage: string; createdAt: string }> = [];

  constructor() {
    if (!this.loadFromFile()) {
      this.reset();
    }
  }

  public saveToFile() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const data = {
        users: this.users,
        contacts: this.contacts,
        leads: this.leads,
        deals: this.deals,
        tasks: this.tasks,
        activities: this.activities,
        tickets: this.tickets,
        campaigns: this.campaigns,
        automations: this.automations,
        notifications: this.notifications,
        stageHistories: this.stageHistories,
        auditLogs: this.auditLogs,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      // ignore
    }
  }

  public loadFromFile(): boolean {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(raw);
        if (data && data.users && data.users.length) {
          this.users = data.users;
          this.contacts = data.contacts || [];
          this.leads = data.leads || [];
          this.deals = data.deals || [];
          this.tasks = data.tasks || [];
          this.activities = data.activities || [];
          this.tickets = data.tickets || [];
          this.campaigns = data.campaigns || [];
          this.automations = data.automations || [];
          this.notifications = data.notifications || [];
          this.stageHistories = data.stageHistories || [];
          this.auditLogs = data.auditLogs || [];
          return true;
        }
      }
    } catch {
      // fallback
    }
    return false;
  }

  public reset() {
    const defaultPasswordHash = bcrypt.hashSync('password123', 10);
    this.users = USERS.map((u) => ({
      ...u,
      passwordHash: defaultPasswordHash,
      failedLoginAttempts: 0,
    }));
    this.contacts = JSON.parse(JSON.stringify(CONTACTS));
    this.leads = JSON.parse(JSON.stringify(LEADS));
    this.deals = JSON.parse(JSON.stringify(DEALS));
    this.tasks = JSON.parse(JSON.stringify(TASKS));
    this.activities = JSON.parse(JSON.stringify(ACTIVITIES));
    this.tickets = JSON.parse(JSON.stringify(TICKETS));
    this.campaigns = JSON.parse(JSON.stringify(CAMPAIGNS));
    this.automations = JSON.parse(JSON.stringify(AUTOMATIONS));
    this.notifications = JSON.parse(JSON.stringify(NOTIFICATIONS));
    this.refreshTokens = [];
    this.auditLogs = [];
    this.stageHistories = [];
    this.saveToFile();
  }
}

export const dbStore = new DbStore();
