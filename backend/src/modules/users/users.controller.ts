import { Request, Response, NextFunction } from 'express';
import { userService } from './users.service';

export class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      const avatarUrl = file
        ? `/uploads/avatars/${file.filename}`
        : req.body.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
      const user = await userService.updateAvatar(req.params.id, avatarUrl);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async resetDatabase(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.resetDatabase();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
