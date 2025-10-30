const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const solc = require('solc');
require('dotenv').config({ path: '.env.local' });

// Contract source code
const contractSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MilestoneBadge is ERC1155, Ownable {
    mapping(address => mapping(uint256 => bool)) public claimed;
    
    constructor(string memory uri_) ERC1155(uri_) Ownable(msg.sender) {}
    
    function claim(uint256 tokenId) external {
        require(!claimed[msg.sender][tokenId], "Already claimed");
        claimed[msg.sender][tokenId] = true;
        _mint(msg.sender, tokenId, 1, "");
    }
    
    function adminMint(address to, uint256 tokenId, uint256 amount) external onlyOwner {
        _mint(to, tokenId, amount, "");
    }
}
`;

async function findImports(path) {
    try {
        if (path === '@openzeppelin/contracts/token/ERC1155/ERC1155.sol') {
            const erc1155Path = require.resolve('@openzeppelin/contracts/token/ERC1155/ERC1155.sol');
            return { contents: fs.readFileSync(erc1155Path, 'utf8') };
        }
        if (path === '@openzeppelin/contracts/access/Ownable.sol') {
            const ownablePath = require.resolve('@openzeppelin/contracts/access/Ownable.sol');
            return { contents: fs.readFileSync(ownablePath, 'utf8') };
        }
        // Handle other imports recursively
        const fullPath = require.resolve(`@openzeppelin/contracts/${path.replace('@openzeppelin/contracts/', '')}`);
        return { contents: fs.readFileSync(fullPath, 'utf8') };
    } catch (e) {
        return { error: 'File not found' };
    }
}

async function compileContract() {
    console.log('🔨 Compiling contract...');
    
    const input = {
        language: 'Solidity',
        sources: {
            'MilestoneBadge.sol': {
                content: contractSource
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode']
                }
            }
        }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
    
    if (output.errors) {
        const hasErrors = output.errors.some(error => error.severity === 'error');
        if (hasErrors) {
            console.error('❌ Compilation errors:');
            output.errors.forEach(error => console.error(error.formattedMessage));
            throw new Error('Contract compilation failed');
        } else {
            console.warn('⚠️ Compilation warnings:');
            output.errors.forEach(error => console.warn(error.formattedMessage));
        }
    }
    
    const contract = output.contracts['MilestoneBadge.sol']['MilestoneBadge'];
    
    if (!contract) {
        throw new Error('Contract not found in compilation output');
    }
    
    console.log('✅ Contract compiled successfully');
    
    return {
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object
    };
}

async function deployContract() {
    try {
        console.log('🚀 Starting deployment to Celo Alfajores...');
        
        // Setup provider and wallet
        const provider = new ethers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
        const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
        
        console.log(`Deployer address: ${wallet.address}`);
        
        // Check balance
        const balance = await provider.getBalance(wallet.address);
        console.log(`Deployer balance: ${ethers.formatEther(balance)} CELO`);
        
        if (balance === 0n) {
            throw new Error('Deployer account has no CELO for gas fees');
        }
        
        // Compile the contract
        const { abi, bytecode } = await compileContract();
        
        // Contract constructor parameters
        const baseURI = process.env.MILESTONE_BADGE_BASE_URI || "https://academy.celo.org/api/metadata/milestone/";
        console.log(`Base URI: ${baseURI}`);
        
        // Create contract factory
        const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
        
        console.log('📤 Deploying contract...');
        
        // Deploy the contract
        const contract = await contractFactory.deploy(baseURI, {
            gasLimit: 3000000,
        });
        
        console.log(`📝 Transaction hash: ${contract.deploymentTransaction().hash}`);
        console.log('⏳ Waiting for deployment confirmation...');
        
        // Wait for deployment
        await contract.waitForDeployment();
        const contractAddress = await contract.getAddress();
        
        console.log(`✅ MilestoneBadge deployed to: ${contractAddress}`);
        
        // Save deployment info
        const deploymentInfo = {
            contractName: "MilestoneBadge",
            address: contractAddress,
            network: "alfajores",
            chainId: 44787,
            deployer: wallet.address,
            transactionHash: contract.deploymentTransaction().hash,
            constructorArgs: [baseURI],
            deployedAt: new Date().toISOString(),
            abi: abi
        };
        
        // Save to file
        const deploymentPath = path.join(__dirname, '..', 'deployments', 'alfajores');
        if (!fs.existsSync(deploymentPath)) {
            fs.mkdirSync(deploymentPath, { recursive: true });
        }
        
        fs.writeFileSync(
            path.join(deploymentPath, 'MilestoneBadge.json'),
            JSON.stringify(deploymentInfo, null, 2)
        );
        
        console.log('📄 Deployment Summary:');
        console.log(JSON.stringify(deploymentInfo, null, 2));
        
        // Update environment file
        console.log('🔧 Updating environment variables...');
        const envPath = path.join(__dirname, '..', '.env.local');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        const addressLine = `NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES=${contractAddress}`;
        
        if (envContent.includes('NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES=')) {
            envContent = envContent.replace(
                /NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES=.*/,
                addressLine
            );
        } else {
            envContent += `\n${addressLine}\n`;
        }
        
        fs.writeFileSync(envPath, envContent);
        
        console.log('✅ Environment updated with contract address');
        console.log('🎉 Deployment completed successfully!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Verify the contract on Celoscan (if desired)');
        console.log('2. Test the enrollment functionality in your app');
        console.log('3. Deploy to mainnet when ready');
        
        return deploymentInfo;
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        throw error;
    }
}

// Check if solc is available
try {
    require('solc');
} catch (e) {
    console.error('❌ solc not found. Installing...');
    require('child_process').execSync('npm install solc@^0.8.20', { stdio: 'inherit' });
    console.log('✅ solc installed');
}

// Execute deployment
if (require.main === module) {
    deployContract()
        .then((result) => {
            console.log('🎉 Deployment script completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Deployment script failed:', error.message);
            process.exit(1);
        });
}

module.exports = { deployContract };