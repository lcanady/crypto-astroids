import { ImageResponse } from "next/og";

export const alt = "Farcaster Frames V2 Demo";
export const size = {
  width: 600,
  height: 400,
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
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: '#ffffff',
              textShadow: '0 0 10px rgba(255,255,255,0.5)',
              margin: 0,
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            Astroid Blast!
          </h1>
          <h2
            style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#4f9eff',
              margin: 0,
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            V2 Frame
          </h2>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Arial',
          data: await fetch(
            new URL('https://fonts.cdnfonts.com/s/29107/ARIAL.woff')
          ).then((res) => res.arrayBuffer()),
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );
}
