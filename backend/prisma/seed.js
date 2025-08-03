const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Algemeen' },
    { name: 'Beveiliging' },
    { name: 'Toegangscontrole' },
    { name: 'Cilinders' },
    { name: 'Sleutels' }
  ];
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    });
  }
  console.log('✅ Standaard categorieën toegevoegd');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 