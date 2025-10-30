# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## CRITICAL: PRE-WORK REQUIREMENTS

**BEFORE MAKING ANY CODE CHANGES:**
1. **READ ALL .md FILES** - Review existing documentation to understand current state
2. **CHECK TRACKING DOCUMENTS** - Look for ENROLLMENT_FIX_TRACKING.md, bug analysis files, implementation plans
3. **CREATE DOCUMENTATION FIRST** - Always document analysis and implementation plans before coding
4. **FOLLOW COMMUNICATION RULES** - See WARP_COMMUNICATION_RULES.md for mandatory guidelines

**Key Documentation Files to Always Check:**
- ENROLLMENT_FIX_TRACKING.md - Current enrollment system status
- ENROLLMENT_BUG_ANALYSIS.md - Specific bug details and root causes
- ENROLLMENT_FIX_IMPLEMENTATION_PLAN.md - Step-by-step fix procedures
- WARP_COMMUNICATION_RULES.md - Communication and workflow requirements
- Any other analysis or tracking .md files in root directory

**Workflow Requirement**: Document → Plan → Implement → Commit → Push

Project overview
- Next.js 15 (App Router) with TypeScript
- Web3: wagmi + viem; Authentication: Privy
- Database: Prisma + PostgreSQL
- Smart contracts: Hardhat (Celo Alfajores/Mainnet)
- Testing: Jest (unit/integration) and Playwright (E2E)
- CI: GitHub Actions pipeline (.github/workflows/bulletproof-ci.yml)

Node and package manager
- Node engine: >= 18.18.0 (package.json). The project is commonly run with Node 20.x in docs/CI.
- npm is the default (package-lock.json present). pnpm also appears in docs, but CI uses npm.

Common commands
Development server and build
- Start dev server: npm run dev
- Build (includes Prisma client generation): npm run build
- Start production server: npm run start

Quality
- Lint: npm run lint
- Type-check: npm run type-check
- Format: npm run format

Jest tests (web app)
- All tests: npm test
- Watch mode: npm run test:watch
- Coverage report: npm run test:coverage
- Targeted test directories:
  - Smoke: npm run test:smoke
  - Performance: npm run test:performance
  - Database: npm run test:database
  - Integration: npm run test:integration
  - Components: npm run test:components
  - Unit: npm run test:unit
- Run a single test file:
  - npx jest tests/smoke/smoke.test.ts
- Run by name pattern within a file:
  - npx jest tests/performance/performance.test.ts -t "pattern here"

Playwright E2E tests
- Run all E2E: npm run test:e2e
- Run in UI mode: npm run test:e2e:ui
- Run a single spec file:
  - npx playwright test tests/e2e/example.e2e.ts
- Run a single test by title:
  - npx playwright test -g "should do X"
- If browsers are missing: npx playwright install

Prisma (database)
- Generate client: npm run prisma:generate
- Dev migrations: npm run prisma:migrate
- Seed data: npm run prisma:seed
- Reset DB (destructive, dev): npm run prisma:reset
- Prisma Studio (GUI): npm run prisma:studio

Hardhat (smart contracts)
- Compile: npm run hardhat:compile
- Run contract tests: npm run hardhat:test
- Run a single hardhat test by file:
  - npx hardhat test test/contracts/MilestoneBadge.test.ts -g "pattern"
- Deploy:
  - Alfajores: npm run deploy:alfajores
  - Celo mainnet: npm run deploy:celo
  - Local hardhat: npm run deploy:local
- Verify (set explorer API key in env):
  - npm run verify:alfajores
  - npm run verify:celo

CI-like local run
- Full CI bundle (unit/components/integration + coverage + E2E): npm run test:ci
  - Note: Playwright browsers may need installation (npx playwright install).

Environment variables (must be set via .env.local or your environment)
These are referenced across middleware, providers, wagmi, Prisma, and Hardhat. See docs/reference/PROJECT_RULES.md for authoritative lists.
- Database: DATABASE_URL, DIRECT_URL, DATABASE_SSL_CERT (if using SSL)
- Privy: NEXT_PUBLIC_PRIVY_APP_ID, PRIVY_APP_SECRET
- Web3/connectors: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID (include WalletConnect connector only when set)
- Contracts: NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES
- Admin access: ADMIN_WALLETS, NEXT_PUBLIC_ADMIN_WALLETS
- Other variables may be referenced in docs/deployment/DEPLOYMENT_GUIDE.md

High-level architecture
App shell and providers
- app/layout.tsx composes the global shell (ThemeProvider + Providers, Header/Footer). The Providers component (components/Providers.tsx) wraps the tree with:
  - PrivyProvider for wallet auth (configured for Celo Alfajores)
  - TanStack Query client
  - WagmiProvider using lib/wagmi.ts
- lib/wagmi.ts builds connectors dynamically:
  - injected() always included
  - walletConnect() is added only if NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is defined

Academy routes and paywall
- Public catalog in app/academy/page.tsx; course detail views in app/academy/[slug]/page.tsx
- Client-side enrollment gating:
  - app/academy/[slug]/CourseDetailClient.tsx shows course content and drives enrollment UX (dynamic import of Web3EnrollPanel with ssr: false to avoid SSR wallet issues)
  - app/academy/[slug]/LessonAccessWrapper.tsx enforces access control around lessons and renders CoursePaywall when needed
  - components/academy/CoursePaywall.tsx renders the locked state with three states: LOADING, WALLET_NOT_CONNECTED, NOT_ENROLLED

Enrollment logic and token IDs
- lib/hooks/useSimpleBadge.ts centralizes SimpleBadge contract interactions using wagmi and a Privy fallback for signing when no EIP-1193 connector is present (mobile Safari).
- Course token IDs:
  - Legacy slugs map to fixed token IDs (compatibility)
  - New courses derive tokenId deterministically from the course database ID (generateTokenIdFromCourseId)
  - getCourseTokenId(slug, id) chooses legacy → DB-based → slug hash fallback
- Contract address is read from NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES; wagmi reads it via getContractAddress with basic validation.

Middleware and security
- middleware.ts enforces rate limiting for all requests (simple in-memory store; swap to Redis in production).
- Admin access is expected to check wallets against ADMIN_WALLETS. Note: There is a temporary bypass in middleware for /admin and /api/admin during testing; remove this for production.
- Security headers and CSP are added in production builds.

API and backend
- API routes under app/api/* include health checks (/api/health, /api/health/db, /api/health/env), admin endpoints, metadata, and progress.
- lib/auth-server.ts provides token parsing and admin checks (wallet list, optional emails), used by middleware validation helpers.

Database model (Prisma)
- prisma/schema.prisma models a hierarchical curriculum: Course → Module → Lesson, plus User, Enrollment, Certificate, progress tracking, categories/levels/tags, and NFT config per course.
- lib/prisma.ts initializes a singleton Prisma client with verbose logs in development.

Smart contracts and deployment
- Contracts live under contracts/ (SimpleBadge.sol, MilestoneBadge.sol) with tests in test/contracts.
- Hardhat config (hardhat.config.mts/cjs) targets Solidity 0.8.20 with optimizer, network configs for hardhat, alfajores, and celo, and paths adjusted to ./test/contracts.
- Deployment entry is scripts/deploy.ts; utility helpers under scripts/deploy-utils.ts. Environment variables include DEPLOYER_PRIVATE_KEY, CELOSCAN_API_KEY, optional AUTO_VERIFY and MILESTONE_BADGE_BASE_URI.

Testing strategy
- Jest is configured in jest.config.js to run tests under tests/, app/, components/, and lib/ with jsdom environment; coverage thresholds are high (90–100% on critical areas). Some setup paths are referenced under tests/setup/*.
- Playwright E2E configuration is defined in playwright.config.ts. Tests look under tests/e2e, with webServer auto-starting npm run dev locally during E2E runs.

Rules and invariants (from docs/reference/PROJECT_RULES.md)
- Course access is gated: lesson content must not render without NFT enrollment. Do not bypass CourseDetailClient/LessonAccessWrapper checks.
- Token ID policy: legacy mapping retained; new courses must use dynamic token IDs derived from DB IDs.
- Environment-driven connectors: only enable WalletConnect when NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is set; do not ship default/fake IDs.
- Admin routes validate against ADMIN_WALLETS; do not hardcode admin addresses in code.
- MDX/media: rehype-raw must remain enabled to allow trusted embeds and consistent iframe/video handling.
- Mobile Safari signing policy: without WalletConnect, there is no injected provider; users must use a wallet in-app browser or set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID. Long-term: consider Privy v3 + @privy-io/wagmi.

Important references
- README: README.md (Quick Start, endpoints, and links)
- Project rules: docs/reference/PROJECT_RULES.md
- Collaboration guide: docs/COLLABORATION_GUIDE.md (for multiple developers)
- Course paywall: docs/technical/COURSE_PAYWALL.md
- Dynamic NFT solution: docs/technical/DYNAMIC_NFT_SOLUTION.md
- Deployment guide: docs/deployment/DEPLOYMENT_GUIDE.md
- CI workflow: .github/workflows/bulletproof-ci.yml
