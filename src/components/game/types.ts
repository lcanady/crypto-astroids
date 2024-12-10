export interface Point {
  x: number;
  y: number;
}

export interface GameObject {
  position: Point;
  velocity: Point;
  rotation: number;
}

export interface Ship extends GameObject {
  thrusting: boolean;
  canShoot: boolean;
  powerups: ActivePowerups;
  shields: number;
}

export interface Asteroid extends GameObject {
  size: number;
  vertices: Point[];
  opacity?: number;
}

export interface Bullet extends GameObject {
  timeToLive: number;
  power?: number; // For PowerShot powerup
}

export enum PowerupType {
  MULTI_SHOT = 'MULTI_SHOT',
  POWER_SHOT = 'POWER_SHOT',
  RAPID_FIRE = 'RAPID_FIRE',
  SHIELD = 'SHIELD'
}

export interface Powerup extends GameObject {
  type: PowerupType;
  timeToLive: number;
}

export interface ActivePowerups {
  [PowerupType.MULTI_SHOT]?: number; // Duration remaining
  [PowerupType.POWER_SHOT]?: number;
  [PowerupType.RAPID_FIRE]?: number;
  [PowerupType.SHIELD]?: number;
}

export enum GameStatus {
  START = 'start',
  PLAYING = 'playing',
  GAME_OVER = 'gameOver'
}

export interface GameState {
  status: GameStatus;
  ship: Ship;
  asteroids: Asteroid[];
  bullets: Bullet[];
  powerups: Powerup[];
  score: number;
  highScore: number;
  spawnTimer: number;
  backgroundAsteroids?: Asteroid[];
}

// Game constants
export const BASE_SHIP_SIZE = 20;
export const BASE_ASTEROID_SIZES = [50, 25, 12];
export const BASE_FONT_SIZE = {
  TITLE: 48,
  NORMAL: 24,
  MIN: {
    TITLE: 32,
    NORMAL: 16
  }
};
export const BULLET_SPEED = 7;
export const BULLET_TTL = 60;
export const ROTATION_SPEED = 0.1;
export const THRUST_SPEED = 0.3;
export const FRICTION = 0.97;
export const MAX_VELOCITY = 6;
export const SHOT_COOLDOWN = 250;
export const MIN_ASTEROID_DISTANCE = 150;
export const MIN_VELOCITY = 0.05;

// Asteroid spawn constants
export const INITIAL_SPAWN_INTERVAL = 300;
export const MIN_SPAWN_INTERVAL = 120;
export const SPAWN_INTERVAL_DECREASE = 10;

// Powerup constants
export const POWERUP_TTL = 600; // 10 seconds at 60fps
export const POWERUP_DURATION = 600; // 10 seconds at 60fps
export const POWERUP_SPAWN_CHANCE = 0.35; // 35% chance per asteroid destroyed
export const MULTI_SHOT_COUNT = 3; // Number of bullets for multi-shot
export const POWER_SHOT_MULTIPLIER = 2; // Damage multiplier for power shot
export const RAPID_FIRE_COOLDOWN = SHOT_COOLDOWN / 2; // Halved cooldown for rapid fire
export const SHIELD_HITS = 3; // Number of hits a shield can take

// Background asteroid constants
export const BACKGROUND_ASTEROID_COUNT = 15; // Increased from 8 to 15
export const BACKGROUND_ASTEROID_SPEED = 1.5; // Increased from 0.5 to 1.5
export const BACKGROUND_ASTEROID_OPACITY = 0.15; // Decreased from 0.2 to 0.15 for subtler effect
