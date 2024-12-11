"use client";

import { useEffect, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { AsteroidsGame } from './AsteroidsGame';
import { GameStatus } from './game/types';

export default function Demo(
  { title }: { title?: string } = { title: "Asteroids Frame Game" }
) {
  // These state variables are used indirectly through canvas data attributes
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [context, setContext] = useState<FrameContext>();
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.START);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  /* eslint-enable @typescript-eslint/no-unused-vars */

  useEffect(() => {
    const load = async () => {
      try {
        const ctx = await sdk.context;
        setContext(ctx);
        await sdk.actions.ready();
      } catch (error) {
        console.error("Failed to load SDK:", error);
      }
    };
    
    load();
  }, []);

  // Game state observer
  useEffect(() => {
    const gameStateInterval = setInterval(() => {
      const gameCanvas = document.querySelector('canvas');
      if (!gameCanvas) return;

      const status = gameCanvas.dataset.gameStatus as GameStatus;
      const score = parseInt(gameCanvas.dataset.score || '0', 10);
      const newHighScore = parseInt(gameCanvas.dataset.highScore || '0', 10);

      setGameStatus(status || GameStatus.START);
      setCurrentScore(score);
      setHighScore(newHighScore);
    }, 1000);

    return () => clearInterval(gameStateInterval);
  }, []);

  return (
    <div className="relative w-screen h-screen">
      <AsteroidsGame />
      
      {/* Title overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <h1 className="text-2xl font-bold text-center text-white mb-4">{title}</h1>
      </div>
    </div>
  );
}
