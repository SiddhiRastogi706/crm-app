import { userRepository } from '../../repositories/user.repository';
import { hashPassword } from '../../utils/password';
import { AppError } from '../../utils/AppError';
import { dbStore } from '../../repositories/dbStore';

export class UserService {
  async getUsers() {
    const users = await userRepository.findAll();
    return users.map((u) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, failedLoginAttempts, lockoutUntil, ...safeUser } = u;
      return safeUser;
    });
  }

  async createUser(data: { name: string; email: string; role?: string; password?: string; avatar?: string }) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('User with this email already exists', 409);
    }

    const passwordHash = await hashPassword(data.password || 'password123');
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role || 'sales_rep',
      avatar: data.avatar,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, failedLoginAttempts: __, lockoutUntil: ___, ...safeUser } = user;
    return safeUser;
  }

  async updateUser(id: string, updates: any) {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new AppError('User not found', 404);
    }

    if (updates.email && updates.email !== existing.email) {
      const emailTaken = await userRepository.findByEmail(updates.email);
      if (emailTaken && emailTaken.id !== id) {
        throw new AppError('Email is already in use by another user', 409);
      }
    }

    const updated = await userRepository.update(id, updates);
    if (!updated) throw new AppError('User not found', 404);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, failedLoginAttempts: __, lockoutUntil: ___, ...safeUser } = updated;
    return safeUser;
  }

  async deleteUser(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);

    await userRepository.delete(id);
    return { success: true };
  }

  async updateAvatar(id: string, avatarUrl: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);

    const updated = await userRepository.update(id, { avatar: avatarUrl });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, failedLoginAttempts: __, lockoutUntil: ___, ...safeUser } = updated!;
    return safeUser;
  }

  async resetDatabase() {
    dbStore.reset();
    return { success: true, message: 'Database reset to original seeds.' };
  }
}

export const userService = new UserService();
