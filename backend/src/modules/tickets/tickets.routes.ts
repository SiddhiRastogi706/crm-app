import { Router } from 'express';
import { ticketController } from './tickets.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { auditLog } from '../../middlewares/auditLog.middleware';
import { createTicketSchema, updateTicketSchema, addCommentSchema } from './tickets.schemas';

const router = Router();

// Public Webhook endpoint for inbound email ingestion (No Auth required for webhooks)
router.post('/inbound-email', ticketController.handleInboundEmail);

router.use(authenticate);

router.get('/', ticketController.getTickets);
router.get('/:id', ticketController.getTicketById);

router.post(
  '/',
  validate(createTicketSchema),
  auditLog('ticket_created', 'Ticket'),
  ticketController.createTicket
);

router.patch(
  '/:id',
  validate(updateTicketSchema),
  auditLog('ticket_updated', 'Ticket'),
  ticketController.updateTicket
);

router.post(
  '/:id/comments',
  validate(addCommentSchema),
  auditLog('ticket_comment_added', 'Ticket'),
  ticketController.addComment
);

export default router;
