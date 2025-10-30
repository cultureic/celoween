# New Smart Contract Mainnet Integration Guide

## 🎯 Overview

This guide provides a complete step-by-step process for integrating a new smart contract into the Celo Academy platform with mainnet deployment. Based on the current architecture, here's everything you need to plug a new smart contract that goes to mainnet.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Smart Contract Development](#smart-contract-development) 
3. [Contract Configuration](#contract-configuration)
4. [Frontend Integration](#frontend-integration)
5. [Deployment Scripts](#deployment-scripts)
6. [Testing Strategy](#testing-strategy)
7. [Mainnet Deployment Checklist](#mainnet-deployment-checklist)
8. [Post-Deployment Integration](#post-deployment-integration)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🔧 Prerequisites

### Environment Setup
- Node.js >= 18.18.0
- npm (project uses npm as primary package manager)
- Hardhat development environment
- Access to Celo mainnet RPC
- Sufficient CELO tokens for deployment (minimum 2 CELO recommended)
- CeloScan API key for contract verification

### Required Environment Variables
```bash
# Core blockchain variables
PRIVATE_KEY=your_deployer_private_key_64_chars
CELO_RPC_URL=https://forno.celo.org
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org

# Explorer API keys for verification
CELOSCAN_API_KEY=your_celoscan_api_key
ALFAJORES_CELOSCAN_API_KEY=your_alfajores_celoscan_api_key

# Gas settings (optional)
CELO_GAS_PRICE=500000000
CONFIRMATION_BLOCKS=5
```

---

## 📄 Smart Contract Development

### 1. Contract Structure
Follow the existing pattern from `OptimizedSimpleBadge.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title YourNewContract
 * @dev Description of your contract's purpose
 * Optimized for gas efficiency on Celo mainnet
 */
contract YourNewContract {
    
    // ==== STORAGE OPTIMIZATION ====
    // Use packed structs and mappings for gas efficiency
    
    // ==== EVENTS ====
    // Keep events minimal but informative
    
    // ==== ERRORS ====
    // Use custom errors (gas efficient)
    error YourCustomError();
    
    // ==== FUNCTIONS ====
    // Main contract functionality
    
    // ==== VIEW FUNCTIONS ====
    // Read-only functions for frontend integration
}
```

### 2. Gas Optimization Guidelines
- Use `uint256` for loop counters with `unchecked` blocks
- Pack struct variables to fit in single storage slots
- Use custom errors instead of `require` strings
- Minimize storage writes (SSTORE operations are expensive)
- Use bit manipulation for boolean flags when possible

### 3. Contract Placement
Save your contract in: `contracts/YourNewContract.sol`

---

## ⚙️ Contract Configuration

### 1. Create Configuration File
Create: `lib/contracts/your-new-contract-config.ts`

```typescript
/**
 * Unified Contract Configuration for YourNewContract
 * 
 * This is the SINGLE SOURCE OF TRUTH for all contract interactions.
 * ALL hooks and components must import from this file to ensure consistency.
 */

import { type Address } from 'viem';

// Network-based contract addresses
const YOUR_CONTRACT_ADDRESSES = {
  44787: '0x0000000000000000000000000000000000000000', // Celo Alfajores (placeholder)
  42220: '0x0000000000000000000000000000000000000000', // Celo Mainnet (to be updated after deployment)
} as const;

// Get contract address based on chain ID
function getContractAddressForChain(chainId?: number): Address {
  // Always default to mainnet unless explicitly requesting Alfajores
  const targetChainId = chainId || 42220; // Default to mainnet
  
  const address = YOUR_CONTRACT_ADDRESSES[targetChainId as keyof typeof YOUR_CONTRACT_ADDRESSES];
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    throw new Error(`Contract not deployed on chain ${targetChainId}`);
  }
  
  console.log(`[YOUR CONTRACT CONFIG] Using contract for chain ${targetChainId}:`, address);
  return address as Address;
}

// Contract ABI - only include functions your frontend needs
export const YOUR_CONTRACT_ABI = [
  // Write functions
  {
    type: 'function',
    name: 'yourWriteFunction',
    inputs: [{ name: 'param', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  
  // View functions  
  {
    type: 'function',
    name: 'yourViewFunction',
    inputs: [{ name: 'param', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  
  // Events
  {
    type: 'event',
    name: 'YourEvent',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: true },
    ],
  },
] as const;

// Dynamic contract configuration
export function getYourContractConfig(chainId?: number) {
  const address = getContractAddressForChain(chainId);
  return {
    address,
    abi: YOUR_CONTRACT_ABI,
  } as const;
}

// Helper functions
export function getYourContractAddress(chainId?: number): Address {
  return getContractAddressForChain(chainId);
}

export const CONTRACT_ADDRESSES = YOUR_CONTRACT_ADDRESSES;

// Cache configuration for React Query
export const YOUR_CONTRACT_CACHE_CONFIG = {
  staleTime: 30 * 1000, // 30 seconds
  gcTime: 5 * 60 * 1000, // 5 minutes
  retry: 1,
  retryDelay: 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: true,
  networkMode: 'always',
} as const;

// Gas estimation
export const YOUR_CONTRACT_GAS_ESTIMATES = {
  YOUR_FUNCTION: 100_000n, // Conservative estimate
} as const;

// Export for easy importing
export const YOUR_CONTRACT_CONFIG = getYourContractConfig();
```

### 2. Update Paymaster Configuration (if using sponsored transactions)
Update `lib/paymaster.ts`:

```typescript
// Add your new contract to sponsored contracts
export const PAYMASTER_CONFIGS: Record<number, PaymasterConfig> = {
  // Celo Mainnet
  [celo.id]: {
    chainId: celo.id,
    // ... existing config
    sponsoredContracts: [
      // ... existing contracts
      '0xYOUR_NEW_CONTRACT_ADDRESS' as Address, // Your new contract mainnet address
    ].filter(Boolean) as Address[],
    sponsoredFunctions: [
      // ... existing functions
      '0xYOUR_FUNCTION_SELECTOR', // Your new function selector
    ],
  },
};
```

---

## 🔗 Frontend Integration

### 1. Create React Hooks
Create: `lib/hooks/useYourContract.ts`

```typescript
'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { type Address } from 'viem';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getYourContractConfig,
  YOUR_CONTRACT_CACHE_CONFIG,
} from '@/lib/contracts/your-new-contract-config';

// Force mainnet for all contract interactions
function useContractConfig() {
  return getYourContractConfig(42220); // Always use mainnet
}

// Read hook example
export function useYourContractData(userAddress?: Address, param?: bigint) {
  const { address: contractAddress, abi: contractAbi } = useContractConfig();
  
  return useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'yourViewFunction',
    args: userAddress && param !== undefined ? [userAddress, param] : undefined,
    chainId: 42220, // Force mainnet chain ID
    query: {
      enabled: !!userAddress && param !== undefined,
      ...YOUR_CONTRACT_CACHE_CONFIG,
    },
  });
}

// Write hook example
export function useYourContractWrite() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { address: contractAddress, abi: contractAbi } = useContractConfig();
  const queryClient = useQueryClient();

  const executeFunction = async (param: bigint) => {
    return writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'yourWriteFunction',
      args: [param],
      chainId: 42220, // Force mainnet
    });
  };

  return {
    executeFunction,
    hash,
    error,
    isPending,
  };
}

// Combined hook with status tracking
export function useYourContractWithStatus() {
  const { executeFunction, hash, error, isPending } = useYourContractWrite();
  const { isLoading: isConfirming, isSuccess, error: confirmError } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });

  return {
    executeFunction,
    hash,
    error: error || confirmError,
    isPending,
    isConfirming,
    isSuccess,
  };
}
```

### 2. Create React Components
Create: `components/your-contract/YourContractPanel.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useYourContractData, useYourContractWithStatus } from '@/lib/hooks/useYourContract';
import { useAuth } from '@/hooks/useAuth';
import type { Address } from 'viem';

interface YourContractPanelProps {
  className?: string;
}

export function YourContractPanel({ className = '' }: YourContractPanelProps) {
  const { isAuthenticated, wallet } = useAuth();
  const userAddress = wallet?.address as Address | undefined;
  
  // Read contract data
  const contractData = useYourContractData(userAddress, BigInt(1));
  
  // Write contract functions
  const { executeFunction, hash, error, isPending, isConfirming, isSuccess } = useYourContractWithStatus();
  
  const handleExecute = async () => {
    try {
      await executeFunction(BigInt(123));
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Connect your wallet to interact with the contract
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Your Contract Interface</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display contract data */}
        <div>
          <p className="text-sm font-medium">Contract Data:</p>
          <p className="text-sm text-muted-foreground">
            {contractData.isLoading ? 'Loading...' : contractData.data ? 'True' : 'False'}
          </p>
        </div>

        {/* Transaction success */}
        {isSuccess && hash && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Transaction successful! 
              <a 
                href={`https://celoscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 underline"
              >
                View on Explorer
              </a>
            </p>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ❌ Error: {error.message}
            </p>
          </div>
        )}

        {/* Action button */}
        <Button
          onClick={handleExecute}
          disabled={isPending || isConfirming}
          className="w-full"
        >
          {isPending && 'Signing Transaction...'}
          {isConfirming && 'Confirming on Blockchain...'}
          {!isPending && !isConfirming && 'Execute Function'}
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

## 🚀 Deployment Scripts

### 1. Create Deployment Script
Create: `scripts/deploy-your-contract-mainnet.js`

```javascript
import pkg from "hardhat";
const { ethers } = pkg;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("🚀 Deploying YourNewContract to Celo Mainnet...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Get balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO");
  
  // Safety check for mainnet
  if (parseFloat(ethers.formatEther(balance)) < 1.0) {
    console.error("❌ Insufficient balance for mainnet deployment. Need at least 1 CELO");
    process.exit(1);
  }
  
  // Deploy the contract
  console.log("\n📄 Deploying YourNewContract...");
  
  const YourContract = await ethers.getContractFactory("YourNewContract");
  
  // Constructor parameters (if any)
  const constructorArgs = [
    // Add your constructor arguments here
    // Example: "Initial Value"
  ];
  
  // Get current fee data and set appropriate gas price
  const feeData = await deployer.provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.parseUnits("2", "gwei");
  
  console.log("Using gas price:", ethers.formatUnits(gasPrice, "gwei"), "Gwei");
  
  // Deploy with proper gas settings for mainnet
  const contract = await YourContract.deploy(...constructorArgs, {
    gasLimit: 3000000, // Adjust based on your contract
    gasPrice: gasPrice,
  });
  
  console.log("⏳ Waiting for deployment transaction to be mined...");
  const deployTransaction = contract.deploymentTransaction();
  console.log("Transaction hash:", deployTransaction.hash);
  
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  
  console.log("✅ YourNewContract deployed to:", contractAddress);
  
  // Wait for confirmations
  console.log("⏳ Waiting for confirmations...");
  const receipt = await deployTransaction.wait(5);
  console.log("✅ Transaction confirmed with 5 confirmations");
  
  // Save deployment info
  const deploymentInfo = {
    network: "celo-mainnet",
    chainId: 42220,
    contractName: "YourNewContract",
    address: contractAddress,
    deployer: deployer.address,
    deploymentTx: deployTransaction.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    gasPrice: receipt.gasPrice?.toString() || "N/A",
    deploymentCost: ethers.formatEther(receipt.gasUsed * (receipt.gasPrice || 0n)) + " CELO",
    timestamp: new Date().toISOString(),
    explorerUrl: `https://celoscan.io/address/${contractAddress}`,
    constructorArgs: constructorArgs,
  };
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save deployment info
  const deploymentPath = path.join(deploymentsDir, "your-contract-mainnet.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to:", deploymentPath);
  
  console.log("\n🎉 MAINNET DEPLOYMENT COMPLETE!");
  console.log("================================================");
  console.log("Contract Address:", contractAddress);
  console.log("Network: Celo Mainnet");
  console.log("Chain ID: 42220");
  console.log("Explorer:", `https://celoscan.io/address/${contractAddress}`);
  console.log("Gas Used:", receipt.gasUsed.toString());
  console.log("Deployment Cost:", ethers.formatEther(receipt.gasUsed * (receipt.gasPrice || 0n)), "CELO");
  
  console.log("\n📋 NEXT STEPS:");
  console.log("===============");
  console.log("1. Update your contract configuration:");
  console.log(`   lib/contracts/your-new-contract-config.ts`);
  console.log(`   Replace mainnet address with: ${contractAddress}`);
  console.log("2. Update paymaster configuration (if using sponsored transactions)");
  console.log("3. Verify the contract on CeloScan");
  console.log("4. Test the contract integration");
  console.log("5. Monitor gas costs in production");
  
  // Contract verification reminder
  console.log("\n🔍 Contract Verification:");
  console.log("To verify on CeloScan, run:");
  const verifyArgs = constructorArgs.length > 0 ? ` --constructor-args arguments.js` : '';
  console.log(`npx hardhat verify --network celo ${contractAddress}${verifyArgs}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
```

### 2. Add NPM Scripts
Update `package.json`:

```json
{
  "scripts": {
    // ... existing scripts
    "deploy:your-contract:mainnet": "node scripts/deploy-your-contract-mainnet.js",
    "deploy:your-contract:alfajores": "node scripts/deploy-your-contract-alfajores.js",
    "verify:your-contract:mainnet": "hardhat verify --network celo",
    "verify:your-contract:alfajores": "hardhat verify --network alfajores"
  }
}
```

---

## 🧪 Testing Strategy

### 1. Local Testing
```bash
# Compile contracts
npm run hardhat:compile

# Run contract tests
npm run hardhat:test

# Run specific test
npx hardhat test test/contracts/YourNewContract.test.ts
```

### 2. Alfajores Testing
1. Deploy to Alfajores testnet first
2. Test all contract functions
3. Verify gas costs are reasonable
4. Test frontend integration

### 3. Unit Tests
Create: `test/contracts/YourNewContract.test.ts`

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { YourNewContract } from "../../typechain-types";

describe("YourNewContract", function () {
  let contract: YourNewContract;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    
    const YourContractFactory = await ethers.getContractFactory("YourNewContract");
    contract = await YourContractFactory.deploy(/* constructor args */);
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await contract.getAddress()).to.be.properAddress;
    });
  });

  describe("Core Functionality", function () {
    it("Should execute main function correctly", async function () {
      // Your test logic here
      await expect(contract.yourWriteFunction(123))
        .to.emit(contract, "YourEvent")
        .withArgs(owner.address, 123);
    });

    it("Should read data correctly", async function () {
      const result = await contract.yourViewFunction(user.address);
      expect(result).to.equal(false);
    });
  });

  describe("Gas Optimization", function () {
    it("Should use reasonable gas for main operations", async function () {
      const tx = await contract.yourWriteFunction(123);
      const receipt = await tx.wait();
      
      // Adjust based on your contract's expected gas usage
      expect(receipt?.gasUsed).to.be.below(100000);
    });
  });

  describe("Error Handling", function () {
    it("Should revert with custom error when appropriate", async function () {
      await expect(contract.yourWriteFunction(0))
        .to.be.revertedWithCustomError(contract, "YourCustomError");
    });
  });
});
```

---

## ✅ Mainnet Deployment Checklist

### Pre-Deployment
- [ ] Contract compiled without warnings
- [ ] All unit tests passing
- [ ] Contract tested on Alfajores testnet
- [ ] Frontend integration tested on testnet
- [ ] Gas costs analyzed and optimized
- [ ] Deployer wallet has sufficient CELO (>2 CELO)
- [ ] Environment variables configured
- [ ] CeloScan API key set for verification

### Deployment
- [ ] Run deployment script: `npm run deploy:your-contract:mainnet`
- [ ] Verify transaction on CeloScan
- [ ] Save deployment address and transaction hash
- [ ] Verify contract code: `npm run verify:your-contract:mainnet YOUR_ADDRESS`

### Post-Deployment Verification
- [ ] Contract verified on CeloScan
- [ ] Update contract configuration with mainnet address
- [ ] Update paymaster configuration (if applicable)
- [ ] Test basic contract functions via CeloScan
- [ ] Monitor initial transactions for gas costs

---

## 🔄 Post-Deployment Integration

### 1. Update Contract Configuration
Replace placeholder addresses in `lib/contracts/your-new-contract-config.ts`:

```typescript
const YOUR_CONTRACT_ADDRESSES = {
  44787: '0xYOUR_ALFAJORES_ADDRESS', // If deployed on testnet
  42220: '0xYOUR_MAINNET_ADDRESS',   // Replace with actual mainnet address
} as const;
```

### 2. Update Import Statements
Add to main contract config exports in `lib/contracts/index.ts`:

```typescript
// Export your new contract config
export * from './your-new-contract-config';
```

### 3. Integration in Components
Import and use your new hooks in relevant components:

```typescript
import { YourContractPanel } from '@/components/your-contract/YourContractPanel';
import { useYourContractData } from '@/lib/hooks/useYourContract';

// Use in your page/component
<YourContractPanel className="mb-6" />
```

### 4. Add to Navigation (if needed)
Update navigation files to include routes to your new contract interface.

---

## 📊 Monitoring & Maintenance

### 1. Gas Monitoring
- Monitor transaction costs on mainnet
- Set up alerts for unusual gas usage
- Consider gas optimization if costs exceed 0.1 CELO per transaction

### 2. Contract Health Checks
```typescript
// Add to health check endpoints
export async function checkYourContractHealth() {
  try {
    const config = getYourContractConfig(42220);
    // Test basic contract read operation
    const result = await publicClient.readContract({
      address: config.address,
      abi: config.abi,
      functionName: 'yourViewFunction',
      args: ['0x0000000000000000000000000000000000000000'],
    });
    return { status: 'healthy', result };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}
```

### 3. Error Tracking
- Monitor contract interaction errors
- Set up logging for failed transactions
- Track user adoption and usage patterns

### 4. Upgradability Considerations
- Document contract limitations
- Plan for potential contract upgrades
- Consider proxy patterns for future versions

---

## 🔧 Common Integration Patterns

### Pattern 1: Simple Read/Write Contract
For basic contracts with simple read/write operations, follow the above template exactly.

### Pattern 2: Complex State Management
For contracts with complex state, consider:
- Creating a context provider for global state
- Implementing optimistic updates
- Adding sophisticated caching strategies

### Pattern 3: Multi-Contract Interactions
When your contract interacts with other contracts:
- Create unified hooks that handle multiple contract calls
- Implement transaction batching where possible
- Handle cross-contract dependencies gracefully

---

## 🚨 Security Considerations

1. **Contract Security**
   - Audit contract code thoroughly
   - Use established patterns and avoid experimental features
   - Implement proper access controls

2. **Frontend Security**
   - Validate all user inputs
   - Handle transaction failures gracefully
   - Never expose private keys or sensitive data

3. **Mainnet Safety**
   - Start with small transactions
   - Monitor for unusual activity
   - Have emergency procedures ready

---

## 📚 Resources

- [Celo Developer Documentation](https://docs.celo.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [CeloScan](https://celoscan.io/) - Block explorer
- [Celo Forno RPC](https://docs.celo.org/developer/build-on-celo#forno) - Public RPC endpoints

---

## 🎉 Success Criteria

Your new contract integration is successful when:

✅ Contract deploys successfully to mainnet  
✅ All tests pass  
✅ Frontend correctly interacts with mainnet contract  
✅ Gas costs are reasonable (< 0.1 CELO per transaction)  
✅ Contract is verified on CeloScan  
✅ Error handling works correctly  
✅ Transaction monitoring is in place  
✅ Documentation is updated  

---

*This guide is based on the current Celo Academy architecture and follows established patterns for maximum compatibility and maintainability.*