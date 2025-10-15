import { Ghost, Position, Direction, CellType, GhostMode } from '@/types/game';
import { directionToVelocity, isValidMove } from './maze';

// Calculate distance between two positions
function distance(pos1: Position, pos2: Position): number {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Get target position based on ghost personality and mode
export function getGhostTarget(
  ghost: Ghost,
  pacmanPosition: Position,
  pacmanDirection: Direction,
  blinkyPosition: Position | null
): Position {
  if (ghost.mode === 'frightened') {
    // Random movement when frightened
    return {
      x: Math.random() * 560,
      y: Math.random() * 620,
    };
  }

  if (ghost.mode === 'eaten') {
    // Return to ghost house
    return ghost.homePosition;
  }

  if (ghost.mode === 'scatter') {
    // Go to home corner
    return ghost.homePosition;
  }

  // Chase mode - each ghost has unique behavior
  switch (ghost.color) {
    case 'red': // Blinky - directly targets Pac-Man
      return pacmanPosition;

    case 'pink': { // Pinky - targets 4 tiles ahead of Pac-Man
      const vel = directionToVelocity(pacmanDirection);
      return {
        x: pacmanPosition.x + vel.dx * 80,
        y: pacmanPosition.y + vel.dy * 80,
      };
    }

    case 'cyan': { // Inky - complex targeting based on Blinky
      if (!blinkyPosition) return pacmanPosition;
      const vel = directionToVelocity(pacmanDirection);
      const pivot = {
        x: pacmanPosition.x + vel.dx * 40,
        y: pacmanPosition.y + vel.dy * 40,
      };
      return {
        x: pivot.x + (pivot.x - blinkyPosition.x),
        y: pivot.y + (pivot.y - blinkyPosition.y),
      };
    }

    case 'orange': { // Clyde - targets Pac-Man if far, scatter if close
      const dist = distance(ghost.position, pacmanPosition);
      if (dist > 160) {
        return pacmanPosition;
      } else {
        return ghost.homePosition;
      }
    }

    default:
      return pacmanPosition;
  }
}

// Get best direction to move towards target
export function getBestDirection(
  currentPosition: Position,
  currentDirection: Direction,
  targetPosition: Position,
  maze: CellType[][]
): Direction {
  const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  let bestDirection: Direction = currentDirection || 'UP';
  let bestDistance = Infinity;

  // Get current grid position
  const gridX = Math.floor(currentPosition.x / 20);
  const gridY = Math.floor(currentPosition.y / 20);

  // Try each direction
  for (const dir of directions) {
    // Don't reverse direction
    if (isOpposite(dir, currentDirection)) continue;

    const vel = directionToVelocity(dir);
    const newGridPos = {
      x: gridX + vel.dx,
      y: gridY + vel.dy,
    };

    // Check if valid move
    if (isValidMove(maze, newGridPos)) {
      const newPos = {
        x: newGridPos.x * 20 + 10,
        y: newGridPos.y * 20 + 10,
      };
      const dist = distance(newPos, targetPosition);

      if (dist < bestDistance) {
        bestDistance = dist;
        bestDirection = dir;
      }
    }
  }

  return bestDirection;
}

// Check if two directions are opposite
function isOpposite(dir1: Direction, dir2: Direction): boolean {
  if (!dir1 || !dir2) return false;
  return (
    (dir1 === 'UP' && dir2 === 'DOWN') ||
    (dir1 === 'DOWN' && dir2 === 'UP') ||
    (dir1 === 'LEFT' && dir2 === 'RIGHT') ||
    (dir1 === 'RIGHT' && dir2 === 'LEFT')
  );
}

// Update ghost mode based on game state
export function updateGhostMode(
  ghost: Ghost,
  powerModeActive: boolean,
  gameTime: number
): GhostMode {
  if (ghost.mode === 'eaten') {
    // Check if ghost reached home
    const dist = distance(ghost.position, ghost.homePosition);
    if (dist < 10) {
      return 'chase';
    }
    return 'eaten';
  }

  if (powerModeActive) {
    return 'frightened';
  }

  // Alternate between chase and scatter based on game time
  const cycleTime = Math.floor(gameTime / 5000) % 4;
  if (cycleTime === 0 || cycleTime === 2) {
    return 'scatter';
  }
  return 'chase';
}

// Update ghost position based on direction and speed
export function updateGhostPosition(
  ghost: Ghost,
  maze: CellType[][]
): Position {
  if (!ghost.direction) return ghost.position;

  const vel = directionToVelocity(ghost.direction);
  const newPosition = {
    x: ghost.position.x + vel.dx * ghost.speed,
    y: ghost.position.y + vel.dy * ghost.speed,
  };

  // Check if move is valid
  const gridPos = {
    x: Math.floor(newPosition.x / 20),
    y: Math.floor(newPosition.y / 20),
  };

  if (isValidMove(maze, gridPos)) {
    // Handle tunnel wrapping
    const mazeWidth = maze[0].length * 20;
    if (newPosition.x < 0) newPosition.x = mazeWidth - 1;
    if (newPosition.x >= mazeWidth) newPosition.x = 0;

    return newPosition;
  }

  return ghost.position;
}

// Get ghost speed modifier based on mode
export function getGhostSpeedModifier(mode: GhostMode): number {
  switch (mode) {
    case 'frightened':
      return 0.5; // Slower when frightened
    case 'eaten':
      return 2.0; // Faster when returning to ghost house
    case 'chase':
      return 1.0;
    case 'scatter':
      return 0.9;
    default:
      return 1.0;
  }
}
