# 🚀 Crypto Asteroids

A blockchain-integrated Asteroids game with mobile-optimized controls and responsive scaling.

## Features

- 🎮 Classic Asteroids gameplay reimagined
- 📱 Mobile-optimized controls and display
  - Responsive scaling for different screen sizes
  - Touch controls optimized for mobile devices
  - Tap-to-shoot mechanics for asteroids
- 🔗 Blockchain Integration
  - Farcaster Frames integration
  - Web3 wallet connectivity
  - On-chain transactions

## Getting Started

This is a [NextJS](https://nextjs.org/) + TypeScript + React app with blockchain integration.

### Prerequisites

- Node.js (>=18.0.0)
- Yarn or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crypto-astroids.git
cd crypto-astroids
```

2. Install dependencies:
```bash
yarn
# or
npm install
```

3. Run the development server:
```bash
yarn dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

## Game Controls

### Desktop
- Arrow keys to move
- Spacebar to shoot
- Enter to start game

### Mobile
- Touch and drag anywhere to move
- Tap asteroids to shoot them
- Tap screen to start game

## Technical Details

### Mobile Optimization
- Dynamic scaling based on screen size
- Minimum scale of 1.5x for mobile devices
- Optimized base size (800) for better relative sizing
- Touch-friendly controls with intuitive mechanics

### Architecture
- React components for game elements
- Canvas-based rendering
- Collision detection system
- Physics engine for movement
- Mobile-specific optimizations
  - Enhanced friction for better control
  - Adjusted velocity limits
  - Touch-based targeting system

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
