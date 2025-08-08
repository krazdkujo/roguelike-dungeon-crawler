#!/bin/bash
# Database Backup Script for Roguelike Dungeon Crawler

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="roguelike_dev"
BACKUP_FILE="${BACKUP_DIR}/backup_${DB_NAME}_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

echo -e "${BLUE}📦 Creating database backup...${NC}"
echo -e "${YELLOW}Database: ${DB_NAME}${NC}"
echo -e "${YELLOW}Backup file: ${BACKUP_FILE}${NC}"

# Create backup
docker-compose exec -T postgres pg_dump -U dev ${DB_NAME} > ${BACKUP_FILE}

# Compress the backup
gzip ${BACKUP_FILE}
BACKUP_FILE="${BACKUP_FILE}.gz"

echo -e "${GREEN}✅ Backup created successfully: ${BACKUP_FILE}${NC}"
echo -e "${BLUE}📊 Backup size: $(du -h ${BACKUP_FILE} | cut -f1)${NC}"

# Clean up old backups (keep last 7 days)
find ${BACKUP_DIR} -name "backup_${DB_NAME}_*.sql.gz" -type f -mtime +7 -delete

echo -e "${GREEN}🧹 Old backups cleaned up (keeping last 7 days)${NC}"

# List recent backups
echo -e "${BLUE}📋 Recent backups:${NC}"
ls -lah ${BACKUP_DIR}/backup_${DB_NAME}_*.sql.gz | tail -5