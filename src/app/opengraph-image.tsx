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
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-black">
        <div tw="flex flex-col items-center gap-4">
          <h1 tw="text-6xl font-bold text-white" style={{ fontFamily: 'Ready Player 2' }}>Astroid Blast!</h1>
          <h2 tw="text-4xl font-bold text-white" style={{ fontFamily: 'Ready Player 2' }}>V2 Frame</h2>
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
