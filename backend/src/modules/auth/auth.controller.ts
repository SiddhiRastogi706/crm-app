import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../../utils/jwt';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      setRefreshTokenCookie(res, result.refreshToken);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      setRefreshTokenCookie(res, result.refreshToken);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // Check request body or httpOnly cookie
      const token = req.body.refreshToken || req.cookies?.refreshToken;
      const result = await authService.refreshToken(token);
      setRefreshTokenCookie(res, result.refreshToken);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.body.refreshToken || req.cookies?.refreshToken;
      await authService.logout(token);
      clearRefreshTokenCookie(res);
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword(req.body.email);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resetPassword(req.body.token, req.body.password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await authService.changePassword(userId, req.body.currentPassword, req.body.newPassword);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await authService.getMe(userId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
