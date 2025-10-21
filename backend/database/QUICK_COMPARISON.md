# Quick Database Schema Comparison

## Current Setup (Option 1): Single Users Table
```
┌─────────────────────────────────────────────┐
│            USERS TABLE                       │
├─────────────────────────────────────────────┤
│ id, name, email, username, department       │
│ password, role, verified, otp, otp_expiry   │
│ created_at, updated_at                      │
├─────────────────────────────────────────────┤
│ Student 1   (role: student)                 │
│ Student 2   (role: student)                 │
│ Coordinator 1 (role: moderator)             │
│ Admin 1     (role: admin)                   │
└─────────────────────────────────────────────┘
```

### Files:
- Schema: `database/schema.sql`
- Model: `src/models/User.js`

---

## New Setup (Option 2): Separate Tables
```
┌──────────────────────────────┐
│      STUDENTS TABLE          │
├──────────────────────────────┤
│ id, name, email              │
│ register_number, department  │
│ password, cgpa, year_of_study│
│ verified, otp, otp_expiry    │
└──────────────────────────────┘
        Student 1
        Student 2
        Student 3

┌──────────────────────────────┐
│    COORDINATORS TABLE        │
├──────────────────────────────┤
│ id, name, email              │
│ department, designation      │
│ password, verified           │
│ otp, otp_expiry              │
└──────────────────────────────┘
        Coordinator 1 (IT)
        Coordinator 2 (CSE)

┌──────────────────────────────┐
│       ADMINS TABLE           │
├──────────────────────────────┤
│ id, name, email              │
│ department, designation      │
│ password, verified           │
│ otp, otp_expiry              │
└──────────────────────────────┘
        Admin 1 (Placement)
        Admin 2 (Placement)
```

### Files:
- Schema: `database/schema_separate_tables.sql`
- Model: `src/models/UserSeparate.js`

---

## ✅ Which Should You Use?

### Use **Option 1** (Single Table) if:
- You want simpler code
- You're building a quick prototype
- You don't need role-specific fields

### Use **Option 2** (Separate Tables) if: ⭐ **RECOMMENDED**
- You want professional, scalable architecture
- You need different fields for each role
- You plan to add more role-specific features
- You want cleaner data organization

---

## 🚀 Quick Setup Instructions

### For Option 2 (Recommended):

1. **Import the new schema:**
```powershell
mysql -u root -p < "e:\Mini Project\EasyPrep\backend\database\schema_separate_tables.sql"
```

2. **Update the User model:**
```powershell
cd "e:\Mini Project\EasyPrep\backend\src\models"
Copy-Item UserSeparate.js User.js -Force
```

3. **Restart backend:**
```powershell
cd "e:\Mini Project\EasyPrep\backend"
npm run dev
```

Done! Your backend now uses separate tables for cleaner data organization!

---

## 📝 Both Options Include:
✅ Student authentication
✅ Coordinator authentication  
✅ Admin authentication
✅ OTP verification
✅ Password hashing (bcrypt)
✅ Department-based access control
✅ All supporting tables (companies, questions, etc.)

The only difference is how user data is stored!
