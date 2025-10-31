const hre = require("hardhat");

async function main() {
  console.log("Deploying SimpleVoting contract to Celo mainnet...");

  const SimpleVoting = await hre.ethers.getContractFactory("SimpleVoting");
  const voting = await SimpleVoting.deploy();

  await voting.waitForDeployment();
  const address = await voting.getAddress();

  console.log("✅ SimpleVoting deployed to:", address);
  console.log("\nAdd this to your .env.local:");
  console.log(`NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=${address}`);
  
  console.log("\nVerifying contract...");
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("✅ Contract verified");
  } catch (error) {
    console.log("⚠️  Verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
