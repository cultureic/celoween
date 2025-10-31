const hre = require("hardhat");
require("dotenv").config({ path: ".env.local" });

async function main() {
  console.log("🚀 Deploying VotingContract to Celo Sepolia...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "CELO");

  // Get ContestFactory address from environment
  const contestFactoryAddress = process.env.NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS;
  
  if (!contestFactoryAddress) {
    throw new Error(
      "❌ NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS not found in .env.local\n" +
      "Please deploy ContestFactory first using: npx hardhat run scripts/deploy-contest-factory.cjs --network celoSepolia"
    );
  }

  console.log("Using ContestFactory at:", contestFactoryAddress);

  // Deploy VotingContract
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  console.log("Deploying VotingContract...");
  
  const votingContract = await VotingContract.deploy(contestFactoryAddress);
  await votingContract.waitForDeployment();
  
  const votingAddress = await votingContract.getAddress();
  console.log("✅ VotingContract deployed to:", votingAddress);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await votingContract.deploymentTransaction().wait(3);

  console.log("\n📝 Save this address to your .env.local:");
  console.log(`NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=${votingAddress}`);

  console.log("\n🔍 Verify on Celo Explorer:");
  console.log(`https://celo-sepolia.blockscout.com/address/${votingAddress}`);

  console.log("\n⚙️ Next steps:");
  console.log("1. Add the voting contract address to .env.local");
  console.log("2. Restart your dev server");
  console.log("3. Make sure your ZeroDev project is configured for Celo Sepolia (Chain ID: 11142220)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
