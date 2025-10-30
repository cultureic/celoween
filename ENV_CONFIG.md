# 🎃 Celoween Environment Configuration

**Complete guide to environment variables for the Celoween Contest Platform**

---

## 📋 QUICK SETUP

1. Copy the template:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values (marked with ⚠️)

3. Start development:
   ```bash
   npm run dev
   ```

---

## 🔴 CRITICAL - REQUIRED FOR APP TO WORK

### Authentication (Privy)
```env
# Get from https://dashboard.privy.io
NEXT_PUBLIC_PRIVY_APP_ID=⚠️ REQUIRED
PRIVY_APP_SECRET=⚠️ REQUIRED
```

**How to get:**
1. Go to https://dashboard.privy.io
2. Create a new app or use existing
3. Copy App ID and App Secret
4. Configure allowed domains (localhost:3000 for dev)

---

### Database (PostgreSQL)
```env
# Production/Development database
DATABASE_URL="postgresql://username:password@host:port/celoween"

# Direct connection (for Prisma migrations)
DIRECT_URL="postgresql://username:password@host:port/celoween"
```

**Options:**

**Option A: Supabase (Recommended)**
1. Create project at https://supabase.com
2. Go to Project Settings > Database
3. Copy Connection String (Transaction mode)
4. Replace `[YOUR-PASSWORD]` with your database password

**Option B: Local PostgreSQL**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/celoween"
DIRECT_URL="postgresql://postgres:password@localhost:5432/celoween"
```

**Option C: Railway**
1. Create project at https://railway.app
2. Add PostgreSQL plugin
3. Copy DATABASE_URL from plugin settings

---

## 🟡 IMPORTANT - NEEDED FOR FULL FUNCTIONALITY

### Admin Access Control
```env
# Contest platform admins (can manage all contests)
ADMIN_WALLETS=0x1234...,0xabcd...
NEXT_PUBLIC_ADMIN_WALLETS=0x1234...,0xabcd...

# Email-based admin access (optional)
ADMIN_EMAILS=admin@celoween.com
```

---

### Smart Accounts (Biconomy) - Phase 7
```env
# For gasless voting functionality
NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY=⚠️ REQUIRED (Phase 7)
NEXT_PUBLIC_BUNDLER_URL=https://bundler.biconomy.io/api/v2/44787/
```

**How to get:**
1. Go to https://dashboard.biconomy.io
2. Create new project
3. Select Celo Alfajores network
4. Copy Paymaster API Key
5. Set up gas tank with testnet funds

---

### Smart Contracts - Phase 4
```env
# Contest platform contracts (after deployment)
NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_PRIZE_POOL_ADDRESS=0x...

# Network configuration
NEXT_PUBLIC_CHAIN_ID=44787  # Alfajores testnet
NEXT_PUBLIC_RPC_URL=https://alfajores-forno.celo-testnet.org
```

---

## 🟢 OPTIONAL - ENHANCED FEATURES

### NextAuth (Session Management)
```env
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000  # Change in production
```

Generate secret:
```bash
openssl rand -base64 32
```

---

### WalletConnect (Multi-Wallet Support)
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

**How to get:**
1. Go to https://cloud.walletconnect.com
2. Create new project
3. Copy Project ID

---

### Error Tracking (Sentry)
```env
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=your-org
SENTRY_PROJECT=celoween
```

**Setup:**
1. Create account at https://sentry.io
2. Create new project (Next.js)
3. Copy DSN

---

### Logging (Axiom)
```env
AXIOM_TOKEN=your_axiom_token
AXIOM_DATASET=celoween-logs
```

**Setup:**
1. Sign up at https://axiom.co
2. Create dataset
3. Generate token

---

### Analytics
```env
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=auto  # Auto-detected on Vercel
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Google Analytics (optional)
```

---

## 🔧 DEVELOPMENT CONFIGURATION

### Development Settings
```env
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Debug logging
DEBUG_ENABLED=true
LOG_LEVEL=debug  # debug, info, warn, error
```

---

### Rate Limiting
```env
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
```

---

### CORS Configuration
```env
ALLOWED_ORIGINS=http://localhost:3000,https://celoween.vercel.app
```

---

## 🚀 BLOCKCHAIN CONFIGURATION

### Deployment Keys (KEEP SECURE!)
```env
# ⚠️ NEVER COMMIT THIS! Use .env.local
PRIVATE_KEY=0x...your_private_key_64_chars

# For Hardhat contract deployment
DEPLOYER_PRIVATE_KEY=0x...
```

**Security Best Practices:**
- Use a dedicated deployment wallet
- Keep minimal funds (only for gas)
- Never commit to Git
- Use hardware wallet for mainnet

---

### Network Configuration
```env
# Alfajores Testnet (Development)
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
ALFAJORES_CELOSCAN_API_KEY=your_key_here

# Celo Mainnet (Production)
CELO_RPC_URL=https://forno.celo.org
CELOSCAN_API_KEY=your_key_here

# Gas settings (in wei)
CELO_GAS_PRICE=500000000
ALFAJORES_GAS_PRICE=500000000
```

**Get Celoscan API Key:**
1. Go to https://celoscan.io/apis (mainnet) or https://alfajores.celoscan.io/apis (testnet)
2. Sign up/login
3. Generate API key
4. Add to .env.local

---

## 🎯 FEATURE FLAGS

```env
# Enable/disable features during development
FEATURE_GASLESS_VOTING=true
FEATURE_PRIZE_DISTRIBUTION=false
FEATURE_ADMIN_PANEL=true
FEATURE_CONTEST_CREATION=true
```

---

## 📊 MONITORING & HEALTH CHECKS

```env
# Health check secret for monitoring endpoints
HEALTH_CHECK_SECRET=generate_random_32_chars

# Backup configuration
BACKUP_ENABLED=false  # true in production
BACKUP_FREQUENCY_HOURS=24
```

---

## 🌍 ENVIRONMENT-SPECIFIC CONFIGURATIONS

### Local Development (.env.local)
```env
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/celoween"
NEXT_PUBLIC_CHAIN_ID=44787
NEXT_PUBLIC_RPC_URL=https://alfajores-forno.celo-testnet.org
DEBUG_ENABLED=true
```

---

### Staging/Vercel Preview
```env
NODE_ENV=production
DATABASE_URL="postgresql://...@supabase/celoween_staging"
NEXT_PUBLIC_CHAIN_ID=44787
DEBUG_ENABLED=true
SENTRY_DSN=https://...@sentry.io/...
```

---

### Production
```env
NODE_ENV=production
DATABASE_URL="postgresql://...@supabase/celoween_production"
NEXT_PUBLIC_CHAIN_ID=42220  # Celo Mainnet
NEXT_PUBLIC_RPC_URL=https://forno.celo.org
DEBUG_ENABLED=false
BACKUP_ENABLED=true
SENTRY_DSN=https://...@sentry.io/...
```

---

## 📝 COMPLETE .env.example TEMPLATE

```env
# =============================================================================
# CELOWEEN - HALLOWEEN CONTEST PLATFORM
# =============================================================================
# Copy to .env.local and fill in your values
# NEVER commit .env.local to version control!

# =============================================================================
# 🔴 CRITICAL - REQUIRED
# =============================================================================

# Authentication (Privy)
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=

# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/celoween"
DIRECT_URL="postgresql://username:password@host:port/celoween"

# =============================================================================
# 🟡 IMPORTANT - CONTEST PLATFORM
# =============================================================================

# Admin Access
ADMIN_WALLETS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_ADMIN_WALLETS=0x1234567890123456789012345678901234567890
ADMIN_EMAILS=admin@celoween.com

# Smart Contracts (after Phase 4 deployment)
NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=
NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=
NEXT_PUBLIC_PRIZE_POOL_ADDRESS=

# Network
NEXT_PUBLIC_CHAIN_ID=44787
NEXT_PUBLIC_RPC_URL=https://alfajores-forno.celo-testnet.org

# Biconomy (Phase 7 - Gasless Voting)
NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY=
NEXT_PUBLIC_BUNDLER_URL=https://bundler.biconomy.io/api/v2/44787/

# =============================================================================
# 🟢 OPTIONAL - ENHANCED FEATURES
# =============================================================================

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# Monitoring
SENTRY_DSN=
AXIOM_TOKEN=
AXIOM_DATASET=celoween-logs

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=

# =============================================================================
# 🔧 DEVELOPMENT
# =============================================================================

NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
DEBUG_ENABLED=true
LOG_LEVEL=debug

# =============================================================================
# 🚀 BLOCKCHAIN (DEPLOYMENT)
# =============================================================================

# ⚠️ KEEP SECURE - NEVER COMMIT
PRIVATE_KEY=
DEPLOYER_PRIVATE_KEY=

# Network RPCs
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
CELO_RPC_URL=https://forno.celo.org

# Block Explorer API Keys
ALFAJORES_CELOSCAN_API_KEY=
CELOSCAN_API_KEY=

# =============================================================================
# 🎯 FEATURE FLAGS
# =============================================================================

FEATURE_GASLESS_VOTING=true
FEATURE_PRIZE_DISTRIBUTION=false
FEATURE_ADMIN_PANEL=true
FEATURE_CONTEST_CREATION=true
```

---

## ✅ SETUP CHECKLIST

### Minimum Setup (to run locally):
- [ ] Set `NEXT_PUBLIC_PRIVY_APP_ID`
- [ ] Set `PRIVY_APP_SECRET`
- [ ] Set `DATABASE_URL`
- [ ] Run `npx prisma migrate dev`
- [ ] Run `npm run dev`

### Phase 4 Setup (after smart contracts):
- [ ] Deploy contracts to Alfajores
- [ ] Set `NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS`
- [ ] Set `NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS`
- [ ] Set `NEXT_PUBLIC_PRIZE_POOL_ADDRESS`

### Phase 7 Setup (gasless voting):
- [ ] Create Biconomy project
- [ ] Set `NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY`
- [ ] Fund paymaster gas tank

### Production Setup:
- [ ] Generate strong `NEXTAUTH_SECRET`
- [ ] Set production `DATABASE_URL`
- [ ] Enable `SENTRY_DSN` for error tracking
- [ ] Set `DEBUG_ENABLED=false`
- [ ] Configure `ALLOWED_ORIGINS`
- [ ] Set up monitoring with Axiom
- [ ] Enable `BACKUP_ENABLED=true`

---

## 🔐 SECURITY BEST PRACTICES

1. **Never commit secrets**
   - Use `.env.local` for local development
   - Add `.env.local` to `.gitignore`

2. **Rotate keys regularly**
   - Change `NEXTAUTH_SECRET` periodically
   - Rotate API keys every 90 days

3. **Use environment-specific values**
   - Separate databases for dev/staging/prod
   - Different Privy apps for each environment

4. **Secure deployment keys**
   - Use hardware wallets for mainnet
   - Keep deployment wallets with minimal funds
   - Store `PRIVATE_KEY` in secure vault (1Password, etc.)

5. **Enable monitoring**
   - Set up Sentry alerts
   - Monitor gas usage
   - Track failed transactions

---

## 🆘 TROUBLESHOOTING

### "Missing NEXT_PUBLIC_PRIVY_APP_ID"
- Check `.env.local` exists
- Verify variable name (must start with `NEXT_PUBLIC_`)
- Restart dev server after adding

### "PrismaClient failed to initialize"
- Run `npx prisma generate`
- Check `DATABASE_URL` is correct
- Run `npx prisma migrate dev`

### "Cannot connect to database"
- Verify PostgreSQL is running
- Check connection string format
- Test connection with `npx prisma studio`

### "Smart contract not deployed"
- Complete Phase 4 first
- Check contract address is set
- Verify network matches `NEXT_PUBLIC_CHAIN_ID`

---

## 📞 NEED HELP?

- Check `CELOWEEN_QUICKSTART.md` for quick reference
- Review `MIGRATION_PLAN.md` for phase details
- See `MIGRATION_PROGRESS.md` for current status

---

**Last Updated:** 2025-10-27  
**Next Review:** After Phase 4 (Smart Contract Deployment)
