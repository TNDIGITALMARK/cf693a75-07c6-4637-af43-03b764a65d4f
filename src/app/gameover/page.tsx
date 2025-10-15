'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_HIGH_SCORES } from '@/types/game';

export default function GameOverPage() {
  const router = useRouter();
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [stats, setStats] = useState({
    dotsCollected: 0,
    ghostsEaten: 0,
    level: 1,
  });

  useEffect(() => {
    // Get game stats from localStorage (in a real app, this would come from game state)
    const storedHighScore = parseInt(localStorage.getItem('pacman-high-score') || '0', 10);
    const lastScore = Math.floor(Math.random() * 8000) + 2000; // Simulated for demo

    setFinalScore(lastScore);
    setHighScore(storedHighScore);
    setIsNewHighScore(lastScore > storedHighScore);

    // Simulated stats
    setStats({
      dotsCollected: Math.floor(Math.random() * 200) + 100,
      ghostsEaten: Math.floor(Math.random() * 15) + 5,
      level: Math.floor(Math.random() * 5) + 1,
    });
  }, []);

  const playAgain = () => {
    router.push('/menu');
  };

  const shareScore = () => {
    const text = `I scored ${finalScore.toLocaleString()} points in Pac-Man! Can you beat that?`;
    if (navigator.share) {
      navigator.share({
        title: 'Pac-Man Score',
        text: text,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Score copied to clipboard!');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--game-bg-darker)) 0%, hsl(var(--game-bg-dark)) 100%)',
      }}
    >
      <div className="max-w-2xl w-full animate-[game-start_0.8s_ease-out]">
        {/* Game Over Title */}
        <div className="text-center mb-8">
          <h1
            className="text-6xl md:text-7xl font-bold mb-4 tracking-wider"
            style={{
              color: isNewHighScore ? 'hsl(var(--game-pacman))' : 'hsl(var(--game-ghost-red))',
              textShadow: isNewHighScore
                ? '0 0 30px hsl(var(--game-pacman) / 0.6), 0 0 60px hsl(var(--game-pacman) / 0.3)'
                : '0 0 30px hsl(var(--game-ghost-red) / 0.6)',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 900,
            }}
          >
            GAME OVER
          </h1>
          {isNewHighScore && (
            <div className="text-2xl text-yellow-400 font-bold animate-pulse">
              🏆 NEW HIGH SCORE! 🏆
            </div>
          )}
        </div>

        {/* Score Display */}
        <div className="bg-white/5 backdrop-blur-sm border-2 border-cyan-500/30 rounded-xl p-8 mb-6 shadow-2xl">
          <div className="text-center mb-8 pb-8 border-b border-white/10">
            <div className="text-sm text-white/60 mb-2">FINAL SCORE</div>
            <div
              className="text-6xl font-bold mb-4"
              style={{
                color: 'hsl(var(--game-pacman))',
                textShadow: '0 0 20px hsl(var(--game-pacman) / 0.5)',
              }}
            >
              {finalScore.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">
              Previous High Score: {highScore.toLocaleString()}
            </div>
          </div>

          {/* Game Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-black/20 rounded-lg">
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {stats.dotsCollected}
              </div>
              <div className="text-xs text-white/60">Dots Collected</div>
            </div>
            <div className="text-center p-4 bg-black/20 rounded-lg">
              <div className="text-2xl font-bold text-pink-400 mb-1">
                {stats.ghostsEaten}
              </div>
              <div className="text-xs text-white/60">Ghosts Eaten</div>
            </div>
            <div className="text-center p-4 bg-black/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {stats.level}
              </div>
              <div className="text-xs text-white/60">Level Reached</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={playAgain}
              className="w-full py-4 rounded-lg font-bold text-xl uppercase transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--game-pacman)) 0%, hsl(35 100% 65%) 100%)',
                color: '#000',
                boxShadow: '0 0 20px hsl(var(--game-pacman) / 0.5)',
                animation: 'button-glow 2s ease-in-out infinite',
              }}
            >
              PLAY AGAIN
            </button>

            <button
              onClick={shareScore}
              className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 font-semibold transition-all border border-white/20"
            >
              📤 SHARE SCORE
            </button>

            <button
              onClick={() => router.push('/menu')}
              className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 font-semibold transition-all"
            >
              BACK TO MENU
            </button>
          </div>
        </div>

        {/* High Scores List */}
        <div className="bg-white/5 backdrop-blur-sm border-2 border-pink-500/30 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 text-center">
            🏆 TOP SCORES
          </h2>
          <div className="space-y-2">
            {MOCK_HIGH_SCORES.slice(0, 5).map((entry, index) => (
              <div
                key={index}
                className={`flex justify-between items-center py-2 px-4 rounded-lg ${
                  isNewHighScore && index === 0
                    ? 'bg-yellow-400/20 border border-yellow-400/40'
                    : 'bg-black/20'
                }`}
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

        {/* Footer */}
        <div className="text-center mt-6 text-white/50 text-sm">
          <p>Thanks for playing! 👾</p>
        </div>
      </div>
    </div>
  );
}
