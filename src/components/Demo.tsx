"use client";

import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { AsteroidsGame } from './AsteroidsGame';

export default function Demo(
  { title }: { title?: string } = { title: "Asteroids Frame Game" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      await sdk.context;
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[900px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>

      <div className="mb-8">
        <div className="flex justify-center">
          <AsteroidsGame />
        </div>
      </div>
    </div>
  );
}
