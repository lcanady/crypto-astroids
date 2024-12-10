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
}

export interface Asteroid extends GameObject {
  size: number;
  vertices: Point[];
}

export interface Bullet extends GameObject {
  timeToLive: number;
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
  score: number;
  highScore: number;
  spawnTimer: number;
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
export const INITIAL_SPAWN_INTERVAL = 300; // Frames between spawns (about 5 seconds at 60fps)
export const MIN_SPAWN_INTERVAL = 120; // Minimum frames between spawns (about 2 seconds)
export const SPAWN_INTERVAL_DECREASE = 10; // How much to decrease spawn interval each spawn
