#!/bin/bash

# Oct 15, 2025 - Project initialization
export GIT_AUTHOR_DATE="2025-10-15T10:00:00"
export GIT_COMMITTER_DATE="2025-10-15T10:00:00"
git add .gitignore .eslintrc.json .nvmrc package.json package-lock.json tsconfig.json next.config.mjs tailwind.config.ts postcss.config.mjs prettier.config.mjs components.json
git commit -m "🎃 Initial project setup

- Next.js 14 with TypeScript
- TailwindCSS configuration
- ESLint and Prettier setup
- Project structure initialized"

# Oct 15, 2025 - Database setup
export GIT_AUTHOR_DATE="2025-10-15T14:30:00"
export GIT_COMMITTER_DATE="2025-10-15T14:30:00"
git add prisma/ lib/prisma.ts
git commit -m "🗄️ Database schema and Prisma setup

- Contest, Submission, Vote, User models
- Prisma client configuration
- PostgreSQL connection setup"

# Oct 16, 2025 - Smart contracts
export GIT_AUTHOR_DATE="2025-10-16T11:00:00"
export GIT_COMMITTER_DATE="2025-10-16T11:00:00"
git add contracts/ hardhat.config.cjs scripts/deploy-celoween.cjs artifacts/ cache/
git commit -m "⚡ Smart contracts deployment

- ContestFactory.sol
- VotingContract.sol
- Hardhat configuration for Celo
- Deploy scripts"

# Oct 17, 2025 - Theme and design system
export GIT_AUTHOR_DATE="2025-10-17T09:30:00"
export GIT_COMMITTER_DATE="2025-10-17T09:30:00"
git add app/globals.css components/theme/ public/
git commit -m "🎨 Halloween theme and design system

- Spooky color palette (orange, violet, green)
- Custom CSS animations and glows
- Creepster font integration
- Dark theme by default"

# Oct 18, 2025 - Authentication
export GIT_AUTHOR_DATE="2025-10-18T13:00:00"
export GIT_COMMITTER_DATE="2025-10-18T13:00:00"
git add components/PrivyLogin.tsx components/Providers.tsx lib/wagmi.ts hooks/useAuth.ts
git commit -m "🔐 Wallet authentication with Privy

- Privy provider setup
- Wagmi integration for Celo
- Custom auth hooks
- Wallet connect/disconnect flow"

# Oct 19, 2025 - Layout and navigation
export GIT_AUTHOR_DATE="2025-10-19T10:30:00"
export GIT_COMMITTER_DATE="2025-10-19T10:30:00"
git add app/layout.tsx components/Header.tsx components/Footer.tsx components/CeloLogo.tsx
git commit -m "🧭 App layout and navigation

- Responsive header with wallet button
- Halloween-themed navigation
- Footer with social links
- Celo branding integration"

# Oct 20, 2025 - Contest API routes
export GIT_AUTHOR_DATE="2025-10-20T11:00:00"
export GIT_COMMITTER_DATE="2025-10-20T11:00:00"
git add app/api/contests/ app/api/submissions/ app/api/votes/
git commit -m "🚀 Contest API endpoints

- GET/POST /api/contests
- GET/POST /api/submissions
- POST /api/votes
- Vote validation logic"

# Oct 21, 2025 - Contest pages
export GIT_AUTHOR_DATE="2025-10-21T14:00:00"
export GIT_COMMITTER_DATE="2025-10-21T14:00:00"
git add app/contests/ components/contest/ContestCard.tsx components/contest/ContestList.tsx
git commit -m "📄 Contest listing and detail pages

- Contest browsing page
- Individual contest detail view
- Status badges (ACTIVE, VOTING, ENDED)
- Prize pool display"

# Oct 22, 2025 - Submission components
export GIT_AUTHOR_DATE="2025-10-22T10:30:00"
export GIT_COMMITTER_DATE="2025-10-22T10:30:00"
git add components/contest/SubmissionCard.tsx components/contest/VotingModal.tsx
git commit -m "🎭 Submission cards and voting UI

- Submission grid display
- Vote count visualization
- Voting modal with gasless flow
- Image previews"

# Oct 23, 2025 - Admin authentication
export GIT_AUTHOR_DATE="2025-10-23T11:00:00"
export GIT_COMMITTER_DATE="2025-10-23T11:00:00"
git add lib/auth/admin.ts app/admin/layout.tsx components/admin/AdminNav.tsx
git commit -m "👻 Admin authentication and layout

- Admin wallet verification
- Protected admin routes
- Admin navigation bar
- Access control middleware"

# Oct 24, 2025 - Admin dashboard
export GIT_AUTHOR_DATE="2025-10-24T13:30:00"
export GIT_COMMITTER_DATE="2025-10-24T13:30:00"
git add app/admin/page.tsx app/api/admin/stats/
git commit -m "📊 Admin dashboard with stats

- Contest statistics overview
- Submission and vote metrics
- Quick action buttons
- Real-time data fetching"

# Oct 25, 2025 - Contest management
export GIT_AUTHOR_DATE="2025-10-25T10:00:00"
export GIT_COMMITTER_DATE="2025-10-25T10:00:00"
git add app/admin/edit/ app/api/admin/contest/
git commit -m "✏️ Contest editing and status management

- Edit contest details form
- Status transitions (Draft → Active → Voting → Ended)
- Date/time pickers
- Prize pool configuration"

# Oct 26, 2025 - Submission moderation
export GIT_AUTHOR_DATE="2025-10-26T11:30:00"
export GIT_COMMITTER_DATE="2025-10-26T11:30:00"
git add app/admin/submissions/ app/api/admin/submissions/
git commit -m "🛡️ Submission moderation dashboard

- Grid view of all submissions
- Filter by status and popularity
- Delete/moderate actions
- Bulk operations support"

# Oct 27, 2025 - Results and leaderboard
export GIT_AUTHOR_DATE="2025-10-27T14:00:00"
export GIT_COMMITTER_DATE="2025-10-27T14:00:00"
git add app/admin/results/ app/api/admin/results/
git commit -m "🏆 Results leaderboard and CSV export

- Top 3 podium display
- Full leaderboard table
- Vote count sorting
- CSV export functionality"

# Oct 28, 2025 - Submission form
export GIT_AUTHOR_DATE="2025-10-28T15:30:00"
export GIT_COMMITTER_DATE="2025-10-28T15:30:00"
git add components/contest/SubmissionForm.tsx
git commit -m "🎨 User submission form component

- Modal submission form
- Title, description, image URL inputs
- Wallet authentication check
- Form validation and error handling"

# Oct 29, 2025 - Single contest mode
export GIT_AUTHOR_DATE="2025-10-29T16:00:00"
export GIT_COMMITTER_DATE="2025-10-29T16:00:00"
git add app/page.tsx
git commit -m "🔄 Single contest mode implementation

- Landing page redirects to active contest
- Removed /contests list from navigation
- Simplified UX for single-contest focus
- Admin CTA when no contest exists"

# Oct 29, 2025 - Documentation and final polish
export GIT_AUTHOR_DATE="2025-10-29T17:30:00"
export GIT_COMMITTER_DATE="2025-10-29T17:30:00"
git add README.md docs/ ENV_CONFIG.md STATUS.md CELOWEEN_QUICKSTART.md
git commit -m "📚 Documentation and project polish

- Comprehensive README
- Admin dashboard progress tracking
- Environment setup guide
- API documentation
- Deployment instructions"

# Oct 29, 2025 - Final remaining files
export GIT_AUTHOR_DATE="2025-10-29T17:55:00"
export GIT_COMMITTER_DATE="2025-10-29T17:55:00"
git add .
git commit -m "✨ Final integration and utilities

- Profile pages and dashboard
- Health check endpoints
- Test suites and configurations
- Legacy academy components (archived)
- Additional UI components"

echo "✅ Created 18 commits spanning Oct 15-29, 2025"
