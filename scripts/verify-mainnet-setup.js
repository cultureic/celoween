// Quick verification script to ensure everything defaults to mainnet
import { 
  getOptimizedContractConfig, 
  getOptimizedContractAddress,
  getNetworkConfig,
  OPTIMIZED_CONTRACT_ADDRESS,
  OPTIMIZED_CONTRACT_CONFIG
} from '../lib/contracts/optimized-badge-config.js';

console.log('🔍 VERIFYING MAINNET-FIRST CONFIGURATION');
console.log('==========================================');

// Test default configurations
console.log('\n📋 DEFAULT CONFIGURATIONS:');
console.log('Default contract address:', OPTIMIZED_CONTRACT_ADDRESS);
console.log('Default contract config address:', OPTIMIZED_CONTRACT_CONFIG.address);
console.log('Expected mainnet address: 0xf8CA094fd88F259Df35e0B8a9f38Df8f4F28F336');

// Test functions without chainId parameter (should default to mainnet)
console.log('\n🔧 FUNCTION DEFAULTS:');
console.log('getOptimizedContractAddress():', getOptimizedContractAddress());
console.log('getOptimizedContractConfig().address:', getOptimizedContractConfig().address);
console.log('getNetworkConfig().CHAIN_NAME:', getNetworkConfig().CHAIN_NAME);
console.log('getNetworkConfig().CHAIN_ID:', getNetworkConfig().CHAIN_ID);

// Test explicit mainnet calls
console.log('\n✅ EXPLICIT MAINNET CALLS:');
console.log('getOptimizedContractAddress(42220):', getOptimizedContractAddress(42220));
console.log('getNetworkConfig(42220).CHAIN_NAME:', getNetworkConfig(42220).CHAIN_NAME);

// Verify all point to the same mainnet address
const defaultAddr = OPTIMIZED_CONTRACT_ADDRESS;
const funcDefaultAddr = getOptimizedContractAddress();
const explicitAddr = getOptimizedContractAddress(42220);

console.log('\n🎯 CONSISTENCY CHECK:');
console.log('All addresses match:', defaultAddr === funcDefaultAddr && funcDefaultAddr === explicitAddr);
console.log('Points to mainnet contract:', defaultAddr === '0xf8CA094fd88F259Df35e0B8a9f38Df8f4F28F336');

if (defaultAddr === '0xf8CA094fd88F259Df35e0B8a9f38Df8f4F28F336') {
  console.log('\n🎉 SUCCESS: All configurations point to Celo Mainnet!');
} else {
  console.log('\n❌ ERROR: Configuration not pointing to mainnet!');
}