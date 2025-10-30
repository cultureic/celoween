const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env.local" });

module.exports = async function (hre) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  log("🚀 Deploying MilestoneBadge contract...");
  log(`Network: ${network.name}`);
  log(`Deployer: ${deployer}`);

  // Contract constructor parameters
  const baseURI = process.env.MILESTONE_BADGE_BASE_URI || "https://academy.celo.org/api/metadata/milestone/";

  log(`Base URI: ${baseURI}`);

  // Deploy the contract
  const milestoneBadge = await deploy("MilestoneBadge", {
    from: deployer,
    args: [baseURI],
    log: true,
    waitConfirmations: network.name === "celo" ? 5 : 2,
    gasLimit: 2000000, // Set a reasonable gas limit
  });

  log(`✅ MilestoneBadge deployed to: ${milestoneBadge.address}`);
  log(`📝 Transaction hash: ${milestoneBadge.transactionHash}`);

  // Save deployment info to file
  const deploymentInfo = {
    contractName: "MilestoneBadge",
    address: milestoneBadge.address,
    network: network.name,
    chainId: network.config.chainId,
    deployer: deployer,
    transactionHash: milestoneBadge.transactionHash,
    constructorArgs: [baseURI],
    deployedAt: new Date().toISOString(),
    blockNumber: milestoneBadge.receipt?.blockNumber,
    gasUsed: milestoneBadge.receipt?.gasUsed?.toString(),
  };

  log("📄 Deployment Summary:");
  log(JSON.stringify(deploymentInfo, null, 2));

  return true;
};

module.exports.tags = ["MilestoneBadge", "badges", "nft"];
module.exports.id = "deploy_milestone_badge";