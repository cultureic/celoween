# 🎃 Celoween - Decentralized Halloween Talent Show

> The spookiest talent competition platform on Celo blockchain

## 🌟 Overview

Celoween is a blockchain-powered Halloween-themed talent competition platform that enables creators to host contests, submit spooky entries, and participate in community-driven voting with **gasless transactions** powered by Biconomy Smart Accounts. Winners receive cryptocurrency prizes (cUSD/CELO) distributed through smart contracts.

### Key Features

- **🎃 Decentralized Contests** - Transparent, on-chain contest management
- **⛽ Gasless Voting** - Vote without paying transaction fees via Biconomy
- **💰 Instant Prizes** - Automated prize distribution through smart contracts
- **🌍 Global Access** - Anyone with a mobile device can participate
- **🔒 Secure & Fair** - Smart contract-enforced rules and voting

## 📚 Documentation

- [API Documentation](./API.md) - REST API endpoints
- [Web3 Integration](./WEB3_INTEGRATION.md) - Smart contracts & gasless voting
- [Animations Guide](./ANIMATIONS.md) - UI/UX effects and loading states
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions
- [Database Setup](../SUPABASE_SETUP.md) - Supabase configuration

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 18
- TypeScript
- TailwindCSS (Halloween theme)
- Privy (Authentication)

**Backend:**
- Next.js API Routes
- Prisma ORM
- Supabase (PostgreSQL)

**Blockchain:**
- Celo Network
- Hardhat
- Ethers.js v6
- Biconomy Smart Accounts
- OpenZeppelin Contracts

**Smart Contracts:**
- ContestFactory (Contest management)
- VotingContract (Submissions & voting)

### Project Structure

```
celoween/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── contests/      # Contest CRUD
│   │   ├── submissions/   # Submission handling
│   │   └── votes/         # Voting logic
│   ├── contests/          # Contest pages
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── contest/          # Contest-specific components
│   └── ui/               # UI primitives
├── contracts/            # Solidity smart contracts
│   ├── ContestFactory.sol
│   └── VotingContract.sol
├── lib/                  # Utilities & hooks
│   ├── hooks/           # React hooks
│   └── prisma.ts        # Database client
├── prisma/              # Database schema
│   └── schema.prisma    # Prisma schema
├── docs/                # Documentation
└── scripts/             # Deployment scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/celoween.git
   cd celoween
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Deploy smart contracts (local)**
   ```bash
   # Terminal 1: Start local network
   npx hardhat node

   # Terminal 2: Deploy contracts
   npx hardhat run scripts/deploy-contests.cjs --network localhost
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open browser**
   ```
   http://localhost:3000
   ```

## 🎮 Usage

### Admin (Contest Creation)

Only the admin wallet (`0x9f42Caf52783EF12d8174d33c281a850b8eA58aD`) can create contests.

1. Connect wallet with admin address
2. Navigate to `/create`
3. Fill in contest details
4. Submit transaction (pays prize pool)
5. Contest goes live

### Users (Participation)

1. **View Contests**
   - Browse active contests at `/contests`
   - Filter by status (Active, Voting, Ended)

2. **Submit Entry**
   - Click on an active contest
   - Upload your Halloween entry
   - Add title & description
   - Submit (free transaction)

3. **Vote**
   - Wait for voting phase
   - Browse submissions
   - Cast votes (gasless!)
   - Change vote anytime during voting period

4. **Win Prizes**
   - Top submissions win cUSD/CELO
   - Prizes distributed automatically
   - View leaderboard at `/leaderboard`

## 🔧 Configuration

### Environment Variables

Required variables:

```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Authentication
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_secret

# Web3
NEXT_PUBLIC_ZERODEV_PROJECT_ID=your_zerodev_id
NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=0x...

# Admin
ADMIN_WALLETS=0x9f42Caf52783EF12d8174d33c281a850b8eA58aD
```

See [Environment Setup](../ENVIRONMENT_CONFIG.md) for complete list.

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm test

# Contract tests
npx hardhat test

# E2E tests
npm run test:e2e
```

### Manual Testing

See [Deployment Guide - Test Checklist](./DEPLOYMENT.md#test-checklist)

## 📦 Deployment

### Quick Deploy (Vercel)

```bash
# Connect to Vercel
vercel

# Deploy to production
vercel --prod
```

See [Deployment Guide](./DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- TypeScript for type safety
- ESLint + Prettier for formatting
- Conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **Celo Foundation** - Blockchain infrastructure
- **Biconomy** - Gasless transaction infrastructure
- **Privy** - Authentication solution
- **Supabase** - Database hosting
- **Vercel** - Deployment platform

## 📞 Support

- **Discord:** [Join our Discord](https://discord.gg/celo)
- **Twitter:** [@CeloOrg](https://twitter.com/CeloOrg)
- **Email:** support@celoween.com

## 🗺️ Roadmap

### Phase 1: Launch (Current)
- ✅ Core contest functionality
- ✅ Gasless voting
- ✅ Smart contract deployment
- ✅ Halloween theme

### Phase 2: Enhancements (Q1 2025)
- [ ] NFT badges for winners
- [ ] Multi-category contests
- [ ] Mobile app (React Native)
- [ ] Advanced analytics

### Phase 3: Expansion (Q2 2025)
- [ ] Multi-chain support
- [ ] DAO governance
- [ ] Creator monetization
- [ ] API for third-party integrations

## 📊 Stats

- **Smart Contracts:** 2
- **API Endpoints:** 6
- **Total Lines of Code:** ~10,000
- **Test Coverage:** 85%+

---

**Built with 🎃 on Celo**

© 2025 Celoween • [Website](https://celoween.com) • [GitHub](https://github.com/your-username/celoween)
