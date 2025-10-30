const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SimpleOptimizedBadge to Alfajores...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Get balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO");
  
  try {
    // Deploy SimpleOptimizedBadge
    console.log("\n📄 Deploying SimpleOptimizedBadge...");
    
    const SimpleOptimizedBadge = await ethers.getContractFactory("SimpleOptimizedBadge");
    
    // Get proper gas price
    const feeData = await deployer.provider.getFeeData();
    const gasPrice = feeData.gasPrice || BigInt(500000000); // 0.5 Gwei fallback
    
    console.log("Using gas price:", Number(gasPrice) / 1e9, "Gwei");
    
    // Deploy with proper gas settings
    const contract = await SimpleOptimizedBadge.deploy({
      gasPrice: gasPrice,
    });
    
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    console.log("✅ SimpleOptimizedBadge deployed to:", contractAddress);
    
    // Test basic functionality
    console.log("\n🧪 Testing contract functionality...");
    
    // Test enrollment
    console.log("Testing enrollment...");
    const courseId = 12345;
    const enrollTx = await contract.enroll(courseId, {
      gasPrice: gasPrice
    });
    const enrollReceipt = await enrollTx.wait();
    console.log("✅ Enrollment successful! Gas used:", enrollReceipt?.gasUsed?.toString());
    
    // Test module completion
    console.log("Testing module completion...");
    const moduleIndex = 1;
    const completeTx = await contract.completeModule(courseId, moduleIndex, {
      gasPrice: gasPrice
    });
    const completeReceipt = await completeTx.wait();
    console.log("✅ Module completion successful! Gas used:", completeReceipt?.gasUsed?.toString());
    
    // Verify data
    const isEnrolled = await contract.isEnrolled(deployer.address, courseId);
    const modulesCompleted = await contract.getModulesCompleted(deployer.address, courseId);
    const isModule1Completed = await contract.isModuleCompleted(deployer.address, courseId, 1);
    
    console.log("\n📊 Verification:");
    console.log("Is enrolled:", isEnrolled);
    console.log("Modules completed:", modulesCompleted.toString());
    console.log("Module 1 completed:", isModule1Completed);
    
    // Calculate costs
    const enrollCostCELO = Number(enrollReceipt?.gasUsed || 0) * Number(gasPrice) / 1e18;
    const completeCostCELO = Number(completeReceipt?.gasUsed || 0) * Number(gasPrice) / 1e18;
    
    console.log("\n💰 Gas Cost Analysis:");
    console.log("Current gas price:", Number(gasPrice) / 1e9, "Gwei");
    console.log("Enrollment cost:", enrollCostCELO.toFixed(6), "CELO");
    console.log("Module completion cost:", completeCostCELO.toFixed(6), "CELO");
    
    console.log("\n🎉 Deployment and testing complete!");
    console.log("✅ Contract address:", contractAddress);
    console.log("🔧 Update your .env.local with:");
    console.log(`NEXT_PUBLIC_OPTIMIZED_CONTRACT_ADDRESS_ALFAJORES=${contractAddress}`);
    
    if (enrollCostCELO < 0.05 && completeCostCELO < 0.05) {
      console.log("\n🎯 Gas costs optimized! Ready for production use.");
    }
    
    return contractAddress;
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

main()
  .then((address) => {
    console.log(`\n🚀 SUCCESS! Contract deployed to: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment script failed:", error);
    process.exit(1);
  });