import { GameState, GameStatus, Ship, Asteroid, Bullet, Point, BASE_FONT_SIZE } from './types';

export const drawShip = (
  ctx: CanvasRenderingContext2D,
  ship: Ship,
  shipSize: number,
  scale: number
): void => {
  ctx.save();
  ctx.translate(ship.position.x, ship.position.y);
  ctx.rotate(ship.rotation);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(shipSize, 0);
  ctx.lineTo(-shipSize / 2, -shipSize / 2);
  ctx.lineTo(-shipSize / 2, shipSize / 2);
  ctx.closePath();
  ctx.stroke();

  if (ship.thrusting) {
    ctx.beginPath();
    ctx.moveTo(-shipSize / 2, 0);
    ctx.lineTo(-shipSize, -shipSize / 4);
    ctx.lineTo(-shipSize * 1.5, 0);
    ctx.lineTo(-shipSize, shipSize / 4);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
};

export const drawAsteroid = (
  ctx: CanvasRenderingContext2D,
  asteroid: Asteroid,
  scale: number,
  isTargeted: boolean = false
): void => {
  ctx.save();
  ctx.translate(asteroid.position.x, asteroid.position.y);
  ctx.rotate(asteroid.rotation);
  
  // Draw targeting circle if asteroid is being targeted
  if (isTargeted) {
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    const radius = Math.max(...asteroid.vertices.map(v => Math.hypot(v.x, v.y))) + 5 * scale;
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw the asteroid
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  
  asteroid.vertices.forEach((vertex: Point, i: number) => {
    if (i === 0) {
      ctx.moveTo(vertex.x, vertex.y);
    } else {
      ctx.lineTo(vertex.x, vertex.y);
    }
  });
  
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
};

export const drawBullet = (
  ctx: CanvasRenderingContext2D,
  bullet: Bullet,
  scale: number
): void => {
  ctx.beginPath();
  ctx.arc(bullet.position.x, bullet.position.y, 2 * scale, 0, Math.PI * 2);
  ctx.fill();
};

export const drawScore = (
  ctx: CanvasRenderingContext2D,
  score: number,
  highScore: number,
  scale: number
): void => {
  const normalFontSize = Math.max(BASE_FONT_SIZE.NORMAL * scale, BASE_FONT_SIZE.MIN.NORMAL);
  ctx.font = `${normalFontSize}px "Press Start 2P"`;
  ctx.textAlign = 'left';
  const scoreY = Math.max(normalFontSize, 30 * scale);
  ctx.fillText(`Score: ${score}`, 20, scoreY);
  ctx.fillText(`High Score: ${highScore}`, 20, scoreY * 2);
};

export const drawStartScreen = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  scale: number,
  isMobile: boolean
): void => {
  const titleFontSize = Math.max(BASE_FONT_SIZE.TITLE * scale, BASE_FONT_SIZE.MIN.TITLE);
  const normalFontSize = Math.max(BASE_FONT_SIZE.NORMAL * scale, BASE_FONT_SIZE.MIN.NORMAL);

  ctx.fillStyle = '#fff';
  ctx.font = `${titleFontSize}px "Press Start 2P"`;
  ctx.textAlign = 'center';
  ctx.fillText('ASTEROIDS', canvas.width / 2, canvas.height / 2 - titleFontSize);
  
  ctx.font = `${normalFontSize}px "Press Start 2P"`;
  const lineHeight = normalFontSize * 1.5;
  ctx.fillText('TAP TO START', canvas.width / 2, canvas.height / 2 + lineHeight);
  
  if (isMobile) {
    ctx.fillText('DRAG = MOVE', canvas.width / 2, canvas.height / 2 + lineHeight * 2);
    ctx.fillText('TAP = SHOOT', canvas.width / 2, canvas.height / 2 + lineHeight * 3);
  } else {
    ctx.fillText('Use Arrow Keys or WASD to Move', canvas.width / 2, canvas.height / 2 + lineHeight * 2);
    ctx.fillText('Space to Shoot', canvas.width / 2, canvas.height / 2 + lineHeight * 3);
  }
};

export const drawGameOver = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  score: number,
  highScore: number,
  scale: number
): void => {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const titleFontSize = Math.max(BASE_FONT_SIZE.TITLE * scale, BASE_FONT_SIZE.MIN.TITLE);
  const normalFontSize = Math.max(BASE_FONT_SIZE.NORMAL * scale, BASE_FONT_SIZE.MIN.NORMAL);
  
  ctx.fillStyle = '#fff';
  ctx.font = `${titleFontSize}px "Press Start 2P"`;
  ctx.textAlign = 'center';
  
  const gameOverY = canvas.height / 2 - titleFontSize;
  ctx.fillText('GAME OVER', canvas.width / 2, gameOverY);
  
  ctx.font = `${normalFontSize}px "Press Start 2P"`;
  const lineHeight = normalFontSize * 1.5;
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2, gameOverY + lineHeight);
  ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, gameOverY + lineHeight * 2);
  ctx.fillText('TAP TO PLAY AGAIN', canvas.width / 2, gameOverY + lineHeight * 3);
};

export const render = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  gameState: GameState,
  shipSize: number,
  scale: number,
  isMobile: boolean
): void => {
  // Clear canvas
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameState.status === GameStatus.START) {
    drawStartScreen(ctx, canvas, scale, isMobile);
    return;
  }

  // Draw game objects
  drawShip(ctx, gameState.ship, shipSize, scale);
  
  gameState.asteroids.forEach(asteroid => {
    // Check if this asteroid is being targeted (within shooting range of ship)
    const dx = asteroid.position.x - gameState.ship.position.x;
    const dy = asteroid.position.y - gameState.ship.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const isInRange = distance < canvas.width * 0.4; // Target indicator for asteroids within 40% of screen width
    
    drawAsteroid(ctx, asteroid, scale, isInRange);
  });

  ctx.fillStyle = '#fff';
  gameState.bullets.forEach(bullet => {
    drawBullet(ctx, bullet, scale);
  });

  drawScore(ctx, gameState.score, gameState.highScore, scale);

  if (gameState.status === GameStatus.GAME_OVER) {
    drawGameOver(ctx, canvas, gameState.score, gameState.highScore, scale);
  }
};
