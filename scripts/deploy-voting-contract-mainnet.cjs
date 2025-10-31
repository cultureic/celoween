const hre = require("hardhat");
require("dotenv").config({ path: ".env.local" });

async function main() {
  console.log("🚀 Deploying VotingContract to Celo MAINNET...");
  console.log("⚠️  THIS IS A MAINNET DEPLOYMENT - REAL FUNDS WILL BE USED");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "CELO");

  if (Number(hre.ethers.formatEther(balance)) < 0.5) {
    throw new Error("❌ Insufficient balance for mainnet deployment. Need at least 0.5 CELO.");
  }

  // Get ContestFactory address from environment
  const contestFactoryAddress = process.env.NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS;
  
  if (!contestFactoryAddress) {
    throw new Error(
      "❌ NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS not found in .env.local\n" +
      "Please deploy ContestFactory first using: npx hardhat run scripts/deploy-contest-factory-mainnet.cjs --network celo"
    );
  }

  console.log("Using ContestFactory at:", contestFactoryAddress);

  // Deploy VotingContract
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  console.log("Deploying VotingContract...");
  
  const votingContract = await VotingContract.deploy(contestFactoryAddress);
  
  console.log("Transaction sent, waiting for deployment...");
  await votingContract.waitForDeployment();
  
  const votingAddress = await votingContract.getAddress();
  console.log("✅ VotingContract deployed to:", votingAddress);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  const receipt = await votingContract.deploymentTransaction().wait(3);

  console.log("\n📝 Add this to your .env.local:");
  console.log(`NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=${votingAddress}`);

  console.log("\n🔍 Verify on Celo Explorer:");
  console.log(`https://celoscan.io/address/${votingAddress}`);

  console.log("\n💰 Deployment cost:");
  const gasUsed = receipt.gasUsed;
  const gasPrice = receipt.gasPrice;
  const cost = Number(gasUsed) * Number(gasPrice) / 10 ** 18;
  console.log(`Gas used: ${gasUsed.toString()}`);
  console.log(`Gas price: ${hre.ethers.formatUnits(gasPrice, 'gwei')} Gwei`);
  console.log(`Total cost: ${cost.toFixed(6)} CELO (~$${(cost * 0.70).toFixed(4)} USD at $0.70/CELO)`);

  console.log("\n⚠️  IMPORTANT:");
  console.log("1. Save the voting contract address above");
  console.log("2. Update .env.local with NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS");
  console.log("3. Set NEXT_PUBLIC_USE_TESTNET=false in .env.local");
  console.log("4. Configure ZeroDev project for Celo Mainnet (Chain ID: 42220)");
  console.log("5. Verify the contract on Celoscan (optional but recommended)");
  console.log("6. Restart your dev server");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
