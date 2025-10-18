'use client';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@/components/ui/toast';
import { PrivyProvider } from '@privy-io/react-auth';
import { celo } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { wagmiConfig } from '@/lib/wagmi';
import { ZeroDevSmartWalletProvider } from '@/lib/contexts/ZeroDevSmartWalletProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // Privy configuration (following Motus pattern)
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
  const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID; // Optional for v2.16.0

  // ZeroDev Project ID - for now using test project from Motus
  // TODO: Create dedicated Celo Academy ZeroDev project
  const zeroDevProjectId = process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID || 'e46f4ac3-404e-42fc-a3d3-1c75846538a8';

  return (
    <PrivyProvider
      appId={appId}
      clientId={clientId}
      config={{
        loginMethods: ['wallet', 'email'],
        appearance: {
          theme: 'light',
          accentColor: '#FCFF52',
          walletList: ['metamask', 'detected_wallets'],
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        defaultChain: celo, // Celo Mainnet
        supportedChains: [celo], // Only mainnet supported
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <ZeroDevSmartWalletProvider zeroDevProjectId={zeroDevProjectId}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ZeroDevSmartWalletProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}


