const hre = require("hardhat");
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "CELO");
}
main().catch(console.error);
