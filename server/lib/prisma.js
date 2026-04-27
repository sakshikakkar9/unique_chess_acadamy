import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;

// 1. Connection Pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 2. Initialize Adapter
const adapter = new PrismaPg(pool);

// 3. Global instance logic
const globalForPrisma = globalThis;

// Export the instance directly
export const prisma = globalForPrisma.prisma || new PrismaClient({ 
  adapter,
  log: ['error', 'warn'], // Reduced noise for cleaner terminal
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;