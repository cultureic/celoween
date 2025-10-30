// Debug script to test contract functions directly
import { createPublicClient, http, encodeFunctionData } from 'viem';
import { celo } from 'viem/chains';

const CONTRACT_ADDRESS = '0xf8CA094fd88F259Df35e0B8a9f38Df8f4F28F336';

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
  {
    type: 'function',
    name: 'enroll',
    inputs: [{ name: 'courseId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
];

// Create direct mainnet client
const client = createPublicClient({
  chain: celo,
  transport: http('https://forno.celo.org'),
});

async function testContractFunctions() {
  console.log('🔍 TESTING CONTRACT FUNCTIONS');
  console.log('==============================');
  console.log('Contract:', CONTRACT_ADDRESS);
  console.log('');
  
  // Test addresses
  const smartAccount = '0x80fDef11aF475B23B1E9d0D5f655132e14D6e444';
  const walletAddress = '0x2467775778eDA5Dd5d717756A96780C8Af8E7Ac2';
  const courseId = 94033n;
  
  try {
    // Test if isEnrolled function exists and works
    console.log('Testing isEnrolled function...');
    
    const smartAccountEnrolled = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'isEnrolled',
      args: [smartAccount, courseId],
    });
    
    const walletEnrolled = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'isEnrolled',
      args: [walletAddress, courseId],
    });
    
    console.log(`Smart account (${smartAccount}):`, smartAccountEnrolled ? '✅ ENROLLED' : '❌ NOT ENROLLED');
    console.log(`Wallet (${walletAddress}):`, walletEnrolled ? '✅ ENROLLED' : '❌ NOT ENROLLED');
    
    // Test encoding the enroll function (what our transaction should call)
    console.log('\\nTesting enroll function encoding...');
    const enrollCalldata = encodeFunctionData({
      abi: CONTRACT_ABI,
      functionName: 'enroll',
      args: [courseId],
    });
    
    console.log('Enroll function calldata:', enrollCalldata);
    console.log('Function selector (first 4 bytes):', enrollCalldata.slice(0, 10));
    
    // Test with different course IDs to see if enrollment data exists
    console.log('\\nTesting different course IDs...');
    for (const testCourseId of [1n, 2n, 3n, 94033n, 123n]) {
      try {
        const result = await client.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'isEnrolled',
          args: [smartAccount, testCourseId],
        });
        if (result) {
          console.log(`Course ID ${testCourseId}: ✅ ENROLLED`);
        }
      } catch (error) {
        console.log(`Course ID ${testCourseId}: ❌ Error -`, error.message.slice(0, 50));
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing contract functions:', error.message);
    console.error('Full error:', error);
  }
}

testContractFunctions().catch(console.error);