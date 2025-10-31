import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixMetadataFormat() {
  try {
    console.log('🔄 Fixing metadata format for smart contract submissions...');
    
    // Get all submissions
    const allSubmissions = await prisma.submission.findMany({
      select: {
        id: true,
        title: true,
        metadata: true,
      },
    });
    
    let fixedCount = 0;
    
    for (const sub of allSubmissions) {
      if (!sub.metadata) continue;
      
      try {
        const meta = JSON.parse(sub.metadata);
        
        // Check if this is a smart contract submission with metadataURI
        if (meta.metadataURI && !meta.stateTag) {
          // Parse the metadataURI to extract stateTag
          const innerMeta = JSON.parse(meta.metadataURI);
          
          if (innerMeta.stateTag) {
            // Add stateTag to the outer metadata
            meta.stateTag = innerMeta.stateTag;
            
            await prisma.submission.update({
              where: { id: sub.id },
              data: { metadata: JSON.stringify(meta) },
            });
            
            console.log(`✅ Fixed "${sub.title}": extracted stateTag = ${innerMeta.stateTag}`);
            fixedCount++;
          }
        }
      } catch (e) {
        console.warn(`⚠️  Could not parse metadata for "${sub.title}":`, e.message);
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} submissions`);
    
    // Verify the results
    console.log('\n📊 Current state:');
    const updatedSubmissions = await prisma.submission.findMany({
      select: {
        id: true,
        title: true,
        metadata: true,
      },
    });
    
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
    console.error('❌ Error fixing metadata:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixMetadataFormat();
