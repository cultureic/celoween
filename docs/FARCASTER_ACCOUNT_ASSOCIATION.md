# Farcaster Account Association Setup

## Overview
To publish your Mini App, you need to prove ownership of your domain by signing it with your Farcaster account.

## Steps

### 1. Get Your Farcaster FID and Custody Address

Visit your Farcaster profile or use the Warpcast API to get:
- Your FID (Farcaster ID)
- Your custody address (the Ethereum address that controls your account)

### 2. Generate the Account Association Signature

You need to create a JSON Farcaster Signature with your custody address signing your domain.

#### Using the Farcaster Hub

```bash
# Install the Farcaster Hub SDK
npm install @farcaster/hub-nodejs

# Create a script to generate the signature
node generate-signature.js
```

#### Example Script (`generate-signature.js`)

```javascript
const { makeAccountAssociation } = require('@farcaster/hub-nodejs');

const domain = 'celoween.vercel.app'; // Your domain
const fid = YOUR_FID; // Your Farcaster ID
const privateKey = 'YOUR_CUSTODY_PRIVATE_KEY'; // Your custody address private key

const association = makeAccountAssociation({
  domain,
  fid,
  privateKey
});

console.log('Header:', association.header);
console.log('Payload:', association.payload);
console.log('Signature:', association.signature);
```

### 3. Add to Environment Variables

Add these to your Vercel environment variables:

```env
FARCASTER_ACCOUNT_ASSOCIATION_HEADER=eyJmaWQ...
FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD=eyJkb21h...
FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE=MHgw...
```

### 4. Verify Your Manifest

Visit: `https://celoween.vercel.app/.well-known/farcaster.json`

Should return:
```json
{
  "accountAssociation": {
    "header": "eyJ...",
    "payload": "eyJ...",
    "signature": "MHg..."
  },
  "frame": {
    "version": "1",
    "name": "Celoween",
    ...
  }
}
```

### 5. Test in Farcaster Developer Tools

1. Go to: https://farcaster.xyz/~/developers/mini-apps/preview
2. Enter your app URL: `https://celoween.vercel.app`
3. Verify it loads correctly

## Alternative: Use Warpcast Developer Tools

1. Enable Developer Mode in Warpcast settings
2. Go to: https://farcaster.xyz/~/developers/mini-apps
3. Click "Create Mini App"
4. Follow the guided setup to generate signatures

## Troubleshooting

### Invalid Signature Error
- Make sure the `domain` in your payload exactly matches your deployment URL
- Verify you're using the custody address, not a signer address
- Check that your FID is correct

### Manifest Not Found
- Verify the file is at `/.well-known/farcaster.json` (not `.well-known/farcaster-app.json`)
- Check your deployment logs to ensure the route is deployed

### Still Not Working?
For now, you can test without account association by leaving the fields empty. The app will still work in preview mode.
