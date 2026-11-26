import { prisma, isPrismaConnected } from '../lib/prisma';
import { dbStore, StoredUser, StoredRefreshToken } from './dbStore';
import { logger } from '../config/logger';

export class UserRepository {
  async findByEmail(email: string): Promise<StoredUser | null> {
    if (isPrismaConnected()) {
      try {
        const u = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (u) {
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            role: (u.role.toLowerCase() as any),
            avatar: u.avatar || undefined,
            status: (u.status.toLowerCase() as any),
            createdAt: u.createdAt.toISOString(),
            passwordHash: u.password,
            failedLoginAttempts: u.failedLoginAttempts,
            lockoutUntil: u.lockoutUntil || undefined,
          };
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma error in findByEmail, fallback to dbStore');
      }
    }
    const found = dbStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return found || null;
  }

  async findById(id: string): Promise<StoredUser | null> {
    if (isPrismaConnected()) {
      try {
        const u = await prisma.user.findUnique({ where: { id } });
        if (u) {
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            role: (u.role.toLowerCase() as any),
            avatar: u.avatar || undefined,
            status: (u.status.toLowerCase() as any),
            createdAt: u.createdAt.toISOString(),
            passwordHash: u.password,
            failedLoginAttempts: u.failedLoginAttempts,
            lockoutUntil: u.lockoutUntil || undefined,
          };
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma error in findById, fallback');
      }
    }
    const found = dbStore.users.find((u) => u.id === id);
    return found || null;
  }

  async findAll(): Promise<StoredUser[]> {
    if (isPrismaConnected()) {
      try {
        const list = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
        if (list && list.length > 0) {
          return list.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: (u.role.toLowerCase() as any),
            avatar: u.avatar || undefined,
            status: (u.status.toLowerCase() as any),
            createdAt: u.createdAt.toISOString(),
            passwordHash: u.password,
            failedLoginAttempts: u.failedLoginAttempts,
            lockoutUntil: u.lockoutUntil || undefined,
          }));
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma error in findAll, fallback');
      }
    }
    return dbStore.users;
  }

  async create(user: { name: string; email: string; passwordHash: string; role: string; avatar?: string }): Promise<StoredUser> {
    const id = `user-${Date.now()}`;
    const normalizedRole = user.role.toLowerCase() as any;
    const newUser: StoredUser = {
      id,
      name: user.name,
      email: user.email.toLowerCase(),
      role: normalizedRole,
      avatar: user.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      status: 'active',
      createdAt: new Date().toISOString(),
      passwordHash: user.passwordHash,
      failedLoginAttempts: 0,
    };

    if (isPrismaConnected()) {
      try {
        await prisma.user.create({
          data: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            password: newUser.passwordHash,
            role: (user.role.toUpperCase() as any),
            avatar: newUser.avatar,
            status: 'ACTIVE',
          },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma user create fallback to dbStore');
      }
    }

    dbStore.users.push(newUser);
    return newUser;
  }

  async update(id: string, updates: Partial<StoredUser>): Promise<StoredUser | null> {
    if (isPrismaConnected()) {
      try {
        const prismaUpdates: any = { ...updates };
        if (updates.role) prismaUpdates.role = updates.role.toUpperCase();
        if (updates.status) prismaUpdates.status = updates.status.toUpperCase();
        if (updates.passwordHash) prismaUpdates.password = updates.passwordHash;

        await prisma.user.update({
          where: { id },
          data: prismaUpdates,
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma update user fallback');
      }
    }

    const idx = dbStore.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    dbStore.users[idx] = { ...dbStore.users[idx], ...updates };
    return dbStore.users[idx];
  }

  async delete(id: string): Promise<boolean> {
    if (isPrismaConnected()) {
      try {
        await prisma.user.delete({ where: { id } });
      } catch (err) {
        logger.debug({ err }, 'Prisma delete user fallback');
      }
    }
    const lenBefore = dbStore.users.length;
    dbStore.users = dbStore.users.filter((u) => u.id !== id);
    return dbStore.users.length < lenBefore;
  }

  async updateFailedLogin(id: string, attempts: number, lockoutUntil?: Date): Promise<void> {
    if (isPrismaConnected()) {
      try {
        await prisma.user.update({
          where: { id },
          data: { failedLoginAttempts: attempts, lockoutUntil },
        });
      } catch {
        // fallback
      }
    }
    const user = dbStore.users.find((u) => u.id === id);
    if (user) {
      user.failedLoginAttempts = attempts;
      user.lockoutUntil = lockoutUntil;
    }
  }

  async resetFailedLogin(id: string): Promise<void> {
    if (isPrismaConnected()) {
      try {
        await prisma.user.update({
          where: { id },
          data: { failedLoginAttempts: 0, lockoutUntil: null },
        });
      } catch {
        // fallback
      }
    }
    const user = dbStore.users.find((u) => u.id === id);
    if (user) {
      user.failedLoginAttempts = 0;
      user.lockoutUntil = undefined;
    }
  }

  async saveRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    if (isPrismaConnected()) {
      try {
        await prisma.refreshToken.create({
          data: {
            userId,
            tokenHash,
            expiresAt,
          },
        });
      } catch {
        // fallback
      }
    }
    dbStore.refreshTokens.push({
      id: `rt-${Date.now()}`,
      userId,
      tokenHash,
      expiresAt,
      revoked: false,
    });
  }

  async findRefreshToken(tokenHash: string): Promise<StoredRefreshToken | null> {
    if (isPrismaConnected()) {
      try {
        const rt = await prisma.refreshToken.findUnique({ where: { tokenHash } });
        if (rt) {
          return {
            id: rt.id,
            tokenHash: rt.tokenHash,
            userId: rt.userId,
            expiresAt: rt.expiresAt,
            revoked: rt.revoked,
          };
        }
      } catch {
        // fallback
      }
    }
    const found = dbStore.refreshTokens.find((r) => r.tokenHash === tokenHash && !r.revoked);
    return found || null;
  }

  async revokeRefreshToken(tokenHash: string): Promise<void> {
    if (isPrismaConnected()) {
      try {
        await prisma.refreshToken.update({
          where: { tokenHash },
          data: { revoked: true },
        });
      } catch {
        // fallback
      }
    }
    const token = dbStore.refreshTokens.find((r) => r.tokenHash === tokenHash);
    if (token) token.revoked = true;
  }
}

export const userRepository = new UserRepository();
