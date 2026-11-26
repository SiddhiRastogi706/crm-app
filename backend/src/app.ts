import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middlewares/error.middleware';
import { apiRateLimiter } from './middlewares/rateLimiter.middleware';

// Routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import contactRoutes from './modules/contacts/contacts.routes';
import leadRoutes from './modules/leads/leads.routes';
import dealRoutes from './modules/deals/deals.routes';
import taskRoutes from './modules/tasks/tasks.routes';
import activityRoutes from './modules/activities/activities.routes';
import ticketRoutes from './modules/tickets/tickets.routes';
import marketingRoutes from './modules/marketing/marketing.routes';
import automationRoutes from './modules/automation/automation.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import reportsRoutes from './modules/reports/reports.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import searchRoutes from './modules/search/search.routes';
import swaggerRouter from './docs/swagger';
import { userController } from './modules/users/users.controller';

export const createApp = () => {
  const app = express();

  // Security & standard middlewares
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows Swagger UI inline scripts
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use(
    cors({
      origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  if (env.NODE_ENV !== 'test') {
    app.use(pinoHttp({ logger }));
  }

  // Rate Limiting
  app.use('/api', apiRateLimiter);

  // Health checks
  const healthResponse = (req: express.Request, res: express.Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'pulse-crm-backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    });
  };

  app.get('/health', healthResponse);
  app.get('/api/health', healthResponse);

  // API Documentation
  app.use('/api/docs', swaggerRouter);

  // Direct reset-db endpoint for frontend settings page
  app.post('/api/reset-db', userController.resetDatabase);

  // Mount API modules
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/contacts', contactRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/deals', dealRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/activities', activityRoutes);
  app.use('/api/tickets', ticketRoutes);
  app.use('/api/campaigns', marketingRoutes);
  app.use('/api/automations', automationRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/reports', reportsRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/search', searchRoutes);

  // 404 Catch-all
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
