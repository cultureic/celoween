# 🚀 Hardhat Deployment Guide
**Celo Mexico Academy - Smart Contract Deployment**

*Last Updated: 2025-01-30*  
*Hardhat Version: 3.0.6*  
*Supported Networks: Celo Mainnet, Celo Alfajores Testnet*

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Prerequisites](#-prerequisites)
- [Setup](#-setup)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Verification](#-verification)
- [Network Details](#-network-details)
- [Troubleshooting](#-troubleshooting)
- [Security Best Practices](#-security-best-practices)

---

## 🌟 Overview

This guide provides comprehensive instructions for deploying smart contracts to Celo networks using Hardhat. The deployment system includes:

- ✅ **Automated deployment scripts** for both Celo Mainnet and Alfajores testnet
- ✅ **Contract verification** on CeloScan block explorers
- ✅ **Gas optimization** and cost estimation
- ✅ **Deployment tracking** and logging
- ✅ **Environment configuration** management
- ✅ **Security validations** and best practices

### Contracts Included

- **MilestoneBadge.sol**: ERC-1155 NFT contract for course completion certificates

---

## 📋 Prerequisites

### Required Software
- Node.js (v20.12.0 or higher)
- npm or yarn
- Git

### Required Accounts
- **Deployer Wallet**: With CELO tokens for gas fees
- **CeloScan API Key**: For contract verification (optional)

### Minimum Balance Requirements
- **Alfajores Testnet**: 5 CELO (get from [faucet](https://faucet.celo.org/alfajores))
- **Celo Mainnet**: 10 CELO (for gas fees and safety buffer)

---

## 🛠️ Setup

### 1. Install Dependencies

```bash
# Install Hardhat and deployment dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox hardhat-deploy dotenv

# Verify installation
npx hardhat --version
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.hardhat.example .env.hardhat

# Edit the configuration file
nano .env.hardhat
```

### 3. Required Environment Variables

```bash
# .env.hardhat file
DEPLOYER_PRIVATE_KEY=your_private_key_here
CELOSCAN_API_KEY=your_celoscan_api_key_here
MILESTONE_BADGE_BASE_URI=https://your-api.com/metadata/
AUTO_VERIFY=true
```

⚠️ **Security Warning**: Never commit `.env.hardhat` to version control!

---

## ⚙️ Configuration

### Hardhat Networks

The `hardhat.config.ts` file is pre-configured with:

```typescript
networks: {
  alfajores: {
    url: "https://alfajores-forno.celo-testnet.org",
    accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    chainId: 44787,
    gas: 10000000,
    gasPrice: 0.5 * 10 ** 9, // 0.5 Gwei
  },
  celo: {
    url: "https://forno.celo.org", 
    accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    chainId: 42220,
    gas: 10000000,
    gasPrice: 0.5 * 10 ** 9, // 0.5 Gwei
  }
}
```

### Contract Verification

Automatic verification is configured for both networks:

```typescript
verify: {
  etherscan: {
    apiKey: {
      alfajores: process.env.CELOSCAN_API_KEY,
      celo: process.env.CELOSCAN_API_KEY,
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
      // ... Celo Mainnet config
    ],
  },
}
```

---

## 🚀 Deployment

### Quick Start Commands

```bash
# Deploy to Alfajores Testnet
npm run deploy:alfajores

# Deploy to Celo Mainnet
npm run deploy:celo

# Deploy to local Hardhat network
npm run deploy:local
```

### Advanced Deployment Options

#### 1. Compile Contracts First
```bash
npm run hardhat:compile
```

#### 2. Run Tests
```bash
npm run hardhat:test
```

#### 3. Deploy with Custom Parameters
```bash
# Set custom base URI
export MILESTONE_BADGE_BASE_URI="https://custom-api.com/metadata/"
npm run deploy:alfajores
```

#### 4. Deploy Without Auto-Verification
```bash
export AUTO_VERIFY=false
npm run deploy:alfajores
```

### Deployment Output Example

```bash
🚀 Starting Celo Academy Contract Deployment
============================================
Network: alfajores (Chain ID: 44787)
Timestamp: 2025-01-30T15:00:00.000Z

Deployer Address: 0x1234567890123456789012345678901234567890
Deployer Balance: 15.5 CELO

📦 Deploying MilestoneBadge Contract
-----------------------------------
Base URI: https://academy.celo.org/api/metadata/milestone/
Gas Estimate: 1456789
Estimated Cost: 0.000728395 CELO

⏳ Deploying contract...
📝 Transaction sent: 0xabcdef1234567890abcdef1234567890abcdef12
⏳ Waiting for deployment confirmation...
⏳ Waiting for 2 confirmation(s)...
✅ Transaction confirmed in block 12345678
✅ MilestoneBadge deployed to: 0x9876543210987654321098765432109876543210

🔍 Verifying contract on block explorer...
✅ Contract verified successfully!

┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT SUCCESSFUL                    │
├─────────────────────────────────────────────────────────────┤
│ Contract: MilestoneBadge                                    │
│ Network:  alfajores                                         │ 
│ Address:  0x9876543210987654321098765432109876543210        │
│ TX Hash:  0xabcdef1234567890abcdef1234567890abcdef12        │
│ Gas Used: 1456789                                           │
│ Block:    12345678                                          │
├─────────────────────────────────────────────────────────────┤
│ Explorer: https://alfajores.celoscan.io/address/0x9876...   │
└─────────────────────────────────────────────────────────────┘

🎉 All contracts deployed successfully!
```

---

## 🔍 Verification

### Automatic Verification

Verification happens automatically if:
- `AUTO_VERIFY=true` in environment
- `CELOSCAN_API_KEY` is provided
- Deploying to live network (not hardhat)

### Manual Verification

```bash
# Verify on Alfajores
npx hardhat verify --network alfajores CONTRACT_ADDRESS "CONSTRUCTOR_ARG_1"

# Verify on Celo Mainnet  
npx hardhat verify --network celo CONTRACT_ADDRESS "CONSTRUCTOR_ARG_1"

# Example for MilestoneBadge
npx hardhat verify --network alfajores 0x1234... "https://academy.celo.org/api/metadata/milestone/"
```

### Verification Commands

```bash
# Pre-configured verification commands
npm run verify:alfajores -- CONTRACT_ADDRESS "CONSTRUCTOR_ARGS"
npm run verify:celo -- CONTRACT_ADDRESS "CONSTRUCTOR_ARGS"
```

---

## 🌐 Network Details

### Celo Alfajores Testnet

| Parameter | Value |
|-----------|-------|
| **Chain ID** | 44787 |
| **RPC URL** | https://alfajores-forno.celo-testnet.org |
| **Block Explorer** | https://alfajores.celoscan.io |
| **Faucet** | https://faucet.celo.org/alfajores |
| **Native Currency** | CELO (18 decimals) |
| **Gas Price** | ~0.5 Gwei |

### Celo Mainnet

| Parameter | Value |
|-----------|-------|
| **Chain ID** | 42220 |
| **RPC URL** | https://forno.celo.org |
| **Block Explorer** | https://celoscan.io |
| **Native Currency** | CELO (18 decimals) |
| **Gas Price** | ~0.5 Gwei |

### Gas Optimization Settings

```typescript
solidity: {
  version: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    viaIR: true,
  },
}
```

---

## 🔧 Deployment Tracking

### Deployment Records

All deployments are automatically tracked in:
- `deployments/{network}/{contract}.json` - Individual contract records
- `deployments/{network}-summary.json` - Network deployment summary

### Deployment Record Format

```json
{
  "contractName": "MilestoneBadge",
  "address": "0x1234567890123456789012345678901234567890",
  "network": "alfajores",
  "chainId": 44787,
  "deployer": "0x9876543210987654321098765432109876543210",
  "transactionHash": "0xabcdef...",
  "constructorArgs": ["https://academy.celo.org/api/metadata/milestone/"],
  "deployedAt": "2025-01-30T15:00:00.000Z",
  "blockNumber": 12345678,
  "gasUsed": "1456789",
  "verified": true
}
```

### Viewing Deployment History

The deployment scripts include utility functions:

```typescript
// Check if contract is deployed
DeploymentUtils.isDeployed("MilestoneBadge", "alfajores");

// Get contract address
DeploymentUtils.getContractAddress("MilestoneBadge", "alfajores");

// Generate deployment report
DeploymentUtils.generateReport("alfajores");
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Insufficient Balance**
```
Error: insufficient funds for gas
```
**Solution**: Add CELO to your deployer wallet from [faucet](https://faucet.celo.org/alfajores)

#### 2. **Invalid Private Key**
```
Error: invalid private key format
```
**Solution**: Ensure private key is 64 hex characters (without 0x prefix)

#### 3. **Network Connection Issues**
```
Error: network connection failed
```
**Solution**: Check RPC endpoints and network connectivity

#### 4. **Verification Failed**
```
Error: contract verification failed
```
**Solutions**:
- Wait 10-30 seconds after deployment
- Check CeloScan API key is valid
- Verify constructor arguments are correct

#### 5. **Gas Estimation Failed**
```
Error: cannot estimate gas
```
**Solution**: Increase gas limit in deployment script

### Debug Mode

Enable verbose logging:

```bash
export DEBUG=true
npm run deploy:alfajores
```

### Contract Size Issues

Check contract sizes:

```bash
npm run contracts:size
```

If contracts are too large:
- Enable `viaIR: true` in compiler settings
- Optimize with higher `runs` value
- Consider splitting large contracts

---

## 🔒 Security Best Practices

### Private Key Management

✅ **DO:**
- Use environment variables
- Use hardware wallets for mainnet
- Rotate keys regularly
- Use separate keys for testnet/mainnet

❌ **DON'T:**
- Commit private keys to git
- Share private keys
- Use same key across projects
- Store keys in plain text

### Deployment Security

✅ **Pre-Deployment Checklist:**
- [ ] Code audit completed
- [ ] Tests pass with 100% coverage
- [ ] Gas optimization verified
- [ ] Constructor parameters validated
- [ ] Network configuration verified
- [ ] Backup deployment plan ready

✅ **Post-Deployment:**
- [ ] Contract verified on explorer
- [ ] Functionality tested on network
- [ ] Access controls validated
- [ ] Documentation updated

### Network Safety

```bash
# Always test on testnet first
npm run deploy:alfajores

# Validate deployment before mainnet
# Check contract functionality
# Verify gas costs are reasonable

# Then deploy to mainnet
npm run deploy:celo
```

---

## 📚 Additional Resources

### Official Documentation
- [Celo Developer Docs](https://docs.celo.org)
- [Hardhat Documentation](https://hardhat.org/docs)
- [CeloScan API](https://celoscan.io/apis)

### Helpful Commands

```bash
# Check Hardhat installation
npx hardhat --version

# List available tasks
npx hardhat help

# Get network info
npx hardhat run scripts/network-info.ts --network alfajores

# Clean artifacts
npm run contracts:clean

# Compile contracts
npm run hardhat:compile

# Run contract tests
npm run hardhat:test
```

### Support

For deployment issues:
1. Check this documentation
2. Review Hardhat logs
3. Check network status
4. Verify environment variables
5. Test on Alfajores first

---

## 🎯 Quick Reference

### Environment Setup
```bash
cp .env.hardhat.example .env.hardhat
# Edit .env.hardhat with your keys
```

### Deploy to Testnet
```bash
npm run deploy:alfajores
```

### Deploy to Mainnet
```bash
npm run deploy:celo
```

### Verify Contract
```bash
npm run verify:alfajores -- 0xCONTRACT_ADDRESS "constructor_arg"
```

### Check Gas Costs
```bash
export REPORT_GAS=true
npm run hardhat:test
```

---

*Deployment Guide v1.0 - Created for Celo Mexico Academy*  
*For support, contact the development team or create an issue in the repository.*