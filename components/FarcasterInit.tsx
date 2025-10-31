"use client";

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function FarcasterInit() {
  useEffect(() => {
    // Call ready() to dismiss the splash screen
    const initializeFarcaster = async () => {
      try {
        // Check if we're in a Farcaster context
        const context = await sdk.context;
        if (context) {
          console.log('[Farcaster] Context detected, calling ready()');
          await sdk.actions.ready();
          console.log('[Farcaster] Ready called successfully');
        }
      } catch (error) {
        // Not in Farcaster context, ignore
        console.log('[Farcaster] Not in Farcaster context:', error);
      }
    };

    initializeFarcaster();
  }, []);

  return null;
}
