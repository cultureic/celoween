# Feature Request Template

Use this template when requesting new features or major changes to the Celo Mexico Academy platform.

---

## 📋 New Feature Request

**IMPORTANT: Before implementing this feature, please:**

1. ✅ Read and follow all rules in `PROJECT_RULES.md`
2. ✅ Check `PRODUCTION_STATUS.md` for current system state
3. ✅ Review `COURSE_PAYWALL.md` if touching enrollment/access logic
4. ✅ Verify this change won't break existing paywall, NFT badge, or course access systems
5. ✅ Confirm you understand the client/server component boundaries for Web3 interactions

---

### Feature Description:
[Describe what you want to build]

### Requirements:
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

### Expected Behavior:
[Describe how the feature should work]

### User Flow:
1. User does X
2. System responds with Y
3. Final outcome is Z

### Files That Might Be Affected:
[List any files you think need changes, or say "Not sure"]

### Database Changes:
- [ ] No database changes needed
- [ ] New tables/models required
- [ ] Existing schema modifications needed

### Environment Variables:
- [ ] No new env variables needed
- [ ] New configuration required (list them)

### Impact Assessment:
- [ ] Will this affect the paywall system?
- [ ] Will this change NFT badge verification?
- [ ] Will this modify course access control?
- [ ] Will this change admin permissions?
- [ ] Will this affect existing user data?

### Questions/Concerns:
[Any specific concerns about breaking existing functionality?]

---

## 🎯 Quick Copy-Paste Version

Use this shortened version for simple feature requests:

```
🚨 BEFORE YOU START: Review PROJECT_RULES.md, PRODUCTION_STATUS.md, and COURSE_PAYWALL.md

Feature: [describe feature in one sentence]

Requirements:
- [requirement 1]
- [requirement 2]
- [requirement 3]

Impact Check:
- [ ] Affects paywall system
- [ ] Changes NFT badge logic
- [ ] Requires database changes
- [ ] Needs new environment variables

Concerns:
[Any worries about breaking existing features?]
```

---

## 💡 Examples

### Example 1: Adding a Course Progress Tracker

```
Feature: Add visual progress tracker showing % completion for enrolled students

Requirements:
- Track completed lessons per course
- Show progress bar on course detail page
- Store progress in database
- Only visible to enrolled users

Impact Check:
- [x] Affects paywall system (must check enrollment first)
- [ ] Changes NFT badge logic
- [x] Requires database changes (new Progress table)
- [ ] Needs new environment variables

Files Affected:
- app/academy/[slug]/CourseDetailClient.tsx
- prisma/schema.prisma
- New: components/academy/ProgressTracker.tsx
```

### Example 2: Adding Course Reviews

```
Feature: Allow enrolled students to leave reviews and ratings

Requirements:
- Only enrolled users can review
- 5-star rating system
- Text review (optional)
- Display average rating

Impact Check:
- [x] Affects paywall system (enrollment check required)
- [ ] Changes NFT badge logic
- [x] Requires database changes (new Review table)
- [ ] Needs new environment variables

Concerns:
- Need to verify user owns NFT before allowing review
- Should reviews be editable?
- Moderation system needed?
```

---

## 🚫 Anti-Patterns to Avoid

**DON'T:**
- Request features that bypass the NFT paywall system
- Ask to remove enrollment verification
- Suggest hardcoding contract addresses or secrets
- Request changes that break existing course access
- Skip database migrations

**DO:**
- Think about enrolled vs non-enrolled user states
- Consider how the feature integrates with Web3
- Plan for both client and server rendering
- Document expected user flows
- Test with different wallet states

---

## 📞 Need Help?

If you're unsure about:
- How the current system works → Read `PROJECT_RULES.md`
- Current feature status → Check `PRODUCTION_STATUS.md`
- Paywall implementation → See `COURSE_PAYWALL.md`
- Deployment process → Review `DEPLOYMENT_GUIDE.md`

---

**Last Updated:** 2025-10-07  
**Version:** 1.0.0
