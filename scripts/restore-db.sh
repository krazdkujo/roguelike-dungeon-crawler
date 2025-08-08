#!/bin/bash
# Database Restore Script for Roguelike Dungeon Crawler

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups"
DB_NAME="roguelike_dev"

# Check if backup file is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Please provide a backup file.${NC}"
    echo -e "${BLUE}Usage: $0 <backup-file>${NC}"
    echo -e "${BLUE}Available backups:${NC}"
    ls -lah ${BACKUP_DIR}/backup_${DB_NAME}_*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
    echo -e "${RED}❌ Backup file not found: ${BACKUP_FILE}${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  This will completely replace the current database!${NC}"
echo -e "${YELLOW}Database: ${DB_NAME}${NC}"
echo -e "${YELLOW}Backup file: ${BACKUP_FILE}${NC}"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}Operation cancelled.${NC}"
    exit 0
fi

echo -e "${BLUE}🔄 Restoring database from backup...${NC}"

# Stop the server to prevent connection issues
echo "Stopping server service..."
docker-compose stop server

# Drop and recreate database
echo "Dropping existing database..."
docker-compose exec postgres psql -U dev -c "DROP DATABASE IF EXISTS ${DB_NAME};"

echo "Creating fresh database..."
docker-compose exec postgres psql -U dev -c "CREATE DATABASE ${DB_NAME};"

# Restore from backup
echo "Restoring data..."
if [[ ${BACKUP_FILE} == *.gz ]]; then
    # If file is compressed
    zcat ${BACKUP_FILE} | docker-compose exec -T postgres psql -U dev ${DB_NAME}
else
    # If file is not compressed
    cat ${BACKUP_FILE} | docker-compose exec -T postgres psql -U dev ${DB_NAME}
fi

# Restart server
echo "Restarting server..."
docker-compose start server

echo -e "${GREEN}✅ Database restored successfully!${NC}"