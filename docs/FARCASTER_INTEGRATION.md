# Farcaster Mini App Integration

## Overview
The Celoween app now works as both a regular web app AND a Farcaster mini app, allowing users to submit entries and vote directly from Warpcast or other Farcaster clients.

## What Was Added

### 1. Farcaster Login via Privy
- Added `'farcaster'` to Privy's `loginMethods` in `components/Providers.tsx`
- Users can now log in with their Farcaster account
- Privy handles all the authentication automatically

### 2. Farcaster Manifest
- Created `/api/farcaster-manifest.json` endpoint
- Tells Farcaster clients about your app:
  - App name: "Celoween Halloween Contest"
  - Home URL: Your deployed app
  - Icon and splash screen
  - Theme color: #1a0b2e (spooky purple)

## How It Works

### For Regular Web Users:
1. Visit your app URL
2. Login with wallet, email, or **Farcaster**
3. Submit entries and vote as normal

### For Farcaster Users:
1. Open your app in Warpcast/Farcaster client
2. Automatically authenticated with Farcaster account
3. Can submit and vote without leaving Farcaster
4. All votes/submissions are linked to their Farcaster ID

## User Identity

When users log in via Farcaster:
- Privy provides their Farcaster ID (FID)
- The app uses `user.wallet?.address` (which Privy generates)
- Votes and submissions work exactly the same way
- Users don't need a separate wallet

## Setup Required

### 1. Configure Privy
Make sure your Privy dashboard has Farcaster login enabled.

### 2. Deploy
The manifest endpoint needs to be publicly accessible:
```
https://your-app.vercel.app/api/farcaster-manifest.json
```

### 3. Register on Farcaster
- Go to Warpcast developer portal
- Register your app with the manifest URL
- Get approved for mini app status

### 4. Test
- Share your app URL in Warpcast
- It should open as a mini app
- Users can interact without leaving Farcaster

## Environment Variables

Make sure you have:
```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
```

## Benefits

✅ **Seamless UX**: Users don't leave Farcaster to vote/submit
✅ **No Wallet Required**: Farcaster handles identity
✅ **Viral Growth**: Easy sharing within Farcaster
✅ **Cross-Platform**: Works in web app AND Farcaster
✅ **Zero Changes**: Existing functionality works as-is

## What Users Can Do

### In the Mini App:
- ✅ Browse contests
- ✅ View submissions
- ✅ Vote on submissions (using Farcaster ID)
- ✅ Submit entries (redirects to web app for file upload)

### Flow Example:
1. User sees contest shared in Warpcast
2. Opens it (mini app launches)
3. Browses submissions and votes (stays in Farcaster)
4. To submit: clicks button → opens web app → uploads → authenticated via Farcaster

## Future Enhancements

- Add Farcaster Frames v1 for in-feed voting
- Display submission previews in Farcaster feeds
- Show vote counts in real-time
- Add Farcaster notifications for contest updates
- Allow users to share their submissions to Farcaster

## Testing Locally

1. Install ngrok: `npm install -g ngrok`
2. Start your dev server: `npm run dev`
3. Expose it: `ngrok http 3000`
4. Use the ngrok URL in your manifest
5. Test in Warpcast mobile app

## Resources

- [Farcaster Frames Documentation](https://docs.farcaster.xyz/developers/frames/v2/spec)
- [Privy Farcaster Auth](https://docs.privy.io/guide/react/recipes/misc/farcaster-auth)
- [Mini App Examples](https://github.com/farcasterxyz/frames-v2-demo)
