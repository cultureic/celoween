const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ContestFactory to Celo Sepolia...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "CELO");

  // Deploy ContestFactory
  const ContestFactory = await hre.ethers.getContractFactory("ContestFactory");
  console.log("Deploying ContestFactory...");
  
  const contestFactory = await ContestFactory.deploy(deployer.address);
  await contestFactory.waitForDeployment();
  
  const factoryAddress = await contestFactory.getAddress();
  console.log("✅ ContestFactory deployed to:", factoryAddress);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await contestFactory.deploymentTransaction().wait(3);

  console.log("\n📝 Save this address to your .env.local:");
  console.log(`NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=${factoryAddress}`);

  console.log("\n🔍 Verify on Celo Explorer:");
  console.log(`https://celo-sepolia.blockscout.com/address/${factoryAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
