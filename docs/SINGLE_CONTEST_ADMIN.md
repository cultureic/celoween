# 🎃 Celoween Single Contest Admin Dashboard

**Mode:** Single Active Contest  
**Status:** 📋 Planning

---

## 🎯 Overview

Simplified admin dashboard for managing **ONE active Celoween contest** with full control over submissions, voting, and results.

---

## 📊 Core Features

### Contest Management
- ✅ **View current contest** details
- 🆕 **Edit contest** (title, description, dates, prizes)
- 🆕 **Manage status** (Draft → Active → Voting → Ended)
- 🆕 **Configure settings** (dates, prizes, rules)

### Submission Management
- 🆕 **View all submissions** in real-time
- 🆕 **Moderate submissions** (approve/reject)
- 🆕 **Delete inappropriate content**
- 🆕 **Feature top submissions**

### Voting & Results
- 🆕 **Monitor live voting**
- 🆕 **View vote counts** per submission
- 🆕 **Declare winners** manually
- 🆕 **Export results**

### Analytics
- 🆕 **Real-time stats**
  - Total participants
  - Active voters
  - Submission count
  - Vote distribution
- 🆕 **Engagement metrics**
  - Peak voting times
  - User activity

---

## 🗂️ Simplified File Structure

```
app/
├── admin/
│   ├── layout.tsx           (Admin layout)
│   ├── page.tsx             (Main dashboard - contest overview)
│   ├── edit/
│   │   └── page.tsx         (Edit contest details)
│   ├── submissions/
│   │   └── page.tsx         (Manage all submissions)
│   └── results/
│       └── page.tsx         (View results & declare winners)

components/
├── admin/
│   ├── AdminNav.tsx         (Simple top nav)
│   ├── ContestOverview.tsx  (Main stats card)
│   ├── SubmissionGrid.tsx   (Grid with moderation)
│   ├── VoteMonitor.tsx      (Live vote tracking)
│   └── ContestEditor.tsx    (Edit form)

app/api/admin/
├── contest/
│   ├── route.ts             (GET, PUT contest)
│   └── status/
│       └── route.ts         (PATCH status)
├── submissions/
│   ├── route.ts             (GET all)
│   └── [id]/
│       └── route.ts         (DELETE, PATCH moderate)
└── stats/
    └── route.ts             (GET live stats)
```

---

## 🎨 Dashboard Layout

### Main Dashboard (`/admin`)
```
┌─────────────────────────────────────────────┐
│  CELOWEEN ADMIN                        👻   │
├─────────────────────────────────────────────┤
│                                             │
│  🎃 Spooky Costume Contest 2025             │
│  Status: [VOTING] 🟢                        │
│  Prize: 500 CELO                            │
│                                             │
│  ┌──────────┬──────────┬──────────┐        │
│  │   120    │   450    │    89    │        │
│  │Submissions│  Votes   │ Voters   │        │
│  └──────────┴──────────┴──────────┘        │
│                                             │
│  Quick Actions:                             │
│  [Edit Contest] [View Submissions]          │
│  [Manage Status] [View Results]             │
│                                             │
│  Recent Activity:                           │
│  • New submission from 0x1234...            │
│  • 15 new votes in last hour                │
│                                             │
└─────────────────────────────────────────────┘
```

### Submissions Page (`/admin/submissions`)
```
Grid view with cards:
- Thumbnail
- Submitter wallet
- Vote count
- Actions: ✅ Approve | ❌ Delete | 🚩 Flag
```

### Results Page (`/admin/results`)
```
Leaderboard:
1. 👑 [Submission] - 250 votes
2. 🥈 [Submission] - 180 votes
3. 🥉 [Submission] - 120 votes

[Declare Winners] [Export CSV]
```

---

## 📝 Implementation Plan

### Phase 1: Admin Layout (20 min)
**Files:**
- `app/admin/layout.tsx`
- `components/admin/AdminNav.tsx`

**Features:**
- Simple top nav with wallet display
- Links: Dashboard | Submissions | Edit | Results
- Admin wallet check

---

### Phase 2: Main Dashboard (30 min)
**File:** `app/admin/page.tsx`

**Components:**
- Contest overview card
- Key metrics (submissions, votes, voters)
- Status indicator
- Quick action buttons
- Recent activity feed

**API:** `GET /api/admin/stats`

---

### Phase 3: Edit Contest (25 min)
**File:** `app/admin/edit/page.tsx`

**Form Fields:**
- Title
- Description
- Start/End/Voting End dates
- Prize pool
- Rules/Guidelines

**API:** `PUT /api/admin/contest`

**Status Control:**
- Draft → Active (starts contest)
- Active → Voting (ends submissions, starts voting)
- Voting → Ended (closes voting, shows results)

---

### Phase 4: Submission Management (30 min)
**File:** `app/admin/submissions/page.tsx`

**Features:**
- Grid view of all submissions
- Filter: All | Pending | Approved | Flagged
- Quick actions per submission
- Bulk approve/delete

**API:**
- `GET /api/admin/submissions`
- `DELETE /api/admin/submissions/[id]`
- `PATCH /api/admin/submissions/[id]` (moderate)

---

### Phase 5: Results & Winners (20 min)
**File:** `app/admin/results/page.tsx`

**Features:**
- Leaderboard sorted by votes
- Winner badges (1st, 2nd, 3rd)
- Export results as CSV
- Declare winners button (marks in DB)

**API:** `GET /api/admin/results`

---

## 🔐 Security

### Admin Check Middleware
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/admin')) {
    // Check wallet from header/cookie
    const wallet = request.headers.get('x-wallet-address');
    const adminWallet = process.env.ADMIN_WALLETS?.toLowerCase();
    
    if (wallet?.toLowerCase() !== adminWallet) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

---

## 🔄 Contest Status Flow

```
Draft 
  ↓ (Admin clicks "Start Contest")
Active (accepting submissions)
  ↓ (Admin clicks "Start Voting")
Voting (accepting votes only)
  ↓ (Admin clicks "End Contest")
Ended (show results, declare winners)
```

---

## 📅 Timeline

| Phase | Task | Time | Files |
|-------|------|------|-------|
| 1 | Admin Layout | 20 min | layout.tsx, AdminNav |
| 2 | Main Dashboard | 30 min | page.tsx, stats API |
| 3 | Edit Contest | 25 min | edit/page.tsx, contest API |
| 4 | Submissions | 30 min | submissions/page.tsx |
| 5 | Results | 20 min | results/page.tsx |

**Total: ~2 hours**

---

## 🎯 Priority Features

### Must Have (MVP)
- ✅ View contest overview
- ✅ Edit contest details
- ✅ View all submissions
- ✅ Delete submissions
- ✅ Change contest status
- ✅ View vote leaderboard

### Nice to Have (v2)
- Analytics charts
- Email notifications
- Bulk actions
- Comment moderation
- NFT minting for winners

---

## 🚀 Quick Start

1. **Create admin layout** with wallet check
2. **Build main dashboard** with contest stats
3. **Add edit page** for contest configuration
4. **Build submissions page** for moderation
5. **Add results page** for winners

**Let's start building!** 🎃

Want me to begin with Phase 1 (Admin Layout)?
