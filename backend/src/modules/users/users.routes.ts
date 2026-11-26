import { Router } from 'express';
import { userController } from './users.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { auditLog } from '../../middlewares/auditLog.middleware';
import { createUserSchema, updateUserSchema } from './users.schemas';

const router = Router();

// Reset DB route (can be accessed with auth or dev)
router.post('/reset-db', userController.resetDatabase);

// Protected user management routes
router.use(authenticate);

router.get('/', userController.getUsers);

router.post(
  '/',
  requireRole('ADMIN'),
  validate(createUserSchema),
  auditLog('user_created', 'User'),
  userController.createUser
);

router.patch(
  '/:id',
  validate(updateUserSchema),
  auditLog('user_updated', 'User'),
  userController.updateUser
);

router.delete(
  '/:id',
  requireRole('ADMIN'),
  auditLog('user_deleted', 'User'),
  userController.deleteUser
);

router.post(
  '/:id/avatar',
  auditLog('user_avatar_updated', 'User'),
  userController.uploadAvatar
);

export default router;
