import { CellType, Position } from '@/types/game';

// Classic Pac-Man inspired maze layout (28x31)
export function generateMaze(): CellType[][] {
  const maze: CellType[][] = [];

  // 0 = wall, 1 = dot, 2 = power pellet, 3 = empty, 4 = ghost house
  const layout = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,2,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,2,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,3,3,3,3,3,3,3,3,3,3,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,3,0,0,0,4,4,0,0,0,3,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,3,0,4,4,4,4,4,4,0,3,0,0,1,0,0,0,0,0,0],
    [3,3,3,3,3,3,1,3,3,3,0,4,4,4,4,4,4,0,3,3,3,1,3,3,3,3,3,3],
    [0,0,0,0,0,0,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,3,3,3,3,3,3,3,3,3,3,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,2,1,1,0,0,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,0,0,1,1,2,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];

  // Convert numeric layout to CellType
  for (let y = 0; y < layout.length; y++) {
    maze[y] = [];
    for (let x = 0; x < layout[y].length; x++) {
      const cell = layout[y][x];
      switch (cell) {
        case 0:
          maze[y][x] = 'wall';
          break;
        case 1:
          maze[y][x] = 'dot';
          break;
        case 2:
          maze[y][x] = 'power';
          break;
        case 3:
          maze[y][x] = 'empty';
          break;
        case 4:
          maze[y][x] = 'ghost-house';
          break;
        default:
          maze[y][x] = 'empty';
      }
    }
  }

  return maze;
}

// Check if a position is valid and not a wall
export function isValidMove(maze: CellType[][], position: Position): boolean {
  const { x, y } = position;

  // Check bounds
  if (y < 0 || y >= maze.length || x < 0 || x >= maze[0].length) {
    return false;
  }

  // Check if it's not a wall
  return maze[y][x] !== 'wall';
}

// Check collision between two positions
export function checkCollision(pos1: Position, pos2: Position, threshold: number = 10): boolean {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < threshold;
}

// Get cell at position
export function getCellAt(maze: CellType[][], position: Position): CellType | null {
  const gridX = Math.floor(position.x / 20); // cellSize = 20
  const gridY = Math.floor(position.y / 20);

  if (gridY < 0 || gridY >= maze.length || gridX < 0 || gridX >= maze[0].length) {
    return null;
  }

  return maze[gridY][gridX];
}

// Count total dots in maze
export function countDots(maze: CellType[][]): number {
  let count = 0;
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 'dot' || maze[y][x] === 'power') {
        count++;
      }
    }
  }
  return count;
}

// Get starting position for Pac-Man
export function getPacManStartPosition(): Position {
  return { x: 13.5 * 20, y: 23 * 20 }; // Center bottom
}

// Get starting positions for ghosts
export function getGhostStartPositions(): Position[] {
  return [
    { x: 13.5 * 20, y: 11 * 20 }, // Red - Blinky
    { x: 11.5 * 20, y: 14 * 20 }, // Pink - Pinky
    { x: 13.5 * 20, y: 14 * 20 }, // Cyan - Inky
    { x: 15.5 * 20, y: 14 * 20 }, // Orange - Clyde
  ];
}

// Convert direction to velocity
export function directionToVelocity(direction: string | null): { dx: number; dy: number } {
  switch (direction) {
    case 'UP':
      return { dx: 0, dy: -1 };
    case 'DOWN':
      return { dx: 0, dy: 1 };
    case 'LEFT':
      return { dx: -1, dy: 0 };
    case 'RIGHT':
      return { dx: 1, dy: 0 };
    default:
      return { dx: 0, dy: 0 };
  }
}

// Get opposite direction
export function getOppositeDirection(direction: string | null): string | null {
  switch (direction) {
    case 'UP':
      return 'DOWN';
    case 'DOWN':
      return 'UP';
    case 'LEFT':
      return 'RIGHT';
    case 'RIGHT':
      return 'LEFT';
    default:
      return null;
  }
}
