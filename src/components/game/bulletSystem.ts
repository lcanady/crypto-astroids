import { GameState, Bullet, PowerupType, BULLET_SPEED, BULLET_TTL, SHOT_COOLDOWN, MULTI_SHOT_COUNT, POWER_SHOT_MULTIPLIER, RAPID_FIRE_COOLDOWN } from './types';

const createBullet = (
  position: { x: number; y: number },
  velocity: { x: number; y: number },
  rotation: number,
  power: number = 1
): Bullet => ({
  position: { ...position },
  velocity,
  rotation,
  timeToLive: BULLET_TTL,
  power
});

export const shoot = (gameState: GameState): void => {
  const { ship } = gameState;
  if (!ship.canShoot) return;

  const hasMultiShot = (ship.powerups[PowerupType.MULTI_SHOT] ?? 0) > 0;
  const hasPowerShot = (ship.powerups[PowerupType.POWER_SHOT] ?? 0) > 0;
  const hasRapidFire = (ship.powerups[PowerupType.RAPID_FIRE] ?? 0) > 0;

  // Calculate bullet power
  const bulletPower = hasPowerShot ? POWER_SHOT_MULTIPLIER : 1;

  if (hasMultiShot) {
    // Create spread pattern of bullets
    const spreadAngle = Math.PI / 8; // 22.5 degrees
    for (let i = 0; i < MULTI_SHOT_COUNT; i++) {
      const angleOffset = spreadAngle * (i - (MULTI_SHOT_COUNT - 1) / 2);
      const rotation = ship.rotation + angleOffset;
      
      gameState.bullets.push(createBullet(
        ship.position,
        {
          x: Math.cos(rotation) * BULLET_SPEED + ship.velocity.x,
          y: Math.sin(rotation) * BULLET_SPEED + ship.velocity.y
        },
        rotation,
        bulletPower
      ));
    }
  } else {
    // Single bullet
    gameState.bullets.push(createBullet(
      ship.position,
      {
        x: Math.cos(ship.rotation) * BULLET_SPEED + ship.velocity.x,
        y: Math.sin(ship.rotation) * BULLET_SPEED + ship.velocity.y
      },
      ship.rotation,
      bulletPower
    ));
  }

  ship.canShoot = false;
  setTimeout(() => {
    if (gameState.ship) {
      gameState.ship.canShoot = true;
    }
  }, hasRapidFire ? RAPID_FIRE_COOLDOWN : SHOT_COOLDOWN);
};

export const updateBullets = (gameState: GameState, canvas: HTMLCanvasElement): void => {
  // Update bullet positions and remove expired bullets
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
