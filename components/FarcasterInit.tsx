"use client";

import { useEffect } from 'react';

export default function FarcasterInit() {
  useEffect(() => {
    // Initialize Farcaster SDK when app loads
    if (typeof window !== 'undefined') {
      const sdk = (window as any).sdk;
      
      if (sdk?.actions?.ready) {
        console.log('[Farcaster] SDK ready() called');
        sdk.actions.ready();
      }
    }
  }, []);

  return null;
}
