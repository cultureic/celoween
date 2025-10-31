const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ContestFactory to Celo MAINNET...");
  console.log("⚠️  THIS IS A MAINNET DEPLOYMENT - REAL FUNDS WILL BE USED");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "CELO");

  if (Number(hre.ethers.formatEther(balance)) < 1) {
    throw new Error("❌ Insufficient balance for mainnet deployment. Need at least 1 CELO.");
  }

  // Deploy ContestFactory
  const ContestFactory = await hre.ethers.getContractFactory("ContestFactory");
  console.log("Deploying ContestFactory...");
  
  const contestFactory = await ContestFactory.deploy(deployer.address);
  
  console.log("Transaction sent, waiting for deployment...");
  await contestFactory.waitForDeployment();
  
  const factoryAddress = await contestFactory.getAddress();
  console.log("✅ ContestFactory deployed to:", factoryAddress);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  const receipt = await contestFactory.deploymentTransaction().wait(3);

  console.log("\n📝 Add this to your .env.local:");
  console.log(`NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=${factoryAddress}`);
  console.log(`NEXT_PUBLIC_USE_TESTNET=false`);

  console.log("\n🔍 Verify on Celo Explorer:");
  console.log(`https://celoscan.io/address/${factoryAddress}`);
  
  console.log("\n💰 Deployment cost:");
  const gasUsed = receipt.gasUsed;
  const gasPrice = receipt.gasPrice;
  const cost = Number(gasUsed) * Number(gasPrice) / 10 ** 18;
  console.log(`Gas used: ${gasUsed.toString()}`);
  console.log(`Gas price: ${hre.ethers.formatUnits(gasPrice, 'gwei')} Gwei`);
  console.log(`Total cost: ${cost.toFixed(6)} CELO (~$${(cost * 0.70).toFixed(4)} USD at $0.70/CELO)`);
  
  console.log("\n⚠️  IMPORTANT:");
  console.log("1. Save the contract address above");
  console.log("2. Update .env.local with the address");
  console.log("3. Verify the contract on Celoscan (optional but recommended)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
