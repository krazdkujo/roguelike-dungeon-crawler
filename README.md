# Roguelike Dungeon Crawler

A multiplayer, browser-based, asynchronous roguelike dungeon crawler where players team up to defeat bosses for loot. Built as a modern full-stack web application with Node.js backend, PostgreSQL database, React frontend, and real-time WebSocket multiplayer capabilities.

## Technology Stack

- **Backend**: Node.js + Express + Socket.io + PostgreSQL + Redis
- **Frontend**: React + TypeScript + Redux Toolkit
- **Infrastructure**: Docker + GitHub Actions + DigitalOcean/AWS
- **Security**: JWT authentication + comprehensive security measures
- **Testing**: Jest + Playwright + Artillery

## Project Structure

```
roguelike-dungeon-crawler/
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── socket/         # WebSocket handlers
│   │   └── utils/          # Helper functions
│   ├── tests/
│   ├── prisma/             # Database schema & migrations
│   └── package.json
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── stores/         # Redux stores
│   │   ├── services/       # API services
│   │   ├── game/           # Game logic
│   │   └── styles/         # SCSS styles
│   ├── public/
│   ├── tests/
│   └── package.json
├── docker-compose.yml      # Local development
└── .github/workflows/      # CI/CD pipelines
```

## Features Implemented

### ✅ Authentication System
- User registration and login
- JWT token-based authentication
- Protected routes and middleware

### ✅ Character Management
- Character creation with multiple classes (Warrior, Mage, Rogue)
- Character stats and progression
- Equipment system with stat bonuses

### ✅ Inventory & Equipment System
- Item management with stackable materials
- Equipment slots (weapon, armor, shield)
- Stat calculations with equipment bonuses

### ✅ Crafting System
- Material-based crafting recipes
- Inventory management for materials and crafted items
- Recipe discovery and crafting interface

### ✅ Dungeon System
- Dungeon instances for multiplayer sessions
- Room navigation and exploration
- Instance management and player tracking

### ✅ Combat System
- Turn-based combat mechanics
- Damage calculation and health management
- Loot generation and rewards
- Combat state management

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/krazdkujo/roguelike-dungeon-crawler.git
cd roguelike-dungeon-crawler
```

2. Start the development environment:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Testing

The backend includes comprehensive test scripts:

```bash
# Test all endpoints
node server/test-endpoints.js

# Test combat and loot system
node server/test-combat-loot.js
```

## Architecture Principles

- **Real-time multiplayer**: WebSocket connections for live gameplay
- **Security-focused**: Server validates all game actions
- **Scalable design**: Microservice-ready architecture
- **Modern stack**: Industry-standard full-stack web technologies
- **CI/CD pipeline**: Automated testing and deployment

## Current Status

The application is in active development with core systems implemented:
- ✅ Backend API with mock data storage
- ✅ Frontend React application with Redux state management
- ✅ Character creation and management
- ✅ Inventory and equipment systems
- ✅ Crafting system with materials and recipes
- ✅ Combat system with loot generation
- ✅ Dungeon exploration mechanics

## Development Notes

The project currently uses a simplified mock backend (`simple-server.js`) to bypass Prisma SSL issues in the Docker environment. All core functionality is implemented and tested.

## Development
See `CLAUDE.md` for development guidelines and sub-agent usage patterns.