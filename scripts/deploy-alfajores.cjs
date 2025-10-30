const hre = require("hardhat");

async function main() {
  console.log("\n🎃 Deploying Celoween to Alfajores Testnet\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deployer:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "CELO\n");

  // Deploy ContestFactory
  console.log("🏭 Deploying ContestFactory...");
  const ContestFactory = await hre.ethers.getContractFactory("ContestFactory");
  const contestFactory = await ContestFactory.deploy(deployer.address);
  
  console.log("⏳ Waiting for confirmation...");
  await contestFactory.waitForDeployment();
  
  const contestFactoryAddress = await contestFactory.getAddress();
  console.log("✅ ContestFactory:", contestFactoryAddress);

  // Wait a bit before next deployment
  console.log("\n⏱️  Waiting 10 seconds before next deployment...");
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Deploy VotingContract  
  console.log("\n🗳️  Deploying VotingContract...");
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy(contestFactoryAddress);
  
  console.log("⏳ Waiting for confirmation...");
  await votingContract.waitForDeployment();
  
  const votingContractAddress = await votingContract.getAddress();
  console.log("✅ VotingContract:", votingContractAddress);

  // Summary
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  console.log("📍 Contract Addresses:");
  console.log(`   ContestFactory: ${contestFactoryAddress}`);
  console.log(`   VotingContract:  ${votingContractAddress}\n`);
  
  console.log("🔗 Add to .env.local:");
  console.log(`NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=${contestFactoryAddress}`);
  console.log(`NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=${votingContractAddress}\n`);
  
  console.log("🌐 View on Celoscan:");
  console.log(`   ContestFactory: https://alfajores.celoscan.io/address/${contestFactoryAddress}`);
  console.log(`   VotingContract:  https://alfajores.celoscan.io/address/${votingContractAddress}\n`);
  
  console.log("🔍 To verify contracts:");
  console.log(`npx hardhat verify --network alfajores ${contestFactoryAddress} "${deployer.address}"`);
  console.log(`npx hardhat verify --network alfajores ${votingContractAddress} "${contestFactoryAddress}"\n`);

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: "alfajores",
    chainId: 44787,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      ContestFactory: contestFactoryAddress,
      VotingContract: votingContractAddress,
    },
  };

  fs.writeFileSync(
    "./deployments/alfajores_latest.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("💾 Saved to: ./deployments/alfajores_latest.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error.message);
    process.exit(1);
  });
