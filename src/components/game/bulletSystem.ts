import { GameState, Bullet, BULLET_SPEED, BULLET_TTL, SHOT_COOLDOWN } from './types';

export const shoot = (gameState: GameState): void => {
  const { ship } = gameState;
  if (!ship.canShoot) return;
  
  gameState.bullets.push({
    position: { ...ship.position },
    velocity: {
      x: Math.cos(ship.rotation) * BULLET_SPEED + ship.velocity.x,
      y: Math.sin(ship.rotation) * BULLET_SPEED + ship.velocity.y
    },
    rotation: ship.rotation,
    timeToLive: BULLET_TTL
  });

  ship.canShoot = false;
  setTimeout(() => {
    if (gameState.ship) {
      gameState.ship.canShoot = true;
    }
  }, SHOT_COOLDOWN);
};

export const updateBullets = (gameState: GameState, canvas: HTMLCanvasElement): void => {
  gameState.bullets = gameState.bullets
    .map((bullet: Bullet) => ({
      ...bullet,
      position: {
        x: (bullet.position.x + bullet.velocity.x + canvas.width) % canvas.width,
        y: (bullet.position.y + bullet.velocity.y + canvas.height) % canvas.height
      },
      timeToLive: bullet.timeToLive - 1
    }))
    .filter((bullet: Bullet) => bullet.timeToLive > 0);
};
