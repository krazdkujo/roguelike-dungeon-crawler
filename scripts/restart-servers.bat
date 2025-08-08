@echo off
echo.
echo ===================================================
echo 🚀 ROGUELIKE DUNGEON CRAWLER - SERVER STARTUP
echo ===================================================
echo.
echo Starting servers with corrected port configuration...
echo Backend: Port 3005
echo Frontend: Port 3003 (or next available)
echo.

REM Change to project directory
cd /d "C:\Dev\Testing the Agent Swarm"

echo 📁 Current Directory: %CD%
echo.

echo 🔧 Verifying project structure...
if not exist "server\src\simple-server.js" (
    echo ❌ ERROR: Backend server file not found!
    echo Expected: server\src\simple-server.js
    pause
    exit /b 1
)

if not exist "client\package.json" (
    echo ❌ ERROR: Frontend package.json not found!
    echo Expected: client\package.json
    pause
    exit /b 1
)

echo ✅ Project structure verified!
echo.

echo 🔥 Starting Backend Server (Port 3005)...
echo Opening new terminal for backend...
start "Backend Server (Port 3005)" cmd /k "cd /d C:\Dev\Testing the Agent Swarm\server && echo Starting backend server... && node src/simple-server.js"

echo.
echo ⏱️  Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Starting Frontend Server...  
echo Opening new terminal for frontend...
start "Frontend Server" cmd /k "cd /d C:\Dev\Testing the Agent Swarm\client && echo Starting frontend server... && npm run dev"

echo.
echo ✅ Server startup sequence initiated!
echo.
echo 📋 Next Steps:
echo 1. Wait for both terminals to show servers are running
echo 2. Backend should show: "🚀 Server running on port 3005"
echo 3. Frontend should show: "Local: http://localhost:3003/"
echo 4. Open browser to: http://localhost:3003
echo.
echo 🧪 Test endpoints:
echo - Application: http://localhost:3003
echo - Backend Health: http://localhost:3005/health
echo - API Status: http://localhost:3003/api/v1/status
echo.
echo Press any key to close this startup window...
pause >nul