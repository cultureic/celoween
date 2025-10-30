const hre = require("hardhat");

async function main() {
  console.log("🎃 Checking Deployments on Alfajores...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deployer address:", deployer.address);
  console.log("🌐 Explorer: https://alfajores.celoscan.io/address/" + deployer.address);
  
  const nonce = await hre.ethers.provider.getTransactionCount(deployer.address, "latest");
  const pendingNonce = await hre.ethers.provider.getTransactionCount(deployer.address, "pending");
  
  console.log("\n📝 Nonce info:");
  console.log("   Latest nonce:", nonce);
  console.log("   Pending nonce:", pendingNonce);
  
  if (pendingNonce > nonce) {
    console.log("   ⚠️  There are", (pendingNonce - nonce), "pending transactions");
  } else {
    console.log("   ✅ No pending transactions");
  }
  
  console.log("\n💡 Check recent transactions at:");
  console.log("   https://alfajores.celoscan.io/address/" + deployer.address + "#transactions");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
