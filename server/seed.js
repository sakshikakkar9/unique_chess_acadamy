import prisma from './lib/prisma.js'; // Adjust path as needed
import bcrypt from 'bcrypt';

const seedAdmin = async () => {
  try {
    const username = 'superadmin';
    const password = 'supersecretpassword123';

    // Hash the password exactly like your service does
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the admin directly in the database
    await prisma.admin.create({
      data: { 
        username, 
        passwordHash 
      },
    });

    console.log('First admin seeded successfully!');
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdmin();