# 🎃 Celoween - Supabase Database Setup

## Quick Setup

### Option 1: Automated Setup (Recommended)
Run the setup script that will securely prompt for your password:

```bash
./scripts/setup-database.sh
```

### Option 2: Manual Setup
1. Open `.env.local`
2. Find the `DATABASE_URL` and `DIRECT_URL` lines
3. Replace `[YOUR-PASSWORD]` with your actual Supabase password
4. Run migrations:
```bash
npx prisma generate
npx prisma migrate deploy
```

## Database Information

**Project**: `zijbqfnihzddlaaungau`  
**Region**: `aws-1-us-east-1`  
**Pooler Port**: `6543` (for production/pooling)  
**Direct Port**: `5432` (for migrations)

## Environment Variables

Your `.env.local` should have:

```env
# Connection pooling (for Next.js serverless functions)
DATABASE_URL="postgresql://postgres.zijbqfnihzddlaaungau:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (for Prisma migrations)
DIRECT_URL="postgresql://postgres.zijbqfnihzddlaaungau:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

## Prisma Schema

The current schema includes:

- **User** - User profiles and authentication
- **Contest** - Halloween talent contests
- **Submission** - Contest entries
- **Vote** - Community voting records
- **Reward** - Prize distribution tracking

## Useful Commands

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Open Prisma Studio (GUI)
npx prisma studio

# Verify connection
npx prisma db pull

# Reset database (DANGER: deletes all data)
npx prisma migrate reset
```

## Next Steps After Setup

1. ✅ Run the setup script
2. ✅ Verify connection with `npx prisma studio`
3. 🔄 Start building API routes (Phase 8)
4. 🔄 Connect Web3 integration (Phase 7)

## Troubleshooting

**Connection refused?**
- Check that your IP is allowed in Supabase dashboard
- Verify password is correct
- Ensure Supabase project is not paused

**Migration errors?**
- Make sure you're using `DIRECT_URL` for migrations
- Check Prisma schema syntax
- Review migration history: `npx prisma migrate status`

**Pooler issues?**
- Use `DATABASE_URL` for app queries
- Use `DIRECT_URL` for migrations only
- PgBouncer doesn't support all PostgreSQL features

## Security Notes

⚠️ **Never commit `.env.local` to version control!**  
✅ It's already in `.gitignore`  
✅ Password should be strong (Supabase auto-generates)  
✅ Use connection pooling for production
