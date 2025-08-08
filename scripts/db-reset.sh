#!/bin/bash
# Database Reset Script for Roguelike Dungeon Crawler

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  This will completely reset the database and all data will be lost!${NC}"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}Operation cancelled.${NC}"
    exit 0
fi

echo -e "${YELLOW}🗄️ Resetting database...${NC}"

# Stop the server to prevent connection issues
echo "Stopping server service..."
docker-compose stop server

# Reset database
echo "Dropping database..."
docker-compose exec postgres psql -U dev -c "DROP DATABASE IF EXISTS roguelike_dev;"

echo "Creating fresh database..."
docker-compose exec postgres psql -U dev -c "CREATE DATABASE roguelike_dev;"

# Run migrations and seed
echo "Running migrations..."
docker-compose run --rm server npm run db:migrate:deploy

echo "Seeding database..."
docker-compose run --rm server npm run db:seed

# Restart server
echo "Restarting server..."
docker-compose start server

echo -e "${GREEN}✅ Database reset complete!${NC}"