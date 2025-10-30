import { type Address } from 'viem';
import { celoAlfajores, celo } from 'viem/chains';

/**
 * Paymaster configuration for Celo Academy sponsored transactions
 */
export interface PaymasterConfig {
  // Paymaster contract address
  paymasterAddress: Address;
  
  // API endpoint for paymaster service
  paymasterUrl: string;
  
  // Maximum gas limit for sponsored transactions
  maxGasLimit: bigint;
  
  // Supported contract addresses that can be sponsored
  sponsoredContracts: Address[];
  
  // Supported function selectors that can be sponsored
  sponsoredFunctions: string[];
  
  // Chain ID this config is for
  chainId: number;
}

/**
 * Network-specific paymaster configurations
 */
export const PAYMASTER_CONFIGS: Record<number, PaymasterConfig> = {
  // Celo Alfajores Testnet
  [celoAlfajores.id]: {
    chainId: celoAlfajores.id,
    paymasterAddress: process.env.NEXT_PUBLIC_PAYMASTER_ADDRESS_ALFAJORES as Address || '0x0000000000000000000000000000000000000000',
    paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL_ALFAJORES || 'https://api.celo-academy.com/paymaster/alfajores',
    maxGasLimit: 200000n,
    sponsoredContracts: [
      process.env.NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES as Address,
      '0x4193D2f9Bf93495d4665C485A3B8AadAF78CDf29' as Address, // Optimized contract Alfajores
    ].filter(Boolean) as Address[],
    sponsoredFunctions: [
      '0x7b8b9c8d', // claimBadge(uint256,address)
      '0x4e4bfa29', // completeModule(uint256,uint256) 
      '0xa0b8e5f3', // adminMint(address,uint256,uint256) - for certificates
      '0x6339fbaa', // enroll(uint256) - optimized contract function
    ],
  },
  
  // Celo Mainnet
  [celo.id]: {
    chainId: celo.id,
    paymasterAddress: process.env.NEXT_PUBLIC_PAYMASTER_ADDRESS_MAINNET as Address || '0x0000000000000000000000000000000000000000',
    paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL_MAINNET || 'https://api.celo-academy.com/paymaster/mainnet',
    maxGasLimit: 300000n, // Higher limit for mainnet safety
    sponsoredContracts: [
      process.env.NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_MAINNET as Address,
      '0xf8CA094fd88F259Df35e0B8a9f38Df8f4F28F336' as Address, // Optimized contract Mainnet
    ].filter(Boolean) as Address[],
    sponsoredFunctions: [
      '0x7b8b9c8d', // claimBadge(uint256,address)
      '0x4e4bfa29', // completeModule(uint256,uint256) 
      '0xa0b8e5f3', // adminMint(address,uint256,uint256) - for certificates
      '0x6339fbaa', // enroll(uint256) - optimized contract function
    ],
  },
};

/**
 * Get paymaster configuration for a specific chain
 */
export function getPaymasterConfig(chainId: number): PaymasterConfig | null {
  const config = PAYMASTER_CONFIGS[chainId];
  if (!config) {
    console.warn(`[PAYMASTER] No paymaster configuration found for chain ID: ${chainId}`);
    return null;
  }
  console.log(`[PAYMASTER] Using paymaster config for chain ${chainId}:`, {
    paymasterAddress: config.paymasterAddress,
    sponsoredContractsCount: config.sponsoredContracts.length,
    maxGasLimit: config.maxGasLimit.toString(),
  });
  return config;
}

/**
 * Default paymaster configuration (always mainnet)
 */
export const DEFAULT_PAYMASTER_CONFIG = PAYMASTER_CONFIGS[celo.id];

/**
 * Check if a transaction can be sponsored
 */
export function canSponsorTransaction(
  to: Address,
  data: `0x${string}`,
  chainId?: number,
  config?: PaymasterConfig
): boolean {
  // Get config for the specific chain if not provided
  const paymasterConfig = config || (chainId ? getPaymasterConfig(chainId) : DEFAULT_PAYMASTER_CONFIG);
  if (!paymasterConfig) {
    console.log('[PAYMASTER] No paymaster config available for chain:', chainId);
    return false;
  }
  // Check if the contract address is whitelisted
  if (!paymasterConfig.sponsoredContracts.includes(to)) {
    console.log('[PAYMASTER] Contract not sponsored:', to, 'on chain', paymasterConfig.chainId);
    return false;
  }
  
  // Check if the function selector is whitelisted
  const functionSelector = data.slice(0, 10);
  if (!paymasterConfig.sponsoredFunctions.includes(functionSelector)) {
    console.log('[PAYMASTER] Function not sponsored:', functionSelector, 'on chain', paymasterConfig.chainId);
    return false;
  }
  
  console.log('[PAYMASTER] ✅ Transaction can be sponsored on chain', paymasterConfig.chainId);
  return true;
}

/**
 * Get paymaster data for a sponsored transaction
 * In a real implementation, this would call your paymaster service
 */
export async function getPaymasterData(
  to: Address,
  data: `0x${string}`,
  userAddress: Address,
  chainId?: number,
  config?: PaymasterConfig
): Promise<{
  paymasterAndData: `0x${string}`;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
} | null> {
  
  // Get config for the specific chain
  const paymasterConfig = config || (chainId ? getPaymasterConfig(chainId) : DEFAULT_PAYMASTER_CONFIG);
  if (!paymasterConfig || !canSponsorTransaction(to, data, chainId, paymasterConfig)) {
    return null;
  }
  
  try {
    console.log('[PAYMASTER] Getting paymaster data for sponsored transaction:', {
      to,
      data: data.slice(0, 10),
      user: userAddress,
    });
    
    // In a real implementation, you would call your paymaster service:
    /*
    const response = await fetch(`${config.paymasterUrl}/sponsor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAYMASTER_API_KEY}`,
      },
      body: JSON.stringify({
        to,
        data,
        userAddress,
        chainId: paymasterConfig.chainId,
      }),
    });
    
    const result = await response.json();
    return result;
    */
    
    // For demo purposes, return mock paymaster data
    // In production, this would come from your paymaster service
    return {
      paymasterAndData: `${paymasterConfig.paymasterAddress}${'0'.repeat(128)}` as `0x${string}`,
      callGasLimit: 100000n,
      verificationGasLimit: 50000n,
      preVerificationGas: 21000n,
    };
    
  } catch (error) {
    console.error('[PAYMASTER] Failed to get paymaster data:', error);
    return null;
  }
}

/**
 * Estimate gas for a sponsored transaction
 */
export async function estimateSponsoredGas(
  to: Address,
  data: `0x${string}`,
  userAddress: Address
): Promise<{
  gasLimit: bigint;
  gasPrice: bigint;
} | null> {
  try {
    // For Celo, gas is very cheap, so we can use fixed estimates
    // In production, you might want to use actual gas estimation
    
    const baseGas = 21000n; // Base transaction cost
    const callDataGas = BigInt(data.length * 16); // Rough estimate for calldata
    const contractCallGas = 50000n; // Estimate for contract call
    
    const gasLimit = baseGas + callDataGas + contractCallGas;
    const gasPrice = 500000000n; // 0.5 Gwei - typical for Celo Alfajores
    
    console.log('[PAYMASTER] Gas estimation:', {
      gasLimit: gasLimit.toString(),
      gasPrice: gasPrice.toString(),
      estimatedCost: ((gasLimit * gasPrice) / 10n**18n).toString() + ' CELO',
    });
    
    return {
      gasLimit,
      gasPrice,
    };
    
  } catch (error) {
    console.error('[PAYMASTER] Gas estimation failed:', error);
    return null;
  }
}

/**
 * Environment variables for paymaster configuration
 */
export const PAYMASTER_ENV = {
  PAYMASTER_ADDRESS: process.env.NEXT_PUBLIC_PAYMASTER_ADDRESS,
  PAYMASTER_URL: process.env.NEXT_PUBLIC_PAYMASTER_URL,
  PAYMASTER_API_KEY: process.env.PAYMASTER_API_KEY, // Server-side only
} as const;

/**
 * Validate paymaster environment configuration
 */
export function validatePaymasterConfig(): boolean {
  const required = [
    'NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES',
  ];
  
  const optional = [
    'NEXT_PUBLIC_PAYMASTER_ADDRESS',
    'NEXT_PUBLIC_PAYMASTER_URL',
  ];
  
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`[PAYMASTER] Missing required environment variable: ${key}`);
      return false;
    }
  }
  
  for (const key of optional) {
    if (!process.env[key]) {
      console.warn(`[PAYMASTER] Optional environment variable not set: ${key}`);
    }
  }
  
  return true;
}