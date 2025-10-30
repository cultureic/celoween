import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎃 Verifying Celoween Database Connection...\n');
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');
    
    // Check tables
    console.log('📊 Checking tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    console.log('Tables found:', tables);
    console.log('\n✅ Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
