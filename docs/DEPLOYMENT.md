# 🎃 Celoween Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure all required variables are set in production:

```env
# Database (Supabase)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Authentication (Privy)
NEXT_PUBLIC_PRIVY_APP_ID=...
PRIVY_APP_SECRET=...

# Web3 (ZeroDev/Biconomy)
NEXT_PUBLIC_ZERODEV_PROJECT_ID=...

# Smart Contracts (update with deployed addresses)
NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=0x...

# Admin Wallet
ADMIN_WALLETS=0x9f42Caf52783EF12d8174d33c281a850b8eA58aD
NEXT_PUBLIC_ADMIN_WALLETS=0x9f42Caf52783EF12d8174d33c281a850b8eA58aD

# Security
NEXTAUTH_SECRET=... (generate: openssl rand -base64 32)
NEXTAUTH_URL=https://your-domain.com

# Network
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
CELO_RPC_URL=https://forno.celo.org
```

### 2. Database Migration
```bash
# Verify connection
npx prisma db pull

# Apply migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

### 3. Smart Contract Deployment

#### Deploy to Alfajores Testnet
```bash
# Start hardhat
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy-contests.cjs --network alfajores

# Verify on Celoscan
npx hardhat verify --network alfajores DEPLOYED_ADDRESS "constructor" "args"
```

#### Deploy to Celo Mainnet
```bash
npx hardhat run scripts/deploy-contests.cjs --network celo

# Update .env with production addresses
NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=0x...
```

---

## Deployment Platforms

### Vercel (Recommended)

1. **Connect Repository**
   - Import project from GitHub
   - Select main branch

2. **Configure Build**
   ```bash
   # Build Command
   npm run build

   # Output Directory
   .next

   # Install Command
   npm install
   ```

3. **Environment Variables**
   - Add all variables from `.env.local`
   - Set `NODE_ENV=production`

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Railway

1. **Create New Project**
   ```bash
   railway login
   railway init
   railway link
   ```

2. **Add Environment Variables**
   ```bash
   railway variables set DATABASE_URL="postgresql://..."
   railway variables set NEXT_PUBLIC_PRIVY_APP_ID="..."
   # ... add all variables
   ```

3. **Deploy**
   ```bash
   railway up
   ```

### Self-Hosted (VPS)

1. **Setup Server**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   npm install -g pm2
   ```

2. **Clone & Build**
   ```bash
   git clone https://github.com/your-repo/celoween.git
   cd celoween
   npm install
   npm run build
   ```

3. **Start with PM2**
   ```bash
   pm2 start npm --name "celoween" -- start
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Post-Deployment

### 1. Verify Functionality

#### Test Checklist
- [ ] Homepage loads correctly
- [ ] User can connect wallet (Privy)
- [ ] Admin can create contest
- [ ] User can view contests
- [ ] User can submit entry (active contests)
- [ ] User can vote (voting phase)
- [ ] Gasless voting works
- [ ] Database updates correctly
- [ ] Contract interactions work

#### Manual Test Script
```bash
# Test API endpoints
curl https://your-domain.com/api/contests
curl https://your-domain.com/api/contests/[id]

# Check health
curl https://your-domain.com/api/health
```

### 2. Monitor Performance

#### Setup Monitoring
```bash
# Install Sentry (optional)
npm install @sentry/nextjs

# Configure in next.config.js
```

#### Check Logs
```bash
# Vercel
vercel logs

# Railway  
railway logs

# PM2
pm2 logs celoween
```

### 3. Database Backup

```bash
# Manual backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Automated backups (cron)
0 2 * * * pg_dump $DATABASE_URL > /backups/celoween-$(date +\%Y\%m\%d).sql
```

---

## Security Hardening

### 1. Rate Limiting
Add to `middleware.ts`:

```typescript
import { rateLimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await rateLimit.limit(ip);
  
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
}
```

### 2. CORS Configuration
```typescript
// next.config.js
headers: async () => [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
      { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,DELETE' },
    ],
  },
],
```

### 3. Content Security Policy
```typescript
// Add to next.config.js
headers: [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  }
]
```

---

## Maintenance

### Update Dependencies
```bash
# Check outdated packages
npm outdated

# Update safely
npm update

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name add_new_field

# Apply to production
npx prisma migrate deploy
```

### Contract Upgrades
```bash
# Deploy new version
npx hardhat run scripts/deploy-v2.js --network celo

# Update environment variables
# Coordinate with frontend update
```

---

## Rollback Strategy

### Quick Rollback (Vercel)
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url]
```

### Database Rollback
```bash
# Restore from backup
psql $DATABASE_URL < backup-20240101.sql

# Or use Prisma
npx prisma migrate resolve --rolled-back [migration-name]
```

### Contract Issues
- Cannot rollback smart contracts
- Deploy fixed version
- Update frontend to use new address
- Keep old contracts accessible for historical data

---

## Performance Optimization

### 1. Enable Caching
```typescript
// app/api/contests/route.ts
export const revalidate = 60; // Cache for 60 seconds
```

### 2. Optimize Images
```bash
# Use Next.js Image component
import Image from 'next/image';

<Image 
  src="/pumpkin.jpg" 
  width={500} 
  height={500}
  priority={false}
/>
```

### 3. Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Check Supabase status
# Visit status.supabase.com
```

### Contract Call Failures
- Check RPC endpoint is up
- Verify gas price settings
- Ensure wallet has funds
- Check contract addresses are correct

---

## Launch Checklist

- [ ] All environment variables set
- [ ] Database migrated and tested
- [ ] Contracts deployed to mainnet
- [ ] Smart contract addresses updated
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Monitoring setup (optional)
- [ ] Backup strategy in place
- [ ] Admin wallet configured
- [ ] Test contest created
- [ ] Social media ready
- [ ] Documentation updated

---

## Support & Resources

- **Celo Docs:** https://docs.celo.org
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Privy Docs:** https://docs.privy.io
- **Biconomy Docs:** https://docs.biconomy.io

---

## Post-Launch

### Marketing
- Announce on Twitter/X
- Post in Celo Discord
- Share in Web3 communities
- Create demo video

### Analytics
- Track user signups
- Monitor contest participation
- Analyze voting patterns
- Measure gas savings from gasless voting

### Iterate
- Gather user feedback
- Fix bugs quickly
- Add requested features
- Plan Season 2 contests
