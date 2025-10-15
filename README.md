# 🎮 PAC-MAN Game

A modern browser-based implementation of the classic Pac-Man arcade game built with Next.js, React, and TypeScript.

## ✨ Features

- **Classic Gameplay**: Authentic Pac-Man mechanics with maze navigation, dot collection, and ghost AI
- **Smart Ghost AI**: Four unique ghost personalities with chase, scatter, and frightened behaviors
- **Power Mode**: Eat power pellets to turn the tables on ghosts
- **Score System**: Track your score, level progress, and compete for high scores
- **Responsive Design**: Fully playable on desktop and mobile devices
- **Mobile Controls**: Touch-friendly swipe controls and button interface
- **Modern UI**: Neon-styled retro aesthetic with smooth animations

## 🎯 Game Features

### 3-Page Architecture

1. **Start Menu** (`/menu`)
   - Difficulty selection (Easy, Normal, Hard)
   - High score display
   - Controls reference
   - Top 5 leaderboard

2. **Game Board** (`/game`)
   - Real-time gameplay with 60fps rendering
   - Score, lives, and level tracking
   - Keyboard and mobile touch controls
   - Pause functionality

3. **Game Over** (`/gameover`)
   - Final score display
   - Game statistics (dots collected, ghosts eaten, level reached)
   - Social sharing
   - Play again or return to menu

### Gameplay Mechanics

- **Pac-Man Movement**: Arrow keys (↑↓←→) or WASD
- **Pause**: SPACE or ESC key
- **Mobile**: Swipe gestures or on-screen controls
- **Scoring**:
  - Regular dot: 10 points
  - Power pellet: 50 points
  - Ghost: 200, 400, 800, 1600 (combo multiplier)
  - Level completion bonus: 1000+ points

### Ghost AI

Each ghost has unique behavior patterns:

- **Blinky (Red)**: Directly targets Pac-Man
- **Pinky (Pink)**: Targets position ahead of Pac-Man
- **Inky (Cyan)**: Complex targeting based on Blinky's position
- **Clyde (Orange)**: Targets Pac-Man when far, scatters when close

## 🚀 Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:4006](http://localhost:4006) to play the game.

### Build

```bash
npm run build
npm start
```

## 🎨 Design System

The game uses a consistent design system inspired by classic arcade aesthetics:

- **Colors**: Bright neon colors on dark backgrounds
- **Typography**: Bold sans-serif fonts for clear readability
- **Animations**: Smooth 60fps character movement and UI transitions
- **Responsive**: Scales beautifully from mobile to desktop

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for detailed specifications.

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS variables
- **Rendering**: HTML5 Canvas for game graphics
- **State Management**: React hooks and refs for game state

### Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page (redirects to menu)
│   ├── menu/page.tsx     # Start menu
│   ├── game/page.tsx     # Main game board
│   └── gameover/page.tsx # Game over screen
├── lib/
│   ├── maze.ts           # Maze generation and collision detection
│   ├── ghostAI.ts        # Ghost behavior and pathfinding
│   ├── gameEngine.ts     # Core game logic and state management
│   └── gameRenderer.ts   # Canvas rendering functions
└── types/
    └── game.ts           # TypeScript type definitions
```

## 🎮 Controls

### Desktop
- **↑↓←→** or **WASD**: Move Pac-Man
- **SPACE**: Pause/Resume
- **ESC**: Pause

### Mobile
- **Swipe**: Move in swiped direction
- **On-screen buttons**: Directional controls and pause

## 🏆 High Scores

High scores are stored in browser localStorage. Challenge yourself to beat your best score!

## 🔧 Customization

The game is highly customizable through configuration files:

- `src/types/game.ts` - Game constants and difficulty settings
- `src/app/globals.css` - Color scheme and animations
- `src/lib/maze.ts` - Maze layout and structure

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Touch controls supported

## 🎯 Future Enhancements

Potential additions for expanded versions:

- Multiple maze designs
- Sound effects and music
- Online leaderboards
- Achievement system
- Additional game modes
- Power-up variations
- Custom maze editor

## 📄 License

This is a demo project for educational purposes.

## 🙏 Credits

Inspired by the original Pac-Man game by Namco (1980).
Reimagined with modern web technologies.

---

**Ready to play?** Launch the game and chase those high scores! 👾
