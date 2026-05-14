import 'dotenv/config'; // Must be the first import
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Prisma 7 uses the 'url' field in the config for migrations.
    // If you use a pooler (like Supabase), use your DIRECT_URL here.
    url: env('DATABASE_URL'), 
  },
});