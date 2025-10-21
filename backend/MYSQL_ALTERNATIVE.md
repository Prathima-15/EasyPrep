# Alternative: Use Standalone MySQL Instead of XAMPP

## Why This Works Better
- No corrupted plugins
- Easier to manage
- Better performance
- Works with MySQL Workbench

## Installation Steps

### 1. Download MySQL Installer
- Visit: https://dev.mysql.com/downloads/installer/
- Download: mysql-installer-community-8.0.XX.msi
- File size: ~400MB

### 2. Install MySQL
- Run the installer
- Choose "Developer Default" or "Server only"
- Set root password: **leave it empty** (or remember it)
- Click through installation

### 3. Verify Installation
```powershell
# Check if MySQL is in PATH
mysql --version

# If not found, use full path
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" --version
```

### 4. Create Database and Import Schema
```powershell
# Navigate to MySQL bin folder
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"

# Login to MySQL (no password)
.\mysql.exe -u root

# Or with password if you set one
.\mysql.exe -u root -p
```

**In MySQL prompt:**
```sql
CREATE DATABASE easyprep_db;
EXIT;
```

**Import schema:**
```powershell
.\mysql.exe -u root easyprep_db < "e:\Mini Project\EasyPrep\backend\database\schema_separate_tables.sql"

# Verify tables
.\mysql.exe -u root -e "USE easyprep_db; SHOW TABLES;"
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

### 5. Update Backend Configuration

**backend/.env:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=easyprep_db
DB_PORT=3306
```

If you set a password during installation, use that instead.

### 6. Test Backend Connection
```powershell
cd "e:\Mini Project\EasyPrep\backend"

# Make sure dependencies are installed
npm install

# Start backend server
npm run dev
```

Expected output:
```
✓ MySQL Database connected successfully
✓ MongoDB connected successfully
🚀 Server running on port 5000
```

## Using MySQL Workbench (GUI Alternative to phpMyAdmin)

If you installed standalone MySQL, you can use MySQL Workbench instead of phpMyAdmin:

1. **Open MySQL Workbench** (installed with MySQL)
2. **Create Connection**:
   - Connection Name: EasyPrep Local
   - Hostname: localhost
   - Port: 3306
   - Username: root
   - Password: (empty or your password)
3. **Click "Test Connection"** - should succeed
4. **Open Connection**
5. **Run SQL Scripts**:
   - File → Open SQL Script
   - Select: `e:\Mini Project\EasyPrep\backend\database\schema_separate_tables.sql`
   - Click Execute (⚡ icon)
6. **Verify Tables**:
   - Refresh Schemas panel
   - Expand `easyprep_db` → Tables
   - Should see 9 tables

## Comparison

| Feature | XAMPP MySQL | Standalone MySQL |
|---------|-------------|------------------|
| Setup Time | 5 min | 10 min |
| Stability | ⚠️ Can have plugin issues | ✅ Very stable |
| GUI Tool | phpMyAdmin | MySQL Workbench |
| Performance | Good | Better |
| Portability | ✅ All-in-one | ❌ Separate install |
| Current Status | 🔴 Broken | ✅ Would work |

## Recommendation

Since your XAMPP MySQL has authentication plugin corruption:

1. **If you need XAMPP for Apache/PHP**: Try the fix script first
2. **If you only need MySQL**: Install standalone MySQL (cleaner solution)
3. **Quick test**: You can have both installed, just use different ports

## What to Do Right Now

**FASTEST PATH (Recommended):**

1. Install standalone MySQL (10 minutes)
2. Import your schema
3. Update backend .env
4. Test backend connection
5. Keep XAMPP for Apache only (PHP serving)

**Why this is better:**
- ✅ No more phpMyAdmin errors
- ✅ Get MySQL Workbench (better than phpMyAdmin)
- ✅ Your XAMPP Apache still works
- ✅ More stable for development

Let me know which path you want to take!
