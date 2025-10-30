const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function main() {
    console.log('🎃 Starting Celoween contract deployment to Alfajores...\n');

    const [deployer] = await ethers.getSigners();
    console.log('Deployer address:', deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log('Deployer balance:', ethers.formatEther(balance), 'CELO\n');

    if (balance === 0n) {
        throw new Error('❌ Deployer account has no CELO for gas fees');
    }

    // Get current nonce and use the next one
    const currentNonce = await ethers.provider.getTransactionCount(deployer.address, 'latest');
    const useNonce = currentNonce + 1; // Skip any stuck transaction at current nonce
    
    console.log('📊 Nonce info:');
    console.log('   Current nonce:', currentNonce);
    console.log('   Using nonce:', useNonce, '\n');

    // Deploy ContestFactory with higher gas price
    console.log('📤 Deploying ContestFactory...');
    const feeCollector = deployer.address;
    const ContestFactory = await ethers.getContractFactory('ContestFactory');
    
    const feeData = await ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice * 150n / 100n; // 50% higher
    
    console.log('   Gas price:', ethers.formatUnits(gasPrice, 'gwei'), 'Gwei');
    
    const contestFactory = await ContestFactory.deploy(feeCollector, {
        gasLimit: 3000000,
        gasPrice: gasPrice,
        nonce: useNonce
    });
    
    console.log('   Transaction sent! Hash:', contestFactory.deploymentTransaction().hash);
    console.log('   Waiting for confirmation...');
    
    await contestFactory.waitForDeployment();
    const contestFactoryAddress = await contestFactory.getAddress();
    console.log('✅ ContestFactory deployed to:', contestFactoryAddress);
    console.log('   Fee collector:', feeCollector, '\n');

    // Deploy VotingContract
    console.log('📤 Deploying VotingContract...');
    const VotingContract = await ethers.getContractFactory('VotingContract');
    
    const votingContract = await VotingContract.deploy(contestFactoryAddress, {
        gasLimit: 3000000,
        gasPrice: gasPrice,
        nonce: useNonce + 1
    });
    
    console.log('   Transaction sent! Hash:', votingContract.deploymentTransaction().hash);
    console.log('   Waiting for confirmation...');
    
    await votingContract.waitForDeployment();
    const votingContractAddress = await votingContract.getAddress();
    console.log('✅ VotingContract deployed to:', votingContractAddress, '\n');

    // Test contracts
    console.log('🔍 Testing contracts...');
    try {
        const owner = await contestFactory.owner();
        const totalContests = await contestFactory.getTotalContests();
        console.log('   ContestFactory owner:', owner);
        console.log('   Total contests:', totalContests.toString());
        console.log('✅ Contracts working correctly!\n');
    } catch (e) {
        console.warn('⚠️ Contracts deployed but test failed:', e.message, '\n');
    }

    // Save deployment info
    const deploymentInfo = {
        network: 'alfajores',
        chainId: 44787,
        deployer: deployer.address,
        deployedAt: new Date().toISOString(),
        contracts: {
            ContestFactory: {
                address: contestFactoryAddress,
                constructorArgs: [feeCollector],
                txHash: contestFactory.deploymentTransaction().hash
            },
            VotingContract: {
                address: votingContractAddress,
                constructorArgs: [contestFactoryAddress],
                txHash: votingContract.deploymentTransaction().hash
            }
        }
    };

    // Save to deployments directory
    const deploymentDir = path.join(__dirname, '..', 'deployments', 'alfajores');
    if (!fs.existsSync(deploymentDir)) {
        fs.mkdirSync(deploymentDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(deploymentDir, 'celoween-deployment.json'),
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log('📄 Deployment info saved\n');

    // Update .env.local
    console.log('🔧 Updating .env.local...');
    const envPath = path.join(__dirname, '..', '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');

    const updates = [
        [`NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS`, contestFactoryAddress],
        [`NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS`, votingContractAddress]
    ];

    for (const [key, value] of updates) {
        const line = `${key}=${value}`;
        if (envContent.includes(`${key}=`)) {
            envContent = envContent.replace(new RegExp(`${key}=.*`), line);
        } else {
            envContent += `\n${line}`;
        }
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Environment updated\n');

    console.log('🎉 DEPLOYMENT SUCCESSFUL!\n');
    console.log('📊 Summary:');
    console.log('   ContestFactory:', contestFactoryAddress);
    console.log('   VotingContract:', votingContractAddress);
    console.log('\n🔗 View on Celoscan:');
    console.log(`   https://alfajores.celoscan.io/address/${contestFactoryAddress}`);
    console.log(`   https://alfajores.celoscan.io/address/${votingContractAddress}`);

    return deploymentInfo;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('\n💥 DEPLOYMENT FAILED:', error.message);
        if (error.reason) console.error('Reason:', error.reason);
        process.exit(1);
    });
