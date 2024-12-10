"use client";

import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";
import { AsteroidsGame } from './AsteroidsGame';

export default function Demo(
  { title }: { title?: string } = { title: "Asteroids Frame Game" }
) {


  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    
      load();
  }, []);

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
