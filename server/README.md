# Roguelike Dungeon Crawler - Backend Server

A Node.js/Express backend server with PostgreSQL database and Socket.io for real-time multiplayer functionality.

## Features

- **Authentication**: JWT-based auth with refresh tokens
- **Character Management**: Create and manage game characters with different classes
- **Real-time Multiplayer**: Socket.io for live dungeon exploration and combat
- **Turn-based Combat**: Strategic combat system with skills and items
- **Dungeon Instances**: Multi-player dungeon exploration
- **Database**: PostgreSQL with Prisma ORM

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis (optional, for session storage)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup**
   ```bash
   npm run db:setup
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Characters
- `GET /api/v1/characters` - List user's characters
- `POST /api/v1/characters` - Create new character
- `GET /api/v1/characters/:id` - Get character details
- `PUT /api/v1/characters/:id` - Update character
- `DELETE /api/v1/characters/:id` - Delete character
- `GET /api/v1/characters/classes` - Get available classes

### Dungeons
- `GET /api/v1/dungeons` - List available dungeons
- `GET /api/v1/dungeons/:id` - Get dungeon details
- `POST /api/v1/dungeons/:id/enter` - Enter dungeon
- `GET /api/v1/dungeons/instances/:id` - Get instance details
- `POST /api/v1/dungeons/instances/:id/leave` - Leave instance

### Combat
- `POST /api/v1/combat/start` - Start combat encounter
- `GET /api/v1/combat/:id` - Get combat state
- `POST /api/v1/combat/:id/action` - Perform combat action

## WebSocket Events

### Connection
- `ping` / `pong` - Connection testing
- Authentication required via token

### Combat Events
- `join-combat` - Join combat instance
- `combat-action` - Perform combat action
- `leave-combat` - Leave combat

### Dungeon Events
- `join-dungeon` - Join dungeon instance
- `dungeon-action` - Perform dungeon action
- `leave-dungeon` - Leave dungeon

## Character Classes

### Warrior
- High HP and Defense
- Strong physical attacks
- Tank role in combat

### Mage
- High MP and magical abilities
- Powerful spells with area effects
- Support and damage dealer

### Rogue
- High Speed and Luck
- Critical strikes and stealth
- DPS and utility role

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:setup` - Complete database setup
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Environment Variables

See `.env.example` for all available configuration options.

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3001)
- `CORS_ORIGIN` - Frontend URL for CORS (default: http://localhost:3000)

## Database Models

- **User** - User accounts and authentication
- **Session** - JWT refresh token sessions
- **Character** - Player characters with stats and progression
- **Dungeon** - Dungeon templates and layouts
- **DungeonInstance** - Active dungeon runs with players
- **Room** - Individual dungeon rooms
- **CombatInstance** - Active combat encounters
- **Item** - Game items and equipment
- **Skill** - Character abilities and spells
- **Guild** - Player organizations (Phase 2)

## Development

The server uses TypeScript with strict type checking. All API endpoints include:
- Input validation with express-validator
- Authentication middleware where required
- Comprehensive error handling
- Request/response logging

## Docker Support

The project includes a Dockerfile for containerized deployment:

```bash
docker build -t roguelike-server .
docker run -p 3001:3001 roguelike-server
```

## Contributing

1. Follow TypeScript best practices
2. Add input validation for all endpoints
3. Include proper error handling
4. Write tests for new features
5. Update this README for new endpoints/features