import prisma from '../lib/prisma.js'; 
import bcrypt from 'bcryptjs';

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    console.log("🧹 Cleaning up old data...");
    
    // ✅ Use exact casing from your schema.prisma
    // If the model is 'TournamentResult', use prisma.tournamentResult
    // If the model is 'Admin', use prisma.admin
    
    await prisma.tournamentResult.deleteMany();
    await prisma.registration.deleteMany();
    await prisma.gallery.deleteMany();
    await prisma.tournament.deleteMany();
    await prisma.event.deleteMany();
    await prisma.admin.deleteMany();
    
    console.log("✅ Cleanup complete.");

    console.log("🔐 Hashing admin password...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    await prisma.admin.create({
      data: {
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
  }
}

main();