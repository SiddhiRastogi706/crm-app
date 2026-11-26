import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaConnectedGlobal: boolean | undefined;
}

export const prisma =
  globalThis.prismaGlobal ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'stdout', level: 'error' },
            { emit: 'stdout', level: 'warn' },
          ]
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

let isConnected = globalThis.prismaConnectedGlobal || false;

export const isPrismaConnected = () => isConnected;

export const setPrismaConnected = (status: boolean) => {
  isConnected = status;
  globalThis.prismaConnectedGlobal = status;
};

export const checkPrismaConnection = async (): Promise<boolean> => {
  if (process.env.NODE_ENV === 'test' && !process.env.TEST_WITH_REAL_DB) {
    setPrismaConnected(false);
    return false;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    setPrismaConnected(true);
    logger.info('Connected to PostgreSQL via Prisma 🚀');
    return true;
  } catch {
    setPrismaConnected(false);
    logger.warn('PostgreSQL not detected at DATABASE_URL. Running in high-fidelity In-Memory Database store with full seed data.');
    return false;
  }
};
