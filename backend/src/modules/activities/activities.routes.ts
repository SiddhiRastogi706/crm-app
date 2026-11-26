import { Router } from 'express';
import { activityController } from './activities.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createActivitySchema } from './activities.schemas';

const router = Router();

router.use(authenticate);

router.get('/', activityController.getActivities);
router.post('/', validate(createActivitySchema), activityController.createActivity);

export default router;
