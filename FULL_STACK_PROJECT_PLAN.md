# Roguelike Dungeon Crawler - Full-Stack Web Application Plan

## Project Overview
A multiplayer, browser-based, asynchronous roguelike dungeon crawler where players team up to defeat bosses for loot. Built as a modern full-stack web application with real-time multiplayer capabilities.

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15+
- **Cache/Sessions**: Redis
- **Real-time**: Socket.io
- **Authentication**: JWT with refresh tokens
- **Background Jobs**: Bull Queue
- **ORM**: Prisma or Sequelize

### Frontend
- **Framework**: React 18 + TypeScript
- **State Management**: Redux Toolkit
- **Styling**: SCSS with SNES JRPG theme
- **Real-time Client**: Socket.io-client
- **HTTP Client**: Axios
- **Build Tool**: Vite

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose
- **Deployment**: DigitalOcean App Platform (MVP) → AWS (Scale)
- **CI/CD**: GitHub Actions
- **CDN**: CloudFront (AWS) or DigitalOcean Spaces
- **Monitoring**: PM2, New Relic, or DataDog

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React Client  │────▶│  Express API    │────▶│   PostgreSQL    │
│   (Frontend)    │◀────│   (Backend)     │◀────│   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                        │
         │                        │
         │               ┌─────────────────┐
         └──────────────▶│     Redis       │
           Socket.io     │  (Cache/Queue)  │
                        └─────────────────┘
```

## Database Schema

### Core Tables
```sql
-- Users & Authentication
Users (id, email, username, password_hash, created_at, updated_at)
Sessions (id, user_id, refresh_token, expires_at)

-- Game Data
Characters (id, user_id, name, class, level, stats_json, created_at)
Dungeons (id, name, difficulty, max_players, layout_json)
DungeonInstances (id, dungeon_id, players_json, state, created_at)
Rooms (id, dungeon_id, position_x, position_y, type, monsters_json)

-- Combat & Items
CombatInstances (id, instance_id, participants_json, turn_order, current_turn)
Items (id, name, type, stats_json, rarity, description)
CharacterInventories (id, character_id, item_id, quantity, equipped)
Skills (id, name, class, level_required, effect_json, description)
CharacterSkills (character_id, skill_id, learned_at)

-- Guilds & Social
Guilds (id, name, leader_id, description, created_at)
GuildMembers (guild_id, user_id, role, joined_at)
```

## API Architecture

### REST Endpoints
```
/api/v1/
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /refresh
│   └── POST /logout
├── /characters
│   ├── GET / (list user's characters)
│   ├── POST / (create character)
│   ├── GET /:id
│   ├── PUT /:id
│   └── DELETE /:id
├── /dungeons
│   ├── GET / (list available dungeons)
│   ├── POST /:id/enter (join dungeon instance)
│   └── GET /instances/:id (get instance state)
├── /inventory
│   ├── GET /:characterId
│   ├── POST /:characterId/items (add item)
│   └── PUT /:characterId/items/:itemId (equip/unequip)
├── /skills
│   ├── GET /:characterId (learned skills)
│   └── POST /:characterId/learn (learn new skill)
└── /leaderboards
    ├── GET /characters (top characters)
    └── GET /guilds (top guilds)
```

### WebSocket Events
```javascript
// Client to Server
'join-dungeon' -> { dungeonInstanceId, characterId }
'combat-action' -> { action, target, skillId? }
'move' -> { direction, roomId }
'use-item' -> { itemId, target? }

// Server to Client
'dungeon-state' -> { instance, players, currentRoom }
'combat-update' -> { combatState, turnOrder, damage }
'player-joined' -> { player }
'player-left' -> { playerId }
'loot-drop' -> { items, location }
```

## Security Implementation

### Authentication & Authorization
```javascript
// JWT Configuration
ACCESS_TOKEN_EXPIRY = '15m'
REFRESH_TOKEN_EXPIRY = '7d'
JWT_SECRET = process.env.JWT_SECRET
BCRYPT_ROUNDS = 12

// Middleware Stack
app.use(helmet()) // Security headers
app.use(cors(corsConfig))
app.use(rateLimit) // Rate limiting
app.use(authenticateJWT) // JWT validation
```

### Game Security
- Server-side validation for all game actions
- Anti-cheat checks for impossible moves/damage
- Input sanitization and parameterized queries
- Encrypted WebSocket connections (WSS)
- Action rate limiting to prevent spam

## Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── auth/           # Login, Register components
│   ├── character/      # Character creation, stats
│   ├── dungeon/        # Dungeon exploration UI
│   ├── combat/         # Turn-based combat interface
│   ├── inventory/      # Item management
│   ├── skills/         # Skill trees and learning
│   └── ui/            # Reusable UI components
├── stores/
│   ├── authStore.ts
│   ├── gameStore.ts
│   ├── combatStore.ts
│   └── uiStore.ts
├── services/
│   ├── api.ts         # HTTP client
│   ├── socket.ts      # WebSocket client
│   └── auth.ts        # Auth utilities
├── game/
│   ├── GameEngine.ts  # Core game logic
│   ├── Combat.ts      # Combat calculations
│   └── Utils.ts       # Helper functions
└── styles/
    ├── themes/        # SNES JRPG styling
    ├── components/    # Component-specific styles
    └── globals.scss   # Global styles
```

### State Management
```typescript
// Redux Store Structure
interface RootState {
  auth: {
    user: User | null
    token: string | null
    isAuthenticated: boolean
  }
  game: {
    currentCharacter: Character | null
    dungeonInstance: DungeonInstance | null
    inventory: Item[]
    skills: Skill[]
  }
  combat: {
    isInCombat: boolean
    combatState: CombatState | null
    turnOrder: string[]
    currentTurn: string
  }
  ui: {
    notifications: Notification[]
    activeModal: string | null
    loading: boolean
  }
}
```

## Development Workflow

### Local Development Setup
```bash
# Backend setup
cd server
npm install
npm run db:setup    # Setup PostgreSQL + Redis
npm run db:migrate  # Run database migrations
npm run dev         # Start development server

# Frontend setup
cd client
npm install
npm run dev         # Start React development server
```

### Docker Development
```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: roguelike_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
  
  redis:
    image: redis:7-alpine
  
  server:
    build: ./server
    depends_on: [db, redis]
    ports: ["3001:3001"]
  
  client:
    build: ./client
    ports: ["3000:3000"]
```

## Testing Strategy

### Backend Testing
```javascript
// Unit Tests (Jest)
describe('Combat System', () => {
  test('calculates damage correctly', () => {
    // Test combat calculations
  })
  test('validates turn order', () => {
    // Test turn-based logic
  })
})

// Integration Tests
describe('API Endpoints', () => {
  test('POST /api/v1/characters creates character', async () => {
    // Test API integration
  })
})

// Load Testing (Artillery)
artillery run load-test.yml
```

### Frontend Testing
```javascript
// Component Tests (React Testing Library)
describe('CharacterCreation', () => {
  test('renders character creation form', () => {
    render(<CharacterCreation />)
    expect(screen.getByText('Create Character')).toBeInTheDocument()
  })
})

// E2E Tests (Playwright)
describe('Game Flow', () => {
  test('complete dungeon run', async ({ page }) => {
    await page.goto('/login')
    // Test full game flow
  })
})
```

## Deployment Strategy

### Staging Environment
- DigitalOcean App Platform
- Managed PostgreSQL database
- Managed Redis instance
- Automated deployment on merge to `develop`

### Production Environment
```
AWS Infrastructure:
├── Application Load Balancer
├── ECS Fargate (Auto-scaling containers)
├── RDS PostgreSQL (Multi-AZ)
├── ElastiCache Redis
├── S3 + CloudFront (Static assets)
└── Route 53 (DNS)
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      
  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to DigitalOcean
        run: doctl apps create-deployment
      
  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS
        run: aws ecs update-service
```

## Project Phases

### Phase 1: MVP Foundation (4-6 weeks)
- [ ] Basic authentication system
- [ ] Character creation and management
- [ ] Simple dungeon exploration
- [ ] Basic combat system
- [ ] PostgreSQL database setup
- [ ] WebSocket real-time updates

### Phase 2: Core Gameplay (4-6 weeks)
- [ ] Full combat system with skills
- [ ] Inventory and item management
- [ ] Multiple dungeon types
- [ ] Loot generation system
- [ ] Guild/party system
- [ ] Basic admin panel

### Phase 3: Polish & Scale (4-6 weeks)
- [ ] Advanced skill trees
- [ ] Leaderboards and achievements
- [ ] Enhanced SNES JRPG styling
- [ ] Performance optimizations
- [ ] Advanced anti-cheat measures
- [ ] Production deployment

### Phase 4: Advanced Features (Ongoing)
- [ ] PvP combat modes
- [ ] Seasonal events
- [ ] Advanced guild features
- [ ] Mobile responsiveness
- [ ] API rate limiting improvements
- [ ] Advanced analytics

## File Structure

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
│   ├── Dockerfile
│   └── package.json
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── stores/         # Redux stores
│   │   ├── services/       # API services
│   │   ├── game/           # Game logic
│   │   ├── styles/         # SCSS styles
│   │   └── types/          # TypeScript types
│   ├── public/
│   ├── tests/
│   └── package.json
├── docker-compose.yml      # Local development
├── .github/workflows/      # CI/CD pipelines
└── docs/                   # Project documentation
```

## Success Metrics

### Technical Metrics
- Server response time < 100ms for API calls
- WebSocket message latency < 50ms
- Support for 100+ concurrent players
- 99.9% uptime in production
- < 2 second page load times

### Game Metrics
- Average session duration > 30 minutes
- Player retention > 60% after 7 days
- < 5% churn rate monthly
- Positive user feedback score > 4.0/5.0

## Risk Mitigation

### Technical Risks
- **Database performance**: Implement read replicas and caching
- **WebSocket scaling**: Use Redis adapter for Socket.io clustering  
- **Security vulnerabilities**: Regular security audits and updates
- **Data loss**: Automated backups every 6 hours

### Business Risks
- **Player engagement**: Regular content updates and events
- **Scaling costs**: Monitor usage and optimize infrastructure
- **Competition**: Focus on unique multiplayer cooperative features

---

This comprehensive plan provides a modern, scalable foundation for the roguelike dungeon crawler as a proper full-stack web application, removing all dependencies on no-code/low-code platforms and implementing industry-standard web development practices.