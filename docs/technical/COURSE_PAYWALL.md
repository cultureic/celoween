# 🔒 Course Paywall System

## Overview

The Celo Mexico Academy implements a **blockchain-based paywall** system that requires users to claim an NFT badge before accessing course content. This ensures that only enrolled students can view lessons while maintaining a decentralized and verifiable enrollment system.

---

## How It Works

### 1. **Enrollment Flow**

```
User visits course → Connects wallet → Claims NFT badge → Accesses lessons
```

1. **Course Discovery**: Users browse the course catalog freely
2. **Course Overview**: Course details and syllabus are publicly accessible
3. **Enrollment Required**: Lessons are locked until user enrolls
4. **NFT Badge Claim**: User claims a free enrollment NFT badge (ERC1155)
5. **Content Access**: Once badge is claimed, all lessons become accessible

### 2. **Verification Levels**

#### Client-Side Verification (Current Implementation)
- ✅ Real-time verification using Wagmi hooks
- ✅ Checks NFT balance via smart contract
- ✅ Instant feedback to user
- ✅ No server load for verification

#### Server-Side Verification (Optional Enhancement)
- 📋 Can be added for additional security
- 📋 Verifies NFT ownership via Viem public client
- 📋 Prevents direct API access
- 📋 Useful for API rate limiting

---

## Components

### 1. **CoursePaywall Component**

**Location**: `components/academy/CoursePaywall.tsx`

Beautiful lock screen shown when user doesn't have access.

**Features**:
- 🎨 Attractive locked content UI
- 💡 Clear explanation of why content is locked
- ✅ Lists benefits of enrollment
- 🔗 Direct enrollment action
- 🎭 Three states: `WALLET_NOT_CONNECTED`, `NOT_ENROLLED`, `LOADING`

**Usage**:
```tsx
<CoursePaywall
  courseTitle="Desarrollo de DApps"
  courseSlug="desarrollo-dapps"
  reason="NOT_ENROLLED"
  onEnroll={handleEnroll}
  isEnrolling={false}
/>
```

### 2. **LessonAccessWrapper Component**

**Location**: `app/academy/[slug]/LessonAccessWrapper.tsx`

Client-side wrapper that handles enrollment verification and paywall logic.

**Features**:
- 🔍 Checks wallet connection status
- 📊 Verifies NFT badge ownership
- 🔄 Real-time enrollment state
- 🎬 Handles enrollment transactions
- ✨ Smooth hydration handling

**Usage**:
```tsx
<LessonAccessWrapper
  courseId={course.id}
  courseSlug={course.slug}
  courseTitle={course.title}
  serverHasAccess={false}
>
  {/* Lesson content here */}
</LessonAccessWrapper>
```

### 3. **Enrollment Verification Utilities**

**Location**: `lib/enrollment-verification.ts`

Server-side utilities for verifying NFT badge ownership (optional, for future enhancement).

**Functions**:

```typescript
// Check if user has claimed the badge
await hasUserClaimedBadge(userAddress, courseSlug, courseId)

// Check if user has the badge (balance > 0)
await hasUserEnrollmentBadge(userAddress, courseSlug, courseId)

// Comprehensive check with detailed response
await isUserEnrolledInCourse(userAddress, courseSlug, courseId)

// Verify access with error reasons
await verifyEnrollmentAccess(userAddress, courseSlug, courseId)
```

---

## User Experience

### States

#### 1. **Not Connected** 🔌
```
┌─────────────────────────────────┐
│       🔒 Locked Content         │
├─────────────────────────────────┤
│  Please connect your wallet to  │
│  access this course content.    │
│                                 │
│     [Connect Wallet Button]     │
└─────────────────────────────────┘
```

#### 2. **Not Enrolled** 📚
```
┌─────────────────────────────────┐
│       🔒 Enrollment Required    │
├─────────────────────────────────┤
│  To access lessons, claim your  │
│  free enrollment NFT badge.     │
│                                 │
│  You'll receive:                │
│  ✓ NFT Badge                    │
│  ✓ Full course access           │
│  ✓ On-chain certificate         │
│  ✓ Progress tracking            │
│                                 │
│  [View Details] [Enroll Now]    │
└─────────────────────────────────┘
```

#### 3. **Enrolled** ✅
```
┌─────────────────────────────────┐
│   📖 Lesson Content (Unlocked)  │
├─────────────────────────────────┤
│                                 │
│   Full lesson content shown...  │
│                                 │
└─────────────────────────────────┘
```

---

## Technical Implementation

### Smart Contract Integration

The paywall system uses the **SimpleBadge ERC1155** contract deployed on Celo Alfajores:

**Contract Address**: `0x7Ed5CC0cf0B0532b52024a0DDa8fAE24C6F66dc3`

**Key Functions**:
- `claim(uint256 tokenId)` - User claims enrollment badge
- `balanceOf(address account, uint256 id)` - Check badge ownership
- `claimed(address user, uint256 tokenId)` - Check if already claimed

### Token ID Generation

Each course gets a unique token ID:

```typescript
// From course database ID
const tokenId = generateTokenIdFromCourseId(course.id);

// Legacy courses have hardcoded IDs
const legacyTokenId = LEGACY_COURSE_TOKEN_IDS[courseSlug];
```

### Verification Flow

```typescript
// 1. User connects wallet
const { address } = useAccount();

// 2. Hook checks enrollment
const { hasBadge, hasClaimed } = useCourseEnrollmentBadge(
  courseSlug,
  courseId,
  address
);

// 3. Grant or deny access
if (hasBadge || hasClaimed) {
  // Show lesson content
} else {
  // Show paywall
}
```

---

## Mobile Signing (Safari) and Privy

### Why transactions may fail on mobile Safari

- The app uses Privy for authentication and Wagmi for contract writes.
- Wagmi requires a ready EIP-1193 wallet connector to sign transactions (e.g., injected provider or WalletConnect session).
- On desktop, an injected provider (e.g., MetaMask) is typically present, so signing works.
- On mobile Safari/Chrome, there is no injected provider. Without WalletConnect configured, Wagmi has no ready connector and writes fail with errors like "provider not found" or "connector not connected".

### Supported solutions that do NOT break desktop

1) Enable WalletConnect
- Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in your environment (Vercel).
- Our code only enables the WalletConnect connector when this variable is present.
- Desktop behavior remains unchanged; mobile users can connect/sign via their wallet app.

2) Use a wallet's in-app browser
- Open the site inside the wallet's in-app browser (e.g., MetaMask Browser).
- This provides an injected provider so the current flow works without WalletConnect.

3) Future (recommended): Upgrade to Privy v3 + `@privy-io/wagmi`
- Privy v3 exposes a first-class wagmi connector for the embedded wallet.
- This removes the need for WalletConnect on mobile Safari.
- This is a larger migration and should be planned separately to avoid desktop regressions.

### Current safeguards implemented

- The application now always renders `WagmiProvider` around children to prevent provider-not-found crashes.
- Write hooks auto-connect to a ready connector if available; if none are available, a clear error message is shown.
- Module completion is gated by enrollment both in the UI and smart contract.

---

## Configuration

### Environment Variables

Required environment variables:

```bash
# Smart Contract Address
NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES=0x7Ed5CC0cf0B0532b52024a0DDa8fAE24C6F66dc3

# Chain ID
NEXT_PUBLIC_CHAIN_ID=44787

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Privy (for wallet auth)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

### Customization

#### Change Paywall Message

Edit `components/academy/CoursePaywall.tsx`:

```typescript
<p className="text-sm text-yellow-700 dark:text-yellow-300">
  Your custom message here
</p>
```

#### Modify Access Rules

Edit `app/academy/[slug]/LessonAccessWrapper.tsx`:

```typescript
// Add custom logic
const hasAccess = serverHasAccess || hasBadge || hasClaimed || customCondition;
```

---

## Security Considerations

### Current Security Level: **Client-Side** ⚠️

**Pros**:
- ✅ Fast verification (no server round-trip)
- ✅ Real-time updates
- ✅ No server load
- ✅ Transparent verification

**Cons**:
- ⚠️ Can be bypassed by advanced users (inspect element, etc.)
- ⚠️ Relies on client-side checks
- ⚠️ No API-level protection

### Enhanced Security (Optional)

For production environments requiring strict access control:

#### 1. **Add Server-Side Verification**

```typescript
// In course page (server component)
import { verifyEnrollmentAccess } from '@/lib/enrollment-verification';

const { hasAccess } = await verifyEnrollmentAccess(
  userAddress,
  courseSlug,
  courseId
);

if (!hasAccess) {
  return <PaywallPage />;
}
```

#### 2. **Protect API Routes**

```typescript
// In API route
export async function GET(request: Request) {
  const userAddress = getUserAddressFromRequest(request);
  const { hasAccess } = await verifyEnrollmentAccess(userAddress, courseSlug);
  
  if (!hasAccess) {
    return NextResponse.json(
      { error: 'Enrollment required' },
      { status: 403 }
    );
  }
  
  // Return lesson content
}
```

#### 3. **Implement Rate Limiting**

Prevent abuse by limiting enrollment checks:

```typescript
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

---

## Benefits

### For Students 🎓
- ✅ **Free Enrollment**: Only pay minimal gas fees (~$0.001 USD)
- ✅ **Proof of Enrollment**: NFT badge is permanent proof
- ✅ **Privacy**: No email or personal info required
- ✅ **Portability**: Badge is yours forever, viewable in any wallet
- ✅ **Gamification**: Collect badges from multiple courses

### For Platform 🏫
- ✅ **Verifiable Metrics**: On-chain enrollment data
- ✅ **Fraud Prevention**: Can't create fake enrollments
- ✅ **Decentralized**: No central auth server required
- ✅ **Monetization Ready**: Can easily add paid courses
- ✅ **Community Building**: Badge holders form a community

### For Developers 🛠️
- ✅ **Composable**: Works with any ERC1155-compatible system
- ✅ **Extensible**: Easy to add new features (achievements, etc.)
- ✅ **Transparent**: All verification logic is visible
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **Well-Documented**: Clear implementation examples

---

## Testing

### Manual Testing

1. **Test Paywall Display**:
   ```bash
   # Visit lesson without wallet
   open https://your-domain.com/academy/desarrollo-dapps?m=1&s=1
   ```

2. **Test Wallet Connection**:
   - Click "Connect Wallet"
   - Verify paywall updates to show enrollment option

3. **Test Enrollment**:
   - Click "Enroll Now"
   - Approve transaction
   - Verify lesson content appears

4. **Test Persistence**:
   - Refresh page
   - Verify lesson remains accessible

### Automated Testing

```typescript
// Test paywall component
describe('CoursePaywall', () => {
  it('shows wallet connection prompt when not connected', () => {
    render(<CoursePaywall reason="WALLET_NOT_CONNECTED" />);
    expect(screen.getByText('Conecta tu Wallet')).toBeInTheDocument();
  });

  it('shows enrollment prompt when not enrolled', () => {
    render(<CoursePaywall reason="NOT_ENROLLED" />);
    expect(screen.getByText('Inscripción Requerida')).toBeInTheDocument();
  });
});
```

---

## Future Enhancements

### Planned Features 🚀

1. **Course Completion Badges**
   - Additional NFT for completing all lessons
   - Graduation NFT with special artwork

2. **Tiered Access**
   - Free tier: Basic lessons
   - Premium tier: Advanced content + mentorship
   - Different token IDs for different tiers

3. **Time-Limited Access**
   - Badges with expiration dates
   - Subscription-based model

4. **Achievement System**
   - Badges for specific milestones
   - Bonus content for collectors

5. **Social Features**
   - Display badges in user profile
   - Leaderboards for badge collectors
   - Community-exclusive channels

---

## Troubleshooting

### Common Issues

#### Paywall Shows After Enrollment

**Cause**: Client state not updated  
**Solution**: Refresh page or clear cache

#### Can't Claim Badge

**Cause**: Insufficient gas or wrong network  
**Solution**: Ensure on Celo Alfajores with CELO for gas

#### Lesson Loads Slowly

**Cause**: Blockchain verification delay  
**Solution**: Normal - verification takes 2-3 seconds

#### Wallet Disconnects

**Cause**: Session timeout  
**Solution**: Reconnect wallet (lesson access persists)

---

## Support

For issues or questions:
- 📧 Email: support@celomexico.org
- 💬 Discord: [Celo Mexico Community](https://discord.gg/celo)
- 🐛 GitHub: [Open an Issue](https://github.com/CeloMX/celo-mx/issues)

---

## Changelog

### v1.0.0 (Oct 7, 2025)
- ✅ Initial paywall implementation
- ✅ Client-side verification
- ✅ Beautiful paywall UI
- ✅ One-click enrollment
- ✅ Real-time access updates

---

**Last Updated**: October 7, 2025  
**Status**: ✅ **Production Ready**  
**Security Level**: Client-Side Verification
