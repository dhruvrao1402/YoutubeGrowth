@echo off
echo Starting YouTube Craft Tracker Development Environment...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Development servers started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8080 (or next available port)
echo.
echo Press any key to close this window...
pause > nul
