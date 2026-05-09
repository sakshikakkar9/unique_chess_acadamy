import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;

// 1. Connection Pool
const pool = (process.env.DATABASE_URL) ? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}) : null;

// 2. Initialize Adapter
const adapter = pool ? new PrismaPg(pool) : undefined;

// 3. Global instance logic
const globalForPrisma = globalThis;

// Export the instance directly
export const prisma = globalForPrisma.prisma || new PrismaClient({ 
  adapter,
  log: ['error', 'warn'], // Reduced noise for cleaner terminal
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;