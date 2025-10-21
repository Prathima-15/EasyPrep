# Fix phpMyAdmin Access Denied Error in XAMPP

## Problem
- phpMyAdmin shows: "Access denied for user 'root'@'localhost'"
- MySQL authentication plugin error: caching_sha2_password.dll not found

## Solution

### Option 1: Reset MySQL Root Password (RECOMMENDED)

1. **Stop MySQL in XAMPP Control Panel**
   - Open XAMPP Control Panel
   - Click "Stop" next to MySQL

2. **Start MySQL in Safe Mode**
   - Open PowerShell as Administrator
   - Run these commands:
   ```powershell
   cd C:\xampp\mysql\bin
   .\mysqld.exe --skip-grant-tables --skip-networking
   ```
   - Keep this PowerShell window open

3. **Open Another PowerShell Window**
   - Run as Administrator
   - Execute these commands:
   ```powershell
   cd C:\xampp\mysql\bin
   .\mysql.exe -u root
   ```

4. **Reset the Password**
   - In the MySQL prompt, run:
   ```sql
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY '';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **Stop Safe Mode MySQL**
   - Go back to first PowerShell window (with mysqld running)
   - Press `Ctrl+C` to stop it

6. **Start MySQL Normally**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL

7. **Fix phpMyAdmin Config**
   - Open: `C:\xampp\phpMyAdmin\config.inc.php`
   - Find this line:
   ```php
   $cfg['Servers'][$i]['password'] = '';
   ```
   - Make sure it's set to empty string (as shown above)

8. **Restart Apache**
   - In XAMPP Control Panel
   - Click "Stop" then "Start" for Apache

### Option 2: Use Command Line Instead (FASTER)

If phpMyAdmin continues to have issues, you can directly import your database using command line:

1. **Start MySQL in XAMPP**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL

2. **Import Your Database Schema**
   ```powershell
   cd "C:\xampp\mysql\bin"
   
   # Create database
   .\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS easyprep_db;"
   
   # Import schema
   .\mysql.exe -u root easyprep_db < "e:\Mini Project\EasyPrep\backend\database\schema_separate_tables.sql"
   
   # Verify tables created
   .\mysql.exe -u root -e "USE easyprep_db; SHOW TABLES;"
   ```

### Option 3: Reinstall MySQL Authentication Plugin

1. **Download MySQL Plugin**
   - Download from: https://dev.mysql.com/downloads/file/?id=516926
   - Extract `caching_sha2_password.dll`

2. **Copy to Plugin Directory**
   ```powershell
   Copy-Item "path\to\caching_sha2_password.dll" "C:\xampp\mysql\lib\plugin\"
   ```

3. **Restart MySQL**
   - XAMPP Control Panel → Stop MySQL → Start MySQL

## Verification

After applying any fix, test MySQL access:

```powershell
cd C:\xampp\mysql\bin
.\mysql.exe -u root -e "SELECT VERSION();"
```

Expected output: MySQL version information (should work without errors)

## Quick Database Setup (After Fix)

Once MySQL access is working:

```powershell
# Navigate to MySQL bin
cd "C:\xampp\mysql\bin"

# Create database
.\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS easyprep_db;"

# Import schema
.\mysql.exe -u root easyprep_db < "e:\Mini Project\EasyPrep\backend\database\schema_separate_tables.sql"

# Show all tables
.\mysql.exe -u root easyprep_db -e "SHOW TABLES;"

# Verify students table structure
.\mysql.exe -u root easyprep_db -e "DESCRIBE students;"

# Verify coordinators table structure
.\mysql.exe -u root easyprep_db -e "DESCRIBE coordinators;"

# Verify admins table structure  
.\mysql.exe -u root easyprep_db -e "DESCRIBE admins;"
```

Expected output:
```
Tables_in_easyprep_db
admins
audit_logs
companies
coordinators
department_mappings
eligible_students
questions
saved_questions
students
```

## Update Backend .env

After fixing MySQL access, update your backend `.env` file:

```env
# MySQL Configuration (Leave password empty for XAMPP)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=easyprep_db
DB_PORT=3306
```

## Troubleshooting

### Still getting errors?
- Make sure XAMPP MySQL is running (green in Control Panel)
- Check MySQL error log: `C:\xampp\mysql\data\mysql_error.log`
- Try accessing MySQL from command line first before phpMyAdmin

### phpMyAdmin still not working?
- Clear browser cache
- Try incognito/private browsing mode
- Use command line instead (faster and more reliable)
