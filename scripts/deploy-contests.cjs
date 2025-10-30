const hre = require("hardhat");

async function main() {
  console.log("\n🎃 Deploying Celoween Contracts to", hre.network.name, "...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "CELO");
  
  // Get current nonce (use 'pending' to get the most up-to-date nonce)
  const nonce = await hre.ethers.provider.getTransactionCount(deployer.address, "pending");
  console.log("📝 Using nonce:", nonce, "\n");

  // Deploy ContestFactory
  console.log("🏭 Deploying ContestFactory...");
  const ContestFactory = await hre.ethers.getContractFactory("ContestFactory");
  const contestFactory = await ContestFactory.deploy(deployer.address); // Fee collector = deployer
  await contestFactory.waitForDeployment();
  const contestFactoryAddress = await contestFactory.getAddress();
  console.log("✅ ContestFactory deployed to:", contestFactoryAddress);

  // Deploy VotingContract
  console.log("\n🗳️  Deploying VotingContract...");
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy(contestFactoryAddress);
  await votingContract.waitForDeployment();
  const votingContractAddress = await votingContract.getAddress();
  console.log("✅ VotingContract deployed to:", votingContractAddress);

  // Summary
  console.log("\n🎉 Deployment Complete!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 DEPLOYMENT SUMMARY");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId.toString());
  console.log("\n📍 Contract Addresses:");
  console.log("   ContestFactory:", contestFactoryAddress);
  console.log("   VotingContract:", votingContractAddress);
  console.log("\n🔗 Add to .env:");
  console.log(`NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=${contestFactoryAddress}`);
  console.log(`NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=${votingContractAddress}`);

  // Verification instructions
  if (hre.network.name === "alfajores" || hre.network.name === "celo") {
    console.log("\n🔍 To verify contracts on Celoscan:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contestFactoryAddress} "${deployer.address}"`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${votingContractAddress} "${contestFactoryAddress}"`);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      ContestFactory: contestFactoryAddress,
      VotingContract: votingContractAddress,
    },
  };

  const deploymentPath = `./deployments/${hre.network.name}_latest.json`;
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", deploymentPath, "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
