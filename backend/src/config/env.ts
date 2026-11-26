import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PREFIX: z.string().default('/api'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/pulse_crm?schema=public'),

  JWT_ACCESS_SECRET: z.string().default('super_secret_jwt_access_key_pulse_crm_2026_secure'),
  JWT_REFRESH_SECRET: z.string().default('super_secret_jwt_refresh_key_pulse_crm_2026_secure'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  REDIS_URL: z.string().optional(),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default('Pulse CRM <no-reply@pulsecrm.com>'),

  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(500),
  AUTH_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(20),
  ACCOUNT_LOCKOUT_ATTEMPTS: z.coerce.number().default(5),
  ACCOUNT_LOCKOUT_DURATION_MINS: z.coerce.number().default(15),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
