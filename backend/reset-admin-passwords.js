const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetAdminPasswords() {
  try {
    console.log('🔄 Resetting admin passwords...');

    // Reset admin user password
    await prisma.user.update({
      where: { email: 'admin@btd.nl' },
      data: {
        password: 'admin',
        name: 'Admin',
        role: 'admin'
      }
    });
    console.log('✅ Admin password reset to: admin');

    // Reset test user password
    await prisma.user.update({
      where: { email: 'user@btd.nl' },
      data: {
        password: 'user',
        name: 'Test User',
        role: 'user'
      }
    });
    console.log('✅ Test user password reset to: user');

    // Show all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    });

    console.log('\n📋 Current users in database:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}): ${user.password}`);
    });

    console.log('\n🎉 Password reset complete!');
    console.log('You can now login with:');
    console.log('- admin@btd.nl / admin');
    console.log('- user@btd.nl / user');

  } catch (error) {
    console.error('❌ Error resetting passwords:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPasswords(); 