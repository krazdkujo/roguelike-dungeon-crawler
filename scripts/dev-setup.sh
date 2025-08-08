#!/bin/bash
# Development Setup Script for Roguelike Dungeon Crawler

set -e

echo "🎮 Setting up Roguelike Dungeon Crawler development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}📄 Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file. Please review and customize the values.${NC}"
else
    echo -e "${GREEN}✅ .env file already exists.${NC}"
fi

# Create environment files for services if they don't exist
if [ ! -f server/.env ]; then
    echo -e "${BLUE}📄 Creating server/.env file...${NC}"
    cat > server/.env << EOF
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://dev:dev123@postgres:5432/roguelike_dev?schema=public"
REDIS_URL="redis://redis:6379"
JWT_SECRET="your-super-secret-jwt-key-for-development"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"
BCRYPT_ROUNDS=12
CORS_ORIGIN="http://localhost:3000"
EOF
    echo -e "${GREEN}✅ Created server/.env file.${NC}"
fi

if [ ! -f client/.env ]; then
    echo -e "${BLUE}📄 Creating client/.env file...${NC}"
    cat > client/.env << EOF
NODE_ENV=development
VITE_API_URL=http://localhost:3001
EOF
    echo -e "${GREEN}✅ Created client/.env file.${NC}"
fi

# Build and start services
echo -e "${BLUE}🐳 Building Docker containers...${NC}"
docker-compose build

echo -e "${BLUE}🚀 Starting services...${NC}"
docker-compose up -d postgres redis

echo -e "${BLUE}⏳ Waiting for database to be ready...${NC}"
sleep 10

# Setup database
echo -e "${BLUE}🗄️ Setting up database...${NC}"
docker-compose run --rm server npm run db:setup

echo -e "${BLUE}🎯 Starting all services...${NC}"
docker-compose up -d

echo -e "${GREEN}"
echo "🎉 Development environment is ready!"
echo ""
echo "📍 Services running at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001" 
echo "   Database: localhost:5432"
echo "   Redis:    localhost:6379"
echo ""
echo "🔧 Useful commands:"
echo "   docker-compose logs -f          # View all logs"
echo "   docker-compose logs -f server   # View backend logs"
echo "   docker-compose logs -f client   # View frontend logs"
echo "   docker-compose down             # Stop all services"
echo "   docker-compose restart server   # Restart backend"
echo "   ./scripts/db-reset.sh           # Reset database"
echo "${NC}"