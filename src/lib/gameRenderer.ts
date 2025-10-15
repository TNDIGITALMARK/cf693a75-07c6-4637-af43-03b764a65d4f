import { GameState, Ghost, CellType } from '@/types/game';

const CELL_SIZE = 20;

// Main render function
export function renderGame(ctx: CanvasRenderingContext2D, state: GameState): void {
  const { maze, pacman, ghosts } = state;

  // Clear canvas
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Render maze
  renderMaze(ctx, maze);

  // Render Pac-Man
  renderPacMan(ctx, pacman.position, pacman.direction, pacman.mouthOpen);

  // Render ghosts
  ghosts.forEach(ghost => renderGhost(ctx, ghost, state.powerModeActive));

  // Render power mode overlay
  if (state.powerModeActive) {
    const alpha = Math.sin(Date.now() / 100) * 0.1 + 0.05;
    ctx.fillStyle = `rgba(0, 100, 255, ${alpha})`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}

// Render the maze
function renderMaze(ctx: CanvasRenderingContext2D, maze: CellType[][]): void {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const cell = maze[y][x];
      const px = x * CELL_SIZE;
      const py = y * CELL_SIZE;

      switch (cell) {
        case 'wall':
          renderWall(ctx, px, py);
          break;
        case 'dot':
          renderDot(ctx, px + CELL_SIZE / 2, py + CELL_SIZE / 2);
          break;
        case 'power':
          renderPowerPellet(ctx, px + CELL_SIZE / 2, py + CELL_SIZE / 2);
          break;
        case 'ghost-house':
          ctx.fillStyle = 'rgba(255, 105, 180, 0.1)';
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          break;
      }
    }
  }
}

// Render wall with neon effect
function renderWall(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = '#0a1628';
  ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

  // Neon border
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

  // Glow effect
  ctx.shadowBlur = 5;
  ctx.shadowColor = '#00d4ff';
  ctx.strokeRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
  ctx.shadowBlur = 0;
}

// Render dot
function renderDot(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();

  // Subtle glow
  ctx.shadowBlur = 3;
  ctx.shadowColor = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

// Render power pellet with animation
function renderPowerPellet(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const scale = Math.sin(Date.now() / 200) * 0.3 + 1;
  const radius = 5 * scale;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Strong glow
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ffff00';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

// Render Pac-Man
function renderPacMan(
  ctx: CanvasRenderingContext2D,
  position: { x: number; y: number },
  direction: string | null,
  mouthOpen: boolean
): void {
  const radius = 12;

  // Determine rotation based on direction
  let rotation = 0;
  switch (direction) {
    case 'RIGHT':
      rotation = 0;
      break;
    case 'DOWN':
      rotation = Math.PI / 2;
      break;
    case 'LEFT':
      rotation = Math.PI;
      break;
    case 'UP':
      rotation = -Math.PI / 2;
      break;
  }

  // Mouth angle
  const mouthAngle = mouthOpen ? 0.6 : 0.2;

  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.rotate(rotation);

  // Body
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(0, 0, radius, mouthAngle, Math.PI * 2 - mouthAngle);
  ctx.lineTo(0, 0);
  ctx.fill();

  // Glow effect
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#ffff00';
  ctx.beginPath();
  ctx.arc(0, 0, radius, mouthAngle, Math.PI * 2 - mouthAngle);
  ctx.lineTo(0, 0);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// Render ghost
function renderGhost(
  ctx: CanvasRenderingContext2D,
  ghost: Ghost,
  powerMode: boolean
): void {
  const size = 14;
  const { position } = ghost;

  // Determine color
  let color: string;
  if (ghost.mode === 'eaten') {
    // Just eyes when eaten
    renderGhostEyes(ctx, position.x, position.y, ghost.direction);
    return;
  } else if (ghost.mode === 'frightened') {
    // Blue and flashing when frightened
    const flash = Math.floor(Date.now() / 200) % 2 === 0;
    color = flash ? '#0000dd' : '#ffffff';
  } else {
    // Normal colors
    switch (ghost.color) {
      case 'red':
        color = '#ff0000';
        break;
      case 'pink':
        color = '#ffb8ff';
        break;
      case 'cyan':
        color = '#00ffff';
        break;
      case 'orange':
        color = '#ffb852';
        break;
    }
  }

  ctx.save();
  ctx.translate(position.x, position.y);

  // Body (rounded top)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, -size / 4, size, Math.PI, 0);
  ctx.lineTo(size, size);
  ctx.lineTo(-size, size);
  ctx.closePath();
  ctx.fill();

  // Wavy bottom
  ctx.beginPath();
  ctx.moveTo(-size, size);
  for (let i = 0; i < 3; i++) {
    const x1 = -size + (i * size * 2) / 3;
    const x2 = -size + ((i + 0.5) * size * 2) / 3;
    const x3 = -size + ((i + 1) * size * 2) / 3;
    ctx.quadraticCurveTo(x2, size + 4, x3, size);
  }
  ctx.lineTo(size, size / 2);
  ctx.lineTo(-size, size / 2);
  ctx.closePath();
  ctx.fill();

  // Glow effect
  if (ghost.mode !== 'frightened') {
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Eyes (unless frightened)
  if (ghost.mode === 'frightened') {
    // Frightened face
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-4, -2, 2, 0, Math.PI * 2);
    ctx.arc(4, -2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Wavy mouth
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-6, 4);
    for (let i = 0; i < 4; i++) {
      const x = -6 + i * 4;
      const y = 4 + (i % 2 === 0 ? 2 : 0);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  } else {
    renderGhostEyes(ctx, 0, 0, ghost.direction);
  }

  ctx.restore();
}

// Render ghost eyes
function renderGhostEyes(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  direction: string | null
): void {
  ctx.save();
  ctx.translate(x, y);

  // Eye whites
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-4, -3, 3, 0, Math.PI * 2);
  ctx.arc(4, -3, 3, 0, Math.PI * 2);
  ctx.fill();

  // Pupils (move based on direction)
  let pupilX = 0;
  let pupilY = 0;
  switch (direction) {
    case 'LEFT':
      pupilX = -1;
      break;
    case 'RIGHT':
      pupilX = 1;
      break;
    case 'UP':
      pupilY = -1;
      break;
    case 'DOWN':
      pupilY = 1;
      break;
  }

  ctx.fillStyle = '#000088';
  ctx.beginPath();
  ctx.arc(-4 + pupilX, -3 + pupilY, 1.5, 0, Math.PI * 2);
  ctx.arc(4 + pupilX, -3 + pupilY, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
