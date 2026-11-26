import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/metrics', dashboardController.getMetrics);

export default router;
