import { ethers, network } from "hardhat";
import * as dotenv from "dotenv";
import { DeploymentUtils, NETWORKS } from "./deploy-utils";

// Load environment variables
dotenv.config({ path: ".env.hardhat" });

async function main() {
  const networkName = network.name;
  const chainId = network.config.chainId;
  
  console.log("🚀 Starting Celo Academy Contract Deployment");
  console.log("============================================");
  console.log(`Network: ${networkName} (Chain ID: ${chainId})`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log("");

  // Validate network
  if (!NETWORKS[networkName]) {
    console.error(`❌ Unsupported network: ${networkName}`);
    console.log("Supported networks:", Object.keys(NETWORKS).join(", "));
    process.exit(1);
  }

  // Validate environment variables
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    console.error("❌ DEPLOYER_PRIVATE_KEY not set in environment variables");
    console.log("Please copy .env.hardhat.example to .env.hardhat and fill in your private key");
    process.exit(1);
  }

  if (!DeploymentUtils.validatePrivateKey(privateKey)) {
    console.error("❌ Invalid private key format");
    process.exit(1);
  }

  // Get deployer info
  const deployerInfo = await DeploymentUtils.getDeployerInfo(privateKey);
  console.log(`Deployer Address: ${deployerInfo.address}`);
  console.log(`Deployer Balance: ${deployerInfo.balance} CELO`);
  console.log("");

  // Check if balance is sufficient (minimum 1 CELO for deployment)
  if (parseFloat(deployerInfo.balance) < 1) {
    console.warn("⚠️  Warning: Low balance detected. Make sure you have enough CELO for gas fees.");
    console.log(`   You can get testnet CELO from: https://faucet.celo.org/alfajores`);
    console.log("");
  }

  try {
    // Deploy MilestoneBadge contract
    await deployMilestoneBadge();
    
    // Generate deployment report
    console.log("\n" + DeploymentUtils.generateReport(networkName));
    
    console.log("🎉 All contracts deployed successfully!");
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

async function deployMilestoneBadge() {
  console.log("📦 Deploying MilestoneBadge Contract");
  console.log("-----------------------------------");

  // Contract parameters
  const baseURI = process.env.MILESTONE_BADGE_BASE_URI || "https://academy.celo.org/api/metadata/milestone/";
  const constructorArgs = [baseURI];

  console.log(`Base URI: ${baseURI}`);

  // Check if already deployed
  if (DeploymentUtils.isDeployed("MilestoneBadge", network.name)) {
    const existingAddress = DeploymentUtils.getContractAddress("MilestoneBadge", network.name);
    console.log(`⚠️  MilestoneBadge already deployed at: ${existingAddress}`);
    console.log("   Skipping deployment. Use --reset flag to redeploy.");
    return;
  }

  // Estimate gas cost
  try {
    const gasEstimate = await DeploymentUtils.estimateDeploymentCost("MilestoneBadge", constructorArgs);
    console.log(`Gas Estimate: ${gasEstimate.gasEstimate.toString()}`);
    console.log(`Estimated Cost: ${gasEstimate.costInEther} CELO`);
    console.log("");
  } catch (error) {
    console.log("⚠️  Could not estimate gas cost, proceeding with deployment...");
  }

  // Deploy contract
  const MilestoneBadge = await ethers.getContractFactory("MilestoneBadge");
  console.log("⏳ Deploying contract...");
  
  const milestoneBadge = await MilestoneBadge.deploy(...constructorArgs, {
    gasLimit: 2000000, // Set reasonable gas limit
  });

  console.log(`📝 Transaction sent: ${milestoneBadge.deploymentTransaction()?.hash}`);
  console.log("⏳ Waiting for deployment confirmation...");

  // Wait for deployment
  await milestoneBadge.waitForDeployment();
  const address = await milestoneBadge.getAddress();
  const deploymentTx = milestoneBadge.deploymentTransaction();

  if (!deploymentTx) {
    throw new Error("Deployment transaction not found");
  }

  // Wait for additional confirmations
  const confirmations = network.name === "celo" ? 5 : 2;
  const receipt = await DeploymentUtils.waitForConfirmation(deploymentTx.hash, confirmations);

  if (!receipt) {
    throw new Error("Failed to get transaction receipt");
  }

  console.log(`✅ MilestoneBadge deployed to: ${address}`);

  // Save deployment record
  const deploymentRecord = {
    contractName: "MilestoneBadge",
    address: address,
    network: network.name,
    chainId: network.config.chainId,
    deployer: deploymentTx.from!,
    transactionHash: deploymentTx.hash,
    constructorArgs: constructorArgs,
    deployedAt: new Date().toISOString(),
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    verified: false,
  };

  DeploymentUtils.saveDeployment(deploymentRecord);

  // Contract verification
  if (process.env.AUTO_VERIFY === "true" && process.env.CELOSCAN_API_KEY) {
    console.log("\n🔍 Verifying contract on block explorer...");
    try {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10s before verification
      
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: constructorArgs,
      });

      // Update deployment record with verification status
      deploymentRecord.verified = true;
      DeploymentUtils.saveDeployment(deploymentRecord);
      
      console.log("✅ Contract verified successfully!");
    } catch (error: any) {
      console.log("❌ Contract verification failed:");
      console.log(error.message);
      if (error.message.includes("Already Verified")) {
        deploymentRecord.verified = true;
        DeploymentUtils.saveDeployment(deploymentRecord);
        console.log("✅ Contract was already verified");
      }
    }
  }

  // Display deployment info
  console.log(DeploymentUtils.formatDeploymentInfo(deploymentRecord));
}

// Handle CLI arguments
const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log(`
Celo Academy Deployment Script

Usage:
  npx hardhat run scripts/deploy.ts --network <network>

Networks:
  --network alfajores   Deploy to Celo Alfajores Testnet
  --network celo        Deploy to Celo Mainnet

Options:
  --help               Show this help message

Environment Variables:
  DEPLOYER_PRIVATE_KEY    Private key of deployer account (required)
  CELOSCAN_API_KEY        API key for contract verification (optional)
  AUTO_VERIFY             Set to 'true' to auto-verify contracts (optional)
  MILESTONE_BADGE_BASE_URI Base URI for NFT metadata (optional)

Examples:
  npx hardhat run scripts/deploy.ts --network alfajores
  npx hardhat run scripts/deploy.ts --network celo
  `);
  process.exit(0);
}

// Run main function
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}