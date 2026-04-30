import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    // This tells Prisma to run your javascript seed file
    seed: 'node prisma/seed.js', 
  },
  datasource: {
    // Use DIRECT_URL for the seeding process
    url: env('DIRECT_URL'), 
  },
});