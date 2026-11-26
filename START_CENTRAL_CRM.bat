@echo off
title KCIS Pulse CRM - Central Multi-User Server
echo ===============================================================
echo     KCIS PULSE CRM - CENTRAL DATABASE & ENTERPRISE SERVER
echo ===============================================================
echo.
echo [1/3] Checking Node environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    pause
    exit /b 1
)

echo [2/3] Starting Central Backend Database Server on port 5000...
start "KCIS Central Backend (Port 5000)" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo [3/3] Starting Frontend Network Server on port 5173...
start "KCIS Frontend Portal (Port 5173)" cmd /k "cd /d "%~dp0" && npx vite --host"

echo.
echo ===============================================================
echo  SUCCESS! Both Central Backend Database and Frontend are running!
echo ===============================================================
echo.
echo - Access on this computer: http://localhost:5173
echo - Access for Sales & Tech Team on your office WiFi:
for /f "tokens=4" %%a in ('route print 0.0.0.0 ^| findstr 0.0.0.0 ^| findstr /v "Default"') do (
    set LOCAL_IP=%%a
    goto :found_ip
)
:found_ip
if defined LOCAL_IP (
    echo   http://%LOCAL_IP%:5173
) else (
    echo   Check your IP with 'ipconfig' (e.g. http://192.168.x.x:5173)
)
echo.
echo Data entered by any team member will now be saved in the
echo Central Database and visible to Admins and all departments!
echo ===============================================================
echo.
pause
