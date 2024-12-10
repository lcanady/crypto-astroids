import { GameState, Bullet, Asteroid, BASE_ASTEROID_SIZES, GameStatus } from './types';
import { getDistance, createAsteroidVertices } from './gameUtils';

export const handleCollisions = (
  gameState: GameState,
  shipSize: number,
  scale: number
): void => {
  const { asteroids, bullets, ship } = gameState;

  // Handle bullet-asteroid collisions
  bullets.forEach((bullet: Bullet, bulletIndex: number) => {
    asteroids.forEach((asteroid: Asteroid, asteroidIndex: number) => {
      const distance = getDistance(bullet.position, asteroid.position);

      if (distance < asteroid.size) {
        // Remove the bullet
        bullets.splice(bulletIndex, 1);

        // Split asteroid if it's large enough
        if (asteroid.size > BASE_ASTEROID_SIZES[2] * scale) {
          const newSize = BASE_ASTEROID_SIZES[ASTEROID_SIZES_INDEX[asteroid.size / scale] + 1] * scale;
          
          // Create two smaller asteroids
          for (let i = 0; i < 2; i++) {
            asteroids.push({
              position: { ...asteroid.position },
              velocity: {
                x: asteroid.velocity.x + (Math.random() - 0.5) * 2,
                y: asteroid.velocity.y + (Math.random() - 0.5) * 2
              },
              rotation: Math.random() * Math.PI * 2,
              size: newSize,
              vertices: createAsteroidVertices(newSize)
            });
          }
        }

        // Remove the original asteroid
        asteroids.splice(asteroidIndex, 1);
        gameState.score += 100;
      }
    });
  });

  // Handle ship-asteroid collisions
  asteroids.forEach((asteroid: Asteroid) => {
    const distance = getDistance(ship.position, asteroid.position);

    if (distance < asteroid.size + shipSize / 2) {
      // Update high score if current score is higher
      if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
      }
      gameState.status = GameStatus.GAME_OVER;
    }
  });
};

// Helper object to find the next asteroid size index
const ASTEROID_SIZES_INDEX: { [key: number]: number } = {
  [BASE_ASTEROID_SIZES[0]]: 0,
  [BASE_ASTEROID_SIZES[1]]: 1,
  [BASE_ASTEROID_SIZES[2]]: 2
};
