import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;

// 1. Create a connection pool to your PostgreSQL database
// Ensure DATABASE_URL is defined in your server/.env file
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 2. Initialize the Prisma Postgres adapter
const adapter = new PrismaPg(pool);

// 3. Create the Prisma Client instance
// We use a global variable check to prevent multiple instances during development (nodemon restarts)
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient({ 
  adapter,
  // Optional: Enable logging to help you debug database queries in the terminal
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;