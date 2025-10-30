import { abi as MILESTONE_ABI } from "@/lib/abi/MilestoneBadge"; // placeholder ABI
export const MILESTONE_CONTRACT = {
  44787: process.env.NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES || "{{ALFAJORES_BADGE_ADDRESS}}",
  42220: process.env.NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_MAINNET || "{{MAINNET_BADGE_ADDRESS}}",
} as const;

export function getMilestoneAddress(chainId: number): `0x${string}` {
  const addr = (MILESTONE_CONTRACT as any)[chainId];
  if (!addr) throw new Error("Milestone contract no configurado para esta red");
  return addr as `0x${string}`;
}

export const MILESTONE_ABI_JSON = MILESTONE_ABI; // ensure it's exported
