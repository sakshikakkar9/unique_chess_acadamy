// prisma/seed.js
import prisma from '../lib/prisma.js'; // Ensure this points to your updated prisma.js
import bcrypt from 'bcryptjs';

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    console.log("🧹 Cleaning up old data...");
    
    // Order matters because of Foreign Key constraints (Children first, then Parents)
    await prisma.tournamentResult.deleteMany();
    await prisma.courseEnrollment.deleteMany();
    await prisma.registration.deleteMany();
    await prisma.gallery.deleteMany();
    await prisma.tournament.deleteMany();
    await prisma.event.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.course.deleteMany();
    await prisma.demoRegistration.deleteMany();
    
    console.log("✅ Cleanup complete.");

    console.log("🔐 Hashing admin password...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Using upsert ensures we don't create duplicate admins if run twice
    await prisma.admin.upsert({
      where: { username: "sakshi_admin" },
      update: { passwordHash: hashedPassword },
      create: {
        username: "sakshi_admin",
        passwordHash: hashedPassword, 
      },
    });
    console.log("✅ Admin user created: sakshi_admin");

    console.log("🏆 Seeding sample tournament...");
    await prisma.tournament.create({
      data: {
        title: "Academy Grandmaster Open",
        description: "The primary tournament for Unique Chess Academy students.",
        date: new Date("2026-06-15T10:00:00Z"),
        location: "Main Hall, Academy Campus",
        entryFee: 500.0,
        status: "UPCOMING",
      }
    });

    console.log("✨ Seeding finished successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    // Crucial: Always disconnect to close database pools
    await prisma.$disconnect();
  }
}

main();