# Fix XAMPP MySQL Authentication Error
# Run this script as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "XAMPP MySQL Authentication Fix Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Stop MySQL if running
Write-Host "[1/6] Stopping MySQL service..." -ForegroundColor Yellow
$mysqlProcess = Get-Process mysqld -ErrorAction SilentlyContinue
if ($mysqlProcess) {
    Stop-Process -Name mysqld -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✓ MySQL stopped" -ForegroundColor Green
} else {
    Write-Host "✓ MySQL not running" -ForegroundColor Green
}

# Step 2: Backup current MySQL data folder
Write-Host "`n[2/6] Creating backup..." -ForegroundColor Yellow
$backupPath = "C:\xampp\mysql_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
if (Test-Path "C:\xampp\mysql\data") {
    Write-Host "Creating backup at: $backupPath" -ForegroundColor Gray
    # Only backup important files to save time
    New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
    Copy-Item "C:\xampp\mysql\data\mysql" -Destination "$backupPath\mysql" -Recurse -ErrorAction SilentlyContinue
    Write-Host "✓ Backup created" -ForegroundColor Green
} else {
    Write-Host "! Data folder not found" -ForegroundColor Red
}

# Step 3: Reset MySQL root user
Write-Host "`n[3/6] Resetting MySQL authentication..." -ForegroundColor Yellow

# Create temporary init file
$initFile = "C:\xampp\mysql\data\init.sql"
$initContent = @"
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
"@
Set-Content -Path $initFile -Value $initContent -Force

Write-Host "Created init file: $initFile" -ForegroundColor Gray

# Step 4: Start MySQL with init file
Write-Host "`n[4/6] Starting MySQL with reset script..." -ForegroundColor Yellow
$mysqldPath = "C:\xampp\mysql\bin\mysqld.exe"

if (Test-Path $mysqldPath) {
    # Start MySQL in background with init file
    $process = Start-Process -FilePath $mysqldPath `
        -ArgumentList "--defaults-file=`"C:\xampp\mysql\bin\my.ini`" --init-file=`"$initFile`"" `
        -PassThru -WindowStyle Hidden
    
    Write-Host "Waiting for MySQL to start..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
    
    if ($process.HasExited -eq $false) {
        Write-Host "✓ MySQL started successfully" -ForegroundColor Green
        
        # Stop MySQL
        Stop-Process -Id $process.Id -Force
        Start-Sleep -Seconds 2
        Write-Host "✓ MySQL stopped" -ForegroundColor Green
    } else {
        Write-Host "! MySQL failed to start" -ForegroundColor Red
    }
    
    # Remove init file
    Remove-Item $initFile -Force -ErrorAction SilentlyContinue
} else {
    Write-Host "! mysqld.exe not found at: $mysqldPath" -ForegroundColor Red
}

# Step 5: Fix phpMyAdmin config
Write-Host "`n[5/6] Fixing phpMyAdmin configuration..." -ForegroundColor Yellow
$phpMyAdminConfig = "C:\xampp\phpMyAdmin\config.inc.php"

if (Test-Path $phpMyAdminConfig) {
    $config = Get-Content $phpMyAdminConfig -Raw
    
    # Update password to empty
    $config = $config -replace "(\`$cfg\['Servers'\]\[\`$i\]\['password'\]\s*=\s*')([^']*)(')", '$1$3'
    
    # Update auth_type to config
    $config = $config -replace "(\`$cfg\['Servers'\]\[\`$i\]\['auth_type'\]\s*=\s*')([^']*)(')", '${1}config$3'
    
    Set-Content -Path $phpMyAdminConfig -Value $config -Force
    Write-Host "✓ phpMyAdmin config updated" -ForegroundColor Green
} else {
    Write-Host "! phpMyAdmin config not found" -ForegroundColor Yellow
}

# Step 6: Instructions
Write-Host "`n[6/6] Next Steps" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "1. Open XAMPP Control Panel" -ForegroundColor White
Write-Host "2. Start MySQL (should work now)" -ForegroundColor White
Write-Host "3. Start Apache" -ForegroundColor White
Write-Host "`n4. Test MySQL access:" -ForegroundColor White
Write-Host '   cd "C:\xampp\mysql\bin"' -ForegroundColor Gray
Write-Host '   .\mysql.exe -u root' -ForegroundColor Gray
Write-Host "`n5. If MySQL works, import your database:" -ForegroundColor White
Write-Host '   .\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS easyprep_db;"' -ForegroundColor Gray
Write-Host '   .\mysql.exe -u root easyprep_db < "e:\Mini Project\EasyPrep\backend\database\schema_separate_tables.sql"' -ForegroundColor Gray
Write-Host '   .\mysql.exe -u root -e "USE easyprep_db; SHOW TABLES;"' -ForegroundColor Gray

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "If issues persist, try Option B below..." -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan
