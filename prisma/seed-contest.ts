import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎃 Seeding Celoween contest...');

  // Delete existing contest
  await prisma.contest.deleteMany({});

  // Create or get admin user
  const adminWallet = '0x9f42Caf52783EF12d8174d33c281a850b8eA58aD';
  await prisma.user.upsert({
    where: { walletAddress: adminWallet },
    update: {},
    create: {
      walletAddress: adminWallet,
    },
  });

  // Create single contest
  const contest = await prisma.contest.create({
    data: {
      slug: 'celoween-2025',
      title: 'Celoween Costume Contest 2025',
      description: 'Show off your spookiest, most creative Halloween costume! Win amazing prizes in CELO. Submit your photo, get votes, and become the Celoween champion! 👻🎃',
      category: 'Halloween',
      prizeAmount: '500',
      prizeToken: 'CELO',
      startDate: new Date('2025-10-28T00:00:00Z'),
      endDate: new Date('2025-11-04T23:59:59Z'),
      votingEndDate: new Date('2025-11-11T23:59:59Z'),
      creatorAddress: '0x9f42Caf52783EF12d8174d33c281a850b8eA58aD',
      status: 'ACTIVE',
      rules: 'Submit one photo of yourself in costume. No AI-generated images. Voting starts after submission period ends.',
    },
  });

  console.log('✅ Contest created!');
  console.log('📊 Details:');
  console.log(`   ID: ${contest.id}`);
  console.log(`   Title: ${contest.title}`);
  console.log(`   Status: ${contest.status}`);
  console.log(`   Prize Pool: ${contest.prizePool} CELO`);
  console.log(`   Starts: ${contest.startDate.toISOString()}`);
  console.log(`   Ends: ${contest.endDate.toISOString()}`);
  console.log(`   Voting Ends: ${contest.votingEndDate.toISOString()}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
