# Collaboration Guide for Celo Academy MX

## 🚨 Critical Rules to Prevent Breakage

### 1. Before Starting Work
```bash
# ALWAYS pull latest changes first
git pull origin main

# Check if dependencies need updating
npm install

# Run tests to ensure everything works
npm run test:unit
npm run type-check
```

### 2. Branch Strategy
```bash
# Create feature branches for all changes
git checkout -b feature/your-feature-name
git checkout -b fix/your-bug-fix
git checkout -b docs/your-documentation-update

# Never commit directly to main branch
```

### 3. Required Checks Before Committing
```bash
# Run this checklist before every commit:
npm run type-check     # TypeScript errors
npm run lint          # ESLint issues  
npm run test:unit     # Unit tests pass
npm run build         # Build works (if Node.js >= 18.18.0)

# Test your changes work:
npm run dev          # Development server starts
```

## 🔒 Protected Areas - Be Extra Careful

### Database & Migrations
- **NEVER** modify `prisma/schema.prisma` without creating migration
- **NEVER** delete existing migration files
- Always test migrations locally first:
```bash
npm run prisma:reset    # Reset local DB
npm run prisma:migrate  # Apply migrations
npm run prisma:seed     # Test with seed data
```

### Authentication & Security
- **NEVER** modify middleware.ts without testing admin access
- **NEVER** change environment variable names
- **NEVER** commit `.env.local` or `.env` files
- Test admin routes work: `/admin` should require wallet authentication

### Smart Contracts
- **NEVER** modify contract files without coordination
- **NEVER** change token ID generation logic
- Contract address changes require environment updates

### Course Access System
- **NEVER** bypass the paywall in `CourseDetailClient.tsx`
- **NEVER** remove enrollment checks
- **NEVER** make course content publicly accessible without NFT

## 📋 Coordination Workflow

### 1. Communication Protocol
```
1. Before starting major feature → Discuss in team chat
2. Before modifying core files → Get approval
3. Before database changes → Coordinate migrations
4. Before deployment → Run full test suite
```

### 2. Core Files That Need Coordination
- `middleware.ts` - Security & routing
- `prisma/schema.prisma` - Database schema
- `lib/wagmi.ts` - Web3 configuration
- `components/academy/CourseDetailClient.tsx` - Paywall system
- `lib/hooks/useSimpleBadge.ts` - NFT logic

### 3. File Conflict Resolution
```bash
# When you get merge conflicts:
git status                 # See conflicted files
# Edit files manually to resolve conflicts
npm run type-check        # Ensure no TypeScript errors
npm run test:unit         # Ensure tests pass
git add .
git commit -m "resolve: merge conflicts in [files]"
```

## 🎯 Best Practices

### Commit Messages
```bash
# Use this format:
git commit -m "feat: add new course enrollment flow"
git commit -m "fix: resolve dark mode text legibility"
git commit -m "docs: update API documentation"
git commit -m "refactor: improve component structure"
git commit -m "test: add unit tests for enrollment"

# Types: feat, fix, docs, refactor, test, chore
```

### Pull Request Checklist
```markdown
- [ ] Tests pass locally (`npm run test:unit`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Code follows existing patterns
- [ ] No console.log statements left
- [ ] Environment variables documented if new ones added
- [ ] Database migrations included if schema changed
- [ ] No breaking changes to existing APIs
```

## ⚠️ Common Pitfalls to Avoid

### 1. Node.js Version Issues
- Project requires Node.js >= 18.18.0
- Current system has 18.17.1 (needs upgrade)
- Use `node --version` to check before building

### 2. Package Manager Consistency
- Always use `npm` (not yarn/pnpm)
- Run `npm install` after pulling changes
- Don't commit `package-lock.json` conflicts without resolving properly

### 3. Environment Configuration
- Never hardcode API keys or secrets
- Use placeholder values in examples
- Test with different environment configurations

### 4. Dark Mode & Styling
- Test changes in both light and dark mode
- Don't use pure grey colors (use slate variants)
- Maintain Celo yellow (#fcff52) for brand consistency

## 🚀 Deployment Coordination

### Before Deploying
1. Merge to main branch only after PR review
2. Run full test suite: `npm run test:ci`
3. Verify build works: `npm run build`
4. Test on staging environment if available
5. Coordinate with team for deployment timing

### Environment Variables in Production
- Verify all required env vars are set in Vercel
- Test contract addresses are correct for network
- Admin wallet addresses are properly configured

## 🔧 Troubleshooting Common Issues

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors after pull
```bash
npm run prisma:generate  # Regenerate Prisma client
```

### Test failures
```bash
npm run test:unit -- --verbose  # See detailed test output
```

### Build failures
```bash
# Check Node.js version first
node --version  # Should be >= 18.18.0

# Clear Next.js cache
rm -rf .next
npm run build
```

## 📞 When to Ask for Help

### Immediate Help Needed:
- Build is broken and blocking others
- Database migrations failing
- Security-related changes
- Contract deployment issues

### Code Review Required:
- Changes to core authentication logic
- Database schema modifications  
- New API endpoints
- UI/UX changes affecting enrollment flow

### Nice to Have Review:
- Component refactoring
- Documentation updates
- Test improvements
- Performance optimizations

---

**Remember**: When in doubt, ask! It's better to over-communicate than break production. 🛡️