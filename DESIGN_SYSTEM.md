# PAC-MAN GAME DESIGN SYSTEM

## Visual Specifications Extracted from Reference Image

### Color Palette

#### Primary Colors
- **Background Dark**: `#1a1d29` - Deep charcoal with slight blue tint
- **Background Darker**: `#0f1116` - Near black for depth
- **Pac-Man Yellow**: `#FFFF00` - Bright classic yellow
- **Ghost Red**: `#FF0000` - Blinky red
- **Ghost Pink**: `#FFB8FF` - Pinky pink
- **Ghost Cyan**: `#00FFFF` - Inky cyan
- **Ghost Orange**: `#FFB852` - Clyde orange

#### UI Colors
- **Primary Accent**: `#FFFF00` - Yellow for buttons and CTAs
- **Success Green**: `#10b981` - For positive actions
- **Text White**: `#FFFFFF` - Primary text
- **Text Gray**: `#9CA3AF` - Secondary text
- **Border Gray**: `#374151` - Subtle borders

#### Glow Effects
- **Yellow Glow**: `0 0 20px rgba(255, 255, 0, 0.6)`
- **Cyan Glow**: `0 0 15px rgba(0, 255, 255, 0.4)`
- **Pink Glow**: `0 0 15px rgba(255, 184, 255, 0.4)`
- **Red Glow**: `0 0 15px rgba(255, 0, 0, 0.4)`

### Typography

#### Font Families
- **Display/Retro**: `'Press Start 2P', monospace` - For scores and game UI
- **Body**: `system-ui, -apple-system, sans-serif` - For menus and information

#### Font Sizes (Retro Scale)
- **Score/Title Large**: `32px` / `2rem`
- **Game Stats**: `16px` / `1rem`
- **Menu Items**: `14px` / `0.875rem`
- **Small Labels**: `12px` / `0.75rem`

#### Font Weights
- **Normal**: `400`
- **Bold**: `700`

### Spacing System (8px Grid)

- **Base Unit**: `8px`
- **Tight**: `8px` (1 unit)
- **Normal**: `16px` (2 units)
- **Relaxed**: `24px` (3 units)
- **Loose**: `32px` (4 units)
- **Extra Loose**: `48px` (6 units)

### Component Patterns

#### Buttons
- **Primary Button**: Yellow background, dark text, rounded corners (8px)
- **Hover State**: Brighten yellow, add shadow
- **Active State**: Slightly darker yellow, pressed effect

#### Panels/Cards
- **Background**: Semi-transparent dark (#1a1d29 with 0.95 opacity)
- **Border**: 2px solid with subtle gray (#374151)
- **Border Radius**: `12px`
- **Padding**: `24px`

#### Game Board
- **Aspect Ratio**: Square (1:1) or slightly wider
- **Max Width**: `600px` on desktop
- **Border**: Neon cyan glow effect
- **Background**: Deep black (#000000)

### Layout Structure

#### Responsive Breakpoints
- **Mobile**: `< 640px` - Stack vertically
- **Tablet**: `640px - 1024px` - Hybrid layout
- **Desktop**: `> 1024px` - Full layout with side panels

#### Grid System
- **Game Board**: Centered, fixed aspect ratio
- **UI Panels**: Positioned around game board
- **Controls**: Bottom overlay on mobile, side panel on desktop

### Animation Specifications

#### Character Movement
- **Frame Rate**: 60fps (16ms updates)
- **Pac-Man Mouth**: Animate open/close every 200ms
- **Ghost Movement**: Smooth linear interpolation
- **Power Mode**: Flashing effect every 500ms

#### UI Animations
- **Button Hover**: 200ms ease-in-out
- **Panel Transitions**: 300ms ease-in-out
- **Score Count Up**: 1000ms ease-out
- **Game Over**: 500ms fade-in

### Icon & Asset Styles

#### Maze Elements
- **Walls**: Neon blue outline (#00FFFF), 2px stroke
- **Dots**: White circles, 4px diameter, subtle pulse
- **Power Pellets**: White circles, 12px diameter, glow effect

#### Character Sprites
- **Pac-Man**: Solid yellow circle, directional wedge cut
- **Ghosts**: Rounded top, wavy bottom (3 waves), 2 white eyes
- **Scared Ghosts**: Dark blue (#0000AA), white mouth pattern

### Visual Hierarchy

1. **Primary Focus**: Game board and characters
2. **Secondary**: Score and lives display
3. **Tertiary**: Level indicator and high scores
4. **Background**: Feature icons and decorative elements

### Accessibility Considerations

- **High Contrast**: Bright colors on dark background
- **Focus States**: Yellow outline for keyboard navigation
- **Text Size**: Minimum 12px for readability
- **Color Blind Friendly**: Use patterns + colors for ghosts

---

## Asset Generation Strategy

### Nested Images from Reference

#### Feature Icons (from reference image)
1. **Maze Icon** (Innovation) - Yellow maze pattern in square
2. **Pac-Man Icon** (Growth) - Cyan circular design with lines
3. **Ghost Icon** (Strategy) - Pink pixel ghost character

#### Icon Style Treatment
- **Size**: 64x64px to 128x128px
- **Style**: Neon outline on dark background
- **Glow**: Matching color glow effect
- **Border Radius**: 8px for containing squares

### CSS-Based Graphics

#### Pac-Man Character
```css
.pacman {
  width: 32px;
  height: 32px;
  background: #FFFF00;
  border-radius: 50%;
  position: relative;
  clip-path: polygon(50% 50%, 0% 0%, 0% 100%);
}
```

#### Ghost Characters
```css
.ghost {
  width: 28px;
  height: 32px;
  border-radius: 14px 14px 0 0;
  background: var(--ghost-color);
  position: relative;
}
.ghost::after {
  content: '';
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 8px;
  background:
    radial-gradient(circle at 25% 0, transparent 0, transparent 50%, var(--ghost-color) 50%);
}
```

### Stock Photo Needs
- **None required** - Game uses pure CSS graphics and geometric shapes

---

## Implementation Checklist

- [x] Color palette defined
- [x] Typography scale established
- [x] Spacing system documented
- [x] Component patterns specified
- [x] Animation timings defined
- [x] Asset strategy outlined
- [x] Responsive breakpoints set
- [x] Accessibility guidelines noted
