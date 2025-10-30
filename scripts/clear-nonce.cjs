const { ethers } = require('hardhat');

async function main() {
    console.log('🔧 Clearing stuck transaction...\n');

    const [deployer] = await ethers.getSigners();
    console.log('Address:', deployer.address);

    const nonce = await ethers.provider.getTransactionCount(deployer.address, 'latest');
    console.log('Current nonce:', nonce);

    const feeData = await ethers.provider.getFeeData();
    const highGasPrice = feeData.gasPrice * 3n;
    
    console.log('Using gas price:', ethers.formatUnits(highGasPrice, 'gwei'), 'Gwei');
    console.log('\nSending replacement transaction...');
    
    const tx = await deployer.sendTransaction({
        to: deployer.address,
        value: 0,
        gasPrice: highGasPrice,
        gasLimit: 21000,
        nonce: nonce
    });
    
    console.log('Tx hash:', tx.hash);
    console.log('Waiting...');
    
    await tx.wait();
    console.log('\n✅ Cleared! Now deploy your contracts.');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Failed:', error.message);
        process.exit(1);
    });
