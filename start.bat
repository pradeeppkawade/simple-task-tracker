@echo off
title Simple Task Tracker Launcher
echo ===================================================
echo       SIMPLE TASK TRACKER - 1-CLICK LAUNCHER
echo ===================================================
echo.
echo Starting Backend Server (Port 5000)...
start "Task Tracker - Backend (Port 5000)" cmd /k "cd server && npm.cmd run dev"

echo Starting Frontend Client (Port 3000)...
start "Task Tracker - Frontend (Port 3000)" cmd /k "cd client && npm.cmd run dev"

echo.
echo ===================================================
echo Both servers are launching!
echo - Backend:  http://localhost:5000
echo - Frontend: http://localhost:3000
echo ===================================================
echo Opening application in your default web browser in 4 seconds...
ping 127.0.0.1 -n 4 >nul
start http://localhost:3000
exit
