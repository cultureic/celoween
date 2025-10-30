# Auth and Wallet Integration Audit

This document audits the current authentication and wallet stack, identifies likely failure points for the "Conectar" flow, and proposes targeted fixes with minimal blast radius.

## Architecture overview

- UI entry: `components/PrivyLogin.tsx`
  - Uses `useAuth()` to read `authenticated`, `ready`, `user`, `wallet`, `login()`, `logout()`.
- Auth hook: `hooks/useAuth.ts`
  - Thin wrapper around `usePrivy()`, derives wallet from `user.linkedAccounts`.
  - Persists access token and wallet address to cookies/localStorage for SSR/middleware.
- Global providers: `components/Providers.tsx`
  - `<PrivyProvider>` (outermost), then React Query, Wagmi, then `<ZeroDevSmartWalletProvider>`.
- Smart account: `lib/contexts/ZeroDevSmartWalletProvider.tsx`
  - Initializes ZeroDev Kernel account once Privy is authenticated and `useWallets()` returns a wallet.
- App consumers:
  - `EnrollmentContext` reads wallet address from `useAuth()` and uses smart account for signing.
  - Progress UI no longer depends on contract aggregate counts; uses per‑module reads.
- Wagmi connectors: `lib/wagmi.ts`
  - Injected always; WalletConnect only when a valid `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set.

## Symptoms reported

- Connect button shows spinner or does nothing
- `useAuth` debug shows `{ user: false, wallet: false }`
- Reown/WalletConnect relayer errors: `Unauthorized: invalid key`

## Findings

1) WalletConnect relayer was starting with an invalid `projectId`, causing auth noise and potential UI stalls.
   - Fixed: WalletConnect is now disabled unless `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is a valid non‑placeholder value.

2) `useAuth` gated `isAuthenticated` on `ready`. If Privy `ready` never flips true due to network/script issues, the app stays in perpetual loading.
   - Fixed: `isAuthenticated` now reflects `authenticated` directly; `isLoading` is `!ready && !authenticated`.

3) PrivyLogin previously hid the Connect button while loading, preventing user action if `ready` lagged. Clicking during loading could be ignored.
   - Fixed: Connect button is always rendered and clickable; spinner appears inline while `isLoading` is true.

4) Enrollment/Progress contexts were noisy but not blockers for auth. They now consume the `useAuth()` address without gating auth.

## Remaining environmental requirements

- `NEXT_PUBLIC_PRIVY_APP_ID` must be correctly set. If wrong/missing, Privy `ready` can hang and `login()` may no‑op.
- If WalletConnect is needed, set a real `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.

## Code paths to verify in runtime

- `components/PrivyLogin.tsx` → Connect button invokes `login()` regardless of loading; inline spinner only.
- `hooks/useAuth.ts` → `isAuthenticated` no longer waits for `ready`.
- `components/Providers.tsx` → PrivyProvider no `clientId` misconfig; supported chains limited to Celo Alfajores.
- `lib/wagmi.ts` → WalletConnect excluded unless valid projectId.

## Minimal test plan

1) Load any page with the header.
   - Expect: Connect button visible; spinner inside button while Privy initializes.
2) Click Connect.
   - Expect: Privy modal opens; after success, header shows truncated wallet.
3) Refresh page.
   - Expect: Session persists; `useAuth` shows authenticated without waiting for `ready`.

## Suggested hardening (optional)

- Add runtime warnings when `NEXT_PUBLIC_PRIVY_APP_ID` is missing/placeholder.
- Add `/test-auth` simple page (already present) to isolate Privy login without app providers.
- Defer ZeroDev initialization until authenticated to reduce noise in the auth phase (already conditional).

## Files touched in this pass

- hooks/useAuth.ts
  - isAuthenticated/auth loading semantics adjusted
- components/PrivyLogin.tsx
  - Always‑on Connect button; robust click handler; inline spinner
- lib/wagmi.ts
  - Validate WalletConnect projectId and disable when invalid
- components/Providers.tsx
  - Removed optional clientId to avoid misconfiguration

## Rollback plan

- If any regression appears, revert these four files to the previous commit.
