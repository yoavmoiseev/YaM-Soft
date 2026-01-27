@echo off
REM start-server.bat - try multiple methods to run a local static server
cd /d %~dp0
echo ========================================
echo Starting local server...
echo Current folder: %CD%
echo ========================================
echo.

REM Try python in common locations
echo [1/4] Checking Python 3.13 at: C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python313\python.exe
if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python313\python.exe" (
  echo [OK] Found! Starting server...
  echo.
  echo Server will run at: http://localhost:8000
  echo Press Ctrl+C to stop the server
  echo ========================================
  "C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python313\python.exe" -m http.server 8000
  goto :eof
) else (
  echo [FAIL] Not found
  echo.
)

echo [2/4] Checking: python command
where python >nul 2>&1
if %ERRORLEVEL%==0 (
  echo [OK] Found! Starting server...
  echo.
  echo Server will run at: http://localhost:8000
  echo Press Ctrl+C to stop the server
  echo ========================================
  python -m http.server 8000
  goto :eof
) else (
  echo [FAIL] Not found
  echo.
)

echo [3/4] Checking: py command
where py >nul 2>&1
if %ERRORLEVEL%==0 (
  echo [OK] Found! Starting server...
  echo.
  echo Server will run at: http://localhost:8000
  echo Press Ctrl+C to stop the server
  echo ========================================
  py -3 -m http.server 8000
  goto :eof
) else (
  echo [FAIL] Not found
  echo.
)

echo [4/4] Checking: npx command
where npx >nul 2>&1
if %ERRORLEVEL%==0 (
  echo [OK] Found! Starting server...
  echo.
  echo Server will run at: http://localhost:8000
  echo Press Ctrl+C to stop the server
  echo ========================================
  npx serve -s . -l 8000
  goto :eof
) else (
  echo [FAIL] Not found
  echo.
)

echo ========================================
echo ERROR: Python or Node.js not found!
echo ========================================
echo.
echo Please install Python from: https://www.python.org/downloads/
echo Make sure to check "Add Python to PATH" during installation
echo.
echo Or use Live Server extension in VS Code
echo See README.md for instructions
echo.
pause
