'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_HIGH_SCORES } from '@/types/game';

export default function MenuPage() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [showControls, setShowControls] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pacman-high-score');
      setHighScore(stored ? parseInt(stored, 10) : 0);
    }
  }, []);

  const startGame = () => {
    localStorage.setItem('pacman-difficulty', difficulty);
    router.push('/game');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, hsl(var(--game-bg-darker)) 0%, hsl(var(--game-bg-dark)) 100%)'
    }}>
      <div className="max-w-2xl w-full">
        {/* Title */}
        <div className="text-center mb-12 animate-[game-start_0.6s_ease-out]">
          <div className="mb-4 text-2xl text-cyan-400 font-semibold" style={{
            textShadow: '0 0 15px hsl(var(--game-wall) / 0.6)',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            Hello, Player! 👋
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-wider" style={{
            color: 'hsl(var(--game-pacman))',
            textShadow: '0 0 20px hsl(var(--game-pacman) / 0.5), 0 0 40px hsl(var(--game-pacman) / 0.3)',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 900,
          }}>
            PAC-MAN
          </h1>
          <p className="text-xl text-white/80">Classic Arcade Adventure</p>
        </div>

        {/* Main Menu Panel */}
        <div className="bg-white/5 backdrop-blur-sm border-2 border-cyan-500/30 rounded-xl p-8 mb-6 shadow-2xl"
          style={{
            boxShadow: '0 0 30px hsl(var(--game-wall) / 0.2)',
          }}>

          {/* High Score Display */}
          <div className="text-center mb-8 pb-6 border-b border-white/10">
            <div className="text-sm text-white/60 mb-1">HIGH SCORE</div>
            <div className="text-4xl font-bold text-yellow-400">
              {highScore.toLocaleString()}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <label className="block text-white/80 text-sm font-semibold mb-3">
              SELECT DIFFICULTY
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['easy', 'normal', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`py-3 px-4 rounded-lg font-semibold text-sm uppercase transition-all ${
                    difficulty === level
                      ? 'bg-yellow-400 text-black shadow-lg scale-105'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  style={difficulty === level ? {
                    boxShadow: '0 0 20px hsl(var(--game-pacman) / 0.6)',
                  } : undefined}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startGame}
            className="w-full py-4 rounded-lg font-bold text-xl uppercase transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--game-pacman)) 0%, hsl(35 100% 65%) 100%)',
              color: '#000',
              boxShadow: '0 0 20px hsl(var(--game-pacman) / 0.5)',
              animation: 'button-glow 2s ease-in-out infinite',
            }}
          >
            START GAME
          </button>

          {/* Controls Toggle */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 font-semibold transition-all"
          >
            {showControls ? 'HIDE' : 'SHOW'} CONTROLS
          </button>

          {/* Controls Display */}
          {showControls && (
            <div className="mt-4 p-4 bg-black/30 rounded-lg border border-white/10">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-yellow-400 font-semibold mb-2">KEYBOARD</div>
                  <div className="text-white/70 space-y-1">
                    <div>↑ ↓ ← → Arrow Keys</div>
                    <div>W A S D Keys</div>
                    <div>SPACE Pause</div>
                  </div>
                </div>
                <div>
                  <div className="text-yellow-400 font-semibold mb-2">MOBILE</div>
                  <div className="text-white/70 space-y-1">
                    <div>Swipe to move</div>
                    <div>Tap controls</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* High Scores List */}
        <div className="bg-white/5 backdrop-blur-sm border-2 border-pink-500/30 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 text-center">
            🏆 HIGH SCORES
          </h2>
          <div className="space-y-2">
            {MOCK_HIGH_SCORES.map((entry, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 px-4 bg-black/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold w-6">#{index + 1}</span>
                  <span className="text-white/80 text-sm">{entry.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 font-bold">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-white/50 text-xs">Level {entry.level}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Info */}
        <div className="text-center mt-6 text-white/50 text-sm">
          <p>© 2025 Pac-Man Game | Built with Next.js</p>
        </div>
      </div>
    </div>
  );
}
