import { Metadata } from "next";
import Demo from "~/components/Demo";

export const metadata: Metadata = {
  title: "Astroid Blast!",
  description: "An astroid blaster!",
  openGraph: {
    title: "Astroid Blast!",
    description: "An astroid blaster!",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Astroid Blast!",
      },
    ],
  },
};

export default function Page() {
  return <Demo />;
}
