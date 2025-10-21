# Quick Database Check Script
# Run this in PowerShell to check your database setup

Write-Host "`n=== EasyPrep Database Check ===" -ForegroundColor Cyan
Write-Host "Checking database tables...`n" -ForegroundColor Yellow

# Check if MySQL is accessible
$mysqlPath = "mysql"

# Try to find MySQL
if (!(Get-Command mysql -ErrorAction SilentlyContinue)) {
    $mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    if (!(Test-Path $mysqlPath)) {
        Write-Host "❌ MySQL not found in PATH or default location" -ForegroundColor Red
        Write-Host "Please provide the full path to mysql.exe" -ForegroundColor Yellow
        exit
    }
}

Write-Host "✅ MySQL found at: $mysqlPath`n" -ForegroundColor Green

# Prompt for password
Write-Host "Enter MySQL root password:" -ForegroundColor Yellow
$password = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Check if database exists
Write-Host "`nChecking if easyprep_db exists..." -ForegroundColor Cyan
$checkDb = "SHOW DATABASES LIKE 'easyprep_db';"
$result = & $mysqlPath -u root -p"$plainPassword" -e $checkDb 2>&1

if ($result -match "easyprep_db") {
    Write-Host "✅ Database 'easyprep_db' exists`n" -ForegroundColor Green
    
    # Show all tables
    Write-Host "Tables in easyprep_db:" -ForegroundColor Cyan
    $showTables = "USE easyprep_db; SHOW TABLES;"
    & $mysqlPath -u root -p"$plainPassword" -e $showTables 2>&1
    
    Write-Host "`n"
    
    # Check for separate tables
    Write-Host "Checking for separate user tables..." -ForegroundColor Cyan
    $checkSeparate = @"
USE easyprep_db;
SELECT 
    CASE 
        WHEN COUNT(CASE WHEN TABLE_NAME='students' THEN 1 END) > 0 THEN '✅ students table EXISTS'
        ELSE '❌ students table MISSING'
    END as Students,
    CASE 
        WHEN COUNT(CASE WHEN TABLE_NAME='coordinators' THEN 1 END) > 0 THEN '✅ coordinators table EXISTS'
        ELSE '❌ coordinators table MISSING'
    END as Coordinators,
    CASE 
        WHEN COUNT(CASE WHEN TABLE_NAME='admins' THEN 1 END) > 0 THEN '✅ admins table EXISTS'
        ELSE '❌ admins table MISSING'
    END as Admins,
    CASE 
        WHEN COUNT(CASE WHEN TABLE_NAME='users' THEN 1 END) > 0 THEN '⚠️ users table EXISTS (Old schema)'
        ELSE 'ℹ️ users table not found'
    END as Users
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA='easyprep_db' 
AND TABLE_NAME IN ('students','coordinators','admins','users');
"@
    & $mysqlPath -u root -p"$plainPassword" -e $checkSeparate 2>&1
    
    Write-Host "`n"
    
    # Show row counts
    Write-Host "Row counts in each table:" -ForegroundColor Cyan
    $countRows = @"
USE easyprep_db;
SELECT 'students' as TableName, COUNT(*) as Rows FROM students
UNION ALL
SELECT 'coordinators', COUNT(*) FROM coordinators
UNION ALL
SELECT 'admins', COUNT(*) FROM admins
UNION ALL
SELECT 'companies', COUNT(*) FROM companies
UNION ALL
SELECT 'questions', COUNT(*) FROM questions;
"@
    & $mysqlPath -u root -p"$plainPassword" -e $countRows 2>&1
    
    Write-Host "`n"
    Write-Host "=== Summary ===" -ForegroundColor Cyan
    Write-Host "If you see students, coordinators, and admins tables: ✅ Using SEPARATE TABLES (Recommended)" -ForegroundColor Green
    Write-Host "If you see only users table: ℹ️ Using SINGLE TABLE (Option 1)" -ForegroundColor Yellow
    Write-Host "If no user tables exist: ❌ Please import a schema file`n" -ForegroundColor Red
    
} else {
    Write-Host "❌ Database 'easyprep_db' does not exist" -ForegroundColor Red
    Write-Host "`nTo create the database, run:" -ForegroundColor Yellow
    Write-Host "mysql -u root -p < 'e:\Mini Project\EasyPrep\backend\database\schema_separate_tables.sql'" -ForegroundColor White
}

# Clear password from memory
$plainPassword = $null
[System.GC]::Collect()

Write-Host "`nDone!`n" -ForegroundColor Cyan
