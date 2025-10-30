// Debug script to check if enrollment actually worked
import { createPublicClient, http } from 'viem';
import { celo } from 'viem/chains';

const CONTRACT_ADDRESS = '0xf8CA094fd88F259Df35e0B8a9f38Df8f4F28F336';

// ABI for isEnrolled function
const CONTRACT_ABI = [
  {
    type: 'function',
    name: 'isEnrolled',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'courseId', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
];

// Create direct mainnet client
const client = createPublicClient({
  chain: celo,
  transport: http('https://forno.celo.org'),
});

async function checkEnrollment() {
  console.log('🔍 CHECKING ENROLLMENT ON MAINNET');
  console.log('================================');
  console.log('Contract:', CONTRACT_ADDRESS);
  console.log('Chain:', celo.name, 'ID:', celo.id);
  console.log('RPC:', 'https://forno.celo.org');
  console.log('');
  
  // Test addresses that might be enrolled
  const testAddresses = [
    '0x2467775778eDA5Dd5d717756A96780C8Af8E7Ac2', // Wallet address from logs
    '0x80fDef11aF475B23B1E9d0D5f655132e14D6e444', // Smart account address from logs
  ];
  
  // Test course token ID from logs
  const courseTokenId = 94033n;
  
  for (const address of testAddresses) {
    try {
      console.log(`Checking enrollment for: ${address}`);
      
      const isEnrolled = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'isEnrolled',
        args: [address, courseTokenId],
      });
      
      console.log(`✅ Result: ${isEnrolled ? 'ENROLLED' : 'NOT ENROLLED'}`);
      
      if (isEnrolled) {
        console.log('🎉 ENROLLMENT FOUND! The transaction worked!');
      }
      
    } catch (error) {
      console.error(`❌ Error checking ${address}:`, error.message);
    }
    console.log('');
  }
}

checkEnrollment().catch(console.error);