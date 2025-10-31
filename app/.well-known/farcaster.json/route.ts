import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: "Celoween Halloween Contest",
    description: "Submit your Halloween costume and vote for your favorites to win prizes on Celo!",
    short_name: "Celoween",
    icons: [
      {
        src: "/icons/ipkm.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ],
    start_url: "/",
    display: "standalone",
    background_color: "#1a0b2e",
    theme_color: "#ff6b35",
    farcaster: {
      developer_fid: parseInt(process.env.FARCASTER_DEVELOPER_FID || '0'),
      capabilities: ["auth", "social"],
    }
  };

  return NextResponse.json(manifest);
}
