# Environment Variables Migration Guide

## 🔧 Required Environment Variables for ZeroDev Integration

After migrating to the ZeroDev + Privy v2.16.0 architecture, you need to update your environment variables to match the working Motus configuration.

## 📋 Current vs Required Configuration

### ✅ **Already Configured (Keep These)**
```bash
# Existing Celo Academy variables
NEXT_PUBLIC_PRIVY_APP_ID=your-celo-academy-app-id
NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES=your-contract-address

# Database and other existing vars
DATABASE_URL=your-database-url
# ... other existing variables
```

### 🆕 **New Variables Needed**

#### 1. **Privy Client ID (Optional but Recommended)**
```bash
# Optional for Privy v2.16.0 but used in Motus
NEXT_PUBLIC_PRIVY_CLIENT_ID=your-privy-client-id
```

#### 2. **ZeroDev Project Configuration**
```bash
# CRITICAL: Create your own ZeroDev project
NEXT_PUBLIC_ZERODEV_PROJECT_ID=your-zerodev-project-id
```

**⚠️ IMPORTANT**: Currently using Motus test project as fallback (`e46f4ac3-404e-42fc-a3d3-1c75846538a8`). You should create your own ZeroDev project for production.

## 🚀 Setup Instructions

### Step 1: Privy Configuration
1. **Keep your existing Privy App ID** - no changes needed
2. **Optional**: Add Privy Client ID if you have one
   - Go to [Privy Dashboard](https://dashboard.privy.io/)
   - Find your app settings
   - Look for Client ID (if available)

### Step 2: ZeroDev Project Setup
1. **Go to [ZeroDev Dashboard](https://dashboard.zerodev.app/)**
2. **Create a new project** for Celo Academy
3. **Select Celo Alfajores** as the network
4. **Copy the Project ID**
5. **Add to your `.env.local`**:
   ```bash
   NEXT_PUBLIC_ZERODEV_PROJECT_ID=your-new-project-id
   ```

### Step 3: ZeroDev Project Configuration
1. **Enable Paymaster** in ZeroDev dashboard
2. **Fund the paymaster** with some CELO for gas sponsorship
3. **Set spending limits** appropriate for your usage
4. **Whitelist your contract** (SimpleBadge contract address)

## 📁 Complete .env.local Template

```bash
# ==========================================
# CELO ACADEMY - ENVIRONMENT VARIABLES
# ==========================================

# ----- PRIVY AUTHENTICATION -----
NEXT_PUBLIC_PRIVY_APP_ID=your-celo-academy-app-id
NEXT_PUBLIC_PRIVY_CLIENT_ID=your-privy-client-id  # Optional

# ----- ZERODEV ACCOUNT ABSTRACTION -----
NEXT_PUBLIC_ZERODEV_PROJECT_ID=your-zerodev-project-id  # CRITICAL: Replace with your own

# ----- SMART CONTRACTS -----
NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES=your-contract-address

# ----- DATABASE -----
DATABASE_URL=your-database-url
DIRECT_URL=your-direct-database-url

# ----- ADMIN CONFIGURATION -----
ADMIN_WALLETS=comma,separated,wallet,addresses
NEXT_PUBLIC_ADMIN_WALLETS=same,wallet,addresses

# ----- OPTIONAL: ANALYTICS & MONITORING -----
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# ----- DEVELOPMENT ONLY -----
# Add any development-specific variables here
```

## 🔄 Migration Checklist

### Current State (Using Motus Fallback)
- ✅ Privy App ID: Your existing Celo Academy app
- ⚠️ ZeroDev Project: Using Motus test project (temporary)
- ✅ Contract Address: Your SimpleBadge contract

### Target State (Production Ready)
- ✅ Privy App ID: Your existing Celo Academy app
- ✅ Privy Client ID: Your app's client ID (optional)
- 🎯 **ZeroDev Project: Your own dedicated project**
- ✅ Contract Address: Your SimpleBadge contract

## 📊 Environment Variable Comparison

| Variable | Motus App | Celo Academy Current | Celo Academy Target |
|----------|-----------|---------------------|-------------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | ✅ Motus App ID | ✅ Your App ID | ✅ Keep Current |
| `NEXT_PUBLIC_PRIVY_CLIENT_ID` | ✅ Motus Client ID | ❌ Not set | 🎯 Add if available |
| `NEXT_PUBLIC_ZERODEV_PROJECT_ID` | ✅ Motus Project | ⚠️ Using Motus (fallback) | 🎯 **Create your own** |
| Contract Address | ✅ Motus Contract | ✅ Your Contract | ✅ Keep Current |

## 🚨 Critical Actions Required

### 1. **Create ZeroDev Project** (High Priority)
```bash
# Replace this fallback with your own project
NEXT_PUBLIC_ZERODEV_PROJECT_ID=e46f4ac3-404e-42fc-a3d3-1c75846538a8  # ❌ Remove this
NEXT_PUBLIC_ZERODEV_PROJECT_ID=your-own-project-id                     # ✅ Add this
```

**Why this matters:**
- Currently using Motus's test project
- Could stop working if they change settings
- Need your own project for production
- Independent gas sponsorship budget

### 2. **Test the Configuration**
After updating environment variables:

```bash
# 1. Restart your development server
npm run dev

# 2. Test the enrollment flow
# - Go to any course page  
# - Look for "Inscripción Gratuita (ZeroDev)"
# - Login and test smart account creation
# - Verify enrollment works without gas fees

# 3. Check browser console for logs
# Should see: [ZERODEV] messages with your project ID
```

### 3. **Monitor ZeroDev Usage**
- Check ZeroDev dashboard for transaction counts
- Monitor paymaster balance
- Set up alerts for low balance
- Review spending patterns

## 🛠️ Troubleshooting

### Issue: Smart Account Creation Fails
**Solution**: Check ZeroDev project ID
```bash
# Verify your project ID is correct
echo $NEXT_PUBLIC_ZERODEV_PROJECT_ID
```

### Issue: Gas Sponsorship Not Working  
**Solution**: Check paymaster funding
1. Go to ZeroDev dashboard
2. Check paymaster balance
3. Fund with CELO if low

### Issue: Contract Interaction Fails
**Solution**: Verify contract whitelisting
1. ZeroDev dashboard → Project Settings
2. Add your SimpleBadge contract address to whitelist

## 📈 Next Steps After Migration

1. **Immediate**: Create your own ZeroDev project
2. **Testing**: Verify all flows work with new configuration
3. **Monitoring**: Set up ZeroDev dashboard monitoring
4. **Production**: Deploy with your own project ID
5. **Documentation**: Update team documentation with new variables

## 💡 Pro Tips

### ZeroDev Project Management
- **Separate projects** for development/production
- **Monitor spending** - set appropriate limits
- **Backup config** - document your project settings

### Privy Client ID
- **Not required** for basic functionality
- **Helpful for analytics** and advanced features
- **Check Privy dashboard** if you're unsure

### Security
- **Never commit** `.env.local` to git
- **Use different values** for development/production
- **Rotate keys periodically** for security

---

## 🎯 Summary

The key missing piece is creating your own ZeroDev project. The current implementation works but uses Motus's test project as a fallback. For production deployment, you must create your own ZeroDev project and update the `NEXT_PUBLIC_ZERODEV_PROJECT_ID` environment variable.

All other environment variables can remain the same! 🚀