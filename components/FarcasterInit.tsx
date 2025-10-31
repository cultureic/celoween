"use client";

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function FarcasterInit() {
  useEffect(() => {
    // Call ready() immediately to dismiss splash screen
    // This must be called as soon as the app is ready to display
    const callReady = async () => {
      try {
        console.log('[Farcaster] Calling sdk.actions.ready()');
        await sdk.actions.ready();
        console.log('[Farcaster] ✅ Ready called successfully');
      } catch (error) {
        console.log('[Farcaster] Not in Farcaster context or ready() failed:', error);
      }
    };

    callReady();
  }, []);

  return null;
}
