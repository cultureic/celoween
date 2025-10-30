'use client';

import { createContext, useContext, ReactNode } from 'react';

interface ZeroDevContextType {
  zeroDevProjectId: string;
}

const ZeroDevContext = createContext<ZeroDevContextType | undefined>(undefined);

export function ZeroDevSmartWalletProvider({
  children,
  zeroDevProjectId,
}: {
  children: ReactNode;
  zeroDevProjectId: string;
}) {
  return (
    <ZeroDevContext.Provider value={{ zeroDevProjectId }}>
      {children}
    </ZeroDevContext.Provider>
  );
}

export function useZeroDevSmartWallet() {
  const context = useContext(ZeroDevContext);
  if (context === undefined) {
    throw new Error('useZeroDevSmartWallet must be used within ZeroDevSmartWalletProvider');
  }
  return context;
}
