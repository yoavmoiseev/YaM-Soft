<#
  start-server.ps1
  Автоматически запускает локальный HTTP-сервер в папке проекта.
  Использует: `py -3 -m http.server`, `python -m http.server` или `npx serve` (по наличию).

  Запуск в PowerShell:
    .\start-server.ps1
  Если политика выполнения мешает, запустите:
    powershell -ExecutionPolicy Bypass -File .\start-server.ps1
#>

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "Запускаю локальный сервер в: $scriptDir" -ForegroundColor Cyan

function Try-Run([string]$cmd, [string]$args){
  try{
    Write-Host "Попытка: $cmd $args" -ForegroundColor Yellow
    & $cmd $args
    return $true
  } catch {
    return $false
  }
}

# Try py -3
if (Get-Command py -ErrorAction SilentlyContinue) {
  Write-Host "Использую: py -3 -m http.server 8000" -ForegroundColor Green
  py -3 -m http.server 8000
  exit
}

# Try python
if (Get-Command python -ErrorAction SilentlyContinue) {
  Write-Host "Использую: python -m http.server 8000" -ForegroundColor Green
  python -m http.server 8000
  exit
}

# Try npx serve
if (Get-Command npx -ErrorAction SilentlyContinue) {
  Write-Host "Использую: npx serve -s . -l 8000" -ForegroundColor Green
  npx serve -s . -l 8000
  exit
}

Write-Host "Не найдено `py`, `python` или `npx` в PATH. Установите Python или Node.js, или используйте Live Server в VS Code." -ForegroundColor Red
Write-Host "Инструкция по установке: см. README.md" -ForegroundColor Yellow
