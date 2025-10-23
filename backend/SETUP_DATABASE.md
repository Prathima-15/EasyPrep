# 🗄️ EasyPrep Database Setup Guide

This guide will help you set up both **MySQL** and **MongoDB** databases required for EasyPrep.

---

## 📊 Database Architecture

EasyPrep uses a **hybrid database system**:

- **MySQL** (Port 3306) - User authentication, OTP verification
- **MongoDB** (Port 27017) - Companies, questions, saved items, audit logs

---

## 🔧 Prerequisites

Before starting, ensure you have:

- [x] **MySQL Server** installed (XAMPP, MySQL Workbench, or standalone)
- [x] **MongoDB Server** installed
- [x] Node.js and npm installed
- [x] Backend dependencies installed (`npm install` in backend folder)

---

## 1️⃣ MySQL Setup

### Step 1: Start MySQL Server

**Using XAMPP:**
```
1. Open XAMPP Control Panel
2. Click "Start" for MySQL
3. Verify it's running on port 3306
```

**Using MySQL Workbench:**
```
1. Start MySQL Server from Services
2. Open MySQL Workbench
3. Connect to Local instance
```

### Step 2: Create Database

Open MySQL command line or Workbench and run:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS easyprep_db;

-- Use the database
USE easyprep_db;
```

### Step 3: Run Schema File

**Option A: Command Line**
```bash
# Navigate to backend directory
cd backend

# Run schema file
mysql -u root -p easyprep_db < database/schema.sql
```

**Option B: MySQL Workbench**
```
1. Open MySQL Workbench
2. File → Open SQL Script
3. Select backend/database/schema.sql
4. Click Execute (⚡ icon)
```

### Step 4: Verify Tables Created

```sql
USE easyprep_db;

SHOW TABLES;
-- Should show: users, department_mappings, otp_verifications, etc.

DESCRIBE users;
-- Should show columns: id, name, email, password, role, etc.
```

### Step 5: Update `.env` File

Open `backend/.env` and update MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=easyprep_db
DB_PORT=3306
```

---

## 2️⃣ MongoDB Setup

### Step 1: Install MongoDB

**Windows:**
```
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer (choose "Complete" installation)
3. Install as a Windows Service
4. MongoDB Compass (GUI) will be installed automatically
```

**Or use MongoDB Atlas (Cloud):**
```
1. Sign up at: https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update MONGODB_URI in .env
```

### Step 2: Start MongoDB Server

**Windows (if installed as service):**
- MongoDB starts automatically
- Or run: `net start MongoDB`

**Manual start:**
```powershell
mongod --dbpath "C:\data\db"
```

### Step 3: Verify MongoDB is Running

```powershell
# Connect to MongoDB
mongosh

# Or if using older version
mongo
```

You should see:
```
MongoDB shell version v7.x.x
connecting to: mongodb://127.0.0.1:27017
```

### Step 4: Create Database and Collections

MongoDB creates the database automatically when first accessed, but you can verify:

```javascript
// In mongosh or mongo shell
use easyprep

// Verify database
db.getName()

// Show collections (will be empty initially)
show collections
```

Collections will be created automatically when the backend runs:
- `companies` - Company information
- `questions` - Interview questions
- `savedQuestions` - Bookmarked questions
- `auditLogs` - Activity tracking

### Step 5: Update `.env` File

Open `backend/.env` and verify MongoDB URI:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/easyprep

# Or if using MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/easyprep
```

---

## 3️⃣ Email Configuration

### Setup Gmail SMTP for OTP Emails

See detailed guide in: `EMAIL_SETUP_GUIDE.md`

**Quick Steps:**

1. Enable 2-Step Verification on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
```

**⚠️ Important**: You MUST use Gmail App Password, not your regular password!

---

## 4️⃣ Complete `.env` Configuration

Your `backend/.env` file should look like this:

```env
# Server
NODE_ENV=development
PORT=5000

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YourMySQLPassword123
DB_NAME=easyprep_db
DB_PORT=3306

# MongoDB
MONGODB_URI=mongodb://localhost:27017/easyprep

# JWT
JWT_SECRET=your_random_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

# Gmail SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=your16charapppassword

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## 5️⃣ Test Database Connections

### Start Backend Server

```powershell
cd backend
npm run dev
```

### Expected Output (Success):

```
✅ MySQL Connected to easyprep_db
✅ MongoDB Connected to easyprep_db
🚀 Server running on port 5000
📡 Environment: development
🌐 API URL: http://localhost:5000
💾 MySQL: Connected for Authentication
🍃 MongoDB: Connected for Application Data
```

### If You See Errors:

**MySQL Connection Error:**
```
❌ MySQL Error: ER_ACCESS_DENIED_ERROR
```
**Fix**: Check DB_USER and DB_PASSWORD in `.env`

**MongoDB Connection Error:**
```
❌ MongoDB Error: connect ECONNREFUSED
```
**Fix**: Make sure MongoDB server is running

**Email Error:**
```
❌ Error sending OTP email: ECONNREFUSED 127.0.0.1:587
```
**Fix**: Configure EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD (see `EMAIL_SETUP_GUIDE.md`)

---

## 6️⃣ Verify Setup with Test API Calls

### Test Health Endpoint

```powershell
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-22T12:34:56.789Z"
}
```

### Test Student Signup (will send OTP email)

```powershell
curl -X POST http://localhost:5000/api/auth/signup/student -H "Content-Type: application/json" -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"username\":\"testuser\",\"department\":\"CSE\",\"password\":\"Test@123\"}'
```

Check your email for OTP!

---

## 7️⃣ Database Management Tools

### MySQL Tools:
- **MySQL Workbench** - GUI for managing MySQL
- **phpMyAdmin** - Web-based interface (included with XAMPP)
- **HeidiSQL** - Lightweight alternative

### MongoDB Tools:
- **MongoDB Compass** - Official GUI (installed with MongoDB)
- **Studio 3T** - Advanced MongoDB IDE
- **Robo 3T** - Lightweight MongoDB client

---

## 📋 Database Schemas

### MySQL - Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  department VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'moderator', 'admin') DEFAULT 'student',
  verified BOOLEAN DEFAULT FALSE,
  otp VARCHAR(6),
  otp_expiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### MongoDB - Companies Collection

```javascript
{
  _id: ObjectId,
  name: String,           // Company name
  role: String,           // Job role/position
  logo: String,           // Logo filename
  jobDescription: String,
  eligibleStudentsFile: String,
  attachmentFile: String,
  eligibleStudents: Array,
  totalEligibleStudents: Number,
  status: String,         // 'active' or 'inactive'
  createdBy: String,
  updatedBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔍 Troubleshooting

### MySQL Issues

**Problem**: Can't connect to MySQL
```
Solution:
1. Check if MySQL service is running
2. Verify port 3306 is not blocked
3. Check credentials in .env
4. Test connection: mysql -u root -p
```

**Problem**: Database not found
```
Solution:
1. Create database: CREATE DATABASE easyprep_db;
2. Run schema file: source database/schema.sql
```

**Problem**: Access denied for user 'root'
```
Solution:
1. Reset MySQL password
2. Update DB_PASSWORD in .env
3. Or create new user with privileges
```

### MongoDB Issues

**Problem**: MongoDB not starting
```
Solution:
1. Check if already running: netstat -an | findstr "27017"
2. Start service: net start MongoDB
3. Or run manually: mongod --dbpath "C:\data\db"
```

**Problem**: Connection timeout
```
Solution:
1. Verify MongoDB is running
2. Check firewall settings
3. Try: MONGODB_URI=mongodb://127.0.0.1:27017/easyprep
```

### Email Issues

**Problem**: OTP emails not sending
```
Solution:
See EMAIL_SETUP_GUIDE.md for complete Gmail setup
1. Use App Password, not regular password
2. Enable 2-Step Verification
3. Check EMAIL_HOST=smtp.gmail.com
```

---

## ✅ Setup Checklist

Before running the application, verify:

- [ ] MySQL installed and running on port 3306
- [ ] Database `easyprep_db` created
- [ ] Schema tables created successfully
- [ ] MongoDB installed and running on port 27017
- [ ] `.env` file created with all values filled
- [ ] MySQL credentials correct in `.env`
- [ ] MongoDB URI correct in `.env`
- [ ] Gmail App Password generated and added to `.env`
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend server starts without errors
- [ ] Health check endpoint responds
- [ ] Test email sent successfully

---

## 🎯 Next Steps

Once databases are set up:

1. ✅ Start backend: `npm run dev` (in backend folder)
2. ✅ Start frontend: `npm run dev` (in root folder)
3. ✅ Test signup flow with real email
4. ✅ Verify OTP email received
5. ✅ Complete OTP verification
6. ✅ Test login
7. ✅ Access dashboard

---

## 📚 Additional Resources

- MySQL Documentation: https://dev.mysql.com/doc/
- MongoDB Documentation: https://docs.mongodb.com/
- Nodemailer (Email): https://nodemailer.com/
- Gmail App Passwords: https://support.google.com/accounts/answer/185833

---

**Need Help?** Check these files:
- `EMAIL_SETUP_GUIDE.md` - Email configuration
- `BACKEND_OVERVIEW.md` - Backend architecture
- `README.md` - General setup instructions
