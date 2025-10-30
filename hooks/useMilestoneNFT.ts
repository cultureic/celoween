"use client";
import { useState } from "react";

// Mock version for demo purposes - no on-chain functionality
export function useMilestoneNFT() {
  const [mockAddress] = useState("0x1234...5678");
  const [mockChainId] = useState(44787); // Alfajores testnet

  async function hasBadge(tokenId: bigint): Promise<boolean> {
    // Mock: simulate some badges being owned
    const mockOwnedBadges = [1n, 3n, 5n]; // Mock badges that user "owns"
    return mockOwnedBadges.includes(tokenId);
  }

  async function claimBadge(tokenId: bigint): Promise<{ hash: `0x${string}`, url?: string }> {
    // Mock: simulate a transaction hash
    const mockHash = `0x${Math.random().toString(16).substring(2, 66)}` as `0x${string}`;
    const mockUrl = `https://alfajores.celoscan.io/tx/${mockHash}`;
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { hash: mockHash, url: mockUrl };
  }

  return { hasBadge, claimBadge };
}
