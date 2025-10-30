const { ethers } = require('ethers');

// Contract details
const CONTRACT_ADDRESS = '0x4193D2f9Bf93495d4665C485A3B8AadAF78CDf29';
const RPC_URL = 'https://alfajores-forno.celo-testnet.org';

// Optimized contract ABI - only what we need
const ABI = [
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

async function checkEnrollment() {
  console.log('🔍 DEBUGGING ENROLLMENT STATUS');
  console.log('====================================');
  
  try {
    // Connect to Celo Alfajores
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    
    console.log('✅ Connected to contract:', CONTRACT_ADDRESS);
    console.log('✅ Network:', await provider.getNetwork());
    
    // Check if contract exists
    const code = await provider.getCode(CONTRACT_ADDRESS);
    console.log('✅ Contract has code:', code !== '0x');
    
    // Common user addresses from the error logs
    const testAddresses = [
      '0xEaFBb9bEF20C5D8B5CD52Ef9D8703E7C902AC24c', // From error log
      '0x855cd97c8A2F987736f5E982168E0FA343974AEf', // From other error
    ];
    
    // Common course token IDs
    const courseTokenIds = [
      93521n, // 0x16f51 from error log
      1n,     // Test course
      12345n, // Common test ID
    ];
    
    console.log('\n📊 CHECKING ENROLLMENT STATUS:');
    console.log('====================================');
    
    for (const userAddress of testAddresses) {
      console.log(`\n👤 User: ${userAddress}`);
      
      for (const tokenId of courseTokenIds) {
        try {
          const isEnrolled = await contract.isEnrolled(userAddress, tokenId);
          console.log(`   Course ${tokenId}: ${isEnrolled ? '✅ ENROLLED' : '❌ NOT ENROLLED'}`);
          
          if (isEnrolled) {
            console.log(`   🎯 USER IS ENROLLED IN COURSE ${tokenId}!`);
          }
        } catch (error) {
          console.log(`   Course ${tokenId}: ❌ ERROR - ${error.message}`);
        }
      }
    }
    
    console.log('\n🔬 CONTRACT FUNCTION TEST:');
    console.log('====================================');
    
    // Test if isEnrolled function exists and works
    try {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      const testResult = await contract.isEnrolled(zeroAddress, 1n);
      console.log('✅ isEnrolled function works, zero address result:', testResult);
    } catch (error) {
      console.log('❌ isEnrolled function error:', error.message);
      
      // Maybe the function has a different name?
      console.log('🤔 Function might have different name or ABI mismatch');
    }
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error.message);
    
    if (error.message.includes('could not detect network')) {
      console.log('💡 TIP: Check RPC URL and network connection');
    }
    
    if (error.message.includes('call revert')) {
      console.log('💡 TIP: Function might not exist or ABI mismatch');
    }
  }
}

// Run the debug script
checkEnrollment().then(() => {
  console.log('\n✅ Debug complete');
  process.exit(0);
}).catch(error => {
  console.error('❌ Debug failed:', error);
  process.exit(1);
});