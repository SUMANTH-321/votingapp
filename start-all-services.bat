@echo off
REM Start all BiggBoss Voting microservices in separate windows

start "User Service" cmd /k "cd /d %~dp0user-service && node app.js"
start "Contestant Service" cmd /k "cd /d %~dp0contestant-service && node app.js"
start "Voting Service" cmd /k "cd /d %~dp0voting-service && node app.js"
start "Result Service" cmd /k "cd /d %~dp0result-service && node app.js"
start "Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo All services launched in separate windows.
pause
