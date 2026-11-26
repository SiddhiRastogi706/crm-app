import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authRateLimiter } from '../../middlewares/rateLimiter.middleware';
import { auditLog } from '../../middlewares/auditLog.middleware';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.schemas';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  auditLog('user_registered', 'User'),
  authController.register
);

router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  auditLog('user_logged_in', 'User'),
  authController.login
);

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

router.get('/me', authenticate, authController.getMe);

export default router;
