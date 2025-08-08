@echo off
echo.
echo ===================================================
echo 🧪 ROGUELIKE DUNGEON CRAWLER - QUICK CONNECTIVITY TEST
echo ===================================================
echo.

cd /d "C:\Dev\Testing the Agent Swarm"

echo Testing server connectivity...
echo.

echo 🔍 Testing Backend Health (Port 3005)...
curl -s -X GET http://localhost:3005/health 2>nul
if %errorlevel% neq 0 (
    echo ❌ Backend not responding on port 3005
) else (
    echo ✅ Backend responding on port 3005
)
echo.

echo 🔍 Testing Backend API Status...
curl -s -X GET http://localhost:3005/api/v1/status 2>nul
if %errorlevel% neq 0 (
    echo ❌ Backend API not responding
) else (
    echo ✅ Backend API responding
)
echo.

echo 🔍 Testing Frontend Proxy...
curl -s -X GET http://localhost:3003/api/v1/status 2>nul
if %errorlevel% neq 0 (
    echo ❌ Frontend proxy not working
    echo Note: Frontend server might not be running
) else (
    echo ✅ Frontend proxy working
)
echo.

echo 📊 Port Usage Check:
netstat -ano | findstr :3005 2>nul
if %errorlevel% neq 0 (
    echo ❌ No process listening on port 3005
) else (
    echo ✅ Process found on port 3005
)

netstat -ano | findstr :3003 2>nul
if %errorlevel% neq 0 (
    echo ❌ No process listening on port 3003
) else (
    echo ✅ Process found on port 3003
)

echo.
echo 🎯 Quick Test Complete!
echo.
echo If tests fail, run restart-servers.bat to start the servers
echo.
pause