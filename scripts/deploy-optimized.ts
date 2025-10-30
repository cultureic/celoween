import { ethers } from "hardhat";
import { writeFileSync } from "fs";
import { join } from "path";

async function main() {
  console.log("🚀 Deploying OptimizedSimpleBadge to Alfajores...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Get balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO");
  
  // Deploy the optimized contract
  console.log("\n📄 Deploying OptimizedSimpleBadge...");
  
  const OptimizedSimpleBadge = await ethers.getContractFactory("OptimizedSimpleBadge");
  
  // Estimate gas
  const deploymentData = OptimizedSimpleBadge.interface.encodeDeploy([]);
  const estimatedGas = await deployer.estimateGas({
    data: deploymentData,
  });
  
  console.log("Estimated gas for deployment:", estimatedGas.toString());
  
  const contract = await OptimizedSimpleBadge.deploy({
    gasLimit: estimatedGas + BigInt(50000), // Add buffer
  });
  
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  
  console.log("✅ OptimizedSimpleBadge deployed to:", contractAddress);
  
  // Test basic functionality
  console.log("\n🧪 Testing contract functionality...");
  
  // Test enrollment
  console.log("Testing enrollment...");
  const courseId = 12345;
  const enrollTx = await contract.enroll(courseId);
  const enrollReceipt = await enrollTx.wait();
  console.log("Enrollment gas used:", enrollReceipt?.gasUsed?.toString());
  
  // Test module completion
  console.log("Testing module completion...");
  const moduleIndex = 1;
  const completeTx = await contract.completeModule(courseId, moduleIndex);
  const completeReceipt = await completeTx.wait();
  console.log("Module completion gas used:", completeReceipt?.gasUsed?.toString());
  
  // Test batch completion
  console.log("Testing batch module completion...");
  const batchTx = await contract.completeModulesBatch(courseId, [2, 3, 4]);
  const batchReceipt = await batchTx.wait();
  console.log("Batch completion gas used:", batchReceipt?.gasUsed?.toString());
  
  // Get current gas price
  const gasPrice = (await deployer.provider.getFeeData()).gasPrice || BigInt(0);
  const gasPriceGwei = Number(gasPrice) / 1e9;
  
  // Calculate costs
  const enrollCostCELO = Number(enrollReceipt?.gasUsed || 0) * Number(gasPrice) / 1e18;
  const completeCostCELO = Number(completeReceipt?.gasUsed || 0) * Number(gasPrice) / 1e18;
  const batchCostCELO = Number(batchReceipt?.gasUsed || 0) * Number(gasPrice) / 1e18;
  
  console.log("\n💰 Gas Cost Analysis:");
  console.log("Current gas price:", gasPriceGwei.toFixed(2), "Gwei");
  console.log("Enrollment cost:", enrollCostCELO.toFixed(6), "CELO");
  console.log("Module completion cost:", completeCostCELO.toFixed(6), "CELO");
  console.log("Batch completion cost:", batchCostCELO.toFixed(6), "CELO");
  
  // Verify data
  const isEnrolled = await contract.isEnrolled(deployer.address, courseId);
  const modulesCompleted = await contract.getModulesCompleted(deployer.address, courseId);
  const isModule1Completed = await contract.isModuleCompleted(deployer.address, courseId, 1);
  
  console.log("\n📊 Verification:");
  console.log("Is enrolled:", isEnrolled);
  console.log("Modules completed:", modulesCompleted.toString());
  console.log("Module 1 completed:", isModule1Completed);
  
  // Save deployment info
  const deploymentInfo = {
    network: "alfajores",
    contractName: "OptimizedSimpleBadge",
    address: contractAddress,
    deployer: deployer.address,
    deploymentTx: contract.deploymentTransaction()?.hash,
    gasUsed: {
      deployment: estimatedGas.toString(),
      enrollment: enrollReceipt?.gasUsed?.toString(),
      moduleCompletion: completeReceipt?.gasUsed?.toString(),
      batchCompletion: batchReceipt?.gasUsed?.toString(),
    },
    costs: {
      enrollment: enrollCostCELO.toFixed(6) + " CELO",
      moduleCompletion: completeCostCELO.toFixed(6) + " CELO",
      batchCompletion: batchCostCELO.toFixed(6) + " CELO",
    },
    timestamp: new Date().toISOString(),
  };
  
  // Save to file
  const deploymentPath = join(__dirname, "../deployments/optimized-alfajores.json");
  writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to:", deploymentPath);
  
  console.log("\n🎉 Deployment complete!");
  console.log("Contract address:", contractAddress);
  console.log("Update your .env.local with:");
  console.log(`NEXT_PUBLIC_OPTIMIZED_CONTRACT_ADDRESS_ALFAJORES=${contractAddress}`);
  
  // If gas costs are still too high, provide recommendations
  if (enrollCostCELO > 0.05 || completeCostCELO > 0.05) {
    console.log("\n⚠️  Gas costs are still high. Consider:");
    console.log("1. Using a custom paymaster with lower overhead");
    console.log("2. Batching multiple operations");
    console.log("3. Using CREATE2 for predictable addresses");
  } else {
    console.log("\n✅ Gas costs are optimized! Ready for production.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });