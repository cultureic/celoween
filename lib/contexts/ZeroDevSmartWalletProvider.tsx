'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { createPublicClient, createWalletClient, http, custom } from "viem";
import {
  createZeroDevPaymasterClient,
  createKernelAccount,
  createKernelAccountClient,
} from "@zerodev/sdk";
import { getEntryPoint, KERNEL_V3_1 } from '@zerodev/sdk/constants';
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { celo } from "viem/chains";
import { useChainId } from 'wagmi';

// FORCE MAINNET: Always use Celo mainnet for all smart wallet operations
const FORCED_CHAIN = celo;

type SmartWalletContextType = {
  kernelClient: any; // KernelAccountClient from ZeroDev SDK
  smartAccountAddress: `0x${string}` | null;
  isInitializing: boolean;
  isCreatingSmartAccount: boolean; // Alias for compatibility
  isSmartAccountReady: boolean;
  canSponsorTransaction: boolean;
  error: string | null; // Changed to string for React compatibility
  isLoading: boolean; // Added for compatibility
  executeTransaction: (params: {
    to: `0x${string}`;
    data: `0x${string}`;
    value?: bigint;
  }) => Promise<`0x${string}` | null>;
};

const SmartWalletContext = createContext<SmartWalletContextType>({
  kernelClient: null,
  smartAccountAddress: null,
  isInitializing: false,
  isCreatingSmartAccount: false,
  isSmartAccountReady: false,
  canSponsorTransaction: false,
  error: null,
  isLoading: false,
  executeTransaction: async () => null,
});

export const ZeroDevSmartWalletProvider = ({
  children,
  zeroDevProjectId = process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID || "e46f4ac3-404e-42fc-a3d3-1c75846538a8",
}: {
  children: React.ReactNode;
  zeroDevProjectId?: string;
}) => {
  console.log('[ZERODEV] Provider initialized with project ID:', zeroDevProjectId);
  const { wallets } = useWallets();
  const { authenticated } = usePrivy();
  const [kernelClient, setKernelClient] = useState<any>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<
    `0x${string}` | null
  >(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  console.log('[ZERODEV] Using FORCED mainnet chain:', FORCED_CHAIN.name, 'ID:', FORCED_CHAIN.id);

  const executeTransaction = async (params: {
    to: `0x${string}`;
    data: `0x${string}`;
    value?: bigint;
  }): Promise<`0x${string}` | null> => {
    if (!kernelClient) {
      console.error('[ZERODEV] Kernel client not ready');
      return null;
    }

    try {
      console.log('[ZERODEV] Executing sponsored transaction:', {
        to: params.to,
        data: params.data.slice(0, 10) + '...',
        value: params.value?.toString() || '0',
      });

      // Use ZeroDev's sendTransaction which handles paymaster automatically
      const hash = await kernelClient.sendTransaction({
        to: params.to,
        data: params.data,
        value: params.value || 0n,
      });

      console.log('[ZERODEV] Transaction sent:', hash);
      return hash;
    } catch (error) {
      console.error('[ZERODEV] Transaction failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeSmartWallet = async () => {
      if (!authenticated || !wallets || wallets.length === 0) {
        setKernelClient(null);
        setSmartAccountAddress(null);
        setIsInitializing(false);
        return;
      }

      try {
        setIsInitializing(true);
        setError(null);
        console.log('[ZERODEV] Initializing smart wallet with wallets:', wallets.length);
        
        // Get EntryPoint v0.7 from ZeroDev SDK
        const entryPoint = getEntryPoint('0.7');
        
        // Look for either embedded wallet (email login) or connected wallet (MetaMask login)
        const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
        const connectedWallet = wallets.find((wallet) => wallet.walletClientType !== 'privy');
        
        const walletToUse = embeddedWallet || connectedWallet;
        if (!walletToUse) {
          console.log('[ZERODEV] No wallet found for smart account creation');
          setIsInitializing(false);
          return;
        }
        
        console.log('[ZERODEV] Found wallet:', {
          address: walletToUse.address,
          type: walletToUse.walletClientType,
          isEmbedded: !!embeddedWallet,
          isConnected: !!connectedWallet
        });
        
        // Get the EIP1193 provider from the selected wallet
        const provider = await walletToUse.getEthereumProvider();
        if (!provider) {
          throw new Error('Failed to get Ethereum provider from wallet');
        }

        console.log('[ZERODEV] Creating ECDSA Kernel smart account...');
        
        // Create public client for blockchain interactions
        const publicClient = createPublicClient({
          chain: FORCED_CHAIN,
          transport: http(),
        });
        
        // Create wallet client from the EIP-1193 provider
        const walletClient = createWalletClient({
          chain: FORCED_CHAIN,
          transport: custom(provider),
        });
        
        console.log('[ZERODEV] Creating ECDSA validator...');
        
        // Create ECDSA validator using ZeroDev SDK
        const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
          signer: walletClient as any, // Type assertion for compatibility
          entryPoint: entryPoint,
          kernelVersion: KERNEL_V3_1,
        });
        
        console.log('[ZERODEV] Creating Kernel account...');
        
        // Create Kernel account using ZeroDev SDK with proper version for EntryPoint v0.7
        const account = await createKernelAccount(publicClient, {
          plugins: {
            sudo: ecdsaValidator,
          },
          entryPoint: entryPoint,
          kernelVersion: KERNEL_V3_1,
        });

        console.log('[ZERODEV] Created smart account:', account.address);

        const bundlerUrl = `https://rpc.zerodev.app/api/v3/${zeroDevProjectId}/chain/${FORCED_CHAIN.id}`;
        const paymasterUrl = `https://rpc.zerodev.app/api/v3/${zeroDevProjectId}/chain/${FORCED_CHAIN.id}`;

        console.log('[ZERODEV] Creating paymaster client...');
        
        // Create paymaster client following ZeroDev docs pattern
        const paymasterClient = createZeroDevPaymasterClient({
          chain: FORCED_CHAIN,
          transport: http(paymasterUrl),
        });
        
        console.log('[ZERODEV] Creating Kernel account client...');
        
        // Create Kernel client using ZeroDev SDK with paymaster
        const client = createKernelAccountClient({
          account,
          chain: FORCED_CHAIN,
          bundlerTransport: http(bundlerUrl),
          paymaster: paymasterClient,
          client: publicClient,
        });
        
        console.log("[ZERODEV] ✅ Smart account client created:", client.account.address);
        console.log("[ZERODEV] Chain ID:", await client.getChainId());

        setKernelClient(client);
        setSmartAccountAddress(account.address);
      } catch (err) {
        console.error("[ZERODEV] ❌ Error initializing smart wallet:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSmartWallet();
  }, [authenticated, wallets, zeroDevProjectId]);

  // Reset state when user logs out
  useEffect(() => {
    if (!authenticated) {
      setKernelClient(null);
      setSmartAccountAddress(null);
      setError(null);
    }
  }, [authenticated]);

  const contextValue: SmartWalletContextType = {
    kernelClient,
    smartAccountAddress,
    isInitializing,
    isCreatingSmartAccount: isInitializing, // Alias for compatibility
    isSmartAccountReady: !!kernelClient && !!smartAccountAddress && !isInitializing,
    canSponsorTransaction: !!kernelClient && !!smartAccountAddress && !isInitializing,
    error,
    isLoading: isInitializing, // Alias for compatibility
    executeTransaction,
  };

  return (
    <SmartWalletContext.Provider value={contextValue}>
      {children}
    </SmartWalletContext.Provider>
  );
};

export const useZeroDevSmartWallet = () => {
  const context = useContext(SmartWalletContext);
  if (context === undefined) {
    throw new Error("useZeroDevSmartWallet must be used within a ZeroDevSmartWalletProvider");
  }
  return context;
};

// Alias for backward compatibility with existing code
export const useSmartAccount = useZeroDevSmartWallet;