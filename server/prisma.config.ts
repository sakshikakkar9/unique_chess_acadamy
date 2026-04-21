import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Point to where your schema file is
  schema: "prisma/schema.prisma",
  
  migrations: {
    path: "prisma/migrations",
    seed: 'node prisma/seed.js',
  },
  
  
  // This is where the URL lives now!
  datasource: {
    url: env("DATABASE_URL"),
  },
});

