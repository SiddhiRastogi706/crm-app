import { Router } from 'express';
import { reportsController } from './reports.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { auditLog } from '../../middlewares/auditLog.middleware';

const router = Router();

router.use(authenticate);

router.get('/reps', reportsController.getRepsPerformance);
router.get('/conversion', reportsController.getConversion);
router.get('/forecast', reportsController.getForecast);
router.get('/export', auditLog('reports_exported', 'Report'), reportsController.exportCsv);

export default router;
