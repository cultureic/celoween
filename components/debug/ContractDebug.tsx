'use client';

export function ContractDebug() {
  const optimizedAddress = process.env.NEXT_PUBLIC_OPTIMIZED_CONTRACT_ADDRESS_ALFAJORES;
  const legacyAddress = process.env.NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES;
  
  console.log('🔍 CONTRACT DEBUG:', {
    optimizedAddress,
    legacyAddress,
    timestamp: new Date().toISOString(),
  });

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs font-mono z-50">
      <div>🔍 CONTRACT DEBUG:</div>
      <div>Optimized: {optimizedAddress || 'NOT SET'}</div>
      <div>Legacy: {legacyAddress || 'NOT SET'}</div>
    </div>
  );
}