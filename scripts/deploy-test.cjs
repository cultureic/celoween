const { ethers } = require('hardhat');

async function main() {
    console.log('🧪 Testing basic deployment to Alfajores...\n');

    const [deployer] = await ethers.getSigners();
    console.log('Deployer:', deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log('Balance:', ethers.formatEther(balance), 'CELO\n');

    console.log('Deploying SimpleTest contract...');
    const SimpleTest = await ethers.getContractFactory('SimpleTest');
    const contract = await SimpleTest.deploy();
    
    console.log('Tx hash:', contract.deploymentTransaction().hash);
    console.log('Waiting for confirmation...');
    
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    
    console.log('\n✅ SUCCESS!');
    console.log('Contract deployed to:', address);
    console.log(`View: https://alfajores.celoscan.io/address/${address}`);
    
    // Test it
    const number = await contract.number();
    console.log('Contract number:', number.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('\n❌ FAILED:', error.message);
        process.exit(1);
    });
