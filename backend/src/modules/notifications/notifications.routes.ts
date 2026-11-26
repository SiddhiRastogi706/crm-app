import { Router } from 'express';
import { notificationController } from './notifications.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// SSE live stream
router.get('/stream', notificationController.streamNotifications);

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.post('/read-all', notificationController.markAllAsRead);

export default router;
