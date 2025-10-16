require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config({ path: ".env.local" });

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
const CELOSCAN_API_KEY = process.env.CELOSCAN_API_KEY || "";

if (!DEPLOYER_PRIVATE_KEY) {
  console.warn("Warning: DEPLOYER_PRIVATE_KEY not found in environment variables");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    // Hardhat local network
    hardhat: {
      chainId: 31337,
      gasPrice: 8000000000,
      blockGasLimit: 30000000,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      gasPrice: 8000000000,
    },
    // Celo Alfajores Testnet
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
      chainId: 44787,
      timeout: 60000,
      gasPrice: 100000000000, // 100 Gwei - much higher
    },
    // Celo Sepolia Testnet (NEW - recommended)
    celoSepolia: {
      url: "https://forno.celo-sepolia.celo-testnet.org",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
      chainId: 11142220,
      timeout: 120000,
    },
    // Celo Mainnet
    celo: {
      url: "https://forno.celo.org",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
      chainId: 42220,
      gas: 10000000,
      gasPrice: 0.5 * 10 ** 9, // 0.5 Gwei
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // First account will be the deployer
      alfajores: 0,
      celo: 0,
    },
    owner: {
      default: 0, // Same as deployer for now
      alfajores: 0,
      celo: 0,
    },
  },
  etherscan: {
    apiKey: {
      alfajores: CELOSCAN_API_KEY,
      celo: CELOSCAN_API_KEY,
    },
    customChains: [
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io",
        },
      },
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    gasPrice: 0.5, // Gwei
  },
  paths: {
    sources: "./contracts",
    tests: "./test/contracts",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "./deploy",
    deployments: "./deployments",
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false,
    externalArtifacts: ["externalArtifacts/*.json"],
  },
};