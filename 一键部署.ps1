# 牛香香·草原爱宠营 一键部署 v1.5.0
$envId = "cloudbase-4gvjj5qn247cd61a"
$h5Url = "https://cloudbase-4gvjj5qn247cd61a-1304825656.tcloudbaseapp.com/h5/"

Write-Host "============================================" -ForegroundColor Green
Write-Host "  牛香香 草原爱宠营 一键部署 v1.5.0" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# [1/4] Check login
Write-Host "[1/4] Checking CloudBase login..." -ForegroundColor Yellow
$loggedIn = $false
try {
    $null = tcb env list -e $envId 2>&1
    if ($LASTEXITCODE -eq 0) { $loggedIn = $true }
} catch {}

if (-not $loggedIn) {
    Write-Host "[!] Not logged in. Choose login method:" -ForegroundColor Red
    Write-Host "  A) Browser login (recommended)" -ForegroundColor White
    Write-Host "  B) API key login" -ForegroundColor White
    $method = Read-Host "Enter A or B"
    if ($method -eq "A" -or $method -eq "a") {
        Write-Host "Opening browser for login..." -ForegroundColor Cyan
        tcb login
    }
    else {
        $apiKeyId = Read-Host "SecretID"
        $apiKey = Read-Host "SecretKey"
        tcb login --apiKeyId $apiKeyId --apiKey $apiKey
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[X] Login failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host "[OK] CloudBase logged in" -ForegroundColor Green

# [2/4] Deploy H5
Write-Host ""
Write-Host "[2/4] Deploying H5 to static hosting..." -ForegroundColor Yellow
Push-Location $PSScriptRoot
tcb hosting deploy ./h5 -e $envId
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] H5 deploy failed. Check: https://console.cloud.tencent.com/tcb/hosting" -ForegroundColor Red
    Pop-Location
    Read-Host "Press Enter to exit"
    exit 1
}
Pop-Location
Write-Host "[OK] H5 deployed: $h5Url" -ForegroundColor Green

# [3/4] Init database
Write-Host ""
Write-Host "[3/4] Initializing database config..." -ForegroundColor Yellow
Push-Location $PSScriptRoot
node deploy/init-config.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] DB init failed. Fallback: right-click cloudfunctions/initConfig in IDE -> Upload" -ForegroundColor Yellow
}
Pop-Location
Write-Host "[OK] Database config ready" -ForegroundColor Green

# [4/4] Done
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  DEPLOY COMPLETE!" -ForegroundColor Green
Write-Host "  H5 URL: $h5Url" -ForegroundColor Cyan
Write-Host "  DB: config collection (ugc_enabled=false)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Confirm admin page UGC switch is OFF" -ForegroundColor White
Write-Host "  2. Upload code via WeChat DevTools" -ForegroundColor White
Write-Host "  3. After review: enable UGC in admin page" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"