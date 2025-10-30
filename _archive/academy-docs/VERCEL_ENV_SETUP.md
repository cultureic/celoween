# Vercel Environment Variables Setup

## Critical Fix for Sponsored Transactions

🚨 **IMPORTANT**: You need to add these environment variables to Vercel for sponsored transactions to work:

### Required Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```bash
# Gas-optimized contract (DEPLOYED - CRITICAL - this fixes the error)
NEXT_PUBLIC_OPTIMIZED_CONTRACT_ADDRESS_ALFAJORES=0x4193D2f9Bf93495d4665C485A3B8AadAF78CDf29

# ZeroDev Smart Account Configuration (CRITICAL for sponsored gas)  
NEXT_PUBLIC_ZERODEV_PROJECT_ID=e46f4ac3-404e-42fc-a3d3-1c75846538a8

# Legacy contract (already set, keep as fallback)
NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES=0x7Ed5CC0cf0B0532b52024a0DDa8fAE24C6F66dc3
```

## Why This Fixes the Issue

**Current Problem:**
- Production is using the old contract: `0x7Ed5CC0cf0B0532b52024a0DDa8fAE24C6F66dc3`
- Trying to call new functions: `enroll()`, `completeModule()`
- Old contract doesn't have these functions → Transaction reverts

**After Fix:**
- Production will use optimized contract: `0x4193D2f9Bf93495d4665C485A3B8AadAF78CDf29`  
- Has the correct functions: `enroll()`, `completeModule()`
- Uses bit-packing for lower gas costs (99.5% gas reduction!)
- Sponsored transactions work properly

## How to Add Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable:
   - Name: `NEXT_PUBLIC_OPTIMIZED_CONTRACT_ADDRESS_ALFAJORES`
   - Value: `0x4193D2f9Bf93495d4665C485A3B8AadAF78CDf29`
   - Environment: Production ✅
   
5. Repeat for `NEXT_PUBLIC_ZERODEV_PROJECT_ID`
6. Redeploy your application

## Expected Result After Fix

✅ Course enrollment works with sponsored gas  
✅ Module completion works with sponsored gas  
✅ Gas costs reduced from ~0.26 CELO to <0.05 CELO  
✅ No more "UserOperation reverted" errors

## Test After Deployment

1. Try enrolling in a course → Should work without gas payment
2. Try completing a module → Should work without gas payment  
3. Check transaction on Celoscan → Should show optimized contract address

---

**Next Step**: Add these environment variables to Vercel and redeploy! 🚀