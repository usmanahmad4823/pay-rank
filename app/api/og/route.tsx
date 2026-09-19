import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const name = searchParams.get('name') || 'Pay-Rank Leaderboard';
    const rank = searchParams.get('rank') || '1';
    const amount = searchParams.get('amount') || '$1,500';
    const city = searchParams.get('city') || 'National';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FAF9F6',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #E5E0D8 2px, transparent 0)',
            backgroundSize: '50px 50px',
            fontFamily: 'sans-serif',
            padding: '40px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E5E4',
              borderRadius: '9999px',
              padding: '8px 20px',
              marginBottom: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#F97316' }}>🔥 Pay-Rank Directory</span>
            <span style={{ fontSize: '14px', color: '#78716C' }}>• {city}</span>
          </div>

          {/* Rank & Title */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              color: '#1C1917',
              textAlign: 'center',
              lineHeight: 1.1,
              marginBottom: '16px',
            }}
          >
            #{rank} {name}
          </div>

          {/* Total Bid Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#F97316',
              color: '#FFFFFF',
              padding: '12px 32px',
              borderRadius: '9999px',
              fontSize: '32px',
              fontWeight: 800,
              boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.4)',
            }}
          >
            <span>Verified Bid Volume: {amount}</span>
          </div>

          <div
            style={{
              marginTop: '40px',
              fontSize: '18px',
              color: '#78716C',
              fontWeight: 600,
            }}
          >
            Claim your rank on PayRank
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the OG image`, {
      status: 500,
    });
  }
}
