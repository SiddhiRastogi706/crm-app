import bcrypt from 'bcrypt';
import { env } from '../config/env';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
};

export const comparePassword = async (candidate: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(candidate, hashed);
};
