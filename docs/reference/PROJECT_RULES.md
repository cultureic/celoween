# Project Rules & Conventions

**Last Updated:** 2025-10-08  
**Version:** 1.1.0

## 🚨 CRITICAL RULES - DO NOT BREAK

### 1. Course Access & Paywall System

**RULE:** Course detail pages (`/academy/[slug]`) must be protected with the NFT enrollment paywall.

**Implementation:**
- `CourseDetailClient.tsx` checks wallet connection and NFT badge ownership
- Three paywall states: LOADING, WALLET_NOT_CONNECTED, NOT_ENROLLED
- Only users with NFT badge can see full course content
- Uses `useCourseEnrollmentBadge` hook for on-chain verification
- Uses `CoursePaywall` component for consistent UI

**DO NOT:**
- Remove enrollment checks from CourseDetailClient
- Make course curriculum publicly accessible without NFT verification
- Bypass the paywall system

### 2. NFT Badge System

**RULE:** Each course has a unique NFT token ID for enrollment verification.

**Implementation:**
- Legacy courses use hardcoded token IDs (1-4)
- New courses use dynamic token IDs generated from course database ID
- Token ID generation in `lib/hooks/useSimpleBadge.ts`
- Contract address: `NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES`

**DO NOT:**
- Change token ID generation logic without testing all existing courses
- Hardcode new course token IDs (use dynamic generation)
- Remove legacy course mappings

### 3. Database Schema & Migrations

**RULE:** Always create migrations for schema changes. Never modify production data directly.

**DO:**
- Use `prisma migrate dev` for development
- Use `prisma migrate deploy` for production
- Test migrations locally before deploying
- Document schema changes in commit messages

**DO NOT:**
- Push schema changes without migrations
- Delete migrations that have been deployed
- Modify Prisma schema without running migrations

### 4. Environment Variables

**RULE:** All secrets and configuration must use environment variables.

**Required Variables:**
```
DATABASE_URL
DIRECT_URL
DATABASE_SSL_CERT
NEXT_PUBLIC_PRIVY_APP_ID
PRIVY_APP_SECRET
NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES
NEXTAUTH_SECRET
ADMIN_WALLETS
NEXT_PUBLIC_ADMIN_WALLETS
```

**Optional Variables:**
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID  # Only if WalletConnect is needed
```

**Connectors Policy:**
- WalletConnect MUST NOT be initialized without a valid `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- When the project ID is not set, the app must not perform any Web3Modal/AppKit remote config calls

**DO NOT:**
- Hardcode contract addresses in components
- Commit `.env.local` or `.env` files
- Use production credentials in development
- Ship a default WalletConnect projectId like `fallback-id` or `your_walletconnect_project_id`

### 5. Client/Server Component Rules

**RULE:** Wallet and blockchain interactions must be client-side only, and always under WagmiProvider.

**Implementation:**
- Use `"use client"` for components using Wagmi hooks
- Use dynamic imports with `ssr: false` for Web3 components
- Server components handle database queries and static data
- Providers: `Providers.tsx` MUST always render `<WagmiProvider>` around children. Do not render children without it (no pre-mount fallback that bypasses WagmiProvider).

**DO NOT:**
- Use Wagmi hooks in server components
- Attempt blockchain calls during SSR
- Render children outside of WagmiProvider at any time
- Mix client and server state without proper boundaries

### 6. Admin Access Control

**RULE:** Admin routes must verify wallet address against `ADMIN_WALLETS`.

**Implementation:**
- Middleware checks admin wallet addresses
- Admin wallets defined in environment variables
- Admin UI in `/app/admin/*` routes

**DO NOT:**
- Remove admin checks from middleware
- Hardcode admin addresses
- Expose admin API routes without authentication

### 7. Media & Embeds

RULE: Course media must render reliably across common providers.

Implementation:
- MDX rendering must keep `rehype-raw` enabled to allow trusted iframe/video HTML
- `components/mdx/MdxComponents.tsx` must export handlers for `iframe`, `video`, and `img`
- `lib/youtube.ts` must support YouTube URL variants: watch, youtu.be, embed, shorts, live
- `CourseDetailClient` should embed using `getYouTubeEmbedFromUrl(url)` and fall back to embedding the raw `promoVideoUrl` if not YouTube (e.g., Vimeo)

DO NOT:
- Remove `rehype-raw` from MDX
- Assume only one YouTube URL format
- Block iframes via component wrappers without providing an allowed embed path

---

### 7. Styling & Theme System

**RULE:** Use Tailwind CSS with the custom Celo theme.

**Theme Colors:**
- `celo-yellow`: Primary brand color (#FCFF52)
- `celo-black`: Dark background
- `celo-bg`: Background color (theme-aware)
- `celo-fg`: Foreground/text color (theme-aware)
- `celo-border`: Border color (theme-aware)

**DO NOT:**
- Use arbitrary color values instead of theme colors
- Remove CSS variables from `globals.css`
- Break dark mode support

### 8. Course & Lesson Structure

**RULE:** Maintain the hierarchical structure: Course → Module → Lesson

**Database Schema:**
```
Course (1) → Module (many) → Lesson (many)
```

**DO NOT:**
- Skip the module layer
- Create lessons without a parent module
- Break the slug-based routing system

### 9. Blockchain Contract Interactions

**RULE:** All contract interactions use the SimpleBadge contract ABI and follow the dynamic NFT model.

**Implementation:**
- Contract ABI in `lib/hooks/useSimpleBadge.ts`
- Course enrollment mints exactly 1 NFT per course (tokenId)
- Module completion updates on-chain progress state for the same NFT (no additional mints)
- Network: Celo Alfajores testnet

**DO NOT:**
- Mint additional NFTs per module (one NFT per course only)
- Modify contract ABI without verifying against deployed contract
- Call contract functions without proper error handling
- Skip transaction confirmation checks

### 10. Git Workflow

**RULE:** All changes must be committed with descriptive messages.

**Commit Message Format:**
```
type: brief description

- Detailed point 1
- Detailed point 2
- Impact/benefits
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**DO NOT:**
- Commit without testing locally
- Push breaking changes without communication
- Commit `node_modules`, `.env`, or build artifacts

---

## 📋 Best Practices

### Code Organization

1. **Components:** Keep components focused and reusable
2. **Hooks:** Custom hooks in `lib/hooks/`
3. **Utils:** Helper functions in `lib/` or `utils/`
4. **Types:** Share types via `types.ts` files

### Testing

1. Test enrollment flow with different wallet states
2. Verify paywall appears for non-enrolled users
3. Test dynamic token ID generation
4. Validate admin access controls

### Documentation

1. Update relevant `.md` files when adding features
2. Document breaking changes prominently
3. Keep `PRODUCTION_STATUS.md` current
4. Add inline comments for complex logic

### Performance

1. Use dynamic imports for heavy Web3 libraries
2. Optimize images with Next.js Image component
3. Minimize client-side bundle size
4. Use React Server Components when possible

---

## 📱 Mobile Safari Signing Policy

- Mobile Safari does not expose an injected EIP-1193 provider.
- With Privy v1 + Wagmi v2, contract writes still require a ready wagmi connector.
- Therefore, you MUST either:
  1) Enable WalletConnect by setting `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (preferred short-term), or
  2) Instruct users to open the site in their wallet's in-app browser (which injects a provider), or
  3) Plan the migration to Privy v3 + `@privy-io/wagmi` (long-term fix) to use the embedded wallet as a wagmi connector.

Do not ship a default WalletConnect projectId. The app is coded to include WalletConnect only when the env var is set.

---

## 🔧 Common Tasks

### Adding a New Course
1. Use admin UI at `/admin/courses/create`
2. Token ID will be generated automatically
3. Test enrollment flow before publishing

### Updating Smart Contract Address
1. Update `NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES` in Vercel
2. Redeploy application
3. Verify enrollment still works

### Modifying Paywall Logic
1. Update logic in `CourseDetailClient.tsx` and/or `LessonAccessWrapper.tsx`
2. Test all three paywall states
3. Verify existing enrollments still work
4. Update `COURSE_PAYWALL.md` documentation

### Database Schema Changes
1. Modify `prisma/schema.prisma`
2. Run `prisma migrate dev --name descriptive_name`
3. Test migration locally
4. Commit migration files
5. Deploy with `prisma migrate deploy` in production

---

## ⚠️ Known Issues & Workarounds

### Issue: Wallet Not Connecting
- **Cause:** Privy configuration, missing WalletConnect projectId, or browser extension conflict
- **Fix:**
  - Ensure `NEXT_PUBLIC_PRIVY_APP_ID` is set
  - If using WalletConnect, set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` or disable the connector
  - Clear browser cache and ensure components are under WagmiProvider

### Issue: NFT Badge Not Detected
- **Cause:** RPC rate limiting, contract address mismatch, or calling wagmi hooks outside WagmiProvider
- **Fix:** Verify `WagmiProvider` wraps the tree, contract address is correct, and check the transaction on CeloScan

### Issue: Course Content Not Loading
- **Cause:** Database connection issues or missing migrations
- **Fix:** Check `DATABASE_URL` and run pending migrations

---

## 📞 Support & Contact

- **Repository:** https://github.com/CeloMX/celo-mx
- **Production:** https://celo-mx.vercel.app
- **Documentation:** See individual `.md` files in root directory

---

**Remember:** When in doubt, check existing implementations before making changes!
