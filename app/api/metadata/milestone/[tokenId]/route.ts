import { NextRequest, NextResponse } from 'next/server';
import { LEGACY_COURSE_TOKEN_IDS, getCourseTokenId } from '@/lib/courseToken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Course metadata for each token ID
const COURSE_METADATA: Record<string, {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}> = {
  '1': {
    name: 'Desarrollo de DApps - Badge de Inscripción',
    description: 'Badge otorgado por inscribirse al curso de Desarrollo de Aplicaciones Descentralizadas (DApps) en el ecosistema Celo.',
    image: 'https://academy.celo.org/images/badges/desarrollo-dapps.png',
    external_url: 'https://academy.celo.org/academy/desarrollo-dapps',
    attributes: [
      {
        trait_type: 'Course',
        value: 'Desarrollo de DApps'
      },
      {
        trait_type: 'Level',
        value: 'Principiante'
      },
      {
        trait_type: 'Blockchain',
        value: 'Celo'
      },
      {
        trait_type: 'Category',
        value: 'Desarrollo'
      },
      {
        trait_type: 'Badge Type',
        value: 'Enrollment'
      }
    ]
  },
  '2': {
    name: 'DeFi Fundamentals - Badge de Inscripción',
    description: 'Badge otorgado por inscribirse al curso de Fundamentos de Finanzas Descentralizadas (DeFi).',
    image: 'https://academy.celo.org/images/badges/defi-fundamentals.png',
    external_url: 'https://academy.celo.org/academy/defi-fundamentals',
    attributes: [
      {
        trait_type: 'Course',
        value: 'DeFi Fundamentals'
      },
      {
        trait_type: 'Level',
        value: 'Intermedio'
      },
      {
        trait_type: 'Blockchain',
        value: 'Celo'
      },
      {
        trait_type: 'Category',
        value: 'DeFi'
      },
      {
        trait_type: 'Badge Type',
        value: 'Enrollment'
      }
    ]
  },
  '3': {
    name: 'NFT Development - Badge de Inscripción', 
    description: 'Badge otorgado por inscribirse al curso de Desarrollo de NFTs (Tokens No Fungibles).',
    image: 'https://academy.celo.org/images/badges/nft-development.png',
    external_url: 'https://academy.celo.org/academy/nft-development',
    attributes: [
      {
        trait_type: 'Course',
        value: 'NFT Development'
      },
      {
        trait_type: 'Level',
        value: 'Avanzado'
      },
      {
        trait_type: 'Blockchain',
        value: 'Celo'
      },
      {
        trait_type: 'Category',
        value: 'NFTs'
      },
      {
        trait_type: 'Badge Type',
        value: 'Enrollment'
      }
    ]
  },
  '4': {
    name: 'Web3 Security - Badge de Inscripción',
    description: 'Badge otorgado por inscribirse al curso de Seguridad en Web3 y Blockchain.',
    image: 'https://academy.celo.org/images/badges/web3-security.png',
    external_url: 'https://academy.celo.org/academy/web3-security',
    attributes: [
      {
        trait_type: 'Course',
        value: 'Web3 Security'
      },
      {
        trait_type: 'Level',
        value: 'Avanzado'
      },
      {
        trait_type: 'Blockchain',
        value: 'Celo'
      },
      {
        trait_type: 'Category',
        value: 'Seguridad'
      },
      {
        trait_type: 'Badge Type',
        value: 'Enrollment'
      }
    ]
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params;

    // Validate token ID
    if (!tokenId || !/^\d+$/.test(tokenId)) {
      return NextResponse.json(
        { error: 'Invalid token ID' },
        { status: 400 }
      );
    }

    const tokenIdBigInt = BigInt(tokenId);

    // First check static metadata
    const staticMetadata = COURSE_METADATA[tokenId];
    if (staticMetadata) {
      return NextResponse.json(staticMetadata, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // Try to find course dynamically
    let course = null;

    // Check legacy courses first
    for (const [slug, legacyTokenId] of Object.entries(LEGACY_COURSE_TOKEN_IDS)) {
      if (legacyTokenId === tokenIdBigInt) {
        course = await prisma.course.findUnique({
          where: { slug },
          select: { id: true, slug: true, title: true, subtitle: true }
        });
        break;
      }
    }

    // If not found in legacy, search all courses to find matching generated token ID
    if (!course) {
      const allCourses = await prisma.course.findMany({
        where: { status: 'PUBLISHED' },
        select: { id: true, slug: true, title: true, subtitle: true }
      });
      
      for (const dbCourse of allCourses) {
        const generatedTokenId = getCourseTokenId(dbCourse.slug, dbCourse.id);
        if (generatedTokenId === tokenIdBigInt) {
          course = dbCourse;
          break;
        }
      }
    }

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found for token ID' },
        { status: 404 }
      );
    }

    // Generate dynamic metadata
    const dynamicMetadata = {
      name: `${course.title} - Badge de Inscripción`,
      description: `Badge otorgado por inscribirse al curso "${course.title}"${course.subtitle ? `: ${course.subtitle}` : ''}.`,
      image: `https://academy.celo.org/images/badges/${course.slug}.png`,
      external_url: `https://academy.celo.org/academy/${course.slug}`,
      attributes: [
        {
          trait_type: 'Course',
          value: course.title
        },
        {
          trait_type: 'Blockchain',
          value: 'Celo'
        },
        {
          trait_type: 'Badge Type',
          value: 'Enrollment'
        },
        {
          trait_type: 'Token ID',
          value: tokenId
        }
      ]
    };

    return NextResponse.json(dynamicMetadata, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour (shorter for dynamic)
      },
    });

  } catch (error) {
    console.error('Error serving metadata:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Also handle POST requests for dynamic metadata updates (optional)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  // This could be used for updating metadata dynamically
  // For now, return method not allowed
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}