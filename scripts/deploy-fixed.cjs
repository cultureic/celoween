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

    // Check for stuck transactions
    console.log('🔍 Checking for stuck transactions...');
    const pendingNonce = await ethers.provider.getTransactionCount(deployer.address, 'pending');
    const latestNonce = await ethers.provider.getTransactionCount(deployer.address, 'latest');
    
    console.log('   Pending nonce:', pendingNonce);
    console.log('   Latest nonce:', latestNonce);

    if (pendingNonce > latestNonce) {
        console.log('⚠️  Stuck transaction detected. Waiting 30 seconds for it to clear...\n');
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        // Check again
        const newPendingNonce = await ethers.provider.getTransactionCount(deployer.address, 'pending');
        const newLatestNonce = await ethers.provider.getTransactionCount(deployer.address, 'latest');
        
        if (newPendingNonce > newLatestNonce) {
            console.log('❌ Transaction still stuck. Please wait a few minutes and try again.');
            process.exit(1);
        }
    }
    
    console.log('✅ No stuck transactions\n');

    // Deploy ContestFactory
    console.log('📤 Deploying ContestFactory...');
    const feeCollector = deployer.address;
    const ContestFactory = await ethers.getContractFactory('ContestFactory');
    
    const contestFactory = await ContestFactory.deploy(feeCollector, {
        gasLimit: 3000000,
        nonce: latestNonce
    });
    
    await contestFactory.waitForDeployment();
    const contestFactoryAddress = await contestFactory.getAddress();
    console.log('✅ ContestFactory deployed to:', contestFactoryAddress);
    console.log('   Fee collector:', feeCollector, '\n');

    // Deploy VotingContract
    console.log('📤 Deploying VotingContract...');
    const VotingContract = await ethers.getContractFactory('VotingContract');
    
    const votingContract = await VotingContract.deploy(contestFactoryAddress, {
        gasLimit: 3000000,
        nonce: latestNonce + 1
    });
    
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
                constructorArgs: [feeCollector]
            },
            VotingContract: {
                address: votingContractAddress,
                constructorArgs: [contestFactoryAddress]
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

    console.log('📄 Deployment info saved to deployments/alfajores/celoween-deployment.json\n');

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
    console.log('✅ Environment variables updated\n');

    console.log('🎉 Deployment completed successfully!\n');
    console.log('📊 Summary:');
    console.log('   ContestFactory:', contestFactoryAddress);
    console.log('   VotingContract:', votingContractAddress);
    console.log('\n🔗 View on Celoscan:');
    console.log(`   https://alfajores.celoscan.io/address/${contestFactoryAddress}`);
    console.log(`   https://alfajores.celoscan.io/address/${votingContractAddress}`);
    console.log('\n✨ Next steps:');
    console.log('   1. Restart your Next.js dev server');
    console.log('   2. Test contest creation and voting');
    console.log('   3. Deploy to mainnet when ready\n');

    return deploymentInfo;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('💥 Deployment failed:', error);
        process.exit(1);
    });
