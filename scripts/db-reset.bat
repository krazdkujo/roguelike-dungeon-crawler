@echo off
REM Database Reset Script for Roguelike Dungeon Crawler (Windows)

echo ⚠️  This will completely reset the database and all data will be lost!
set /p "confirm=Are you sure you want to continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Operation cancelled.
    pause
    exit /b 0
)

echo 🗄️ Resetting database...

REM Stop the server to prevent connection issues
echo Stopping server service...
docker-compose stop server

REM Reset database
echo Dropping database...
docker-compose exec postgres psql -U dev -c "DROP DATABASE IF EXISTS roguelike_dev;"

echo Creating fresh database...
docker-compose exec postgres psql -U dev -c "CREATE DATABASE roguelike_dev;"

REM Run migrations and seed
echo Running migrations...
docker-compose run --rm server npm run db:migrate:deploy

echo Seeding database...
docker-compose run --rm server npm run db:seed

REM Restart server
echo Restarting server...
docker-compose start server

echo ✅ Database reset complete!
pause