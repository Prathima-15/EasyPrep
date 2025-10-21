# Database Setup Guide

## Check MySQL Installation

### Option 1: Check MySQL Service Status
Open PowerShell and run:
```powershell
Get-Service -Name MySQL*
```

### Option 2: Find MySQL Installation Path
```powershell
Get-ChildItem "C:\Program Files\MySQL" -Recurse -Filter mysql.exe -ErrorAction SilentlyContinue
```

Or check XAMPP:
```powershell
Get-ChildItem "C:\xampp\mysql" -Recurse -Filter mysql.exe -ErrorAction SilentlyContinue
```

### Option 3: Use Full Path
If MySQL is installed but not in PATH, use the full path:
```powershell
# Example for MySQL 8.0
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" --version

# Example for XAMPP
& "C:\xampp\mysql\bin\mysql.exe" --version
```

## Setup Database with Full Path

### Step 1: Login to MySQL
```powershell
# Using MySQL installer
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p

# Using XAMPP
& "C:\xampp\mysql\bin\mysql.exe" -u root -p
```

### Step 2: Create Database
Once logged in to MySQL, run:
```sql
CREATE DATABASE easyprep_db;
USE easyprep_db;
SOURCE E:/Mini Project/EasyPrep/backend/database/schema.sql;
EXIT;
```

### Step 3: Or Import via Command Line
```powershell
# MySQL Installer
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < "E:\Mini Project\EasyPrep\backend\database\schema.sql"

# XAMPP
& "C:\xampp\mysql\bin\mysql.exe" -u root -p < "E:\Mini Project\EasyPrep\backend\database\schema.sql"
```

## Update .env File

After setting up the database, update your `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=easyprep_db
DB_PORT=3306
```

## Test Connection

Run the backend server to test:
```powershell
cd backend
npm install
npm run dev
```

You should see:
```
✓ MySQL Database connected successfully
✓ MongoDB connected successfully
🚀 Server running on port 5000
```

## Troubleshooting

### MySQL Service Not Running
```powershell
# Start MySQL service
Start-Service -Name MySQL80  # Or MySQL57 depending on version

# Or using XAMPP Control Panel
# Open XAMPP Control Panel → Click "Start" next to MySQL
```

### Can't Connect to MySQL
1. Check if MySQL service is running
2. Verify username/password in .env
3. Make sure port 3306 is not blocked
4. Check firewall settings

### Import Schema Errors
If you get errors importing schema:
1. Open MySQL Workbench
2. Create connection to localhost
3. File → Run SQL Script
4. Select: `E:\Mini Project\EasyPrep\backend\database\schema.sql`
5. Click "Run"
