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
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-black">
        <div tw="flex flex-col items-center gap-4">
          <h1 tw="text-6xl font-bold text-white" style={{ fontFamily: 'Ready Player 2' }}>Astroid Blast!</h1>
          <h2 tw="text-3xl font-bold text-white" style={{ fontFamily: 'Ready Player 2' }}>Click to Play</h2>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Ready Player 2',
          data: await fetch(
            new URL('https://db.onlinewebfonts.com/t/05289e866fe7e1e99d27a7a31f8d3b66.woff2')
          ).then((res) => res.arrayBuffer()),
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
}
