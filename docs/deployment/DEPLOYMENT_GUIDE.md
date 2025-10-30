# Deployment Guide - Celo Mexico Academy

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Environment Variables Setup](#environment-variables-setup)
4. [Vercel CLI Deployment](#vercel-cli-deployment)
5. [Database Configuration](#database-configuration)
6. [Smart Contract Integration](#smart-contract-integration)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Troubleshooting](#troubleshooting)
9. [Rollback Procedure](#rollback-procedure)

---

## 🔧 Prerequisites

### Required Tools

- **Node.js**: v20.0.0 or higher (tested with v20.19.4)
- **npm**: v10.0.0 or higher
- **Vercel CLI**: Latest version
- **Git**: For version control

### Vercel Account Setup

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Login to Vercel:
   ```bash
   vercel login
   ```

---

## ✅ Pre-Deployment Checklist

### Code Quality Verification

```bash
# 1. Run TypeScript type checking
npm run type-check

# 2. Run linting
npm run lint

# 3. Build the project locally
npm run build

# 4. Test locally
npm run dev
```

### Database Verification

```bash
# 1. Test database connection
npx prisma db pull

# 2. Verify database migrations
npx prisma migrate status

# 3. Check database health
curl http://localhost:3000/api/health
```

### Environment Variables Audit

Ensure all required environment variables are set:

- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `DIRECT_URL` - PostgreSQL direct connection (for Prisma)
- ✅ `SUPABASE_URL` - Supabase project URL
- ✅ `SUPABASE_ANON_KEY` - Supabase anonymous key
- ✅ `NEXT_PUBLIC_PRIVY_APP_ID` - Privy authentication app ID
- ✅ `PRIVY_APP_SECRET` - Privy app secret
- ✅ `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID
- ✅ `NEXT_PUBLIC_SIMPLE_BADGE_ADDRESS` - SimpleBadge contract address (Alfajores)
- ✅ `NEXT_PUBLIC_CHAIN_ID` - Blockchain chain ID (44787 for Alfajores)
- ✅ `ADMIN_WALLET_ADDRESS` - Admin wallet for privileged access

---

## 🔐 Environment Variables Setup

### Step 1: Prepare Environment Variables

Create a file `vercel-env-setup.txt` with your production environment variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"

# Authentication (Privy)
NEXT_PUBLIC_PRIVY_APP_ID="your-privy-app-id"
PRIVY_APP_SECRET="your-privy-secret"

# Web3 Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-walletconnect-id"
NEXT_PUBLIC_SIMPLE_BADGE_ADDRESS="0x..."
NEXT_PUBLIC_CHAIN_ID="44787"

# Admin Configuration
ADMIN_WALLET_ADDRESS="0x9f42Caf52783EF12d8174d33c281a850b8eA58aD"

# SSL Certificate (Base64 encoded)
DATABASE_SSL_CERT="LS0tLS1CRUdJTi..."
```

### Step 2: Set Environment Variables in Vercel

#### Option A: Using Vercel CLI

```bash
# Set each environment variable
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_PRIVY_APP_ID production
vercel env add PRIVY_APP_SECRET production
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID production
vercel env add NEXT_PUBLIC_SIMPLE_BADGE_ADDRESS production
vercel env add NEXT_PUBLIC_CHAIN_ID production
vercel env add ADMIN_WALLET_ADDRESS production
vercel env add DATABASE_SSL_CERT production
```

#### Option B: Using Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with appropriate scope (Production, Preview, Development)

---

## 🚀 Vercel CLI Deployment

### Step 1: Initialize Vercel Project

```bash
# Navigate to project directory
cd /path/to/celo-mx

# Initialize Vercel project (first time only)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account/team
# - Link to existing project? No (if first deployment)
# - What's your project's name? celo-mexico-academy
# - In which directory is your code located? ./
# - Want to override the settings? No
```

### Step 2: Deploy to Production

```bash
# Deploy to production
vercel --prod

# The CLI will:
# 1. Build your application
# 2. Upload the build output
# 3. Deploy to production
# 4. Provide you with the production URL
```

### Step 3: Monitor Deployment

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs <deployment-url>

# Open deployment in browser
vercel open
```

---

## 🗄️ Database Configuration

### Supabase SSL Configuration

The application uses SSL for secure database connections. The SSL certificate is stored as a base64-encoded environment variable.

#### Generating SSL Certificate Base64

```bash
# If you have the SSL certificate file
cat /path/to/ssl-cert.pem | base64

# Set as environment variable
vercel env add DATABASE_SSL_CERT production
# Paste the base64 encoded certificate
```

#### Database Connection String Format

```
postgresql://user:password@host:5432/database?sslmode=require
```

### Prisma Database Setup

```bash
# After deployment, run database migrations
vercel env pull .env.production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

---

## 🔗 Smart Contract Integration

### SimpleBadge Contract (Alfajores Testnet)

The application integrates with a SimpleBadge ERC1155 contract deployed on Celo Alfajores testnet.

#### Contract Details

- **Network**: Celo Alfajores (Chain ID: 44787)
- **Contract Address**: Set in `NEXT_PUBLIC_SIMPLE_BADGE_ADDRESS`
- **Token ID Generation**: Dynamically generated from course database IDs

#### Verify Contract Integration

```bash
# Test metadata API endpoint
curl https://your-domain.vercel.app/api/metadata/milestone/1

# Expected response:
{
  "name": "Course Name - Badge de Inscripción",
  "description": "Badge otorgado por inscribirse al curso...",
  "image": "https://academy.celo.org/images/badges/...",
  "external_url": "https://academy.celo.org/academy/...",
  "attributes": [...]
}
```

---

## ✅ Post-Deployment Verification

### 1. Health Check

```bash
# Check application health
curl https://your-domain.vercel.app/api/health

# Expected response:
{
  "status": "ok",
  "version": "0.1.0",
  "environment": "production",
  "checks": {
    "database": { "status": "ok" },
    "memory": { "status": "ok" },
    "uptime": { "status": "ok" }
  }
}
```

### 2. Database Connectivity

```bash
# Test database connection
curl https://your-domain.vercel.app/api/health/db

# Expected response:
{
  "status": "ok",
  "database": "connected",
  "responseTime": "123ms"
}
```

### 3. Environment Variables Check

```bash
# Test environment variables
curl https://your-domain.vercel.app/api/health/env

# Expected response (sensitive values masked):
{
  "status": "ok",
  "environment": "production",
  "variables": {
    "NEXT_PUBLIC_PRIVY_APP_ID": "configured",
    "DATABASE_URL": "configured",
    ...
  }
}
```

### 4. Frontend Functionality

Visit your production URL and verify:

- ✅ Homepage loads correctly
- ✅ Academy page displays courses
- ✅ Course detail pages load
- ✅ Wallet connection works (Privy)
- ✅ NFT badge claiming flow works

### 5. API Endpoints

Test critical API endpoints:

```bash
# Get courses
curl https://your-domain.vercel.app/api/courses

# Get metadata
curl https://your-domain.vercel.app/api/metadata/milestone/1

# Health check
curl https://your-domain.vercel.app/api/health
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Error**: `Can't reach database server`

**Solution**:
```bash
# Verify DATABASE_URL is correct
vercel env ls

# Check SSL configuration
# Ensure sslmode=require is in connection string
# Verify DATABASE_SSL_CERT is base64 encoded correctly
```

#### 2. Build Failures

**Error**: `Type errors during build`

**Solution**:
```bash
# Run type check locally
npm run type-check

# Fix type errors
# Commit and redeploy
git add .
git commit -m "Fix type errors"
vercel --prod
```

#### 3. Environment Variables Not Loading

**Error**: `Missing environment variable`

**Solution**:
```bash
# Pull environment variables
vercel env pull

# Verify they're set for production
vercel env ls

# Re-add missing variables
vercel env add VARIABLE_NAME production
```

#### 4. Prisma Client Errors

**Error**: `@prisma/client did not initialize yet`

**Solution**:
```bash
# Regenerate Prisma client
npx prisma generate

# Redeploy
vercel --prod
```

#### 5. Wallet Connection Issues

**Error**: `Privy authentication failed`

**Solution**:
- Verify `NEXT_PUBLIC_PRIVY_APP_ID` is correct
- Check Privy dashboard for allowed domains
- Ensure production domain is whitelisted in Privy

---

## 🔄 Rollback Procedure

### Option 1: Rollback via Vercel Dashboard

1. Go to Vercel Dashboard → Your Project
2. Navigate to **Deployments** tab
3. Find the previous working deployment
4. Click **⋮** (three dots) → **Promote to Production**

### Option 2: Rollback via CLI

```bash
# List all deployments
vercel ls

# Promote a specific deployment to production
vercel promote <deployment-url>
```

### Option 3: Redeploy Previous Git Commit

```bash
# Find the last working commit
git log --oneline

# Reset to that commit
git reset --hard <commit-hash>

# Force push (if needed)
git push -f origin main

# Deploy
vercel --prod
```

---

## 📊 Monitoring & Maintenance

### Vercel Analytics

Enable Vercel Analytics for monitoring:

1. Go to Vercel Dashboard → Your Project
2. Navigate to **Analytics** tab
3. Enable analytics
4. Monitor page views, performance, and errors

### Logging

View application logs:

```bash
# Real-time logs
vercel logs --follow

# Logs for specific deployment
vercel logs <deployment-url>
```

### Performance Monitoring

Monitor application performance:

```bash
# Check build times
vercel inspect <deployment-url>

# View bandwidth usage
vercel bandwidth
```

---

## 🔒 Security Best Practices

### Environment Variables

- ✅ Never commit `.env` files to git
- ✅ Use different secrets for production vs development
- ✅ Rotate secrets regularly
- ✅ Use Vercel's encrypted environment variables

### Database Security

- ✅ Use SSL connections (sslmode=require)
- ✅ Restrict database access by IP (if possible)
- ✅ Use strong database passwords
- ✅ Regularly update database credentials

### API Security

- ✅ Implement rate limiting
- ✅ Use CORS appropriately
- ✅ Validate all inputs
- ✅ Sanitize database queries

---

## 📝 Deployment Checklist

Use this checklist for each deployment:

- [ ] Run `npm run type-check`
- [ ] Run `npm run lint`
- [ ] Run `npm run build` locally
- [ ] Test critical functionality locally
- [ ] Verify all environment variables are set
- [ ] Check database connectivity
- [ ] Review git diff for changes
- [ ] Create git tag for release
- [ ] Deploy with `vercel --prod`
- [ ] Verify deployment URL
- [ ] Run post-deployment verification tests
- [ ] Check health endpoint
- [ ] Test wallet connection
- [ ] Test course enrollment flow
- [ ] Monitor logs for errors
- [ ] Update documentation

---

## 🎯 Continuous Deployment

### Automatic Deployments with Git

Vercel automatically deploys when you push to connected branches:

```bash
# Production deployment (main branch)
git push origin main

# Preview deployment (feature branch)
git checkout -b feature/new-feature
git push origin feature/new-feature
```

### Branch Configuration

- **main** → Production deployments
- **develop** → Preview deployments
- **feature/** → Preview deployments

Configure in Vercel Dashboard → Settings → Git

---

## 📞 Support & Resources

### Vercel Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

### Project Resources

- GitHub Repository: `celo-academy/celo-mx`
- Vercel Dashboard: `vercel.com/your-team/celo-mexico-academy`
- Supabase Dashboard: `app.supabase.com`

### Getting Help

- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Celo Discord: [discord.gg/celo](https://discord.gg/celo)
- GitHub Issues: Open an issue in the repository

---

## 📅 Deployment History

### Version 1.0.0 - Initial Production Deployment

**Date**: 2025-10-07

**Changes**:
- Initial production deployment
- Smart contract integration (SimpleBadge)
- Dynamic token ID generation
- Privy wallet authentication
- PostgreSQL database with SSL
- NFT metadata API
- Health check endpoints

**Deployment Command**:
```bash
vercel --prod
```

**Verification**:
- ✅ All health checks passing
- ✅ Database connectivity confirmed
- ✅ Smart contract integration working
- ✅ Wallet authentication functional

---

## 🎓 Additional Notes

### Domain Configuration

To add a custom domain:

1. Go to Vercel Dashboard → Your Project
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Configure DNS records as instructed

### SSL Certificates

Vercel automatically provisions SSL certificates for all domains. No manual configuration needed.

### CDN & Edge Network

Vercel automatically deploys your application to their global Edge Network for optimal performance.

---

**Last Updated**: 2025-10-07  
**Maintained By**: Celo Mexico Team  
**Version**: 1.0.0
