require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Initialize database with seed data
async function initializeDatabase() {
  try {
    // Always update admin user (create if doesn't exist)
    await prisma.user.upsert({
      where: { email: 'admin@btd.nl' },
      update: {
        password: 'admin',
        name: 'Admin',
        role: 'admin'
      },
      create: {
        email: 'admin@btd.nl',
        password: 'admin',
        role: 'admin',
        name: 'Admin'
      }
    });
    console.log('✅ Admin user updated/created');

    // Always update test user (create if doesn't exist)
    await prisma.user.upsert({
      where: { email: 'user@btd.nl' },
      update: {
        password: 'user',
        name: 'Test User',
        role: 'user'
      },
      create: {
        email: 'user@btd.nl',
        password: 'user',
        role: 'user',
        name: 'Test User'
      }
    });
    console.log('✅ Test user updated/created');

    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

module.exports = {
  prisma,
  testConnection,
  initializeDatabase
}; 