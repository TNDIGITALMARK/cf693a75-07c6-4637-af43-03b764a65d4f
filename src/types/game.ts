// Pac-Man Game Type Definitions

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null;

export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover';

export type CellType = 'wall' | 'dot' | 'power' | 'empty' | 'ghost-house';

export type GhostMode = 'chase' | 'scatter' | 'frightened' | 'eaten';

export type GhostColor = 'red' | 'pink' | 'cyan' | 'orange';

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  dx: number;
  dy: number;
}

export interface PacMan {
  position: Position;
  direction: Direction;
  nextDirection: Direction;
  speed: number;
  mouthOpen: boolean;
  lives: number;
}

export interface Ghost {
  id: string;
  color: GhostColor;
  position: Position;
  direction: Direction;
  mode: GhostMode;
  targetPosition: Position | null;
  speed: number;
  homePosition: Position;
}

export interface GameStats {
  score: number;
  level: number;
  dotsCollected: number;
  dotsTotal: number;
  ghostsEaten: number;
  powerPelletsConsumed: number;
  ghostComboMultiplier: number;
  highScore: number;
}

export interface GameState {
  phase: GamePhase;
  maze: CellType[][];
  pacman: PacMan;
  ghosts: Ghost[];
  stats: GameStats;
  powerModeActive: boolean;
  powerModeTimer: number;
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface HighScoreEntry {
  name: string;
  score: number;
  level: number;
  date: string;
}

export interface GameConfig {
  mazeWidth: number;
  mazeHeight: number;
  cellSize: number;
  baseSpeed: number;
  powerModeDuration: number;
  ghostScoreBase: number;
  dotScore: number;
  powerPelletScore: number;
  levelBonusBase: number;
}

// Default game configuration
export const DEFAULT_CONFIG: GameConfig = {
  mazeWidth: 28,
  mazeHeight: 31,
  cellSize: 20,
  baseSpeed: 2,
  powerModeDuration: 10000, // 10 seconds
  ghostScoreBase: 200,
  dotScore: 10,
  powerPelletScore: 50,
  levelBonusBase: 1000,
};

// Mock high scores data
export const MOCK_HIGH_SCORES: HighScoreEntry[] = [
  { name: 'player_champion_2024', score: 15420, level: 8, date: '2025-10-14' },
  { name: 'arcade_master_99', score: 12880, level: 6, date: '2025-10-13' },
  { name: 'dot_collector_pro', score: 11750, level: 5, date: '2025-10-12' },
  { name: 'ghost_dodger_elite', score: 10990, level: 5, date: '2025-10-11' },
  { name: 'maze_runner_ace', score: 9340, level: 4, date: '2025-10-10' },
];
