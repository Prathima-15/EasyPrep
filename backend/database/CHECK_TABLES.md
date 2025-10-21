# How to Check Your Database Tables

## Method 1: Using MySQL Command Line

### Check if database exists:
```powershell
# Login to MySQL
mysql -u root -p

# Or with full path if not in PATH:
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

Once logged in:
```sql
-- Show all databases
SHOW DATABASES;

-- Use the EasyPrep database
USE easyprep_db;

-- Show all tables
SHOW TABLES;

-- You should see:
-- +------------------------+
-- | Tables_in_easyprep_db  |
-- +------------------------+
-- | admins                 |
-- | audit_logs             |
-- | companies              |
-- | coordinators           |
-- | department_mappings    |
-- | eligible_students      |
-- | questions              |
-- | saved_questions        |
-- | students               |
-- +------------------------+

-- Check structure of each table:
DESCRIBE students;
DESCRIBE coordinators;
DESCRIBE admins;

-- Check if separate tables exist with this query:
SELECT 
    TABLE_NAME 
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = 'easyprep_db' 
    AND TABLE_NAME IN ('students', 'coordinators', 'admins', 'users');

-- Exit MySQL
EXIT;
```

---

## Method 2: Using PowerShell One-Liner

```powershell
# Check which tables exist
mysql -u root -p -e "USE easyprep_db; SHOW TABLES;"

# Check structure of students table
mysql -u root -p -e "USE easyprep_db; DESCRIBE students;"

# Check structure of coordinators table
mysql -u root -p -e "USE easyprep_db; DESCRIBE coordinators;"

# Check structure of admins table
mysql -u root -p -e "USE easyprep_db; DESCRIBE admins;"

# Count rows in each table
mysql -u root -p -e "USE easyprep_db; SELECT 'Students' as Table_Name, COUNT(*) as Count FROM students UNION SELECT 'Coordinators', COUNT(*) FROM coordinators UNION SELECT 'Admins', COUNT(*) FROM admins;"
```

---

## Method 3: Using MySQL Workbench (GUI)

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click on "Schemas" in the left sidebar
4. Expand "easyprep_db"
5. Expand "Tables"
6. You should see:
   - ✅ students
   - ✅ coordinators
   - ✅ admins
   - ✅ companies
   - ✅ questions
   - etc.

7. Right-click any table → "Select Rows - Limit 1000" to see data
8. Right-click any table → "Table Inspector" to see structure

---

## Quick Check Script

Save this as `check_db.sql`:
```sql
-- Quick Database Check Script
USE easyprep_db;

-- Show all tables
SELECT 'All Tables:' as Info;
SHOW TABLES;

-- Check if separate user tables exist
SELECT '\nSeparate User Tables Check:' as Info;
SELECT 
    TABLE_NAME,
    CASE 
        WHEN TABLE_NAME = 'students' THEN '✅ Students table exists'
        WHEN TABLE_NAME = 'coordinators' THEN '✅ Coordinators table exists'
        WHEN TABLE_NAME = 'admins' THEN '✅ Admins table exists'
        WHEN TABLE_NAME = 'users' THEN '⚠️ Old single users table (Option 1)'
    END as Status
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'easyprep_db'
AND TABLE_NAME IN ('students', 'coordinators', 'admins', 'users');

-- Show table structures
SELECT '\nStudents Table Structure:' as Info;
DESCRIBE students;

SELECT '\nCoordinators Table Structure:' as Info;
DESCRIBE coordinators;

SELECT '\nAdmins Table Structure:' as Info;
DESCRIBE admins;

-- Count rows
SELECT '\nRow Counts:' as Info;
SELECT 
    'Students' as TableName, 
    COUNT(*) as RowCount 
FROM students
UNION ALL
SELECT 
    'Coordinators', 
    COUNT(*) 
FROM coordinators
UNION ALL
SELECT 
    'Admins', 
    COUNT(*) 
FROM admins;
```

Run it:
```powershell
mysql -u root -p < check_db.sql
```

---

## What You Should See

### If using SEPARATE TABLES (Option 2):
```
Tables:
- students (with register_number, cgpa columns)
- coordinators (with designation column)
- admins (with designation column)
- companies
- questions
- saved_questions
- audit_logs
- eligible_students
- department_mappings
```

### If using SINGLE TABLE (Option 1):
```
Tables:
- users (with role column: student/moderator/admin)
- companies
- questions
- saved_questions
- audit_logs
- eligible_students
- department_mappings
```

---

## Verify Which Schema You're Using

```powershell
mysql -u root -p -e "USE easyprep_db; SELECT COUNT(*) as 'Has Separate Tables' FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='easyprep_db' AND TABLE_NAME IN ('students','coordinators','admins');"
```

**Result:**
- `3` = You're using separate tables ✅
- `0` = You're using single users table

---

## If No Tables Exist Yet

You need to import one of the schemas:

### Option 1: Single users table
```powershell
mysql -u root -p < "e:\Mini Project\EasyPrep\backend\database\schema.sql"
```

### Option 2: Separate tables (RECOMMENDED)
```powershell
mysql -u root -p < "e:\Mini Project\EasyPrep\backend\database\schema_separate_tables.sql"
```

---

## Quick Test Query

Once tables are created, test with this:
```powershell
mysql -u root -p -e "USE easyprep_db; SHOW TABLES LIKE '%student%'; SHOW TABLES LIKE '%coordinator%'; SHOW TABLES LIKE '%admin%';"
```

This will show you all tables related to students, coordinators, and admins.
