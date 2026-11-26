import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'manager', 'sales_rep', 'ADMIN', 'MANAGER', 'SALES_REP']).default('sales_rep'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().default('password123'),
  avatar: z.string().url().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'manager', 'sales_rep', 'ADMIN', 'MANAGER', 'SALES_REP']).optional(),
  status: z.enum(['active', 'inactive', 'ACTIVE', 'INACTIVE']).optional(),
  avatar: z.string().optional(),
});
