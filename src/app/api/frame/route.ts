import { NextRequest } from "next/server";

const appUrl = process.env.NEXT_PUBLIC_URL;

export async function POST(req: NextRequest) {
  try {
    await req.json(); // Just validate the JSON without storing it
    
    // Return frame response according to v2 spec
    return new Response(
      JSON.stringify({
        frames: [
          {
            version: "vNext",
            image: `${appUrl}/frames/hello/opengraph-image.png`,
            buttons: [
              {
                label: "Play Again",
                action: "post"
              }
            ],
            postUrl: `${appUrl}/api/frame`,
            input: {
              text: "Enter your name"
            }
          }
        ]
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
