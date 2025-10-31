import { NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://celoween.vercel.app';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_ACCOUNT_ASSOCIATION_HEADER || "",
      payload: process.env.FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD || "",
      signature: process.env.FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE || ""
    },
    frame: {
      version: "1",
      name: "Celoween",
      iconUrl: `${APP_URL}/icons/ipkm.svg`,
      homeUrl: APP_URL,
      imageUrl: `${APP_URL}/icons/ipkm.svg`,
      buttonTitle: "🎃 Enter Contest",
      splashImageUrl: `${APP_URL}/icons/ipkm.svg`,
      splashBackgroundColor: "#1a0b2e",
      webhookUrl: `${APP_URL}/api/webhook/farcaster`
    }
  };

  return NextResponse.json(manifest);
}
