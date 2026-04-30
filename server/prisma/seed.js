import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Setup the same adapter logic as your prisma.js
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});
const adapter = new PrismaPg(pool);

// 2. Pass the adapter to the constructor
const prisma = new PrismaClient({
  adapter,
  log: ['info', 'warn', 'error'],
});

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
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

    console.log("--------------------------------------");
    console.log("🚀 SEEDING SUCCESSFUL");
    console.log("👤 Username: sakshi_admin");
    console.log("--------------------------------------");

  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end(); // Important: Close the pool so the process can exit
  }
}

main();