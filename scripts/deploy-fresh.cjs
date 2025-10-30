const hre = require("hardhat");

async function main() {
  console.log("\n🎃 Fresh Deployment to Alfajores\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deployer:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "CELO");

  // Get the next nonce and skip ahead to avoid conflicts
  const currentNonce = await hre.ethers.provider.getTransactionCount(deployer.address, "latest");
  const nextNonce = currentNonce + 1; // Skip to fresh nonce
  
  console.log("📝 Current nonce:", currentNonce);
  console.log("📝 Using nonce:", nextNonce);
  console.log("📝 Next contract will use nonce:", nextNonce + 1, "\n");

  // Deploy ContestFactory with explicit nonce
  console.log("🏭 Deploying ContestFactory...");
  const ContestFactory = await hre.ethers.getContractFactory("ContestFactory");
  
  const contestFactory = await ContestFactory.deploy(
    deployer.address,
    {
      nonce: nextNonce,
      gasLimit: 5000000,
    }
  );
  
  console.log("⏳ Waiting for ContestFactory deployment...");
  await contestFactory.waitForDeployment();
  
  const contestFactoryAddress = await contestFactory.getAddress();
  console.log("✅ ContestFactory deployed:", contestFactoryAddress);

  // Wait a bit
  console.log("\n⏱️  Waiting 15 seconds...");
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Deploy VotingContract with explicit nonce
  console.log("\n🗳️  Deploying VotingContract...");
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  
  const votingContract = await VotingContract.deploy(
    contestFactoryAddress,
    {
      nonce: nextNonce + 1,
      gasLimit: 5000000,
    }
  );
  
  console.log("⏳ Waiting for VotingContract deployment...");
  await votingContract.waitForDeployment();
  
  const votingContractAddress = await votingContract.getAddress();
  console.log("✅ VotingContract deployed:", votingContractAddress);

  // Summary
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  console.log("📍 Contract Addresses:");
  console.log(`   ContestFactory: ${contestFactoryAddress}`);
  console.log(`   VotingContract:  ${votingContractAddress}\n`);
  
  console.log("🔗 Update .env.local with:");
  console.log(`NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=${contestFactoryAddress}`);
  console.log(`NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=${votingContractAddress}\n`);
  
  console.log("🌐 View on Celoscan:");
  console.log(`   https://alfajores.celoscan.io/address/${contestFactoryAddress}`);
  console.log(`   https://alfajores.celoscan.io/address/${votingContractAddress}\n`);
  
  console.log("🔍 Verify with:");
  console.log(`npx hardhat verify --network alfajores ${contestFactoryAddress} "${deployer.address}"`);
  console.log(`npx hardhat verify --network alfajores ${votingContractAddress} "${contestFactoryAddress}"\n`);

  // Save deployment
  const fs = require("fs");
  const deploymentInfo = {
    network: "alfajores",
    chainId: 44787,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    nonce: {
      contestFactory: nextNonce,
      votingContract: nextNonce + 1,
    },
    contracts: {
      ContestFactory: contestFactoryAddress,
      VotingContract: votingContractAddress,
    },
    explorer: {
      contestFactory: `https://alfajores.celoscan.io/address/${contestFactoryAddress}`,
      votingContract: `https://alfajores.celoscan.io/address/${votingContractAddress}`,
    }
  };

  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync(
    "./deployments/alfajores_latest.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("💾 Saved to: ./deployments/alfajores_latest.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
