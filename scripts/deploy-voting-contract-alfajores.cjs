const hre = require("hardhat");
require("dotenv").config({ path: ".env.local" });

async function main() {
  console.log("🚀 Deploying VotingContract to Celo Alfajores...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "CELO");

  // Get ContestFactory address from environment
  const contestFactoryAddress = process.env.NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS;
  
  if (!contestFactoryAddress) {
    throw new Error(
      "❌ NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS not found in .env.local\n" +
      "Please deploy ContestFactory first using: npx hardhat run scripts/deploy-contest-factory-alfajores.cjs --network alfajores"
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
  const receipt = await votingContract.deploymentTransaction().wait(3);

  console.log("\n📝 Save this address to your .env.local:");
  console.log(`NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=${votingAddress}`);

  console.log("\n🔍 Verify on Celo Explorer:");
  console.log(`https://alfajores.celoscan.io/address/${votingAddress}`);

  console.log("\n💰 Estimated mainnet deployment cost:");
  const gasUsed = receipt.gasUsed;
  const mainnetGasPrice = 0.5 * 10 ** 9; // 0.5 Gwei typical on Celo mainnet
  const estimatedCost = Number(gasUsed) * mainnetGasPrice / 10 ** 18;
  console.log(`Gas used: ${gasUsed.toString()}`);
  console.log(`Estimated cost on mainnet: ~${estimatedCost.toFixed(6)} CELO (~$${(estimatedCost * 0.70).toFixed(4)} USD at $0.70/CELO)`);

  console.log("\n⚙️ Next steps:");
  console.log("1. Add the voting contract address to .env.local");
  console.log("2. Configure ZeroDev project for Celo Alfajores (Chain ID: 44787)");
  console.log("3. Add NEXT_PUBLIC_ZERODEV_PROJECT_ID to .env.local");
  console.log("4. Restart your dev server");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
