import { Router } from 'express';
import { marketingController } from './marketing.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { auditLog } from '../../middlewares/auditLog.middleware';
import { createCampaignSchema } from './marketing.schemas';

const router = Router();

router.use(authenticate);

router.get('/segments', marketingController.getSegments);
router.get('/', marketingController.getCampaigns);

router.post(
  '/',
  validate(createCampaignSchema),
  auditLog('campaign_created', 'Campaign'),
  marketingController.createCampaign
);

export default router;
