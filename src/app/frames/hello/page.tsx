import { Metadata } from "next";
import ClientWrapper from './clientWrapper';

const appUrl = process.env.NEXT_PUBLIC_URL;

export const metadata: Metadata = {
  title: "Astroid Blast",
  description: "Play Astroid Blast on Farcaster",
  openGraph: {
    title: "Astroid Blast",
    description: "Play Astroid Blast on Farcaster",
    images: [`${appUrl}/frames/hello/opengraph-image.png`],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": `${appUrl}/frames/hello/opengraph-image.png`,
    "fc:frame:button:1": "Launch Game",
    "fc:frame:button:1:action": "post",
    "fc:frame:post_url": `${appUrl}/api/frame`,
    "fc:frame:input:text": "Enter your name",
    "fc:frame:state": "initial"
  },
};

export default function HelloFrame() {
  return <ClientWrapper />;
}
