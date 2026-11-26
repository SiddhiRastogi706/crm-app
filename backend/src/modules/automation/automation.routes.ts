import { Router } from 'express';
import { automationController } from './automation.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { auditLog } from '../../middlewares/auditLog.middleware';
import { createAutomationSchema, updateAutomationSchema } from './automation.schemas';

const router = Router();

router.use(authenticate);

router.get('/', automationController.getAutomations);

router.post(
  '/',
  validate(createAutomationSchema),
  auditLog('automation_created', 'Automation'),
  automationController.createAutomation
);

router.patch(
  '/:id',
  validate(updateAutomationSchema),
  auditLog('automation_updated', 'Automation'),
  automationController.updateAutomation
);

router.delete(
  '/:id',
  auditLog('automation_deleted', 'Automation'),
  automationController.deleteAutomation
);

export default router;
