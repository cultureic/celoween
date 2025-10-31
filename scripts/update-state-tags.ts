import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateStateTags() {
  try {
    console.log('🔄 Updating submissions without stateTag...');
    
    const result = await prisma.submission.updateMany({
      where: {
        OR: [
          { stateTag: null },
          { stateTag: '' },
        ]
      },
      data: {
        stateTag: 'SINALOA',
      },
    });
    
    console.log(`✅ Updated ${result.count} submissions with SINALOA tag`);
    
    // Verify the update
    const allSubmissions = await prisma.submission.findMany({
      select: {
        id: true,
        title: true,
        stateTag: true,
      },
    });
    
    console.log('\n📊 All submissions:');
    allSubmissions.forEach(sub => {
      console.log(`  - ${sub.title}: ${sub.stateTag || '(no tag)'}`);
    });
    
    // Count by state
    const byState = allSubmissions.reduce((acc, sub) => {
      const tag = sub.stateTag || 'NO_TAG';
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📍 Submissions by state:');
    Object.entries(byState).forEach(([state, count]) => {
      console.log(`  ${state}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating state tags:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateStateTags();
