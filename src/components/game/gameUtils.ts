import { Point, Ship, Asteroid, GameState, GameStatus, BASE_ASTEROID_SIZES, THRUST_SPEED, MIN_VELOCITY, FRICTION, MAX_VELOCITY, MIN_ASTEROID_DISTANCE, INITIAL_SPAWN_INTERVAL, MIN_SPAWN_INTERVAL, SPAWN_INTERVAL_DECREASE } from './types';

export const getDistance = (p1: Point, p2: Point): number => {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
};

export const limitVelocity = (velocity: Point): Point => {
  const speed = Math.hypot(velocity.x, velocity.y);
  if (speed > MAX_VELOCITY) {
    const ratio = MAX_VELOCITY / speed;
    return {
      x: velocity.x * ratio,
      y: velocity.y * ratio
    };
  }
  return velocity;
};

export const createAsteroidVertices = (size: number): Point[] => {
  const vertices: Point[] = [];
  const numVertices = 8;
  for (let i = 0; i < numVertices; i++) {
    const angle = (i * Math.PI * 2) / numVertices;
    const radius = size * (0.8 + Math.random() * 0.4);
    vertices.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    });
  }
  return vertices;
};

export const getSafeSpawnPosition = (
  canvas: HTMLCanvasElement, 
  shipPos: Point, 
  scale: number
): Point => {
  let pos: Point;
  do {
    pos = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    };
  } while (getDistance(pos, shipPos) < MIN_ASTEROID_DISTANCE * scale);
  return pos;
};

export const createNewAsteroid = (
  canvas: HTMLCanvasElement,
  shipPos: Point,
  scale: number
): Asteroid => {
  const pos = getSafeSpawnPosition(canvas, shipPos, scale);
  return {
    position: pos,
    velocity: {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    },
    rotation: Math.random() * Math.PI * 2,
    size: BASE_ASTEROID_SIZES[0] * scale,
    vertices: createAsteroidVertices(BASE_ASTEROID_SIZES[0] * scale)
  };
};

export const updateShipPhysics = (
  ship: Ship, 
  keys: { [key: string]: boolean }, 
  canvas: HTMLCanvasElement,
  rotationSpeed: number
): void => {
  if (keys['ArrowLeft'] || keys['RotateLeft']) {
    ship.rotation -= rotationSpeed;
  }
  if (keys['ArrowRight'] || keys['RotateRight']) {
    ship.rotation += rotationSpeed;
  }

  ship.thrusting = keys['ArrowUp'] || keys['Thrust'] || false;
  if (ship.thrusting) {
    const thrustX = Math.cos(ship.rotation) * THRUST_SPEED;
    const thrustY = Math.sin(ship.rotation) * THRUST_SPEED;
    ship.velocity.x += thrustX;
    ship.velocity.y += thrustY;
  }

  ship.velocity = limitVelocity(ship.velocity);
  ship.position.x += ship.velocity.x;
  ship.position.y += ship.velocity.y;

  ship.velocity.x *= FRICTION;
  ship.velocity.y *= FRICTION;

  if (Math.abs(ship.velocity.x) < MIN_VELOCITY) ship.velocity.x = 0;
  if (Math.abs(ship.velocity.y) < MIN_VELOCITY) ship.velocity.y = 0;

  ship.position.x = (ship.position.x + canvas.width) % canvas.width;
  ship.position.y = (ship.position.y + canvas.height) % canvas.height;
};

export const updateAsteroidPhysics = (asteroid: Asteroid, canvas: HTMLCanvasElement): void => {
  asteroid.position.x = (asteroid.position.x + asteroid.velocity.x + canvas.width) % canvas.width;
  asteroid.position.y = (asteroid.position.y + asteroid.velocity.y + canvas.height) % canvas.height;
  asteroid.rotation += 0.02;
};

export const handleAsteroidSpawning = (gameState: GameState, canvas: HTMLCanvasElement, scale: number): void => {
  if (gameState.status !== GameStatus.PLAYING) return;

  gameState.spawnTimer--;
  
  if (gameState.spawnTimer <= 0) {
    // Add a new asteroid
    gameState.asteroids.push(createNewAsteroid(canvas, gameState.ship.position, scale));
    
    // Reset timer with decreased interval
    const newInterval = Math.max(
      MIN_SPAWN_INTERVAL,
      INITIAL_SPAWN_INTERVAL - Math.floor(gameState.score / 100) * SPAWN_INTERVAL_DECREASE
    );
    gameState.spawnTimer = newInterval;
  }
};

export const initializeGameState = (
  canvas: HTMLCanvasElement, 
  currentHighScore: number,
  scale: number
): GameState => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const asteroids: Asteroid[] = [];

  for (let i = 0; i < 4; i++) {
    const pos = getSafeSpawnPosition(canvas, { x: centerX, y: centerY }, scale);
    asteroids.push({
      position: pos,
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      },
      rotation: Math.random() * Math.PI * 2,
      size: BASE_ASTEROID_SIZES[0] * scale,
      vertices: createAsteroidVertices(BASE_ASTEROID_SIZES[0] * scale)
    });
  }

  return {
    status: GameStatus.PLAYING,
    ship: {
      position: { x: centerX, y: centerY },
      velocity: { x: 0, y: 0 },
      rotation: 0,
      thrusting: false,
      canShoot: true
    },
    asteroids,
    bullets: [],
    score: 0,
    highScore: currentHighScore,
    spawnTimer: INITIAL_SPAWN_INTERVAL
  };
};
