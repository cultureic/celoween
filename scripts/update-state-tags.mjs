import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateStateTags() {
  try {
    console.log('🔄 Updating submissions to add stateTag to metadata...');
    
    // Get all submissions
    const allSubmissions = await prisma.submission.findMany({
      select: {
        id: true,
        title: true,
        metadata: true,
      },
    });
    
    let updateCount = 0;
    
    // Update each submission's metadata
    for (const sub of allSubmissions) {
      let metadataObj = {};
      try {
        metadataObj = sub.metadata ? JSON.parse(sub.metadata) : {};
      } catch {
        metadataObj = {};
      }
      
      // Only update if stateTag doesn't exist
      if (!metadataObj.stateTag) {
        metadataObj.stateTag = 'SINALOA';
        
        await prisma.submission.update({
          where: { id: sub.id },
          data: { metadata: JSON.stringify(metadataObj) },
        });
        
        updateCount++;
      }
    }
    
    console.log(`✅ Updated ${updateCount} submissions with SINALOA tag`);
    
    // Verify the update
    const updatedSubmissions = await prisma.submission.findMany({
      select: {
        id: true,
        title: true,
        metadata: true,
      },
    });
    
    console.log('\n📊 All submissions:');
    const byState = {};
    
    updatedSubmissions.forEach(sub => {
      let stateTag = '(no tag)';
      try {
        const meta = sub.metadata ? JSON.parse(sub.metadata) : {};
        stateTag = meta.stateTag || '(no tag)';
      } catch {}
      
      console.log(`  - ${sub.title}: ${stateTag}`);
      
      byState[stateTag] = (byState[stateTag] || 0) + 1;
    });
    
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
