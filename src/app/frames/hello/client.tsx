"use client";

import App from "~/app/app";

export default function ClientComponent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Astroid Blast</h1>
      <p className="text-xl mb-8">Welcome to the game!</p>
      <div className="max-w-2xl text-center">
        <p>This is a Farcaster Frame game. Interact with it through your Farcaster client!</p>
      </div>
      <App title={"Astroid Blast"} />
    </main>
  );
}
