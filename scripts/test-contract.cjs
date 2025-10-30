const { ethers } = require('ethers');
require('dotenv').config({ path: '.env.local' });

const SIMPLE_BADGE_ABI = [
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hasBadge',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
];

async function testContract() {
  try {
    console.log('🧪 Testing deployed SimpleBadge contract...');
    
    const contractAddress = process.env.NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES;
    if (!contractAddress || contractAddress === '[YOUR_ALFAJORES_CONTRACT_ADDRESS]') {
      throw new Error('Contract address not configured');
    }
    
    console.log(`Contract address: ${contractAddress}`);
    
    const provider = new ethers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
    const contract = new ethers.Contract(contractAddress, SIMPLE_BADGE_ABI, provider);
    
    // Test 1: Check owner
    console.log('📋 Testing contract owner...');
    const owner = await contract.owner();
    console.log(`Contract owner: ${owner}`);
    
    // Test 2: Check if a test address has a badge
    console.log('📋 Testing hasBadge function...');
    const testAddress = '0x0000000000000000000000000000000000000000';
    const tokenId = 1;
    const hasBadge = await contract.hasBadge(testAddress, tokenId);
    console.log(`Address ${testAddress} has token ${tokenId}:`, hasBadge);
    
    // Test 3: Check deployed wallet's badge status
    console.log('📋 Testing deployer badge status...');
    const deployerAddress = '0x9f42Caf52783EF12d8174d33c281a850b8eA58aD';
    const deployerHasBadge = await contract.hasBadge(deployerAddress, tokenId);
    console.log(`Deployer ${deployerAddress} has token ${tokenId}:`, deployerHasBadge);
    
    console.log('✅ Contract tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Contract test failed:', error.message);
  }
}

testContract();