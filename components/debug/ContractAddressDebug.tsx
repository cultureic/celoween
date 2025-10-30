'use client';

import { useChainId } from 'wagmi';
import { getOptimizedContractConfig, getNetworkConfig } from '@/lib/contracts/optimized-badge-config';

export function ContractAddressDebug() {
  const chainId = useChainId();
  const contractConfig = getOptimizedContractConfig(chainId);
  const networkConfig = getNetworkConfig(chainId);
  
  const expectedMainnetContract = '0xf8CA094fd88F259Df35e0B8a9f38Df8f4F28F336';
  const expectedAlfajoresContract = '0x4193D2f9Bf93495d4665C485A3B8AadAF78CDf29';
  const legacyContract = '0x7Ed5CC0cf0B0532b52024a0DDa8fAE24C6F66dc3';
  
  const isUsingCorrectContract = contractConfig.address === expectedMainnetContract || contractConfig.address === expectedAlfajoresContract;
  const isUsingLegacyContract = contractConfig.address === legacyContract;
  
  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded-lg text-xs font-mono z-50 max-w-md">
      <div className="font-bold text-yellow-400 mb-2">🔍 CONTRACT DEBUG</div>
      
      <div className="space-y-1">
        <div>
          <span className="text-blue-400">Chain ID:</span> {chainId}
        </div>
        <div>
          <span className="text-blue-400">Network:</span> {networkConfig.CHAIN_NAME}
        </div>
        <div>
          <span className="text-blue-400">Is Mainnet:</span> {networkConfig.IS_MAINNET ? 'YES' : 'NO'}
        </div>
      </div>
      
      <div className="mt-3 space-y-1">
        <div className="text-green-400 font-bold">CURRENT CONTRACT:</div>
        <div className="break-all">{contractConfig.address}</div>
        
        {isUsingCorrectContract && (
          <div className="text-green-400">✅ Using correct optimized contract</div>
        )}
        {isUsingLegacyContract && (
          <div className="text-red-400">❌ Using LEGACY contract! This is wrong!</div>
        )}
        {!isUsingCorrectContract && !isUsingLegacyContract && (
          <div className="text-yellow-400">⚠️ Using unknown contract</div>
        )}
      </div>
      
      <div className="mt-3 space-y-1 text-xs text-gray-300">
        <div>Expected Mainnet: {expectedMainnetContract}</div>
        <div>Expected Alfajores: {expectedAlfajoresContract}</div>
<div className="text-red-300">Legacy (DON&apos;T USE): {legacyContract}</div>
      </div>
      
      <div className="mt-3 text-xs">
        <div className="text-blue-400">Environment:</div>
        <div>NODE_ENV: {process.env.NODE_ENV || 'undefined'}</div>
      </div>
    </div>
  );
}