import hre from "hardhat";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { ethers } = hre;

async function main() {
  console.log("🚀 Starting SimpleBadge deployment to Celo Alfajores...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "CELO");
  
  if (balance === 0n) {
    throw new Error('Deployer account has no CELO for gas fees');
  }
  
  const baseURI = process.env.MILESTONE_BADGE_BASE_URI || "https://academy.celo.org/api/metadata/milestone/";
  console.log("Base URI:", baseURI);
  
  // Deploy SimpleBadge contract
  console.log("📤 Deploying SimpleBadge...");
  const SimpleBadge = await ethers.getContractFactory("SimpleBadge");
  
  // Use dynamic gas pricing
  const feeData = await ethers.provider.getFeeData();
  console.log(`Network fee data:`, {
    gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') + ' gwei' : 'null',
    maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') + ' gwei' : 'null',
  });
  
  const simpleBadge = await SimpleBadge.deploy(baseURI, {
    gasLimit: 1500000,
    // Use EIP-1559 gas pricing
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || feeData.maxFeePerGas,
  });
  
  console.log("📝 Transaction hash:", simpleBadge.deploymentTransaction()?.hash);
  console.log("⏳ Waiting for deployment confirmation...");
  
  await simpleBadge.waitForDeployment();
  const contractAddress = await simpleBadge.getAddress();
  
  console.log("✅ SimpleBadge deployed to:", contractAddress);
  
  // Test the contract
  try {
    const owner = await simpleBadge.owner();
    console.log("Contract owner:", owner);
    console.log("✅ Contract is working correctly!");
  } catch (e) {
    console.warn("⚠️ Contract deployed but test call failed:", e.message);
  }
  
  // Update environment file
  console.log("🔧 Updating environment variables...");
  
  const envPath = path.join(__dirname, '..', '.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  const addressLine = `NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES=${contractAddress}`;
  
  if (envContent.includes('NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES=')) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES=.*/,
      addressLine
    );
  } else {
    envContent += `\\n${addressLine}\\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  
  console.log("✅ Environment updated with contract address");
  console.log("🎉 Deployment completed successfully!");
  console.log("");
  console.log("🔗 View on Alfajores Block Explorer:");
  console.log(`https://alfajores.celoscan.io/address/${contractAddress}`);
  
  return {
    contractAddress,
    transactionHash: simpleBadge.deploymentTransaction()?.hash,
    deployer: deployer.address
  };
}

// Run main function if this is the entry point
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Deployment failed:", error.message);
    process.exit(1);
  });

export { main };
