import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  jwt_secret: process.env.JWT_SECRET || 'supersecretkey',
  jwt_expires_in: process.env.JWT_EXPIRES_IN || '1d',
}));
