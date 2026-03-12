import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  DATABASE_PATH: process.env.DATABASE_PATH || path.resolve(__dirname, '../../data/database.sqlite'),
};
