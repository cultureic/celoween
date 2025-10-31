"use client";

import { useEffect } from 'react';

export function useFarcasterSDK() {
  useEffect(() => {
    // Check if running in Farcaster context
    if (typeof window !== 'undefined') {
      const sdk = (window as any).sdk;
      
      if (sdk?.actions?.ready) {
        console.log('[Farcaster SDK] Calling ready()');
        sdk.actions.ready();
      } else {
        console.log('[Farcaster SDK] Not in Farcaster context or SDK not available');
      }
    }
  }, []);
}
