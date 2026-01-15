@echo off
REM start-server.bat - try multiple methods to run a local static server
cd /d %~dp0
echo Запускаю локальный сервер в %CD%

where py >nul 2>&1
if %ERRORLEVEL%==0 (
  echo Использую: py -3 -m http.server 8000
  py -3 -m http.server 8000
  goto :eof
)

where python >nul 2>&1
if %ERRORLEVEL%==0 (
  echo Использую: python -m http.server 8000
  python -m http.server 8000
  goto :eof
)

where npx >nul 2>&1
if %ERRORLEVEL%==0 (
  echo Использую: npx serve -s . -l 8000
  npx serve -s . -l 8000
  goto :eof
)

echo Не найдено py/python/npx. Установите Python или Node.js, либо используйте Live Server в VS Code.
echo См. README.md для инструкций.
pause
