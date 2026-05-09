import 'dotenv/config'; // ✅ REQUIRED

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  console.log("👤 Creating admin user...");

  await prisma.admin.upsert({
    where: { username: "sakshi_admin" },
    update: { passwordHash: hashedPassword },
    create: {
      username: "sakshi_admin",
      passwordHash: hashedPassword,
    },
  });

  console.log("🚀 SEEDING SUCCESSFUL");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });