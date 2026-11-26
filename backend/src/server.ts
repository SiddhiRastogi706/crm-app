import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';
import { automationWorker } from './modules/automation/automation.worker';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Pulse CRM Backend running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  logger.info(`📖 API Documentation available at http://localhost:${env.PORT}/api/docs`);
  logger.info(`🩺 Health check at http://localhost:${env.PORT}/health`);

  // Start background automation runner
  automationWorker.start();
});

// Graceful Shutdown
const handleShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Gracefully shutting down...`);

  automationWorker.stop();

  server.close(async () => {
    logger.info('HTTP server closed.');

    try {
      await prisma.$disconnect();
      logger.info('Prisma disconnected.');
    } catch (err) {
      logger.error({ err }, 'Error during Prisma disconnection');
    }

    process.exit(0);
  });

  // Force close if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Shutdown timed out. Forcing process exit.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default server;
