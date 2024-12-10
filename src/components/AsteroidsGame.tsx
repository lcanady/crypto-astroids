import React, { useEffect, useRef, useState } from 'react';
import { GameState, GameStatus, BASE_SHIP_SIZE, ROTATION_SPEED, THRUST_SPEED } from './game/types';
import { initializeGameState, updateShipPhysics, updateAsteroidPhysics } from './game/gameUtils';
import { render } from './game/renderer';
import { handleCollisions } from './game/collisions';
import { shoot, updateBullets } from './game/bulletSystem';

interface TouchInfo {
  id: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

// Mobile-specific constants
const MOBILE_MAX_SPEED = 4;
const MOBILE_FRICTION = 0.96;
const MOBILE_THRUST_MULTIPLIER = 0.3;
const ASTEROID_TAP_RADIUS = 40; // Radius for asteroid tap detection

// Helper function to convert touch coordinates to canvas coordinates
const getTouchCanvasCoordinates = (canvas: HTMLCanvasElement, touchX: number, touchY: number) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (touchX - rect.left) * scaleX,
    y: (touchY - rect.top) * scaleY
  };
};

interface Asteroid {
  position: { x: number; y: number };
  size: number;
}

// Helper function to check if a point is inside an asteroid
const isPointInAsteroid = (x: number, y: number, asteroid: Asteroid, scale: number) => {
  const dx = x - asteroid.position.x;
  const dy = y - asteroid.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= (asteroid.size + ASTEROID_TAP_RADIUS) * scale;
};

// Helper function to calculate angle between two points
const calculateAngleBetweenPoints = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.atan2(y2 - y1, x2 - x1);
};

export const AsteroidsGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const movementTouchRef = useRef<TouchInfo | null>(null);
  
  const gameStateRef = useRef<GameState>({
    status: GameStatus.START,
    ship: {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      rotation: 0,
      thrusting: false,
      canShoot: true
    },
    asteroids: [],
    bullets: [],
    score: 0,
    highScore: 0
  });

  const keys = useRef<{ [key: string]: boolean }>({});

  const checkMobile = () => {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const handleResize = () => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    setDimensions({ width, height });
    setIsMobile(checkMobile());

    const baseSize = 800; // Reduced from 1000 to make everything relatively larger
    const screenSize = Math.min(width, height);
    const calculatedScale = screenSize / baseSize;
    const minimumScale = checkMobile() ? 1.5 : 0.8; // Increased minimum scale for mobile from 1.0 to 1.5
    setScale(Math.max(calculatedScale, minimumScale));

    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      if (gameStateRef.current.ship) {
        gameStateRef.current.ship.position = {
          x: width / 2,
          y: height / 2
        };
      }
    }
  };

  const updateShipFromTouch = () => {
    if (!movementTouchRef.current) {
      gameStateRef.current.ship.thrusting = false;
      return;
    }

    const { startX, startY, currentX, currentY } = movementTouchRef.current;
    
    // Calculate angle and distance from start point to current point
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.hypot(deltaX, deltaY);
    
    // Only apply thrust if moved more than 10 pixels from start
    if (distance > 10) {
      const ship = gameStateRef.current.ship;
      ship.thrusting = true;
      ship.rotation = angle;

      // Apply reduced thrust in the direction of movement
      const thrustMultiplier = Math.min(distance / 100, 1) * MOBILE_THRUST_MULTIPLIER;
      ship.velocity.x += Math.cos(angle) * THRUST_SPEED * thrustMultiplier;
      ship.velocity.y += Math.sin(angle) * THRUST_SPEED * thrustMultiplier;

      // Limit velocity to lower maximum speed on mobile
      const speed = Math.hypot(ship.velocity.x, ship.velocity.y);
      if (speed > MOBILE_MAX_SPEED) {
        const ratio = MOBILE_MAX_SPEED / speed;
        ship.velocity.x *= ratio;
        ship.velocity.y *= ratio;
      }
    } else {
      gameStateRef.current.ship.thrusting = false;
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 100);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
      }
      keys.current[e.key] = true;
      
      if (e.key === 'Enter') {
        if (gameStateRef.current.status !== GameStatus.PLAYING) {
          gameStateRef.current = initializeGameState(canvas, gameStateRef.current.highScore, scale);
        }
      }

      if (e.key === ' ' && gameStateRef.current.status === GameStatus.PLAYING) {
        shoot(gameStateRef.current);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
      }
      keys.current[e.key] = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();

      if (gameStateRef.current.status !== GameStatus.PLAYING) {
        gameStateRef.current = initializeGameState(canvas, gameStateRef.current.highScore, scale);
        return;
      }

      const touch = e.touches[0];
      const canvasCoords = getTouchCanvasCoordinates(canvas, touch.clientX, touch.clientY);

      // If no movement touch is tracked, check if we're tapping an asteroid
      if (!movementTouchRef.current) {
        // Check if we tapped an asteroid
        for (const asteroid of gameStateRef.current.asteroids) {
          if (isPointInAsteroid(canvasCoords.x, canvasCoords.y, asteroid, scale)) {
            // Calculate angle to asteroid
            const angle = calculateAngleBetweenPoints(
              gameStateRef.current.ship.position.x,
              gameStateRef.current.ship.position.y,
              asteroid.position.x,
              asteroid.position.y
            );
            
            // Update ship rotation and shoot
            gameStateRef.current.ship.rotation = angle;
            shoot(gameStateRef.current);
            return;
          }
        }

        // If no asteroid was tapped, start movement tracking
        movementTouchRef.current = {
          id: touch.identifier,
          startX: touch.clientX,
          startY: touch.clientY,
          currentX: touch.clientX,
          currentY: touch.clientY
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      
      // Update movement touch if we're tracking it
      if (movementTouchRef.current) {
        for (let i = 0; i < e.touches.length; i++) {
          const touch = e.touches[i];
          if (touch.identifier === movementTouchRef.current.id) {
            movementTouchRef.current.currentX = touch.clientX;
            movementTouchRef.current.currentY = touch.clientY;
            break;
          }
        }
        updateShipFromTouch();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      
      // Check if the movement touch ended
      if (movementTouchRef.current) {
        let movementTouchFound = false;
        for (let i = 0; i < e.touches.length; i++) {
          if (e.touches[i].identifier === movementTouchRef.current.id) {
            movementTouchFound = true;
            break;
          }
        }
        if (!movementTouchFound) {
          movementTouchRef.current = null;
          gameStateRef.current.ship.thrusting = false;
        }
      }
    };

    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    let animationFrameId: number;

    const update = () => {
      if (gameStateRef.current.status === GameStatus.PLAYING) {
        if (!isMobile) {
          updateShipPhysics(gameStateRef.current.ship, keys.current, canvas, ROTATION_SPEED);
        } else {
          // Apply stronger friction in mobile mode
          const ship = gameStateRef.current.ship;
          if (!ship.thrusting) {
            ship.velocity.x *= MOBILE_FRICTION;
            ship.velocity.y *= MOBILE_FRICTION;

            // Stop completely at very low speeds to prevent endless drifting
            if (Math.abs(ship.velocity.x) < 0.01) ship.velocity.x = 0;
            if (Math.abs(ship.velocity.y) < 0.01) ship.velocity.y = 0;
          }
          // Update position
          ship.position.x = (ship.position.x + ship.velocity.x + canvas.width) % canvas.width;
          ship.position.y = (ship.position.y + ship.velocity.y + canvas.height) % canvas.height;
        }
        updateBullets(gameStateRef.current, canvas);
        gameStateRef.current.asteroids.forEach(asteroid => {
          updateAsteroidPhysics(asteroid, canvas);
        });
        handleCollisions(gameStateRef.current, BASE_SHIP_SIZE * scale, scale);
      }

      render(ctx, canvas, gameStateRef.current, BASE_SHIP_SIZE * scale, scale, isMobile);
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      canvas.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scale, isMobile]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#000',
        touchAction: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ 
          display: 'block',
          outline: 'none',
          width: '100%',
          height: '100%',
          touchAction: 'none'
        }}
        width={dimensions.width}
        height={dimensions.height}
        tabIndex={0}
        autoFocus
      />
    </div>
  );
};
