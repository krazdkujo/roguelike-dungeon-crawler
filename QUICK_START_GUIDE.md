# Roguelike Dungeon Crawler - Quick Start Guide

## Prerequisites

1. **Docker Desktop** - MUST be installed and running
   - Download from: https://www.docker.com/products/docker-desktop
   - Ensure Docker is running before proceeding

2. **Git** (if not already installed)

## Instant Setup (Recommended)

### Option 1: Windows Automatic Setup
```bash
# Open Command Prompt or PowerShell as Administrator
cd "C:\Dev\Testing the Agent Swarm"
scripts\dev-setup.bat
```

### Option 2: Manual Setup (if script fails)

1. **Start the application:**
```bash
cd "C:\Dev\Testing the Agent Swarm"
docker-compose up -d
```

2. **Wait for services to start (30-60 seconds), then setup database:**
```bash
docker-compose exec server npm run db:setup
```

## Access the Application

Once setup is complete:

- **Frontend (Main App):** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Database:** localhost:5432 (dev/dev123)

## Testing Features

### 1. User Registration & Authentication
1. Go to http://localhost:3000
2. Click "Register" to create a new account
3. Fill in email, username, and password
4. Login with your credentials

### 2. Character Creation
1. After login, create your first character
2. Choose class: Warrior, Mage, or Rogue
3. Each class has different starting stats

### 3. Town Hub
1. Visit the Town page to see available options
2. Access character information
3. View available dungeons

### 4. Basic Combat (if implemented)
1. Enter a dungeon from the Town
2. Engage in turn-based combat
3. Use skills and items

## Troubleshooting

### If services won't start:
```bash
# Stop all services
docker-compose down

# Remove old containers and rebuild
docker-compose down --volumes
docker-compose build --no-cache
docker-compose up -d
```

### If database setup fails:
```bash
# Reset database
scripts\db-reset.bat

# Or manually:
docker-compose exec server npm run db:setup
```

### View logs:
```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f server

# Just frontend
docker-compose logs -f client
```

### Check service status:
```bash
docker-compose ps
```

## Expected Behavior

**Working Features:**
- User registration and login
- JWT-based authentication
- Character creation and selection
- Basic navigation between pages
- Database persistence
- Real-time updates via Socket.IO

**Known Limitations (MVP Phase 1):**
- Combat system may be basic/incomplete
- Limited dungeon content
- Basic UI styling
- No advanced features yet

## Support

If you encounter issues:

1. Ensure Docker Desktop is running
2. Check that ports 3000, 3001, 5432, and 6379 are available
3. Try the manual setup steps
4. Check Docker logs for specific error messages

## Next Steps

After confirming the application works:
1. Test all major user flows
2. Report any bugs or issues found
3. Provide feedback on user experience
4. Ready for Phase 2 development planning