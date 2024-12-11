import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Hello Frame";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

interface Props {
  params: Promise<{
    name: string;
  }>;
}

export default async function Image({ params }: Props) {
  const { name } = await params;

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
          fontFamily: 'system-ui',
        }}
      >
        <h1
          style={{
            fontSize: '60px',
            fontWeight: 'bold',
            color: '#ffffff',
            textShadow: '0 0 10px rgba(255,255,255,0.5)',
            margin: 0,
            fontFamily: 'system-ui',
          }}
        >
          Hello, {name}
        </h1>
      </div>
    ),
    {
      ...size,
    }
  );
}
