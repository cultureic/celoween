import votingContractJson from './voting-contract-abi.json';

export const VOTING_CONTRACT_ABI = votingContractJson.abi as const;

// Contract address - will be set after deployment
export const VOTING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS as `0x${string}` | undefined;

export function getVotingContractConfig() {
  if (!VOTING_CONTRACT_ADDRESS) {
    console.warn('[VOTING CONTRACT] Contract address not configured. Set NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS in .env.local');
  }
  
  return {
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
  };
}
