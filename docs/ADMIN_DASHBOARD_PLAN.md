# 🎃 Celoween Admin Dashboard - Development Plan

**Created:** October 28, 2025  
**Status:** 📋 Planning

---

## 🎯 Overview

Build a comprehensive admin dashboard for managing Celoween contests with full CRUD operations.

---

## 📊 Features Required

### Contest Management
- ✅ **View all contests** (already exists at `/contests`)
- 🔄 **Create contest** (partially done - needs enhancement)
- 🆕 **Edit contest** (title, description, dates, prizes)
- 🆕 **Delete contest** (with confirmation)
- 🆕 **Update contest status** (Draft → Active → Voting → Ended → Cancelled)

### Submission Management
- 🆕 **View all submissions** for a contest
- 🆕 **Moderate submissions** (approve/reject/flag)
- 🆕 **Delete inappropriate submissions**

### Analytics & Stats
- 🆕 **Contest performance metrics**
  - Total participants
  - Total votes
  - Submission count
  - Prize pool amount
- 🆕 **Platform-wide statistics**
  - Total contests created
  - Total users
  - Active contests

### Settings
- 🆕 **Platform configuration**
  - Update admin wallets
  - Configure default contest settings
  - Manage platform fees

---

## 🗂️ File Structure

```
app/
├── admin/
│   ├── layout.tsx          (Admin layout with sidebar)
│   ├── page.tsx            (Dashboard overview)
│   ├── contests/
│   │   ├── page.tsx        (Contest list with actions)
│   │   ├── [id]/
│   │   │   ├── page.tsx    (Edit contest form)
│   │   │   └── submissions/
│   │   │       └── page.tsx (Manage submissions)
│   │   └── new/
│   │       └── page.tsx    (Create new contest)
│   ├── settings/
│   │   └── page.tsx        (Platform settings)
│   └── analytics/
│       └── page.tsx        (Stats dashboard)

components/
├── admin/
│   ├── AdminSidebar.tsx    (Navigation)
│   ├── ContestForm.tsx     (Create/Edit form)
│   ├── SubmissionTable.tsx (Submission management)
│   ├── StatsCard.tsx       (Dashboard metrics)
│   └── StatusBadge.tsx     (Contest status indicator)

app/api/
├── admin/
│   ├── contests/
│   │   ├── route.ts        (GET all, POST create)
│   │   └── [id]/
│   │       ├── route.ts    (GET, PUT, DELETE)
│   │       └── status/
│   │           └── route.ts (PATCH status)
│   ├── submissions/
│   │   └── [id]/
│   │       └── route.ts    (DELETE, PATCH moderate)
│   └── analytics/
│       └── route.ts        (GET platform stats)
```

---

## 🔐 Security Requirements

### Authentication
- Admin wallet check: `0x9f42Caf52783EF12d8174d33c281a850b8eA58aD`
- Privy authentication required
- Middleware to protect `/admin` routes

### Authorization
```typescript
// lib/auth/admin.ts
export function isAdmin(address: string): boolean {
  const adminWallets = process.env.ADMIN_WALLETS?.split(',') || [];
  return adminWallets.includes(address.toLowerCase());
}
```

### API Protection
- Check admin status on all admin API routes
- Return 403 for non-admin users
- Log all admin actions

---

## 📝 Implementation Phases

### Phase 1: Admin Layout & Navigation (30 min)
**Files:**
- `app/admin/layout.tsx`
- `components/admin/AdminSidebar.tsx`
- Middleware for admin route protection

**Tasks:**
- Create admin layout with sidebar
- Add navigation links (Dashboard, Contests, Settings)
- Implement wallet check middleware
- Add logout button

---

### Phase 2: Contest CRUD (1 hour)

#### 2A: Contest List Page
**File:** `app/admin/contests/page.tsx`

**Features:**
- Table view of all contests
- Status badges (Draft, Active, Voting, Ended)
- Quick actions: Edit, Delete, Change Status
- Filter by status
- Search by title

#### 2B: Edit Contest
**File:** `app/admin/contests/[id]/page.tsx`

**Form Fields:**
- Title
- Description
- Start Date/Time
- End Date/Time
- Voting End Date/Time
- Prize Pool Amount
- Prize Token (CELO, cUSD)
- Metadata URI (IPFS)

**API:** `PUT /api/admin/contests/[id]`

#### 2C: Delete Contest
**API:** `DELETE /api/admin/contests/[id]`

**Safety:**
- Confirmation modal
- Can only delete Draft or Cancelled contests
- Cascade delete submissions & votes

#### 2D: Update Status
**API:** `PATCH /api/admin/contests/[id]/status`

**Flow:**
Draft → Active → Voting → Ended  
(or → Cancelled from any state)

---

### Phase 3: Submission Management (45 min)

**File:** `app/admin/contests/[id]/submissions/page.tsx`

**Features:**
- Table of all submissions
- Preview image/video
- Vote count
- Actions: Delete, Flag, View Details
- Bulk actions

**API:** 
- `DELETE /api/admin/submissions/[id]`
- `PATCH /api/admin/submissions/[id]` (moderate)

---

### Phase 4: Dashboard & Analytics (45 min)

#### 4A: Dashboard Overview
**File:** `app/admin/page.tsx`

**Metrics:**
- Total contests (by status)
- Total submissions
- Total votes
- Total prize pool
- Recent activity

#### 4B: Analytics API
**File:** `app/api/admin/analytics/route.ts`

**Returns:**
```json
{
  "contests": {
    "total": 10,
    "draft": 2,
    "active": 3,
    "voting": 2,
    "ended": 3
  },
  "submissions": {
    "total": 150,
    "thisWeek": 45
  },
  "votes": {
    "total": 2500,
    "thisWeek": 780
  },
  "prizePools": {
    "totalCELO": "1250.50",
    "totalcUSD": "500.00"
  }
}
```

---

### Phase 5: Settings & Configuration (30 min)

**File:** `app/admin/settings/page.tsx`

**Settings:**
- Admin wallet addresses (view only)
- Platform fee percentage
- Default contest duration
- Maintenance mode toggle

**API:** `PATCH /api/admin/settings`

---

## 🎨 UI Components Needed

### AdminSidebar.tsx
```tsx
- Logo
- Navigation links
  - Dashboard
  - Contests
  - Analytics
  - Settings
- User wallet display
- Logout button
```

### ContestForm.tsx
```tsx
- All contest fields
- Date pickers
- IPFS upload helper
- Validation
- Submit/Cancel buttons
```

### SubmissionTable.tsx
```tsx
- Data table with sorting
- Thumbnail previews
- Action buttons
- Pagination
```

### StatsCard.tsx
```tsx
- Metric title
- Value (number/currency)
- Change indicator (+/- %)
- Icon
```

---

## 🔄 API Routes Summary

### Contest Management
- `GET /api/admin/contests` - List all
- `POST /api/admin/contests` - Create new
- `GET /api/admin/contests/[id]` - Get single
- `PUT /api/admin/contests/[id]` - Update
- `DELETE /api/admin/contests/[id]` - Delete
- `PATCH /api/admin/contests/[id]/status` - Update status

### Submission Management
- `GET /api/admin/submissions?contestId=[id]` - List
- `DELETE /api/admin/submissions/[id]` - Delete
- `PATCH /api/admin/submissions/[id]` - Moderate

### Analytics
- `GET /api/admin/analytics` - Platform stats
- `GET /api/admin/analytics/contests/[id]` - Contest stats

### Settings
- `GET /api/admin/settings` - Get settings
- `PATCH /api/admin/settings` - Update settings

---

## 📅 Timeline

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Admin Layout | 30 min | 🔄 Next |
| 2A | Contest List | 20 min | ⏳ |
| 2B | Edit Contest | 25 min | ⏳ |
| 2C | Delete Contest | 10 min | ⏳ |
| 2D | Update Status | 15 min | ⏳ |
| 3 | Submission Management | 45 min | ⏳ |
| 4 | Dashboard & Analytics | 45 min | ⏳ |
| 5 | Settings | 30 min | ⏳ |

**Total Estimated Time:** ~3.5 hours

---

## 🧪 Testing Checklist

### Authentication
- [ ] Non-admin redirected from `/admin`
- [ ] Admin can access all pages
- [ ] Logout clears session

### Contest CRUD
- [ ] Create contest with all fields
- [ ] Edit existing contest
- [ ] Delete draft contest
- [ ] Cannot delete active contest
- [ ] Status transitions work correctly

### Submission Management
- [ ] View all submissions for contest
- [ ] Delete submission
- [ ] Submission removed from frontend

### Analytics
- [ ] Stats calculate correctly
- [ ] Charts display properly
- [ ] Real-time updates

---

## 🚀 Deployment Notes

### Environment Variables
```bash
ADMIN_WALLETS=0x9f42Caf52783EF12d8174d33c281a850b8eA58aD
NEXT_PUBLIC_ADMIN_WALLETS=0x9f42Caf52783EF12d8174d33c281a850b8eA58aD
```

### Database Changes
No new tables needed - using existing schema.

### Smart Contract Updates
Status changes should sync with blockchain:
- Call `updateContestStatus()` when status changes
- Ensure on-chain state matches database

---

## 📦 Dependencies

No new packages needed. Using existing:
- React Hook Form (forms)
- Zod (validation)
- TailwindCSS (styling)
- Prisma (database)

---

## 🎯 Next Steps

1. **Start with Phase 1:** Create admin layout and sidebar
2. **Build Contest CRUD:** Full create/edit/delete functionality
3. **Add Analytics:** Dashboard metrics and charts
4. **Test Everything:** Ensure security and data integrity
5. **Document Usage:** Admin guide for contest management

---

**Ready to start?** Let's begin with Phase 1: Admin Layout! 🚀
