# Supabase Storage Setup for Celoween

## Quick Fix for RLS Error

The error "new row violates row-level security policy" means the bucket doesn't allow public uploads.

### Option 1: Allow Public Uploads (Easiest)

1. Go to your Supabase Dashboard
2. Navigate to **Storage** → **Policies** → **celoween bucket**
3. Click **"New Policy"**
4. Choose **"For full customization"**
5. Use this policy:

**Policy name:** `Allow public uploads`

**Allowed operation:** `INSERT`

**Policy definition:**
```sql
true
```

Click **Save**

### Option 2: Allow Authenticated Uploads (Recommended)

If you want only authenticated users to upload:

**Policy name:** `Allow authenticated uploads`

**Allowed operation:** `INSERT`

**Policy definition:**
```sql
auth.role() = 'authenticated'
```

### Public Read Access

You also need a policy for reading images:

**Policy name:** `Allow public reads`

**Allowed operation:** `SELECT`

**Policy definition:**
```sql
true
```

---

## Complete Setup Steps

### 1. Create the Bucket

1. Go to Supabase Dashboard → **Storage**
2. Click **"New bucket"**
3. Name: `celoween`
4. **Public bucket:** ✅ Check this (for public read access)
5. Click **Create bucket**

### 2. Add Storage Policies

Go to **Storage** → **Policies** → select **celoween** bucket

#### Policy 1: Public Uploads
- **Name:** Allow public uploads
- **Operation:** INSERT
- **Policy:** `true`

#### Policy 2: Public Reads  
- **Name:** Allow public reads
- **Operation:** SELECT
- **Policy:** `true`

### 3. Verify Environment Variables

Make sure these are in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Testing

After setting up:

1. Restart your dev server: `npm run dev`
2. Try submitting an entry with an image
3. Check the **Storage** tab in Supabase to see uploaded files
4. Files should appear in: `celoween/submissions/`

---

## Troubleshooting

### Still getting RLS error?
- Make sure the bucket is named exactly `celoween`
- Check that policies are applied to the correct bucket
- Verify policies are **enabled** (toggle should be green)

### Images not displaying?
- Check bucket is marked as **Public**
- Verify `SELECT` policy exists and is enabled

### Environment variables not loading?
- Restart dev server after adding/changing `.env.local`
- Variables must start with `NEXT_PUBLIC_` to be accessible in browser
