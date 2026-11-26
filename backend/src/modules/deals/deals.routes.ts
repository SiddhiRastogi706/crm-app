import { Router } from 'express';
import { dealController } from './deals.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { auditLog } from '../../middlewares/auditLog.middleware';
import { createDealSchema, updateDealSchema } from './deals.schemas';

const router = Router();

router.use(authenticate);

router.get('/pipeline-summary', dealController.getPipelineSummary);
router.get('/', dealController.getDeals);
router.get('/:id', dealController.getDealById);

router.post(
  '/',
  validate(createDealSchema),
  auditLog('deal_created', 'Deal'),
  dealController.createDeal
);

router.patch(
  '/:id',
  validate(updateDealSchema),
  auditLog('deal_updated', 'Deal'),
  dealController.updateDeal
);

router.delete(
  '/:id',
  auditLog('deal_deleted', 'Deal'),
  dealController.deleteDeal
);

export default router;
