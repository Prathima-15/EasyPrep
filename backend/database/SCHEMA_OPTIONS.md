# Database Schema Options

You now have **TWO schema options** for your database:

## Option 1: Single Users Table (Original)
**File:** `database/schema.sql`

### Structure:
- ✅ One `users` table for students, coordinators, and admins
- ✅ Uses `role` field to differentiate (student/moderator/admin)
- ✅ Simpler queries for cross-user operations

### Pros:
- Easier to query all users together
- Simpler authentication logic
- Single table for user management
- Less code duplication

### Cons:
- Mixed data types in same table
- Register number stored for all users (only needed for students)
- Designation stored for all users (only needed for staff)

---

## Option 2: Separate Tables (New)
**File:** `database/schema_separate_tables.sql`

### Structure:
- ✅ `students` table (register_number, cgpa, year_of_study)
- ✅ `coordinators` table (designation, department)
- ✅ `admins` table (designation, always Placement dept)

### Pros:
- **Cleaner data separation**
- Each table only has relevant fields
- Better data integrity
- Easier to add role-specific fields later
- More scalable architecture

### Cons:
- Need to check 3 tables for login
- More complex queries for cross-user operations
- Slightly more code in models

---

## 🎯 Recommendation

I recommend **Option 2 (Separate Tables)** because:

1. **Better Organization:** Each user type has its own table with relevant fields only
2. **Cleaner Code:** Student-specific fields (register_number, cgpa) separate from staff fields (designation)
3. **Scalability:** Easy to add role-specific features later
4. **Professional:** Industry standard for multi-role systems

---

## 📥 How to Use Each Option

### Using Option 1 (Single Table):
```powershell
# Import original schema
mysql -u root -p < "e:\Mini Project\EasyPrep\backend\database\schema.sql"

# Use original User model (already in your code)
# backend/src/models/User.js
```

### Using Option 2 (Separate Tables):  
```powershell
# Import new schema
mysql -u root -p < "e:\Mini Project\EasyPrep\backend\database\schema_separate_tables.sql"

# Update your backend to use the new model
```

Then update `backend/src/models/User.js`:
```javascript
// Replace the contents with UserSeparate.js
// Or rename UserSeparate.js to User.js
```

---

## 🔄 Migration Steps (If Switching)

### From Option 1 → Option 2:

1. **Backup existing data:**
```powershell
mysqldump -u root -p easyprep_db > backup.sql
```

2. **Drop and recreate database:**
```powershell
mysql -u root -p
```
```sql
DROP DATABASE easyprep_db;
CREATE DATABASE easyprep_db;
EXIT;
```

3. **Import new schema:**
```powershell
mysql -u root -p < "e:\Mini Project\EasyPrep\backend\database\schema_separate_tables.sql"
```

4. **Update model file:**
```powershell
cd "e:\Mini Project\EasyPrep\backend\src\models"
# Option A: Replace User.js content with UserSeparate.js content
# Option B: Rename files
Move-Item User.js User_old.js
Move-Item UserSeparate.js User.js
```

5. **Restart backend:**
```powershell
cd "e:\Mini Project\EasyPrep\backend"
npm run dev
```

---

## 📊 Comparison Table

| Feature | Single Table | Separate Tables |
|---------|--------------|-----------------|
| **Simplicity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Data Integrity** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Scalability** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Query Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Maintainability** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Professional Standard** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 My Recommendation

**Use Option 2 (Separate Tables)** - Better for long-term maintenance and follows industry best practices.

The updated `UserSeparate.js` model already handles all the complexity of checking 3 tables, so you don't lose any convenience!

---

## 🔍 Testing Either Option

Both schemas work with your current frontend! The authentication routes will work the same way because the model abstraction handles the differences.

Just make sure to:
1. Choose one schema and import it
2. Use the corresponding User model
3. Restart your backend server
4. Test signup/login on frontend

---

## Need Help?

If you're unsure which to choose or need help migrating, just let me know! 

For now, **Option 2 (Separate Tables)** is ready to use with the `UserSeparate.js` model.
