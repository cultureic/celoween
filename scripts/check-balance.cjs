const hre = require("hardhat");

async function main() {
  console.log("🎃 Checking Deployer Balance on Alfajores...\n");

  const [deployer] = await hre.ethers.getSigners();
  
  console.log("📍 Deployer address:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceInCelo = hre.ethers.formatEther(balance);
  
  console.log("💰 Balance:", balanceInCelo, "CELO");
  
  if (parseFloat(balanceInCelo) < 0.1) {
    console.log("\n⚠️  Warning: Low balance!");
    console.log("Get testnet CELO from: https://faucet.celo.org");
    console.log("Or: https://celo.org/developers/faucet");
  } else {
    console.log("\n✅ Sufficient balance for deployment");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
