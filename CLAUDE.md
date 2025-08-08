# Roguelike Dungeon Crawler - Full-Stack Web Application

## Project Overview
A multiplayer, browser-based, asynchronous roguelike dungeon crawler where players team up to defeat bosses for loot. Built as a modern full-stack web application with Node.js backend, PostgreSQL database, React frontend, and real-time WebSocket multiplayer capabilities.

## Agent System Configuration

### Primary Agent Workflow
This project uses the expert agent team in `.claude/knowledge/agents/`. Always start with:
```
Use project-manager to [task description]
```

### Agent Hierarchy
```
🔵 Project Manager → Orchestrates all tasks
    ├─ 🩵 Research Specialist → Technology research
    ├─ 🟢 Backend Developer → API and server logic
    ├─ 🟡 Frontend Developer → UI and client-side
    ├─ 🟠 DevOps Specialist → Deployment and infrastructure
    ├─ 🔴 Security Specialist → Auth and security
    ├─ 🟪 QA Specialist → Testing and quality
    ├─ 🎨 Whimsy Director → UX optimization
    ├─ 🎮 UI/UX Game Designer → SNES JRPG visuals
    └─ 📖 Story-Writer/DM → Game content and balance

🟣 Development Manager → Critical review (consulted by PM)
```

### Agent Usage Rules
1. **ALWAYS use project-manager for new features/tasks**
2. **Project Manager logs all actions to `.claude/knowledge/logs/project-manager.log`**
3. **Decisions are documented in `.claude/knowledge/decisions.md`**
4. **Each specialist has their own log file**
5. **No direct implementation without PM orchestration**

## Commands to Run

### Current Development Setup
```bash
# Backend (Mock Server)
cd server && node src/simple-server.js

# Frontend (Vite Dev Server)
cd client && npm run dev

# Docker (Alternative)
docker-compose up -d
```

### Infrastructure Scripts
```bash
# Database setup (when using Prisma)
scripts/dev-setup.sh        # Linux/Mac
scripts/dev-setup.bat       # Windows

# Server management
scripts/restart-servers.bat # Windows restart utility
```

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

## Development Guidelines
1. **Always use sub-agents for research and complex searches**
2. **Use TodoWrite tool for all multi-step tasks**
3. **Follow SNES JRPG visual theme throughout**
4. **Implement real-time multiplayer with WebSockets**
5. **Server-authoritative game state for anti-cheat**
6. **Comprehensive testing at all application layers**
7. **Security-first approach with JWT authentication**

## Architecture Principles
- **Real-time multiplayer**: WebSocket connections for live gameplay
- **Security-focused**: Server validates all game actions
- **Scalable design**: Microservice-ready architecture
- **Modern stack**: Industry-standard full-stack web technologies
- **CI/CD pipeline**: Automated testing and deployment