#!/bin/bash
# Infrastructure Test Script for Roguelike Dungeon Crawler

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testing Roguelike Dungeon Crawler Infrastructure...${NC}"

# Function to test service health
test_service() {
    local service=$1
    local url=$2
    local name=$3
    
    echo -n -e "${YELLOW}Testing ${name}...${NC} "
    
    if curl -f -s "${url}" > /dev/null; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Function to check if service is running
check_service_running() {
    local service=$1
    echo -n -e "${YELLOW}Checking ${service} container...${NC} "
    
    if docker-compose ps | grep -q "${service}.*Up"; then
        echo -e "${GREEN}✅ Running${NC}"
        return 0
    else
        echo -e "${RED}❌ Not running${NC}"
        return 1
    fi
}

# Start services if not running
echo -e "${BLUE}📋 Checking service status...${NC}"
if ! docker-compose ps | grep -q "Up"; then
    echo -e "${YELLOW}Starting services...${NC}"
    docker-compose up -d
    echo -e "${YELLOW}Waiting for services to start...${NC}"
    sleep 30
fi

echo -e "${BLUE}🔍 Container Status Check:${NC}"
check_service_running "postgres" || exit 1
check_service_running "redis" || exit 1  
check_service_running "server" || exit 1
check_service_running "client" || exit 1

echo -e "${BLUE}🌐 Health Check Tests:${NC}"
test_service "backend" "http://localhost:3001/health" "Backend API"
test_service "frontend" "http://localhost:3000" "Frontend"

echo -e "${BLUE}💾 Database Connection Test:${NC}"
echo -n -e "${YELLOW}Testing database connection...${NC} "
if docker-compose exec -T postgres pg_isready -U dev > /dev/null; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
    exit 1
fi

echo -e "${BLUE}🔄 Redis Connection Test:${NC}"
echo -n -e "${YELLOW}Testing Redis connection...${NC} "
if docker-compose exec -T redis redis-cli ping | grep -q "PONG"; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
    exit 1
fi

echo -e "${BLUE}🗄️ Database Schema Test:${NC}"
echo -n -e "${YELLOW}Checking database schema...${NC} "
if docker-compose exec -T postgres psql -U dev roguelike_dev -c "\dt" | grep -q "users"; then
    echo -e "${GREEN}✅ Schema exists${NC}"
else
    echo -e "${YELLOW}⚠️ Running database setup...${NC}"
    docker-compose run --rm server npm run db:setup
    if docker-compose exec -T postgres psql -U dev roguelike_dev -c "\dt" | grep -q "users"; then
        echo -e "${GREEN}✅ Schema created${NC}"
    else
        echo -e "${RED}❌ Schema creation failed${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}📊 Service Logs (last 10 lines):${NC}"
echo -e "${YELLOW}Backend logs:${NC}"
docker-compose logs --tail=10 server

echo -e "${YELLOW}Frontend logs:${NC}"
docker-compose logs --tail=10 client

echo -e "${GREEN}"
echo "🎉 All infrastructure tests passed!"
echo ""
echo "📍 Services are running at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001" 
echo "   Backend Health: http://localhost:3001/health"
echo ""
echo "🔧 Next steps:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Test user registration and login"
echo "   3. Create a character and explore the game"
echo "   4. Monitor logs with: docker-compose logs -f"
echo "${NC}"