const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ContestFactory to Celo Alfajores...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "CELO");

  // Deploy ContestFactory
  const ContestFactory = await hre.ethers.getContractFactory("ContestFactory");
  console.log("Deploying ContestFactory...");
  
  // Get current nonce
  const nonce = await deployer.getNonce();
  console.log("Current nonce:", nonce);
  
  const contestFactory = await ContestFactory.deploy(deployer.address, {
    gasPrice: 200000000000, // 200 Gwei
    nonce: nonce,
  });
  
  console.log("Transaction sent, waiting for deployment...");
  await contestFactory.waitForDeployment();
  
  const factoryAddress = await contestFactory.getAddress();
  console.log("✅ ContestFactory deployed to:", factoryAddress);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await contestFactory.deploymentTransaction().wait(3);

  console.log("\n📝 Save this address to your .env.local:");
  console.log(`NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=${factoryAddress}`);

  console.log("\n🔍 Verify on Celo Explorer:");
  console.log(`https://alfajores.celoscan.io/address/${factoryAddress}`);
  
  console.log("\n💰 Estimated mainnet deployment cost:");
  const deployTx = contestFactory.deploymentTransaction();
  const gasUsed = (await deployTx.wait()).gasUsed;
  const mainnetGasPrice = 0.5 * 10 ** 9; // 0.5 Gwei typical on Celo mainnet
  const estimatedCost = Number(gasUsed) * mainnetGasPrice / 10 ** 18;
  console.log(`Gas used: ${gasUsed.toString()}`);
  console.log(`Estimated cost on mainnet: ~${estimatedCost.toFixed(6)} CELO (~$${(estimatedCost * 0.70).toFixed(4)} USD at $0.70/CELO)`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
