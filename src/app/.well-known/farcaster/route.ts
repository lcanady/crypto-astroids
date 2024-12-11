import { NextResponse } from "next/server";

const appUrl = process.env.NEXT_PUBLIC_URL;

export async function GET() {
  return NextResponse.json({
    frames: [
      {
        version: "vNext",
        image: `${appUrl}/frames/hello/opengraph-image.png`,
        buttons: [
          {
            label: "Launch Game",
            action: "post"
          }
        ],
        post_url: `${appUrl}/api/frame`,
        input: {
          text: "Enter your name"
        }
      }
    ]
  });
}
