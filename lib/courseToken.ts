// Shared course token logic (server-safe)
// No React hooks or client-only imports allowed here.

// Legacy course mapping for backward compatibility
// These courses will keep their hardcoded token IDs
export const LEGACY_COURSE_TOKEN_IDS = {
  'desarrollo-dapps': 1n,
  'defi-fundamentals': 2n,
  'nft-development': 3n,
  'web3-security': 4n,
} as const;

/**
 * Generate a token ID from a course database ID
 * Converts string CUID to a numeric token ID for smart contract
 */
export function generateTokenIdFromCourseId(courseId: string): bigint {
  // Take the last 8 characters of the course ID and convert to number
  const suffix = courseId.slice(-8);
  let hash = 0;
  
  // Create a simple hash from the suffix
  for (let i = 0; i < suffix.length; i++) {
    const char = suffix.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Ensure positive number and add offset to avoid conflicts with legacy IDs
  const tokenId = Math.abs(hash % 1000000) + 100; // Keep it reasonable for smart contracts
  return BigInt(tokenId);
}

/**
 * Get token ID for a course - checks legacy mapping first, then generates from course ID
 */
export function getCourseTokenId(courseSlug: string, courseId?: string): bigint {
  // Check legacy mapping first
  const legacyTokenId = LEGACY_COURSE_TOKEN_IDS[courseSlug as keyof typeof LEGACY_COURSE_TOKEN_IDS];
  if (legacyTokenId) {
    return legacyTokenId;
  }
  
  // Generate dynamic token ID from course database ID
  if (courseId) {
    return generateTokenIdFromCourseId(courseId);
  }
  
  // Fallback: generate from slug hash (less ideal but works)
  let hash = 0;
  for (let i = 0; i < courseSlug.length; i++) {
    const char = courseSlug.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const tokenId = Math.abs(hash % 1000000) + 1000; // Different offset for slug-based IDs
  return BigInt(tokenId);
}