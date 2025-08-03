const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixPasswords() {
  try {
    console.log('🔧 Fixing admin passwords...');
    
    // Update admin password
    await prisma.$executeRaw`UPDATE "User" SET password = 'admin' WHERE email = 'admin@btd.nl'`;
    console.log('✅ Admin password fixed');
    
    // Update test user password  
    await prisma.$executeRaw`UPDATE "User" SET password = 'user' WHERE email = 'user@btd.nl'`;
    console.log('✅ Test user password fixed');
    
    // Check results
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: ['admin@btd.nl', 'user@btd.nl']
        }
      },
      select: {
        email: true,
        password: true,
        role: true
      }
    });
    
    console.log('\n📋 Updated users:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}): ${user.password}`);
    });
    
    console.log('\n🎉 Passwords fixed! Try logging in now.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPasswords(); 