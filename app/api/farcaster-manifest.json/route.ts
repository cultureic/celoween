import { NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://celoween.vercel.app';

export async function GET() {
  const manifest = {
    frame: {
      version: "1",
      name: "Celoween Halloween Contest",
      iconUrl: `${APP_URL}/icon.png`,
      homeUrl: APP_URL,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: "#1a0b2e",
      webhookUrl: `${APP_URL}/api/webhook/farcaster`,
    },
  };

  return NextResponse.json(manifest);
}
