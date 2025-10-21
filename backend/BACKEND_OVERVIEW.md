# EasyPrep Backend - Complete Overview

## 📋 Architecture

**Hybrid Database Setup:**
- **MySQL**: User authentication, OTP verification
- **MongoDB**: Companies, Questions, Eligible Students, Saved Questions, Audit Logs

## 🗄️ Database Configuration

### MySQL (Authentication)
```
Host: localhost:3306
Database: easyprep_db
Tables: users, department_mappings
```

### MongoDB (Application Data)
```
URI: mongodb://localhost:27017/easyprep
Collections: companies, questions, savedQuestions, auditLogs
```

## 📁 File Structure

```
backend/
├── src/
│   ├── server.js              # Main server file
│   ├── config/
│   │   ├── database.js        # MySQL connection pool
│   │   └── mongodb.js         # MongoDB connection
│   ├── models/
│   │   ├── User.js            # MySQL user model
│   │   ├── Company.js         # MongoDB company model
│   │   ├── Question.js        # MongoDB question model (TO CREATE)
│   │   ├── SavedQuestion.js   # MongoDB saved questions (TO CREATE)
│   │   └── AuditLog.js        # MongoDB audit logs (TO CREATE)
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── companies.js       # Company CRUD (TO CREATE)
│   │   └── questions.js       # Question CRUD (TO CREATE)
│   ├── middleware/
│   │   └── auth.js            # JWT auth, role-based access
│   ├── controllers/           # Business logic (TO CREATE)
│   └── utils/
│       ├── email.js           # Email sending utilities
│       └── helpers.js         # Helper functions
├── database/
│   └── schema.sql             # MySQL schema
├── uploads/                   # File uploads directory
├── .env                       # Environment variables
└── package.json
```

## 🔑 User Roles & Permissions

### Student
- Register with college email
- Login after OTP verification
- View companies they're eligible for
- Submit interview questions
- Save/bookmark questions
- View own submissions

### Moderator (Coordinator)
- Manage specific departments (IT→IT+ADS, CSE→CSE+CSD+AIML)
- Add companies
- Upload eligible students list (Excel)
- Approve/reject questions
- View analytics for their departments
- Manage students in their departments

### Admin (Placement Cell)
- Full access to all departments
- All coordinator permissions
- View system-wide analytics
- Manage all users
- Access audit logs

## 🔐 Authentication Flow

### Signup Flow:
```
1. POST /api/auth/signup/student (or /coordinator, /admin)
   ↓
2. User created in MySQL (verified=false)
   ↓
3. OTP generated and sent via email
   ↓
4. POST /api/auth/verify-otp
   ↓
5. User verified (verified=true)
   ↓
6. Ready to login
```

### Login Flow:
```
1. POST /api/auth/login
   ↓
2. Validate username/password
   ↓
3. Check if verified
   ↓
4. Generate JWT token
   ↓
5. Return token + user data
```

## 📡 API Endpoints

### Authentication (MySQL)
```
POST   /api/auth/signup/student       - Student registration
POST   /api/auth/signup/coordinator   - Coordinator registration
POST   /api/auth/signup/admin         - Admin registration
POST   /api/auth/verify-otp           - Verify OTP
POST   /api/auth/login                - Login (username/password)
POST   /api/auth/resend-otp           - Resend OTP
```

### Companies (MongoDB) - TO CREATE
```
GET    /api/companies                 - Get all companies (filtered by role)
GET    /api/companies/:id             - Get company details
POST   /api/companies                 - Create company (coordinator/admin)
PUT    /api/companies/:id             - Update company
DELETE /api/companies/:id             - Delete company
POST   /api/companies/:id/eligible    - Upload eligible students (Excel)
GET    /api/companies/:id/eligible    - Get eligible students list
GET    /api/companies/my-eligible     - Get companies student is eligible for
```

### Questions (MongoDB) - TO CREATE
```
GET    /api/questions                 - Get all questions (filtered)
GET    /api/questions/:id             - Get question details
POST   /api/questions                 - Submit question (student)
PUT    /api/questions/:id             - Update question (own questions only)
DELETE /api/questions/:id             - Delete question
PATCH  /api/questions/:id/approve     - Approve question (coordinator/admin)
PATCH  /api/questions/:id/reject      - Reject question (coordinator/admin)
GET    /api/questions/company/:id     - Get questions by company
POST   /api/questions/:id/save        - Save/bookmark question
DELETE /api/questions/:id/unsave      - Remove bookmark
GET    /api/questions/saved           - Get saved questions
```

### Analytics - TO CREATE
```
GET    /api/analytics/dashboard       - Dashboard stats
GET    /api/analytics/companies       - Company statistics
GET    /api/analytics/questions       - Question statistics
GET    /api/analytics/students        - Student participation
```

## 🔒 JWT Token Structure

```javascript
{
  userId: 123,
  role: 'student' | 'moderator' | 'admin',
  iat: 1234567890,
  exp: 1234567890
}
```

## 📊 Data Models

### User (MySQL)
```javascript
{
  id: INT,
  name: STRING,
  email: STRING (unique),
  username: STRING (unique),
  department: STRING,
  password: STRING (hashed),
  role: ENUM('student', 'moderator', 'admin'),
  verified: BOOLEAN,
  otp: STRING,
  otp_expiry: DATETIME,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### Company (MongoDB)
```javascript
{
  _id: ObjectId,
  name: STRING (unique),
  description: STRING,
  website: STRING,
  logo: STRING,
  industry: STRING,
  location: STRING,
  eligibleStudents: [{
    registerNumber: STRING,
    name: STRING,
    department: STRING,
    email: STRING,
    cgpa: NUMBER
  }],
  recruitmentYear: NUMBER,
  recruitmentStatus: ENUM,
  visitDate: DATE,
  createdBy: STRING (email),
  updatedBy: STRING,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

### Question (MongoDB) - TO CREATE
```javascript
{
  _id: ObjectId,
  companyId: ObjectId,
  studentId: NUMBER (MySQL user ID),
  studentEmail: STRING,
  title: STRING,
  description: STRING,
  difficulty: ENUM('Easy', 'Medium', 'Hard'),
  topic: STRING,
  tags: [STRING],
  status: ENUM('pending', 'approved', 'rejected'),
  reviewedBy: STRING (email),
  reviewedAt: DATE,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

## 🛡️ Middleware

### authMiddleware
- Validates JWT token
- Attaches user to req.user
- Checks if user is verified

### requireRole(...roles)
- Checks if user has required role
- Usage: `requireRole('admin', 'moderator')`

### canManageDepartment
- Checks if coordinator can manage specific department
- IT → IT, ADS
- CSE → CSE, CSD, AIML
- Placement → ALL departments

## 📧 Email Templates

### OTP Email
- Beautiful HTML template
- 6-digit OTP code
- 10-minute validity
- Branded with EasyPrep colors

### Password Reset (Future)
- Reset link with token
- Expiry information

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=5000

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=easyprep_db
DB_PORT=3306

# MongoDB
MONGODB_URI=mongodb://localhost:27017/easyprep

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 🚀 Next Steps

1. ✅ MySQL connection configured
2. ✅ MongoDB connection configured
3. ✅ User authentication working
4. ⏳ Create MongoDB models (Question, SavedQuestion, AuditLog)
5. ⏳ Create company routes & controllers
6. ⏳ Create question routes & controllers
7. ⏳ Integrate frontend with backend APIs
8. ⏳ Test authentication flow
9. ⏳ Test file upload (Excel parsing)
10. ⏳ Deploy and configure production environment

## 📝 Notes

- All passwords are hashed using bcryptjs
- OTP expires in 10 minutes
- JWT tokens expire in 7 days
- File uploads limited to 10MB
- Excel files parsed using XLSX library
- CORS enabled for frontend (localhost:3000)
