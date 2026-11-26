import { Router } from 'express';
import { leadController } from './leads.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { auditLog } from '../../middlewares/auditLog.middleware';
import { createLeadSchema, updateLeadSchema, convertLeadSchema } from './leads.schemas';

const router = Router();

router.use(authenticate);

router.get('/', leadController.getLeads);
router.get('/:id', leadController.getLeadById);

router.post(
  '/',
  validate(createLeadSchema),
  auditLog('lead_created', 'Lead'),
  leadController.createLead
);

router.patch(
  '/:id',
  validate(updateLeadSchema),
  auditLog('lead_updated', 'Lead'),
  leadController.updateLead
);

router.delete(
  '/:id',
  auditLog('lead_deleted', 'Lead'),
  leadController.deleteLead
);

router.post(
  '/:id/convert',
  validate(convertLeadSchema),
  auditLog('lead_converted', 'Lead'),
  leadController.convertLead
);

export default router;
