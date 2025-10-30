import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const deployMilestoneBadge: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
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

  // Verify contract if on live network and auto-verify is enabled
  if (network.name !== "hardhat" && process.env.AUTO_VERIFY === "true") {
    log("🔍 Verifying contract on block explorer...");
    
    try {
      await hre.run("verify:verify", {
        address: milestoneBadge.address,
        constructorArguments: [baseURI],
      });
      log("✅ Contract verified successfully!");
    } catch (error) {
      log("❌ Contract verification failed:");
      log(error.message);
    }
  }

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

export default deployMilestoneBadge;
deployMilestoneBadge.tags = ["MilestoneBadge", "badges", "nft"];
deployMilestoneBadge.id = "deploy_milestone_badge";