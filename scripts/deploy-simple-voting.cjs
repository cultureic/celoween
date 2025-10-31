const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying SimpleVoting Contract");
  console.log(`Network: ${network.name}`);
  console.log(`Chain ID: ${network.config.chainId}`);
  
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${ethers.formatEther(balance)} CELO\n`);
  
  // Deploy SimpleVoting
  console.log("📦 Deploying SimpleVoting...");
  const SimpleVoting = await ethers.getContractFactory("SimpleVoting");
  const voting = await SimpleVoting.deploy();
  
  await voting.waitForDeployment();
  const address = await voting.getAddress();
  
  console.log(`✅ SimpleVoting deployed to: ${address}\n`);
  
  // Save deployment info
  const deployment = {
    network: network.name,
    chainId: network.config.chainId,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      SimpleVoting: {
        address: address,
        constructorArgs: []
      }
    }
  };
  
  const deploymentDir = path.join(__dirname, "../deployments", network.name);
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  const deploymentPath = path.join(deploymentDir, "simple-voting-deployment.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  
  console.log(`📝 Deployment saved to: ${deploymentPath}`);
  console.log(`\n✅ Update your .env.local with:`);
  console.log(`NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
