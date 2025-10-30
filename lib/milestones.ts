export function moduleTokenId(courseSlug: string, moduleIndex: number): bigint {
  // Stable, deterministic token id. Hash to uint256; simplest: pack small ints.
  // tokenId = hash(courseSlug) low 192 bits + moduleIndex
  const h = BigInt('0x' + cryptoHashHex(courseSlug).slice(0, 48)); // 192 bits
  return (h << 8n) + BigInt(moduleIndex); // 8 bits for module index
}

// Tiny, deterministic hash (browser-safe) – NOT crypto-secure, just a stable id.
export function cryptoHashHex(input: string): string {
  let h = 0x811c9dc5; // FNV-1a 32-bit
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16).padStart(8, '0').repeat(6); // expand to 48 hex chars
}

export const CELO_EXPLORER = {
  44787: "https://alfajores.celoscan.io",
  42220: "https://celoscan.io"
} as const;

export function explorerTx(chainId: number, hash: `0x${string}`) {
  return `${CELO_EXPLORER[chainId as keyof typeof CELO_EXPLORER] ?? ""}/tx/${hash}`;
}
