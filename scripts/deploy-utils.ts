import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

export interface DeploymentRecord {
  contractName: string;
  address: string;
  network: string;
  chainId?: number;
  deployer: string;
  transactionHash: string;
  constructorArgs: any[];
  deployedAt: string;
  blockNumber?: number;
  gasUsed?: string;
  verified?: boolean;
}

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Network configurations
export const NETWORKS: Record<string, NetworkConfig> = {
  alfajores: {
    name: "Celo Alfajores Testnet",
    chainId: 44787,
    rpcUrl: "https://alfajores-forno.celo-testnet.org",
    blockExplorer: "https://alfajores.celoscan.io",
    nativeCurrency: {
      name: "Celo",
      symbol: "CELO",
      decimals: 18,
    },
  },
  celo: {
    name: "Celo Mainnet",
    chainId: 42220,
    rpcUrl: "https://forno.celo.org",
    blockExplorer: "https://celoscan.io",
    nativeCurrency: {
      name: "Celo",
      symbol: "CELO",
      decimals: 18,
    },
  },
};

// Utility functions
export class DeploymentUtils {
  private static deploymentLogPath = path.join(process.cwd(), "deployments");

  /**
   * Save deployment record to file
   */
  static saveDeployment(record: DeploymentRecord): void {
    const networkDir = path.join(this.deploymentLogPath, record.network);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(networkDir)) {
      fs.mkdirSync(networkDir, { recursive: true });
    }

    // Save individual contract deployment
    const contractFile = path.join(networkDir, `${record.contractName}.json`);
    fs.writeFileSync(contractFile, JSON.stringify(record, null, 2));

    // Update deployments summary
    this.updateDeploymentsSummary(record);

    console.log(`📁 Deployment saved to: ${contractFile}`);
  }

  /**
   * Update deployments summary file
   */
  private static updateDeploymentsSummary(record: DeploymentRecord): void {
    const summaryFile = path.join(this.deploymentLogPath, `${record.network}-summary.json`);
    
    let summary: DeploymentRecord[] = [];
    if (fs.existsSync(summaryFile)) {
      summary = JSON.parse(fs.readFileSync(summaryFile, "utf8"));
    }

    // Remove existing record for same contract if exists
    summary = summary.filter(r => r.contractName !== record.contractName);
    
    // Add new record
    summary.push(record);
    
    // Sort by deployment date
    summary.sort((a, b) => new Date(a.deployedAt).getTime() - new Date(b.deployedAt).getTime());

    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  }

  /**
   * Load deployment record
   */
  static loadDeployment(contractName: string, network: string): DeploymentRecord | null {
    const contractFile = path.join(this.deploymentLogPath, network, `${contractName}.json`);
    
    if (fs.existsSync(contractFile)) {
      return JSON.parse(fs.readFileSync(contractFile, "utf8"));
    }
    
    return null;
  }

  /**
   * Get all deployments for a network
   */
  static getNetworkDeployments(network: string): DeploymentRecord[] {
    const summaryFile = path.join(this.deploymentLogPath, `${network}-summary.json`);
    
    if (fs.existsSync(summaryFile)) {
      return JSON.parse(fs.readFileSync(summaryFile, "utf8"));
    }
    
    return [];
  }

  /**
   * Check if contract is deployed
   */
  static isDeployed(contractName: string, network: string): boolean {
    return this.loadDeployment(contractName, network) !== null;
  }

  /**
   * Get contract address
   */
  static getContractAddress(contractName: string, network: string): string | null {
    const deployment = this.loadDeployment(contractName, network);
    return deployment ? deployment.address : null;
  }

  /**
   * Format deployment info for logging
   */
  static formatDeploymentInfo(record: DeploymentRecord): string {
    const network = NETWORKS[record.network];
    const explorerUrl = network ? `${network.blockExplorer}/address/${record.address}` : "";

    return `
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT SUCCESSFUL                    │
├─────────────────────────────────────────────────────────────┤
│ Contract: ${record.contractName.padEnd(48)} │
│ Network:  ${record.network.padEnd(48)} │ 
│ Address:  ${record.address.padEnd(48)} │
│ TX Hash:  ${record.transactionHash.padEnd(48)} │
│ Gas Used: ${(record.gasUsed || 'N/A').padEnd(48)} │
│ Block:    ${(record.blockNumber?.toString() || 'N/A').padEnd(48)} │
├─────────────────────────────────────────────────────────────┤
│ Explorer: ${explorerUrl.padEnd(48)} │
└─────────────────────────────────────────────────────────────┘
    `;
  }

  /**
   * Validate private key format
   */
  static validatePrivateKey(privateKey: string): boolean {
    if (!privateKey) return false;
    
    // Remove 0x prefix if present
    const key = privateKey.startsWith("0x") ? privateKey.slice(2) : privateKey;
    
    // Check if it's 64 hex characters
    return /^[a-fA-F0-9]{64}$/.test(key);
  }

  /**
   * Get deployer info
   */
  static async getDeployerInfo(privateKey: string): Promise<{
    address: string;
    balance: string;
  }> {
    const wallet = new ethers.Wallet(privateKey);
    const provider = ethers.provider;
    
    const balance = await provider.getBalance(wallet.address);
    
    return {
      address: wallet.address,
      balance: ethers.formatEther(balance),
    };
  }

  /**
   * Estimate deployment cost
   */
  static async estimateDeploymentCost(
    contractName: string,
    constructorArgs: any[] = []
  ): Promise<{
    gasEstimate: bigint;
    costInWei: bigint;
    costInEther: string;
  }> {
    const ContractFactory = await ethers.getContractFactory(contractName);
    const gasEstimate = await ethers.provider.estimateGas(
      ContractFactory.getDeployTransaction(...constructorArgs)
    );
    
    const gasPrice = await ethers.provider.getFeeData();
    const costInWei = gasEstimate * (gasPrice.gasPrice || 0n);
    
    return {
      gasEstimate,
      costInWei,
      costInEther: ethers.formatEther(costInWei),
    };
  }

  /**
   * Wait for confirmation
   */
  static async waitForConfirmation(
    txHash: string,
    confirmations: number = 2
  ): Promise<ethers.TransactionReceipt | null> {
    console.log(`⏳ Waiting for ${confirmations} confirmation(s)...`);
    
    const receipt = await ethers.provider.waitForTransaction(txHash, confirmations);
    
    if (receipt) {
      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
    }
    
    return receipt;
  }

  /**
   * Generate deployment report
   */
  static generateReport(network: string): string {
    const deployments = this.getNetworkDeployments(network);
    const networkConfig = NETWORKS[network];
    
    if (deployments.length === 0) {
      return `📄 No deployments found for network: ${network}`;
    }

    let report = `
📊 DEPLOYMENT REPORT - ${networkConfig?.name || network.toUpperCase()}
${"=".repeat(60)}

`;

    deployments.forEach((deployment, index) => {
      const explorerUrl = networkConfig 
        ? `${networkConfig.blockExplorer}/address/${deployment.address}` 
        : "";

      report += `
${index + 1}. ${deployment.contractName}
   Address: ${deployment.address}
   Deployed: ${new Date(deployment.deployedAt).toLocaleString()}
   Gas Used: ${deployment.gasUsed || 'N/A'}
   Explorer: ${explorerUrl}
   Verified: ${deployment.verified ? '✅' : '❌'}
`;
    });

    report += `
${"=".repeat(60)}
Total Contracts: ${deployments.length}
`;

    return report;
  }
}

export default DeploymentUtils;