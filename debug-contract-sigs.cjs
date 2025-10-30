const { ethers } = require('ethers');

async function debugContractSignatures() {
    const provider = new ethers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
    const contractAddress = '0x4193D2f9Bf93495d4665C485A3B8AadAF78CDf29';
    
    console.log('🔍 Analyzing contract at:', contractAddress);
    
    // Get contract code to see if it exists
    const code = await provider.getCode(contractAddress);
    console.log('📝 Contract bytecode length:', code.length);
    console.log('✅ Contract exists:', code !== '0x');
    
    // Test common function signatures
    const testFunctions = [
        // enroll function variations
        { name: 'enroll(uint256)', sig: '0xf57d585b', params: '0000000000000000000000000000000000000000000000000000000000016f51' }, // 93521
        { name: 'claim(uint256)', sig: '0x379607f5', params: '0000000000000000000000000000000000000000000000000000000000016f51' },
        { name: 'mint(address,uint256)', sig: '0x40c10f19', params: '000000000000000000000000eafbb9bef20c5d8b5cd52ef9d8703e7c902ac24c0000000000000000000000000000000000000000000000000000000000016f51' },
        
        // read function variations
        { name: 'isEnrolled(address,uint256)', sig: '0xd2fb762b', params: '000000000000000000000000eafbb9bef20c5d8b5cd52ef9d8703e7c902ac24c0000000000000000000000000000000000000000000000000000000000016f51' },
        { name: 'hasBadge(address,uint256)', sig: '0x6352211e', params: '000000000000000000000000eafbb9bef20c5d8b5cd52ef9d8703e7c902ac24c0000000000000000000000000000000000000000000000000000000000016f51' },
        { name: 'balanceOf(address,uint256)', sig: '0x00fdd58e', params: '000000000000000000000000eafbb9bef20c5d8b5cd52ef9d8703e7c902ac24c0000000000000000000000000000000000000000000000000000000000016f51' },
        { name: 'balanceOf(address)', sig: '0x70a08231', params: '000000000000000000000000eafbb9bef20c5d8b5cd52ef9d8703e7c902ac24c' },
        
        // owner/admin functions
        { name: 'owner()', sig: '0x8da5cb5b', params: '' },
        { name: 'name()', sig: '0x06fdde03', params: '' },
        { name: 'symbol()', sig: '0x95d89b41', params: '' },
    ];
    
    console.log('\n🧪 Testing function signatures:');
    
    for (const func of testFunctions) {
        try {
            const data = '0x' + func.sig.substring(2) + func.params;
            const result = await provider.call({
                to: contractAddress,
                data: data
            });
            console.log(`✅ ${func.name}: SUCCESS - ${result}`);
            
            // Try to decode common return types
            if (result && result !== '0x') {
                if (result.length === 66) { // 32 bytes = uint256 or bool
                    const asBigInt = BigInt(result);
                    const asBool = asBigInt === 1n;
                    console.log(`   📊 As uint256: ${asBigInt.toString()}`);
                    console.log(`   📊 As bool: ${asBool}`);
                }
            }
        } catch (error) {
            console.log(`❌ ${func.name}: FAILED - ${error.message}`);
        }
    }
}

debugContractSignatures().catch(console.error);