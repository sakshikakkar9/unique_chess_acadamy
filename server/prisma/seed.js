import 'dotenv/config';
import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. CLEANUP
  console.log('🧹 Cleaning up old data...');
  try {
    // Delete in order of dependency (results first)
    await prisma.tournamentResult.deleteMany();
    await prisma.tournament.deleteMany();
    await prisma.event.deleteMany();
    await prisma.gallery.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.admin.deleteMany();
  } catch (err) {
    console.log('⚠️ Cleanup skipped or failed:', err.message);
  }

  // 2. SEED ADMIN
  const hashedAdminPassword = await bcrypt.hash('supersecretpassword123', 10);
  await prisma.admin.create({
    data: {
      username: 'sakshi_admin',
      passwordHash: hashedAdminPassword, // Fixed: Aligned with schema
    },
  });
  console.log('✅ Admin user created: sakshi_admin');

  // 3. SEED EVENTS
  console.log('📅 Seeding events...');
  await prisma.event.createMany({
    data: [
      {
        title: "Weekly Group Class",
        date: new Date("2026-05-02T10:00:00Z"),
        location: "Online",
        category: "CLASS", // Fixed: Matches Enum
      },
      {
        title: "Tactical Workshop",
        date: new Date("2026-05-05T14:00:00Z"),
        location: "Mumbai Center",
        category: "WORKSHOP", // Fixed: Matches Enum
      }
    ],
  });

  // 4. SEED TOURNAMENTS
  console.log('🏆 Seeding tournaments...');
  const tournament = await prisma.tournament.create({
    data: {
      title: "National Junior Championship 2026",
      location: "Mumbai",
      date: new Date("2026-06-15T09:00:00Z"),
      status: "UPCOMING", // Fixed: Matches Enum
      entryFee: 500.0,
    },
  });

  // 5. SEED GALLERY
  console.log('🖼️ Seeding gallery...');
  await prisma.gallery.createMany({
    data: [
      { 
        imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b", // Fixed: Aligned with schema
        caption: "Academy Session", 
        category: "ACADEMY" 
      },
      { 
        imageUrl: "https://images.unsplash.com/photo-1586165368502-1bad197a6461", // Fixed: Aligned with schema
        caption: "Training", 
        category: "TRAINING" 
      }
    ],
  });

  console.log('🚀 Database Seeding Completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });