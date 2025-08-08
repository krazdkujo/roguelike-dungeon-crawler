@echo off
REM Development Setup Script for Roguelike Dungeon Crawler (Windows)

echo 🎮 Setting up Roguelike Dungeon Crawler development environment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 📄 Creating .env file from template...
    copy .env.example .env >nul
    echo ✅ Created .env file. Please review and customize the values.
) else (
    echo ✅ .env file already exists.
)

REM Create environment files for services if they don't exist
if not exist "server\.env" (
    echo 📄 Creating server\.env file...
    (
        echo NODE_ENV=development
        echo PORT=3001
        echo DATABASE_URL="postgresql://dev:dev123@postgres:5432/roguelike_dev?schema=public"
        echo REDIS_URL="redis://redis:6379"
        echo JWT_SECRET="your-super-secret-jwt-key-for-development"
        echo JWT_ACCESS_EXPIRY="15m"
        echo JWT_REFRESH_EXPIRY="7d"
        echo BCRYPT_ROUNDS=12
        echo CORS_ORIGIN="http://localhost:3000"
    ) > server\.env
    echo ✅ Created server\.env file.
)

if not exist "client\.env" (
    echo 📄 Creating client\.env file...
    (
        echo NODE_ENV=development
        echo VITE_API_URL=http://localhost:3001
    ) > client\.env
    echo ✅ Created client\.env file.
)

REM Build and start services
echo 🐳 Building Docker containers...
docker-compose build

echo 🚀 Starting services...
docker-compose up -d postgres redis

echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak >nul

REM Setup database
echo 🗄️ Setting up database...
docker-compose run --rm server npm run db:setup

echo 🎯 Starting all services...
docker-compose up -d

echo.
echo 🎉 Development environment is ready!
echo.
echo 📍 Services running at:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo    Database: localhost:5432
echo    Redis:    localhost:6379
echo.
echo 🔧 Useful commands:
echo    docker-compose logs -f          # View all logs
echo    docker-compose logs -f server   # View backend logs
echo    docker-compose logs -f client   # View frontend logs
echo    docker-compose down             # Stop all services
echo    docker-compose restart server   # Restart backend
echo    scripts\db-reset.bat            # Reset database
echo.
pause