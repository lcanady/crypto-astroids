import { GameState, Bullet, Asteroid, PowerupType, POWERUP_DURATION, GameStatus, BASE_ASTEROID_SIZES, SHIELD_HITS } from './types';
import { getDistance, createAsteroidVertices, handlePowerupSpawning } from './gameUtils';

export const handleCollisions = (
  gameState: GameState,
  shipSize: number,
  scale: number
): void => {
  const { asteroids, bullets, ship, powerups } = gameState;

  // Create a grid for spatial partitioning
  const gridSize = 100 * scale;
  const grid = new Map<string, Array<Asteroid | Bullet | PowerupType>>();

  // Helper function to get grid cell key
  const getGridKey = (x: number, y: number): string => {
    const gridX = Math.floor(x / gridSize);
    const gridY = Math.floor(y / gridSize);
    return `${gridX},${gridY}`;
  };

  // Add objects to grid
  asteroids.forEach(asteroid => {
    const key = getGridKey(asteroid.position.x, asteroid.position.y);
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key)!.push(asteroid);
  });

  bullets.forEach(bullet => {
    const key = getGridKey(bullet.position.x, bullet.position.y);
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key)!.push(bullet);
  });

  powerups.forEach(powerup => {
    const key = getGridKey(powerup.position.x, powerup.position.y);
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key)!.push(powerup.type);
  });

  // Get nearby grid cells
  const getNearbyKeys = (x: number, y: number): string[] => {
    const centerKey = getGridKey(x, y);
    const [centerX, centerY] = centerKey.split(',').map(Number);
    const keys: string[] = [];
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        keys.push(`${centerX + dx},${centerY + dy}`);
      }
    }
    
    return keys;
  };

  // Handle bullet-asteroid collisions
  bullets.forEach((bullet: Bullet, bulletIndex: number) => {
    if (bulletIndex === -1) return; // Bullet was already removed

    const nearbyKeys = getNearbyKeys(bullet.position.x, bullet.position.y);
    let hitAsteroid = false;

    for (const key of nearbyKeys) {
      const cellObjects = grid.get(key) || [];
      for (const obj of cellObjects) {
        if (obj instanceof Object && 'size' in obj) { // Is asteroid
          const asteroid = obj as Asteroid;
          const distance = getDistance(bullet.position, asteroid.position);
          const bulletPower = bullet.power || 1;

          if (distance < asteroid.size) {
            // Remove the bullet
            bullets.splice(bulletIndex, 1);
            hitAsteroid = true;

            // Split asteroid if it's large enough
            if (asteroid.size > BASE_ASTEROID_SIZES[2] * scale) {
              // If using PowerShot, destroy asteroid completely
              if (bulletPower > 1) {
                const asteroidIndex = asteroids.indexOf(asteroid);
                if (asteroidIndex !== -1) {
                  asteroids.splice(asteroidIndex, 1);
                  gameState.score += 200; // Bonus points for complete destruction
                }
              } else {
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
            }

            // Remove the original asteroid
            const asteroidIndex = asteroids.indexOf(asteroid);
            if (asteroidIndex !== -1) {
              asteroids.splice(asteroidIndex, 1);
              gameState.score += 100;

              // Chance to spawn powerup
              handlePowerupSpawning(gameState, asteroid.position);
            }
            break;
          }
        }
      }
      if (hitAsteroid) break;
    }
  });

  // Handle ship-powerup collisions
  const shipGridKeys = getNearbyKeys(ship.position.x, ship.position.y);
  for (const key of shipGridKeys) {
    const cellObjects = grid.get(key) || [];
    for (const obj of cellObjects) {
      if (typeof obj === 'string') { // Is powerup type
        const powerupIndex = powerups.findIndex(p => 
          getDistance(ship.position, p.position) < shipSize && p.type === obj
        );
        
        if (powerupIndex !== -1) {
          const powerup = powerups[powerupIndex];
          if (powerup.type === PowerupType.SHIELD) {
            ship.shields = SHIELD_HITS;
          } else {
            ship.powerups[powerup.type] = POWERUP_DURATION;
          }
          powerups.splice(powerupIndex, 1);
        }
      }
    }
  }

  // Handle ship-asteroid collisions
  let shipHit = false;
  for (const key of shipGridKeys) {
    const cellObjects = grid.get(key) || [];
    for (const obj of cellObjects) {
      if (obj instanceof Object && 'size' in obj) { // Is asteroid
        const asteroid = obj as Asteroid;
        const distance = getDistance(ship.position, asteroid.position);

        if (distance < asteroid.size + shipSize / 2) {
          if (ship.shields > 0) {
            // Reduce shields by 1 and destroy the asteroid
            ship.shields--;
            const asteroidIndex = asteroids.indexOf(asteroid);
            if (asteroidIndex !== -1) {
              asteroids.splice(asteroidIndex, 1);
              gameState.score += 50; // Bonus points for shield block
              
              // Chance to spawn powerup from destroyed asteroid
              handlePowerupSpawning(gameState, asteroid.position);
            }
          } else {
            shipHit = true;
          }
          break;
        }
      }
    }
    if (shipHit) break;
  }

  if (shipHit) {
    // Update high score if current score is higher
    if (gameState.score > gameState.highScore) {
      gameState.highScore = gameState.score;
    }
    gameState.status = GameStatus.GAME_OVER;
  }
};

// Helper object to find the next asteroid size index
const ASTEROID_SIZES_INDEX: { [key: number]: number } = {
  [BASE_ASTEROID_SIZES[0]]: 0,
  [BASE_ASTEROID_SIZES[1]]: 1,
  [BASE_ASTEROID_SIZES[2]]: 2
};
