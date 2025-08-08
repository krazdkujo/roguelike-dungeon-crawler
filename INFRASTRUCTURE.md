# Infrastructure Setup - Roguelike Dungeon Crawler

## Overview
This document describes the Docker-based development and production infrastructure for the Roguelike Dungeon Crawler game.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   Frontend      │    │   Backend       │
│   (Load Bal.)   │◄──►│   (React/Vite)  │◄──►│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Redis Cache   │◄──►│   PostgreSQL    │
                       │                 │    │   Database      │
                       └─────────────────┘    └─────────────────┘
```

## Services

### Frontend (React + Vite)
- **Port:** 3000 (development), 80/443 (production)
- **Technology:** React, TypeScript, Vite, SCSS
- **Features:** Hot reloading, optimized builds, Nginx serving in production

### Backend (Node.js + Express)
- **Port:** 3001
- **Technology:** Node.js, Express, TypeScript, Socket.io
- **Features:** REST API, WebSocket connections, JWT authentication, rate limiting

### Database (PostgreSQL)
- **Port:** 5432
- **Technology:** PostgreSQL 15 with Alpine Linux
- **Features:** Persistent storage, automated backups, initialization scripts

### Cache (Redis)
- **Port:** 6379
- **Technology:** Redis 7 with Alpine Linux
- **Features:** Session storage, caching, pub/sub for real-time features

### Load Balancer (Nginx)
- **Ports:** 80, 443
- **Features:** SSL termination, static file serving, API proxying, WebSocket support

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git for version control
- Make (optional, for convenience commands)

### Development Setup

1. **Clone and setup environment:**
```bash
git clone <repository-url>
cd roguelike-dungeon-crawler
cp .env.example .env
# Edit .env file with your configuration
```

2. **Start development environment:**
```bash
# Using scripts
./scripts/dev-setup.sh    # Linux/Mac
./scripts/dev-setup.bat   # Windows

# Or using Make
make dev

# Or using Docker Compose directly
docker-compose up -d
```

3. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432
- Redis: localhost:6379

## Available Commands

### Using Make
```bash
make help              # Show all available commands
make dev               # Start development environment
make build             # Build all containers
make up                # Start services
make down              # Stop services
make logs              # Show all logs
make logs-server       # Show backend logs
make logs-client       # Show frontend logs
make db-setup          # Setup database
make db-reset          # Reset database (WARNING: destroys data)
make test              # Run all tests
make clean             # Clean up containers and volumes
```

### Using Docker Compose Directly
```bash
docker-compose up -d                    # Start all services
docker-compose down                     # Stop all services
docker-compose logs -f                  # Show logs
docker-compose run --rm server npm test # Run backend tests
docker-compose restart server           # Restart backend
```

### Using Scripts
```bash
./scripts/dev-setup.sh     # Full development setup
./scripts/db-reset.sh      # Reset database
./scripts/backup-db.sh     # Create database backup
./scripts/restore-db.sh    # Restore database from backup
```

## Environment Configuration

### Development (.env)
```bash
NODE_ENV=development
DATABASE_URL="postgresql://dev:dev123@postgres:5432/roguelike_dev"
REDIS_URL="redis://redis:6379"
JWT_SECRET="your-development-secret"
CORS_ORIGIN="http://localhost:3000"
```

### Production (.env.prod)
```bash
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@prod-db:5432/roguelike_prod"
REDIS_URL="redis://user:pass@prod-redis:6379"
JWT_SECRET="your-super-secure-production-secret"
CORS_ORIGIN="https://yourdomain.com"
```

## Database Management

### Migrations
```bash
# Run migrations
docker-compose run --rm server npm run db:migrate

# Deploy migrations (production)
docker-compose run --rm server npm run db:migrate:deploy

# Generate Prisma client
docker-compose run --rm server npm run db:generate
```

### Backup & Restore
```bash
# Create backup
./scripts/backup-db.sh

# Restore from backup
./scripts/restore-db.sh ./backups/backup_roguelike_dev_20240807_120000.sql.gz

# View available backups
ls -la ./backups/
```

### Seeding
```bash
# Seed database with sample data
docker-compose run --rm server npm run db:seed

# Full database setup (migrate + seed)
docker-compose run --rm server npm run db:setup
```

## Production Deployment

### Using Production Compose File
```bash
# Build for production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start production environment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Or using Make
make prod-build
make prod-up
```

### Production Considerations
1. **SSL Certificates:** Place SSL certificates in `./ssl/` directory
2. **Environment Variables:** Use production-specific `.env` file
3. **Database:** Use managed database service (AWS RDS, Google Cloud SQL, etc.)
4. **Redis:** Use managed Redis service (AWS ElastiCache, Redis Cloud, etc.)
5. **Load Balancing:** Configure multiple backend instances
6. **Monitoring:** Set up logging and monitoring solutions

## Development Workflow

### Hot Reloading
Both frontend and backend support hot reloading in development:
- Frontend: Vite handles hot module replacement
- Backend: tsx watch provides automatic restarts

### Testing
```bash
# Run all tests
make test

# Run backend tests only
docker-compose run --rm server npm test

# Run frontend tests only
docker-compose run --rm client npm test

# Run tests in watch mode
docker-compose run --rm server npm run test:watch
```

### Debugging
1. **View Logs:**
```bash
docker-compose logs -f server  # Backend logs
docker-compose logs -f client  # Frontend logs
docker-compose logs -f postgres # Database logs
```

2. **Connect to Services:**
```bash
# Backend shell
docker-compose exec server sh

# Database shell
docker-compose exec postgres psql -U dev roguelike_dev

# Redis shell
docker-compose exec redis redis-cli
```

## Health Checks

All services include health checks:
- **Backend:** GET /health
- **Frontend:** GET /health (via Nginx)
- **Database:** pg_isready
- **Redis:** redis-cli ping

Check service health:
```bash
make health
# Or manually
curl http://localhost:3001/health
curl http://localhost:3000/health
```

## Troubleshooting

### Common Issues

1. **Port Conflicts:**
```bash
# Check what's using the ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001
netstat -tulpn | grep :5432
```

2. **Database Connection Issues:**
```bash
# Check database logs
docker-compose logs postgres

# Test database connection
docker-compose exec postgres pg_isready -U dev
```

3. **Permission Issues:**
```bash
# Fix file permissions
chmod +x ./scripts/*.sh
sudo chown -R $USER:$USER ./
```

4. **Clean Start:**
```bash
# Clean everything and start fresh
make clean
docker system prune -a
make dev
```

### Performance Tuning

1. **Increase Docker Resources:**
- Allocate more CPU and memory to Docker
- Increase disk space for containers

2. **Database Optimization:**
- Configure PostgreSQL settings in docker-compose.yml
- Add database connection pooling

3. **Redis Configuration:**
- Configure Redis memory policies
- Set up Redis persistence options

## Security Considerations

1. **Environment Variables:** Never commit .env files
2. **Database:** Use strong passwords and connection encryption
3. **JWT Secrets:** Use cryptographically secure secrets
4. **CORS:** Configure appropriate CORS origins
5. **Rate Limiting:** Implemented at both Nginx and application level
6. **SSL/TLS:** Use HTTPS in production
7. **Container Security:** Run containers as non-root users

## Monitoring and Logging

### Logs Location
- Application logs: Docker Compose logs
- Nginx logs: `/var/log/nginx/` in container
- Database logs: PostgreSQL container logs

### Recommended Monitoring
- **Application Performance:** New Relic, DataDog
- **Infrastructure:** Prometheus + Grafana
- **Logs:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Uptime:** UptimeRobot, Pingdom

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Docker Compose logs
3. Consult the development team
4. Create an issue in the project repository