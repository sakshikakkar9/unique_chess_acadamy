import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Prisma 7 uses process.env for these values
    url: process.env.DATABASE_URL,
  },
});