import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎃 Seeding Celoween contest database...');

  // Create test users
  const creator1 = await prisma.user.upsert({
    where: { walletAddress: '0x1234567890123456789012345678901234567890' },
    update: {},
    create: {
      walletAddress: '0x1234567890123456789012345678901234567890',
      displayName: 'Spooky Creator',
      email: 'creator@celoween.com',
    },
  });

  const creator2 = await prisma.user.upsert({
    where: { walletAddress: '0x0987654321098765432109876543210987654321' },
    update: {},
    create: {
      walletAddress: '0x0987654321098765432109876543210987654321',
      displayName: 'Haunted Host',
      email: 'host@celoween.com',
    },
  });

  console.log('✅ Created test users');

  // Create sample contests
  const contest1 = await prisma.contest.upsert({
    where: { slug: 'scariest-song-2025' },
    update: {},
    create: {
      slug: 'scariest-song-2025',
      title: '🎤 Scariest Song Contest',
      description: 'Submit your most spine-chilling Halloween song! The community will vote for the scariest track.',
      category: 'Music',
      coverImageUrl: 'https://via.placeholder.com/800x400?text=Scariest+Song',
      prizeAmount: '100',
      prizeToken: 'cUSD',
      startDate: new Date('2025-10-20'),
      endDate: new Date('2025-10-30'),
      votingEndDate: new Date('2025-10-31'),
      creatorAddress: creator1.walletAddress,
      status: 'ACTIVE',
      rules: '## Rules\n\n1. Submit original or remix Halloween-themed music\n2. Maximum 5 minutes duration\n3. Family-friendly content only\n4. No copyright infringement',
      maxSubmissions: 1,
    },
  });

  const contest2 = await prisma.contest.upsert({
    where: { slug: 'best-costume-design' },
    update: {},
    create: {
      slug: 'best-costume-design',
      title: '👻 Best Costume Design',
      description: 'Show off your most creative Halloween costume! Digital art, photos, or 3D designs welcome.',
      category: 'Visual Art',
      coverImageUrl: 'https://via.placeholder.com/800x400?text=Best+Costume',
      prizeAmount: '75',
      prizeToken: 'cUSD',
      startDate: new Date('2025-10-22'),
      endDate: new Date('2025-10-29'),
      votingEndDate: new Date('2025-10-31'),
      creatorAddress: creator2.walletAddress,
      status: 'ACTIVE',
      rules: '## Rules\n\n1. Submit photos or digital art of costumes\n2. Original designs preferred\n3. Must be Halloween-themed\n4. Vote for the most creative!',
      maxSubmissions: 1,
    },
  });

  const contest3 = await prisma.contest.upsert({
    where: { slug: 'spooky-story-challenge' },
    update: {},
    create: {
      slug: 'spooky-story-challenge',
      title: '📖 Spooky Story Challenge',
      description: 'Write a short horror story (max 500 words) that will send chills down our spines!',
      category: 'Writing',
      coverImageUrl: 'https://via.placeholder.com/800x400?text=Spooky+Story',
      prizeAmount: '50',
      prizeToken: 'CELO',
      startDate: new Date('2025-10-25'),
      endDate: new Date('2025-10-31'),
      votingEndDate: new Date('2025-11-01'),
      creatorAddress: creator1.walletAddress,
      status: 'ACTIVE',
      rules: '## Rules\n\n1. Maximum 500 words\n2. Must be original content\n3. Horror/suspense theme required\n4. PG-13 rating maximum',
      maxSubmissions: 1,
    },
  });

  console.log('✅ Created sample contests');

  // Create sample submissions (for demonstration)
  const submitter1 = await prisma.user.upsert({
    where: { walletAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    update: {},
    create: {
      walletAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      displayName: 'Ghost Producer',
      email: 'ghost@celoween.com',
    },
  });

  const submission1 = await prisma.submission.create({
    data: {
      contestId: contest1.id,
      submitterAddress: submitter1.walletAddress,
      title: 'Midnight Haunting',
      description: 'A dark ambient track with eerie vocals and ghostly soundscapes',
      mediaUrl: 'https://example.com/midnight-haunting.mp3',
      mediaType: 'audio',
      voteCount: 0,
    },
  });

  console.log('✅ Created sample submissions');

  console.log('🎃 Seeding completed successfully!');
  console.log(`
  Created:
  - ${creator1.displayName} (${creator1.walletAddress})
  - ${creator2.displayName} (${creator2.walletAddress})
  - ${submitter1.displayName} (${submitter1.walletAddress})
  
  Contests:
  - ${contest1.title} (${contest1.slug})
  - ${contest2.title} (${contest2.slug})
  - ${contest3.title} (${contest3.slug})
  
  Submissions:
  - ${submission1.title}
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
