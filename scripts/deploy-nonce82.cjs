const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
    console.log('🎃 Deploying with nonce 82...\n');

    const [deployer] = await ethers.getSigners();
    console.log('Deployer:', deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log('Balance:', ethers.formatEther(balance), 'CELO\n');

    const feeData = await ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice * 2n; // 2x current

    console.log('Deploying ContestFactory with nonce 82...');
    const ContestFactory = await ethers.getContractFactory('ContestFactory');
    const contestFactory = await ContestFactory.deploy(deployer.address, {
        nonce: 82,
        gasPrice: gasPrice,
        gasLimit: 3000000
    });
    
    await contestFactory.waitForDeployment();
    const cfAddress = await contestFactory.getAddress();
    console.log('✅ ContestFactory:', cfAddress, '\n');

    console.log('Deploying VotingContract with nonce 83...');
    const VotingContract = await ethers.getContractFactory('VotingContract');
    const votingContract = await VotingContract.deploy(cfAddress, {
        nonce: 83,
        gasPrice: gasPrice,
        gasLimit: 3000000
    });
    
    await votingContract.waitForDeployment();
    const vcAddress = await votingContract.getAddress();
    console.log('✅ VotingContract:', vcAddress, '\n');

    console.log('🎉 SUCCESS!\n');
    console.log(`ContestFactory: ${cfAddress}`);
    console.log(`VotingContract: ${vcAddress}`);
    console.log(`\nhttps://alfajores.celoscan.io/address/${cfAddress}`);
    console.log(`https://alfajores.celoscan.io/address/${vcAddress}`);
    
    // Update env
    const envPath = path.join(__dirname, '..', '.env.local');
    let env = fs.readFileSync(envPath, 'utf8');
    env = env.replace(/NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=.*/, `NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=${cfAddress}`);
    env = env.replace(/NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=.*/, `NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=${vcAddress}`);
    fs.writeFileSync(envPath, env);
    console.log('\n✅ .env.local updated');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌', error.message);
        process.exit(1);
    });
