import { prisma, isPrismaConnected } from '../lib/prisma';
import { dbStore } from './dbStore';
import { SeedCampaign } from '../data/seedData';
import { logger } from '../config/logger';

export class MarketingRepository {
  async findAll(): Promise<SeedCampaign[]> {
    if (isPrismaConnected()) {
      try {
        const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: 'desc' } });
        if (campaigns) {
          return campaigns.map((c) => ({
            id: c.id,
            name: c.name,
            subject: c.subject,
            status: c.status.toLowerCase() as any,
            segment: c.segment.toLowerCase() as any,
            scheduledAt: c.scheduledAt ? c.scheduledAt.toISOString() : undefined,
            sentAt: c.sentAt ? c.sentAt.toISOString() : undefined,
            stats: {
              sent: c.sentCount,
              opened: c.openedCount,
              clicked: c.clickedCount,
              bounced: c.bouncedCount,
            },
            createdAt: c.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma campaign findAll fallback');
      }
    }

    return dbStore.campaigns;
  }

  async create(data: Partial<SeedCampaign>): Promise<SeedCampaign> {
    const id = data.id || `cmp-${Date.now()}`;
    const newCampaign: SeedCampaign = {
      id,
      name: data.name || 'New Campaign',
      subject: data.subject || 'Quarterly Insights',
      status: data.status || 'draft',
      segment: data.segment || 'all_leads',
      scheduledAt: data.scheduledAt,
      sentAt: data.sentAt,
      stats: data.stats || { sent: 0, opened: 0, clicked: 0, bounced: 0 },
      createdAt: new Date().toISOString(),
    };

    if (isPrismaConnected()) {
      try {
        await prisma.campaign.create({
          data: {
            id: newCampaign.id,
            name: newCampaign.name,
            subject: newCampaign.subject,
            status: newCampaign.status.toUpperCase() as any,
            segment: newCampaign.segment.toUpperCase() as any,
            scheduledAt: newCampaign.scheduledAt ? new Date(newCampaign.scheduledAt) : null,
            sentAt: newCampaign.sentAt ? new Date(newCampaign.sentAt) : null,
            sentCount: newCampaign.stats.sent,
            openedCount: newCampaign.stats.opened,
            clickedCount: newCampaign.stats.clicked,
            bouncedCount: newCampaign.stats.bounced,
          },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma create campaign fallback to dbStore');
      }
    }

    dbStore.campaigns.unshift(newCampaign);
    return newCampaign;
  }
}

export const marketingRepository = new MarketingRepository();
