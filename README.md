# 🎃 Celoween - Halloween Contest Platform

**Decentralized talent competition platform with gasless voting on Celo**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Celo](https://img.shields.io/badge/Celo-Alfajores-green)](https://docs.celo.org/)

---

## 🎯 What is Celoween?

Celoween is a decentralized contest platform where creators can:
- 🎨 **Submit** creative Halloween-themed content (music, art, stories)
- 🗳️ **Vote** on submissions using gasless transactions
- 💰 **Win prizes** in cUSD or CELO tokens
- 🏆 **Claim rewards** securely on-chain

Built with Celo's Smart Account infrastructure for a seamless, gas-free user experience.

---

## ✨ Key Features

### For Participants
- 🎤 Submit entries to multiple contests
- 👻 Gasless voting (no transaction fees!)
- 🏅 Track your submissions and votes
- 💸 Claim prize rewards automatically

### For Contest Hosts
- 🚀 Create custom contests with prize pools
- 📊 Track submissions and voting in real-time
- 🎯 Set custom rules and deadlines
- ⚡ Automated prize distribution

### Technical Highlights
- ⛽ **Gasless Transactions** via Biconomy Smart Accounts
- 🔐 **Wallet Authentication** with Privy
- 📱 **Responsive Design** with Halloween theme
- 🎨 **Animated UI** with Lottie animations
- 💾 **PostgreSQL Database** for off-chain data
- 🔗 **Smart Contracts** on Celo Alfajores

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.0.0+ 
- PostgreSQL (or Supabase account)
- Wallet with Alfajores testnet tokens

### 1. Clone & Install
```bash
git clone https://github.com/your-org/celoween.git
cd celoween
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Fill in required values (see [ENV_CONFIG.md](./ENV_CONFIG.md)):
- `NEXT_PUBLIC_PRIVY_APP_ID` - Get from [Privy Dashboard](https://dashboard.privy.io)
- `DATABASE_URL` - PostgreSQL connection string
- `PRIVY_APP_SECRET` - Privy secret key

### 3. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed sample contests
npm run prisma:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000 🎃

---

## 📁 Project Structure

```
celoween/
├── app/                      # Next.js 15 App Router
│   ├── contests/            # Contest browsing and detail pages
│   ├── create/              # Contest creation
│   ├── profile/             # User profile and rewards
│   ├── api/                 # API endpoints
│   └── globals.css          # Halloween theme styles
├── components/
│   ├── contests/            # Contest UI components
│   ├── animations/          # Lottie animations
│   └── ui/                  # Reusable UI components
├── contracts/               # Smart contracts (Solidity)
│   ├── ContestFactory.sol   # Contest creation
│   ├── VotingContract.sol   # Gasless voting
│   └── PrizePool.sol        # Prize distribution
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed-contests.js     # Sample data
├── lib/                     # Utilities and hooks
└── public/                  # Static assets
```

---

## 🎨 Halloween Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| 🎃 Pumpkin Orange | `#FF6B00` | Primary, CTAs |
| 💜 Neon Violet | `#B873FF` | Secondary, accents |
| 🖤 Abyss Black | `#0B0B0C` | Background |
| 🔲 Charcoal Gray | `#1B1B1E` | Surfaces |
| 💚 Acid Green | `#9FFF5B` | Success, rewards |

### Typography
- **Display:** Creepster (Halloween headers)
- **Body:** Inter, Poppins (readability)

### Special Effects
- Glow borders on hover
- Floating ghost animations
- Particle effects (bats, pumpkins)

---

## 🔧 Available Scripts

```bash
# Development
npm run dev                  # Start dev server
npm run build                # Production build
npm run start                # Start production server
npm run lint                 # Run ESLint

# Database
npm run prisma:generate      # Generate Prisma client
npm run prisma:migrate       # Run migrations
npm run prisma:seed          # Seed sample data
npm run prisma:studio        # Open database GUI

# Smart Contracts (after Phase 4)
npm run hardhat:compile      # Compile contracts
npm run hardhat:test         # Test contracts
npm run deploy:alfajores     # Deploy to testnet
npm run verify:alfajores     # Verify on block explorer
```

---

## 📚 Documentation

| Document | Description |
|----------|-----------|
| [STATUS.md](./STATUS.md) | ⭐ Current development status (start here!) |
| [CELOWEEN_QUICKSTART.md](./CELOWEEN_QUICKSTART.md) | Quick start guide for developers |
| [ENV_CONFIG.md](./ENV_CONFIG.md) | Complete environment setup guide |
| [MIGRATION_PROGRESS.md](./MIGRATION_PROGRESS.md) | Detailed progress tracking |
| [CLEANUP_REPORT.md](./CLEANUP_REPORT.md) | Transformation from academy |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router, RSC)
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 3.4
- **UI:** Radix UI, shadcn/ui
- **Animations:** Framer Motion, Lottie

### Backend
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 5.0
- **Auth:** Privy (Wallet-based)
- **API:** Next.js API Routes

### Web3
- **Blockchain:** Celo Alfajores Testnet
- **Smart Accounts:** Biconomy (gasless transactions)
- **Web3 Library:** Wagmi + Viem
- **Wallet:** Privy (embedded wallets)

### DevOps
- **Hosting:** Vercel
- **Monitoring:** Sentry (optional)
- **CI/CD:** GitHub Actions

---

## 🌐 Environment Variables

See [ENV_CONFIG.md](./ENV_CONFIG.md) for complete setup guide.

### Required:
```env
NEXT_PUBLIC_PRIVY_APP_ID=        # Privy authentication
PRIVY_APP_SECRET=                 # Privy secret
DATABASE_URL=                     # PostgreSQL connection
```

### Phase 7 (Gasless Voting):
```env
NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY=  # Biconomy paymaster
NEXT_PUBLIC_BUNDLER_URL=                 # Transaction bundler
```

### Phase 4 (Smart Contracts):
```env
NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=     # Contest factory
NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=     # Voting contract
NEXT_PUBLIC_PRIZE_POOL_ADDRESS=          # Prize pool
```

---

## 🚦 Development Status

**Current Phase:** 3/10 Complete (30%)

✅ Phase 1: Design System  
✅ Phase 2: Database Schema  
✅ Phase 3: Dependencies  
🔜 Phase 4: Smart Contracts  
🔜 Phase 5: Pages & Routes  
🔜 Phase 6: UI Components  
🔜 Phase 7: Web3 Integration  
🔜 Phase 8: API Routes  
🔜 Phase 9: Animations  
🔜 Phase 10: Testing & Deployment  

See [MIGRATION_PROGRESS.md](./MIGRATION_PROGRESS.md) for detailed status.

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add: Amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- TypeScript strict mode (no `any`)
- ESLint + Prettier configured
- Conventional commits (feat:, fix:, docs:, etc.)
- Test new features

---

## 🐛 Troubleshooting

### "Missing NEXT_PUBLIC_PRIVY_APP_ID"
```bash
# Copy .env.example and fill in values
cp .env.example .env.local

# Restart dev server
npm run dev
```

### "PrismaClient failed to initialize"
```bash
npx prisma generate
npx prisma migrate dev
```

### "Cannot connect to database"
```bash
# Test connection
npx prisma studio

# Check DATABASE_URL format
# postgresql://user:password@host:port/database
```

See [ENV_CONFIG.md](./ENV_CONFIG.md) for more troubleshooting.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Celo Foundation](https://celo.org) - Blockchain infrastructure
- [Privy](https://privy.io) - Wallet authentication
- [Biconomy](https://biconomy.io) - Gasless transactions
- [Vercel](https://vercel.com) - Hosting
- [Supabase](https://supabase.com) - Database

---

## 📞 Support

- 📧 Email: contact@celoween.com
- 💬 Discord: [Celoween Community](#)
- 🐦 Twitter: [@Celoween](#)
- 📱 Telegram: [t.me/Celoween](#)

---

## 🎃 Ready to Build?

```bash
# Start developing
npm run dev

# Check the quick start guide
cat CELOWEEN_QUICKSTART.md

# Review environment setup
cat ENV_CONFIG.md
```

**Happy Haunting! 👻**

---

<div align="center">
  <strong>Celoween</strong><br>
  Decentralized Halloween Talent Show on Celo
  <br><br>
  <a href="./CELOWEEN_QUICKSTART.md">Quick Start</a> ·
  <a href="./ENV_CONFIG.md">Configuration</a> ·
  <a href="./MIGRATION_PLAN.md">Roadmap</a>
</div>
# Force rebuild Fri Oct 31 15:10:41 PDT 2025
