import { GameState, Direction, Position, Ghost, GhostColor } from '@/types/game';
import {
  generateMaze,
  countDots,
  getPacManStartPosition,
  getGhostStartPositions,
  directionToVelocity,
  isValidMove,
  getCellAt,
  checkCollision,
} from './maze';
import {
  getGhostTarget,
  getBestDirection,
  updateGhostMode,
  updateGhostPosition,
  getGhostSpeedModifier,
} from './ghostAI';
import { DEFAULT_CONFIG } from '@/types/game';

// Initialize a new game state
export function initializeGame(difficulty: 'easy' | 'normal' | 'hard' = 'normal'): GameState {
  const maze = generateMaze();
  const totalDots = countDots(maze);
  const pacmanStart = getPacManStartPosition();
  const ghostStarts = getGhostStartPositions();

  const ghostColors: GhostColor[] = ['red', 'pink', 'cyan', 'orange'];
  const ghosts: Ghost[] = ghostStarts.map((pos, i) => ({
    id: `ghost-${i}`,
    color: ghostColors[i],
    position: { ...pos },
    direction: 'LEFT',
    mode: 'scatter',
    targetPosition: null,
    speed: DEFAULT_CONFIG.baseSpeed * 0.9,
    homePosition: { ...pos },
  }));

  return {
    phase: 'menu',
    maze,
    pacman: {
      position: { ...pacmanStart },
      direction: null,
      nextDirection: null,
      speed: DEFAULT_CONFIG.baseSpeed,
      mouthOpen: true,
      lives: 3,
    },
    ghosts,
    stats: {
      score: 0,
      level: 1,
      dotsCollected: 0,
      dotsTotal: totalDots,
      ghostsEaten: 0,
      powerPelletsConsumed: 0,
      ghostComboMultiplier: 1,
      highScore: parseInt(localStorage.getItem('pacman-high-score') || '0', 10),
    },
    powerModeActive: false,
    powerModeTimer: 0,
    difficulty,
  };
}

// Update Pac-Man position based on input
export function updatePacManPosition(state: GameState): GameState {
  const { pacman, maze } = state;

  // Try to change direction if nextDirection is set
  if (pacman.nextDirection) {
    const vel = directionToVelocity(pacman.nextDirection);
    const testPos = {
      x: Math.floor((pacman.position.x + vel.dx * pacman.speed) / 20),
      y: Math.floor((pacman.position.y + vel.dy * pacman.speed) / 20),
    };

    if (isValidMove(maze, testPos)) {
      pacman.direction = pacman.nextDirection;
      pacman.nextDirection = null;
    }
  }

  // Move in current direction
  if (pacman.direction) {
    const vel = directionToVelocity(pacman.direction);
    const newPos = {
      x: pacman.position.x + vel.dx * pacman.speed,
      y: pacman.position.y + vel.dy * pacman.speed,
    };

    const gridPos = {
      x: Math.floor(newPos.x / 20),
      y: Math.floor(newPos.y / 20),
    };

    if (isValidMove(maze, gridPos)) {
      // Handle tunnel wrapping
      const mazeWidth = maze[0].length * 20;
      if (newPos.x < 0) newPos.x = mazeWidth - 1;
      if (newPos.x >= mazeWidth) newPos.x = 0;

      pacman.position = newPos;
    }
  }

  // Toggle mouth animation
  pacman.mouthOpen = !pacman.mouthOpen;

  return state;
}

// Check for collisions with dots, power pellets, and ghosts
export function checkGameCollisions(state: GameState, gameTime: number): GameState {
  const { pacman, maze, ghosts, stats, powerModeActive } = state;

  // Check dot collection
  const cell = getCellAt(maze, pacman.position);
  const gridX = Math.floor(pacman.position.x / 20);
  const gridY = Math.floor(pacman.position.y / 20);

  if (cell === 'dot') {
    maze[gridY][gridX] = 'empty';
    stats.score += DEFAULT_CONFIG.dotScore;
    stats.dotsCollected++;
  } else if (cell === 'power') {
    maze[gridY][gridX] = 'empty';
    stats.score += DEFAULT_CONFIG.powerPelletScore;
    stats.dotsCollected++;
    stats.powerPelletsConsumed++;
    stats.ghostComboMultiplier = 1;
    state.powerModeActive = true;
    state.powerModeTimer = DEFAULT_CONFIG.powerModeDuration;

    // Make all ghosts frightened
    ghosts.forEach(ghost => {
      if (ghost.mode !== 'eaten') {
        ghost.mode = 'frightened';
      }
    });
  }

  // Check ghost collisions
  for (const ghost of ghosts) {
    if (checkCollision(pacman.position, ghost.position, 15)) {
      if (ghost.mode === 'frightened') {
        // Eat ghost
        const score = DEFAULT_CONFIG.ghostScoreBase * stats.ghostComboMultiplier;
        stats.score += score;
        stats.ghostsEaten++;
        stats.ghostComboMultiplier *= 2;
        ghost.mode = 'eaten';
      } else if (ghost.mode !== 'eaten') {
        // Lose a life
        pacman.lives--;
        if (pacman.lives <= 0) {
          state.phase = 'gameover';
          // Update high score
          if (stats.score > stats.highScore) {
            stats.highScore = stats.score;
            localStorage.setItem('pacman-high-score', stats.score.toString());
          }
        } else {
          // Reset positions
          resetPositions(state);
        }
        return state;
      }
    }
  }

  // Check level completion
  if (stats.dotsCollected >= stats.dotsTotal) {
    advanceLevel(state);
  }

  // Update power mode timer
  if (powerModeActive && state.powerModeTimer > 0) {
    state.powerModeTimer -= 16; // Assuming 60fps
    if (state.powerModeTimer <= 0) {
      state.powerModeActive = false;
      state.powerModeTimer = 0;
    }
  }

  return state;
}

// Update all ghosts
export function updateGhosts(state: GameState, gameTime: number): GameState {
  const { ghosts, pacman, maze, powerModeActive } = state;

  const blinkyPosition = ghosts[0]?.position || null;

  ghosts.forEach(ghost => {
    // Update mode
    ghost.mode = updateGhostMode(ghost, powerModeActive, gameTime);

    // Get speed modifier
    const speedModifier = getGhostSpeedModifier(ghost.mode);
    ghost.speed = DEFAULT_CONFIG.baseSpeed * 0.9 * speedModifier;

    // Get target position
    ghost.targetPosition = getGhostTarget(
      ghost,
      pacman.position,
      pacman.direction,
      blinkyPosition
    );

    // Get best direction
    ghost.direction = getBestDirection(
      ghost.position,
      ghost.direction,
      ghost.targetPosition,
      maze
    );

    // Update position
    ghost.position = updateGhostPosition(ghost, maze);
  });

  return state;
}

// Reset Pac-Man and ghost positions after death
function resetPositions(state: GameState): void {
  state.pacman.position = getPacManStartPosition();
  state.pacman.direction = null;
  state.pacman.nextDirection = null;

  const ghostStarts = getGhostStartPositions();
  state.ghosts.forEach((ghost, i) => {
    ghost.position = { ...ghostStarts[i] };
    ghost.direction = 'LEFT';
    ghost.mode = 'scatter';
  });

  state.powerModeActive = false;
  state.powerModeTimer = 0;
}

// Advance to next level
function advanceLevel(state: GameState): void {
  state.stats.level++;
  state.stats.score += DEFAULT_CONFIG.levelBonusBase + state.pacman.lives * 100;

  // Generate new maze
  state.maze = generateMaze();
  state.stats.dotsCollected = 0;
  state.stats.dotsTotal = countDots(state.maze);

  // Reset positions
  resetPositions(state);

  // Increase difficulty slightly
  state.pacman.speed = DEFAULT_CONFIG.baseSpeed * (1 + state.stats.level * 0.05);
  state.ghosts.forEach(ghost => {
    ghost.speed = DEFAULT_CONFIG.baseSpeed * 0.9 * (1 + state.stats.level * 0.05);
  });
}

// Handle keyboard input
export function handleInput(state: GameState, key: string): void {
  const directionMap: Record<string, Direction> = {
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    ArrowLeft: 'LEFT',
    ArrowRight: 'RIGHT',
    w: 'UP',
    s: 'DOWN',
    a: 'LEFT',
    d: 'RIGHT',
  };

  const direction = directionMap[key];
  if (direction) {
    state.pacman.nextDirection = direction;
  }

  // Pause/unpause
  if (key === ' ' || key === 'Escape') {
    if (state.phase === 'playing') {
      state.phase = 'paused';
    } else if (state.phase === 'paused') {
      state.phase = 'playing';
    }
  }
}

// Main game loop update
export function updateGame(state: GameState, gameTime: number): GameState {
  if (state.phase !== 'playing') {
    return state;
  }

  state = updatePacManPosition(state);
  state = updateGhosts(state, gameTime);
  state = checkGameCollisions(state, gameTime);

  return state;
}
