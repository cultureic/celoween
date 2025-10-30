import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAdminData() {
  try {
    console.log('🌱 Seeding admin data...');

    // Create categories
    const categories = [
      { name: 'Blockchain Basics', slug: 'blockchain-basics' },
      { name: 'Smart Contracts', slug: 'smart-contracts' },
      { name: 'DeFi', slug: 'defi' },
      { name: 'NFTs', slug: 'nfts' },
      { name: 'Web3 Development', slug: 'web3-development' },
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: {
          id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: category.name,
          slug: category.slug,
          updatedAt: new Date(),
        },
      });
    }

    // Create levels
    const levels = [
      { name: 'Principiante', slug: 'principiante' },
      { name: 'Intermedio', slug: 'intermedio' },
      { name: 'Avanzado', slug: 'avanzado' },
    ];

    for (const level of levels) {
      await prisma.level.upsert({
        where: { slug: level.slug },
        update: {},
        create: {
          id: `lvl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: level.name,
          slug: level.slug,
          updatedAt: new Date(),
        },
      });
    }

    // Create instructors
    const instructors = [
      {
        name: 'Cesar Angulo',
        bio: 'Blockchain developer and educator with expertise in Celo ecosystem',
        avatarUrl: 'https://via.placeholder.com/150',
      },
      {
        name: 'Maria Rodriguez',
        bio: 'Smart contract developer and DeFi expert',
        avatarUrl: 'https://via.placeholder.com/150',
      },
      {
        name: 'Juan Carlos',
        bio: 'Web3 frontend developer specializing in React and blockchain integration',
        avatarUrl: 'https://via.placeholder.com/150',
      },
    ];

    for (const instructor of instructors) {
      const existing = await prisma.instructor.findFirst({
        where: { name: instructor.name },
      });
      
      if (!existing) {
        await prisma.instructor.create({
          data: {
            id: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: instructor.name,
            bio: instructor.bio,
            avatarUrl: instructor.avatarUrl,
            updatedAt: new Date(),
          },
        });
      }
    }

    console.log('✅ Admin data seeded successfully!');
    console.log(`Created ${categories.length} categories, ${levels.length} levels, and ${instructors.length} instructors`);
  } catch (error) {
    console.error('❌ Error seeding admin data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedAdminData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });