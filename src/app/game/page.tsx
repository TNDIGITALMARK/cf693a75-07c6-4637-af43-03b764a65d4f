'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GameState } from '@/types/game';
import { initializeGame, updateGame, handleInput } from '@/lib/gameEngine';
import { renderGame } from '@/lib/gameRenderer';

export default function GamePage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);

  // Initialize game
  useEffect(() => {
    const difficulty = (localStorage.getItem('pacman-difficulty') || 'normal') as 'easy' | 'normal' | 'hard';
    gameStateRef.current = initializeGame(difficulty);
    gameStateRef.current.phase = 'playing';
    startTimeRef.current = Date.now();
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!gameStateRef.current || !canvasRef.current) return;

    const state = gameStateRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Update game state
    const gameTime = Date.now() - startTimeRef.current;
    gameStateRef.current = updateGame(state, gameTime);

    // Render game
    renderGame(ctx, state);

    // Update UI
    setScore(state.stats.score);
    setLives(state.pacman.lives);
    setLevel(state.stats.level);
    setIsPaused(state.phase === 'paused');

    // Check game over
    if (state.phase === 'gameover') {
      router.push('/gameover');
      return;
    }

    // Continue loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [router]);

  // Start game loop
  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current) {
        // Prevent default for arrow keys and space
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(e.key)) {
          e.preventDefault();
        }
        handleInput(gameStateRef.current, e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle mobile swipe
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !gameStateRef.current) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    const threshold = 30;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > threshold) {
        handleInput(gameStateRef.current, dx > 0 ? 'ArrowRight' : 'ArrowLeft');
      }
    } else {
      if (Math.abs(dy) > threshold) {
        handleInput(gameStateRef.current, dy > 0 ? 'ArrowDown' : 'ArrowUp');
      }
    }

    touchStartRef.current = null;
  };

  const handleDirectionButton = (key: string) => {
    if (gameStateRef.current) {
      handleInput(gameStateRef.current, key);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--game-bg-darker)) 0%, hsl(var(--game-bg-dark)) 100%)',
      }}
    >
      {/* Game Stats Header */}
      <div className="w-full max-w-4xl mb-4 flex justify-between items-center text-white">
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-xs text-white/60 mb-1">SCORE</div>
            <div className="text-2xl font-bold text-yellow-400">{score.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-white/60 mb-1">LEVEL</div>
            <div className="text-2xl font-bold text-cyan-400">{level}</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-white/60 mb-1">LIVES</div>
          <div className="flex gap-1">
            {Array.from({ length: lives }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full"
                style={{
                  background: 'hsl(var(--game-pacman))',
                  boxShadow: '0 0 10px hsl(var(--game-pacman) / 0.5)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl" style={{
        boxShadow: '0 0 40px hsl(var(--game-wall) / 0.4)',
      }}>
        <canvas
          ref={canvasRef}
          width={560}
          height={620}
          className="max-w-full h-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-4">PAUSED</div>
              <div className="text-white/80">Press SPACE to continue</div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mt-6 md:hidden">
        <div className="grid grid-cols-3 gap-2 w-48">
          <div></div>
          <button
            onTouchStart={() => handleDirectionButton('ArrowUp')}
            className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-2xl border-2 border-white/20 active:bg-white/30"
          >
            ↑
          </button>
          <div></div>
          <button
            onTouchStart={() => handleDirectionButton('ArrowLeft')}
            className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-2xl border-2 border-white/20 active:bg-white/30"
          >
            ←
          </button>
          <button
            onTouchStart={() => handleDirectionButton(' ')}
            className="w-14 h-14 bg-yellow-400/20 hover:bg-yellow-400/30 rounded-lg flex items-center justify-center text-yellow-400 text-xs font-bold border-2 border-yellow-400/30 active:bg-yellow-400/40"
          >
            PAUSE
          </button>
          <button
            onTouchStart={() => handleDirectionButton('ArrowRight')}
            className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-2xl border-2 border-white/20 active:bg-white/30"
          >
            →
          </button>
          <div></div>
          <button
            onTouchStart={() => handleDirectionButton('ArrowDown')}
            className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-2xl border-2 border-white/20 active:bg-white/30"
          >
            ↓
          </button>
          <div></div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-white/50 text-sm">
        <p className="hidden md:block">Use Arrow Keys or WASD to move • SPACE to pause</p>
        <p className="md:hidden">Swipe or use controls to move • Tap PAUSE to pause</p>
      </div>
    </div>
  );
}
