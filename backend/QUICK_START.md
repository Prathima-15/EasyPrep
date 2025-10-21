# 🚀 EasyPrep Backend - Quick Setup Guide

## 📋 Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MySQL** (v8.0 or higher) - [Download XAMPP](https://www.apachefriends.org/) or [MySQL](https://dev.mysql.com/downloads/)
3. **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
4. **Gmail Account** (for sending OTP emails)

## 🔧 Step 1: Install Backend Dependencies

Open terminal in the `backend` folder and run:

```powershell
npm install
```

This will install:
- express
- mysql2
- mongoose
- bcryptjs
- jsonwebtoken
- nodemailer
- cors
- multer
- xlsx
- express-validator
- dotenv

## 🗄️ Step 2: Setup MySQL Database

### Option A: Using XAMPP
1. Start **XAMPP Control Panel**
2. Start **Apache** and **MySQL** modules
3. Click **Admin** button next to MySQL (opens phpMyAdmin)
4. Click **SQL** tab
5. Copy and paste the entire content of `backend/database/schema.sql`
6. Click **Go** button
7. Verify tables are created (should see 7 tables)

### Option B: Using MySQL Command Line
```powershell
# Navigate to backend folder
cd backend

# Login to MySQL
mysql -u root -p

# Run the schema file
source database/schema.sql

# Verify
SHOW DATABASES;
USE easyprep_db;
SHOW TABLES;
```

You should see these tables:
- users
- companies (not used - using MongoDB instead)
- eligible_students (not used - using MongoDB instead)
- questions (not used - using MongoDB instead)
- audit_logs (not used - using MongoDB instead)
- saved_questions (not used - using MongoDB instead)
- department_mappings

## 🍃 Step 3: Setup MongoDB

### Option A: Using MongoDB Compass (Recommended)
1. Install [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Open Compass
3. Connect to `mongodb://localhost:27017`
4. Database will be created automatically when server starts

### Option B: Using MongoDB Command Line
```powershell
# Start MongoDB service
mongod

# In another terminal, connect to MongoDB
mongo

# Create database (will be created automatically by server)
use easyprep
```

## ⚙️ Step 4: Configure Environment Variables

1. Open `backend/.env` file
2. Update the following values:

```env
# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD  # ← Change this
DB_NAME=easyprep_db
DB_PORT=3306

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/easyprep

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this  # ← Change this to random string
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com          # ← Your Gmail address
EMAIL_PASSWORD=your_app_password          # ← Gmail App Password (see below)

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 📧 How to Get Gmail App Password:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled
3. Go to **App passwords** section
4. Select **Mail** and **Other (Custom name)**
5. Enter "EasyPrep Backend"
6. Click **Generate**
7. Copy the 16-character password
8. Paste it in `.env` file as `EMAIL_PASSWORD`

## 🚀 Step 5: Start the Backend Server

### Development Mode (with auto-reload):
```powershell
npm run dev
```

### Production Mode:
```powershell
npm start
```

You should see:
```
✅ MySQL Database connected successfully
✓ MongoDB connected successfully
🚀 Server running on port 5000
📡 Environment: development
🌐 API URL: http://localhost:5000
💾 MySQL: Connected for Authentication
🍃 MongoDB: Connected for Application Data
```

## ✅ Step 6: Test the Backend

Open your browser or Postman and test these endpoints:

### Health Check:
```
GET http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-21T..."
}
```

### Test Student Signup:
```
POST http://localhost:5000/api/auth/signup/student
Content-Type: application/json

{
  "name": "Test Student",
  "email": "test@student.com",
  "username": "teststudent",
  "department": "IT",
  "password": "password123"
}
```

Expected response:
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "userId": 1,
    "email": "test@student.com"
  }
}
```

Check your email for OTP!

## 🔍 Troubleshooting

### MySQL Connection Failed
```powershell
# Check if MySQL is running
netstat -ano | findstr :3306

# Start MySQL in XAMPP Control Panel
# Or start MySQL service:
net start MySQL80
```

### MongoDB Connection Failed
```powershell
# Check if MongoDB is running
mongosh

# If not installed as service, start manually:
mongod --dbpath C:\data\db
```

### Port Already in Use
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or change port in .env file
PORT=5001
```

### Email Not Sending
1. Verify Gmail credentials in `.env`
2. Make sure 2-Step Verification is enabled
3. Use App Password, not regular password
4. Check spam folder
5. Try with different email provider if needed

## 📊 Database Status

After setup, you should have:

### MySQL (localhost:3306)
- Database: `easyprep_db`
- Tables: `users`, `department_mappings`
- Sample data: 24 department mappings

### MongoDB (localhost:27017)
- Database: `easyprep`
- Collections: (created automatically on first use)
  - `companies`
  - `questions`
  - `savedquestions`
  - `auditlogs`

## 🎯 Next Steps

1. ✅ Backend is running
2. ⏭️ Test signup and login
3. ⏭️ Connect frontend to backend
4. ⏭️ Create company/question routes
5. ⏭️ Test file upload (Excel)
6. ⏭️ Deploy to production

## 📚 API Documentation

See `BACKEND_OVERVIEW.md` for complete API documentation and data models.

## 🆘 Need Help?

- Check `backend/README.md`
- Check `backend/DATABASE_CONNECTIVITY_STATUS.md`
- Check `backend/SETUP_DATABASE.md`
- See error logs in terminal

## 🔐 Security Notes

- Never commit `.env` file to Git
- Change JWT_SECRET to a strong random string
- Use strong passwords for database
- Keep email credentials secure
- Enable 2FA on Gmail account
