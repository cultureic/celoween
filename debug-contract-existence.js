// Debug script to check if contract actually exists
import { createPublicClient, http } from 'viem';
import { celo } from 'viem/chains';

const CONTRACT_ADDRESS = '0xf8CA094fd88F259Df35e0B8a9f38Df8f4F28F336';

// Create direct mainnet client
const client = createPublicClient({
  chain: celo,
  transport: http('https://forno.celo.org'),
});

async function checkContract() {
  console.log('🔍 CHECKING IF CONTRACT EXISTS ON MAINNET');
  console.log('==========================================');
  console.log('Contract:', CONTRACT_ADDRESS);
  console.log('Chain:', celo.name, 'ID:', celo.id);
  console.log('RPC:', 'https://forno.celo.org');
  console.log('');
  
  try {
    // Check if contract has code
    const code = await client.getCode({
      address: CONTRACT_ADDRESS,
    });
    
    console.log('Contract code exists:', !!code && code !== '0x');
    console.log('Code length:', code ? code.length : 0);
    
    if (!code || code === '0x') {
      console.log('❌ NO CONTRACT CODE FOUND!');
      console.log('This address does not contain a smart contract.');
      return;
    }
    
    console.log('✅ Contract code found!');
    console.log('Code preview:', code.slice(0, 100) + '...');
    
    // Try to get transaction count
    const txCount = await client.getTransactionCount({
      address: CONTRACT_ADDRESS,
    });
    
    console.log('Transaction count:', txCount);
    
  } catch (error) {
    console.error('❌ Error checking contract:', error.message);
  }
}

checkContract().catch(console.error);