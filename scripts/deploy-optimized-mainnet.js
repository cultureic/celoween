import pkg from "hardhat";
const { ethers } = pkg;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("🚀 Deploying OptimizedSimpleBadge to Celo Mainnet...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Get balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO");
  
  // Safety check for mainnet
  if (parseFloat(ethers.formatEther(balance)) < 1.0) {
    console.error("❌ Insufficient balance for mainnet deployment. Need at least 1 CELO");
    process.exit(1);
  }
  
  // Deploy the optimized contract
  console.log("\n📄 Deploying OptimizedSimpleBadge...");
  
  const OptimizedSimpleBadge = await ethers.getContractFactory("OptimizedSimpleBadge");
  
  // Estimate gas for mainnet
  console.log("Estimating deployment gas...");
  try {
    const deploymentData = OptimizedSimpleBadge.interface.encodeDeploy([]);
    const estimatedGas = await deployer.estimateGas({
      data: deploymentData,
    });
    
    console.log("Estimated gas:", estimatedGas.toString());
    
    // Get current gas price
    const feeData = await deployer.provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    const estimatedCost = estimatedGas * gasPrice;
    
    console.log("Estimated deployment cost:", ethers.formatEther(estimatedCost), "CELO");
    
    if (parseFloat(ethers.formatEther(estimatedCost)) > 0.5) {
      console.warn("⚠️  High deployment cost detected!");
      console.log("Continuing with deployment...");
    }
  } catch (error) {
    console.log("Could not estimate gas, proceeding with deployment...");
  }
  
  // Get current fee data and set appropriate gas price
  const feeData = await deployer.provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.parseUnits("2", "gwei"); // Minimum 2 Gwei
  
  console.log("Using gas price:", ethers.formatUnits(gasPrice, "gwei"), "Gwei");
  
  // Deploy with higher gas limit and proper gas price for mainnet
  const contract = await OptimizedSimpleBadge.deploy({
    gasLimit: 3000000, // Higher limit for mainnet safety
    gasPrice: gasPrice,
  });
  
  console.log("⏳ Waiting for deployment transaction to be mined...");
  const deployTransaction = contract.deploymentTransaction();
  console.log("Transaction hash:", deployTransaction.hash);
  
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  
  console.log("✅ OptimizedSimpleBadge deployed to:", contractAddress);
  
  // Wait for a few confirmations on mainnet
  console.log("⏳ Waiting for confirmations...");
  const receipt = await deployTransaction.wait(5); // Wait for 5 confirmations
  console.log("✅ Transaction confirmed with 5 confirmations");
  
  // Save deployment info for mainnet
  const deploymentInfo = {
    network: "celo-mainnet",
    chainId: 42220,
    contractName: "OptimizedSimpleBadge",
    address: contractAddress,
    deployer: deployer.address,
    deploymentTx: deployTransaction.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    gasPrice: receipt.gasPrice?.toString() || "N/A",
    deploymentCost: ethers.formatEther(receipt.gasUsed * (receipt.gasPrice || 0n)) + " CELO",
    timestamp: new Date().toISOString(),
    explorerUrl: `https://celoscan.io/address/${contractAddress}`,
  };
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save deployment info
  const deploymentPath = path.join(deploymentsDir, "optimized-mainnet.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to:", deploymentPath);
  
  console.log("\n🎉 MAINNET DEPLOYMENT COMPLETE!");
  console.log("================================================");
  console.log("Contract Address:", contractAddress);
  console.log("Network: Celo Mainnet");
  console.log("Chain ID: 42220"); 
  console.log("Explorer:", `https://celoscan.io/address/${contractAddress}`);
  console.log("Gas Used:", receipt.gasUsed.toString());
  console.log("Deployment Cost:", ethers.formatEther(receipt.gasUsed * (receipt.gasPrice || 0n)), "CELO");
  
  console.log("\n📋 NEXT STEPS:");
  console.log("===============");
  console.log("1. Update your .env.local file:");
  console.log(`   NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_MAINNET=${contractAddress}`);
  console.log("2. Update your contract configuration to use this mainnet address");
  console.log("3. Verify the contract on CeloScan (if API key is available)");
  console.log("4. Test the contract with small transactions first");
  console.log("5. Monitor gas costs in production");
  
  // Contract verification reminder
  console.log("\n🔍 Contract Verification:");
  console.log("To verify on CeloScan, run:");
  console.log(`npx hardhat verify --network celo ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });