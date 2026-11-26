import { Request, Response, NextFunction } from 'express';
import { ticketService } from './tickets.service';

export class TicketController {
  async getTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const tickets = await ticketService.getTickets();
      res.json(tickets);
    } catch (err) {
      next(err);
    }
  }

  async getTicketById(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await ticketService.getTicketById(req.params.id);
      res.json(ticket);
    } catch (err) {
      next(err);
    }
  }

  async createTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await ticketService.createTicket(req.body);
      res.status(201).json(ticket);
    } catch (err) {
      next(err);
    }
  }

  async updateTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await ticketService.updateTicket(req.params.id, req.body);
      res.json(ticket);
    } catch (err) {
      next(err);
    }
  }

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const commentData = { ...req.body };
      if (req.user && !commentData.authorId) {
        commentData.authorId = req.user.id;
        commentData.authorName = req.user.name || 'Alex Morgan';
      }
      const ticket = await ticketService.addComment(req.params.id, commentData);
      res.json(ticket);
    } catch (err) {
      next(err);
    }
  }

  // Public webhook handler for Inbound Emails from SendGrid, Mailgun, Cloudflare, or Google PubSub
  async handleInboundEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { from, sender, email, subject, text, body, html, to } = req.body;
      const senderRaw = from || sender || email || 'client@example.com';
      const senderEmail = senderRaw.includes('<')
        ? senderRaw.match(/<([^>]+)>/)?.[1] || senderRaw
        : senderRaw;
      const senderName = senderRaw.includes('<')
        ? senderRaw.split('<')[0].replace(/"/g, '').trim()
        : senderEmail.split('@')[0];

      const emailSubject = subject || 'Technical Support Request';
      const emailBody = text || body || html || 'No details provided';

      // Intelligent SLA Priority Detection
      const combined = (emailSubject + ' ' + emailBody).toLowerCase();
      let priority: 'urgent' | 'high' | 'medium' | 'low' = 'medium';
      if (
        combined.includes('urgent') ||
        combined.includes('down') ||
        combined.includes('outage') ||
        combined.includes('crash') ||
        combined.includes('error 500') ||
        combined.includes('critical')
      ) {
        priority = 'urgent';
      } else if (
        combined.includes('fail') ||
        combined.includes('403') ||
        combined.includes('sso') ||
        combined.includes('high') ||
        combined.includes('security')
      ) {
        priority = 'high';
      }

      // Extract Company Name from Email Domain
      const domain = senderEmail.split('@')[1] || '';
      let companyName = 'Enterprise Client';
      if (domain && !['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'].includes(domain.toLowerCase())) {
        const root = domain.split('.')[0];
        companyName = root.charAt(0).toUpperCase() + root.slice(1) + ' Corp';
      } else if (senderName) {
        companyName = `${senderName}'s Organization`;
      }

      const generatedTicketNum = `TICK-${Math.floor(1040 + Math.random() * 8900)}`;

      const ticketPayload = {
        subject: emailSubject,
        description: emailBody,
        company: companyName,
        contactName: senderName,
        priority,
        status: 'open',
        ticketNumber: generatedTicketNum,
        comments: [
          {
            id: `cmt-inbound-${Date.now()}`,
            authorId: 'inbound-email',
            authorName: `${senderName} (${senderEmail})`,
            content: `📩 [Real Inbound Email via ${to || 'support@kcisindia.com'}]\n\nSubject: ${emailSubject}\n\n${emailBody}`,
            isInternal: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: `cmt-ack-${Date.now() + 1}`,
            authorId: 'system-bot',
            authorName: 'KCIS Support Auto-Responder',
            content: `🤖 Automated Email Sent to ${senderEmail}:\n"Dear ${senderName},\nThank you for reaching out to KCIS Tech Support. Your case #${generatedTicketNum} has been logged under your 24x7 SLA.\nPriority: ${priority.toUpperCase()} | Assigned to: Tier-2 NOC Engineering Team."`,
            isInternal: true,
            createdAt: new Date(Date.now() + 1000).toISOString(),
          }
        ],
      };

      const ticket = await ticketService.createTicket(ticketPayload);
      res.status(200).json({
        success: true,
        message: 'Inbound email received and ticket created',
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const ticketController = new TicketController();
