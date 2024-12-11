import { Point, Ship, Asteroid, GameState, GameStatus, PowerupType, Powerup, BASE_ASTEROID_SIZES, THRUST_SPEED, MIN_VELOCITY, FRICTION, MAX_VELOCITY, MIN_ASTEROID_DISTANCE, INITIAL_SPAWN_INTERVAL, MIN_SPAWN_INTERVAL, SPAWN_INTERVAL_DECREASE, POWERUP_SPAWN_CHANCE, BACKGROUND_ASTEROID_COUNT, BACKGROUND_ASTEROID_SPEED, BACKGROUND_ASTEROID_OPACITY, SHIELD_HITS, MOBILE_INITIAL_SPAWN_INTERVAL, MOBILE_MIN_SPAWN_INTERVAL, MOBILE_SPAWN_INTERVAL_DECREASE } from './types';

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

const getRandomEdgePosition = (canvas: HTMLCanvasElement): { pos: Point, velocity: Point } => {
  const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
  const speed = BACKGROUND_ASTEROID_SPEED * (0.5 + Math.random() * 0.5); // Vary speed a bit
  let pos: Point;
  let velocity: Point;

  switch (side) {
    case 0: // Top
      pos = { x: Math.random() * canvas.width, y: -50 };
      velocity = {
        x: (Math.random() - 0.5) * speed,
        y: speed
      };
      break;
    case 1: // Right
      pos = { x: canvas.width + 50, y: Math.random() * canvas.height };
      velocity = {
        x: -speed,
        y: (Math.random() - 0.5) * speed
      };
      break;
    case 2: // Bottom
      pos = { x: Math.random() * canvas.width, y: canvas.height + 50 };
      velocity = {
        x: (Math.random() - 0.5) * speed,
        y: -speed
      };
      break;
    default: // Left
      pos = { x: -50, y: Math.random() * canvas.height };
      velocity = {
        x: speed,
        y: (Math.random() - 0.5) * speed
      };
  }

  return { pos, velocity };
};

export const createNewAsteroid = (
  canvas: HTMLCanvasElement,
  shipPos: Point,
  scale: number,
  isBackground: boolean = false
): Asteroid => {
  let pos: Point;
  let velocity: Point;

  if (isBackground) {
    const spawnData = getRandomEdgePosition(canvas);
    pos = spawnData.pos;
    velocity = spawnData.velocity;
  } else {
    pos = getSafeSpawnPosition(canvas, shipPos, scale);
    velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    };
  }

  return {
    position: pos,
    velocity: velocity,
    rotation: Math.random() * Math.PI * 2,
    size: BASE_ASTEROID_SIZES[0] * scale,
    vertices: createAsteroidVertices(BASE_ASTEROID_SIZES[0] * scale),
    opacity: isBackground ? BACKGROUND_ASTEROID_OPACITY : 1
  };
};

export const createBackgroundAsteroids = (
  canvas: HTMLCanvasElement,
  scale: number
): Asteroid[] => {
  const asteroids: Asteroid[] = [];
  const centerPos = { x: canvas.width / 2, y: canvas.height / 2 };

  for (let i = 0; i < BACKGROUND_ASTEROID_COUNT; i++) {
    asteroids.push(createNewAsteroid(canvas, centerPos, scale, true));
  }

  return asteroids;
};

export const createNewPowerup = (
  canvas: HTMLCanvasElement,
  position: Point
): Powerup => {
  const powerupTypes = Object.values(PowerupType);
  const randomType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
  
  return {
    position: { ...position },
    velocity: {
      x: (Math.random() - 0.5) * 1, // Slower than asteroids
      y: (Math.random() - 0.5) * 1
    },
    rotation: Math.random() * Math.PI * 2,
    type: randomType,
    timeToLive: 600 // 10 seconds at 60fps
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
  asteroid.position.x += asteroid.velocity.x;
  asteroid.position.y += asteroid.velocity.y;
  asteroid.rotation += 0.02;

  // For background asteroids, respawn them when they go off screen
  if (asteroid.opacity === BACKGROUND_ASTEROID_OPACITY) {
    const buffer = 100; // Buffer zone to prevent sudden disappearance
    if (asteroid.position.x < -buffer || 
        asteroid.position.x > canvas.width + buffer || 
        asteroid.position.y < -buffer || 
        asteroid.position.y > canvas.height + buffer) {
      const spawnData = getRandomEdgePosition(canvas);
      asteroid.position = spawnData.pos;
      asteroid.velocity = spawnData.velocity;
    }
  } else {
    // Regular asteroids wrap around the screen
    asteroid.position.x = (asteroid.position.x + canvas.width) % canvas.width;
    asteroid.position.y = (asteroid.position.y + canvas.height) % canvas.height;
  }
};

export const updatePowerups = (gameState: GameState, canvas: HTMLCanvasElement): void => {
  // Update existing powerups
  gameState.powerups = gameState.powerups.filter(powerup => {
    // Update position
    powerup.position.x = (powerup.position.x + powerup.velocity.x + canvas.width) % canvas.width;
    powerup.position.y = (powerup.position.y + powerup.velocity.y + canvas.height) % canvas.height;
    powerup.rotation += 0.01;
    
    // Update TTL
    powerup.timeToLive--;
    return powerup.timeToLive > 0;
  });

  // Update active powerups on ship
  Object.keys(gameState.ship.powerups).forEach(key => {
    const powerupKey = key as PowerupType;
    if (gameState.ship.powerups[powerupKey] !== undefined) {
      gameState.ship.powerups[powerupKey]!--;
      if (gameState.ship.powerups[powerupKey]! <= 0) {
        delete gameState.ship.powerups[powerupKey];
      }
    }
  });
};

export const handleAsteroidSpawning = (gameState: GameState, canvas: HTMLCanvasElement, scale: number, isMobile: boolean = false): void => {
  if (gameState.status !== GameStatus.PLAYING) return;

  gameState.spawnTimer--;
  
  if (gameState.spawnTimer <= 0) {
    // Add a new asteroid
    gameState.asteroids.push(createNewAsteroid(canvas, gameState.ship.position, scale));
    
    // Reset timer with decreased interval based on platform
    const initialInterval = isMobile ? MOBILE_INITIAL_SPAWN_INTERVAL : INITIAL_SPAWN_INTERVAL;
    const minInterval = isMobile ? MOBILE_MIN_SPAWN_INTERVAL : MIN_SPAWN_INTERVAL;
    const decreaseRate = isMobile ? MOBILE_SPAWN_INTERVAL_DECREASE : SPAWN_INTERVAL_DECREASE;
    
    const newInterval = Math.max(
      minInterval,
      initialInterval - Math.floor(gameState.score / 100) * decreaseRate
    );
    gameState.spawnTimer = newInterval;
  }
};

export const handlePowerupSpawning = (gameState: GameState, destroyedAsteroidPosition: Point): void => {
  if (Math.random() < POWERUP_SPAWN_CHANCE) {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      gameState.powerups.push(createNewPowerup(canvas, destroyedAsteroidPosition));
    }
  }
};

export const initializeGameState = (
  canvas: HTMLCanvasElement, 
  currentHighScore: number,
  scale: number,
  isMobile: boolean = false
): GameState => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const asteroids: Asteroid[] = [];

  // Start with fewer asteroids on mobile
  const initialAsteroids = isMobile ? 2 : 4;

  for (let i = 0; i < initialAsteroids; i++) {
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
      canShoot: true,
      powerups: {},
      shields: SHIELD_HITS
    },
    asteroids,
    bullets: [],
    powerups: [],
    score: 0,
    highScore: currentHighScore,
    spawnTimer: isMobile ? MOBILE_INITIAL_SPAWN_INTERVAL : INITIAL_SPAWN_INTERVAL,
    backgroundAsteroids: createBackgroundAsteroids(canvas, scale)
  };
};
