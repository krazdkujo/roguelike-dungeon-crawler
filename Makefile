# Makefile for Roguelike Dungeon Crawler
.PHONY: help dev build up down logs clean test db-reset db-migrate db-seed

# Default target
help: ## Show this help message
	@echo "Roguelike Dungeon Crawler - Development Commands"
	@echo "================================================"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# Development commands
dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	@docker-compose up -d
	@echo "✅ Services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:3001"

build: ## Build all containers
	@echo "🐳 Building containers..."
	@docker-compose build

up: ## Start all services
	@docker-compose up -d

down: ## Stop all services
	@docker-compose down

logs: ## Show logs from all services
	@docker-compose logs -f

logs-server: ## Show backend logs
	@docker-compose logs -f server

logs-client: ## Show frontend logs
	@docker-compose logs -f client

logs-db: ## Show database logs
	@docker-compose logs -f postgres

# Database commands
db-setup: ## Setup database (migrate and seed)
	@echo "🗄️ Setting up database..."
	@docker-compose run --rm server npm run db:setup

db-migrate: ## Run database migrations
	@docker-compose run --rm server npm run db:migrate

db-seed: ## Seed database with sample data
	@docker-compose run --rm server npm run db:seed

db-reset: ## Reset database (WARNING: destroys all data)
	@echo "⚠️ This will destroy all data!"
	@read -p "Continue? (y/N): " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		./scripts/db-reset.sh; \
	else \
		echo "Operation cancelled."; \
	fi

# Testing commands
test: ## Run all tests
	@echo "🧪 Running tests..."
	@docker-compose run --rm server npm test
	@docker-compose run --rm client npm test

test-server: ## Run backend tests
	@docker-compose run --rm server npm test

test-client: ## Run frontend tests
	@docker-compose run --rm client npm test

# Utility commands
clean: ## Clean up containers and volumes
	@echo "🧹 Cleaning up..."
	@docker-compose down -v
	@docker system prune -f

restart: ## Restart all services
	@docker-compose restart

restart-server: ## Restart backend service
	@docker-compose restart server

restart-client: ## Restart frontend service
	@docker-compose restart client

# Health checks
health: ## Check service health
	@echo "🏥 Checking service health..."
	@curl -f http://localhost:3001/health || echo "Backend unhealthy"
	@curl -f http://localhost:3000/health || echo "Frontend unhealthy"

# Production commands
prod-build: ## Build for production
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

prod-up: ## Start production environment
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

prod-down: ## Stop production environment
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml down