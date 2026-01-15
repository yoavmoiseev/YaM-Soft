#!/usr/bin/env bash
# start-server.sh - portable helper for macOS / Linux / WSL
cd "$(dirname "$0")"
echo "Запускаю локальный сервер в: $(pwd)"

if command -v py >/dev/null 2>&1; then
  py -3 -m http.server 8000
  exit
fi
if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server 8000
  exit
fi
if command -v python >/dev/null 2>&1; then
  python -m http.server 8000
  exit
fi
if command -v npx >/dev/null 2>&1; then
  npx serve -s . -l 8000
  exit
fi

echo "Не найден python или npx. Установите их или используйте VS Code Live Server." >&2
exit 1
