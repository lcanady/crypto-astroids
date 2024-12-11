import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Astroid Blast Frame";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
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
          backgroundColor: '#000000',
          backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: '#ffffff',
              textShadow: '0 0 10px rgba(255,255,255,0.5)',
              margin: 0,
            }}
          >
            Astroid Blast!
          </h1>
          <h2
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#4f9eff',
              margin: 0,
            }}
          >
            Click to Play
          </h2>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
