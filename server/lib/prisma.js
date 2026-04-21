import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;

// Create a standard connection pool for your local PostgreSQL
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// Pass the pool to the Prisma Postgres adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma 7 with the adapter (Notice there is no "datasources" here!)
const prisma = new PrismaClient({ adapter });

export default prisma;