# Build frontend and copy into Spring Boot static/ for single-jar deploy
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "Building client..."
Push-Location "$root\client"
npm ci
npm run build
Pop-Location

$static = "$root\server\demo\src\main\resources\static"
if (Test-Path $static) { Remove-Item -Recurse -Force $static }
New-Item -ItemType Directory -Force -Path $static | Out-Null
Copy-Item -Recurse -Force "$root\client\dist\*" $static

Write-Host "Building server..."
Push-Location "$root\server\demo"
.\mvnw.cmd clean package -DskipTests
Pop-Location

Write-Host "Done. JAR: server\demo\target\demo-0.0.1-SNAPSHOT.jar"
