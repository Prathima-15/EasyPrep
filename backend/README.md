# EasyPrep Backend

Backend server for EasyPrep - Placement Preparation Platform

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Multer** - File upload handling
- **XLSX** - Excel file parsing

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure MySQL Database

Make sure MySQL is installed and running on your system.

Create the database:

```bash
mysql -u root -p
```

Then run the schema file:

```bash
mysql -u root -p < database/schema.sql
```

Or manually:

```sql
source database/schema.sql
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

- `DB_PASSWORD` - Your MySQL password
- `JWT_SECRET` - Generate a secure random string
- `EMAIL_USER` - Your Gmail address
- `EMAIL_PASSWORD` - Gmail App Password (not your regular password)

**Gmail Setup for Email:**
1. Go to Google Account settings
2. Enable 2-Step Verification
3. Generate App Password for "Mail"
4. Use that password in `EMAIL_PASSWORD`

### 4. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### Student Signup
```
POST /api/auth/signup/student
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "department": "CSE",
  "password": "password123"
}
```

#### Coordinator Signup
```
POST /api/auth/signup/coordinator
Body: {
  "name": "Jane Smith",
  "email": "jane@example.com",
  "username": "janesmith",
  "department": "IT",
  "password": "password123"
}
```

#### Admin Signup
```
POST /api/auth/signup/admin
Body: {
  "name": "Admin User",
  "email": "admin@example.com",
  "username": "admin",
  "department": "Placement",
  "password": "password123"
}
```

#### Verify OTP
```
POST /api/auth/verify-otp
Body: {
  "userId": 1,
  "otp": "123456"
}
```

#### Login
```
POST /api/auth/login
Body: {
  "username": "johndoe",
  "password": "password123"
}
```

#### Resend OTP
```
POST /api/auth/resend-otp
Body: {
  "userId": 1
}
```

### Health Check
```
GET /health
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MySQL connection configuration
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   └── User.js              # User model with database queries
│   ├── routes/
│   │   └── auth.js              # Authentication routes
│   ├── utils/
│   │   ├── email.js             # Email sending utilities
│   │   └── helpers.js           # Helper functions
│   └── server.js                # Express server setup
├── database/
│   └── schema.sql               # MySQL database schema
├── uploads/                     # File uploads directory
├── .env                         # Environment variables
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## Database Schema

### Tables

- **users** - Student, Coordinator, and Admin accounts
- **companies** - Company information and job postings
- **eligible_students** - Students eligible for specific companies
- **questions** - Practice questions submitted by students
- **audit_logs** - Activity tracking
- **saved_questions** - Student bookmarks
- **department_mappings** - Coordinator department access control

## Department Mappings

- **IT Coordinator** → Manages IT + ADS students
- **CSE Coordinator** → Manages CSE + CSD + AIML students
- **Other Coordinators** → Manage their own department
- **Placement Coordinator** → Manages ALL departments

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Email OTP verification
- Role-based access control
- SQL injection prevention with parameterized queries
- File upload validation
- CORS protection

## Development

Run in development mode with auto-restart:

```bash
npm run dev
```

## Testing

API testing with tools like Postman or Thunder Client recommended.

## Error Handling

The server includes comprehensive error handling for:
- MySQL errors (duplicate entries, foreign key violations)
- File upload errors (size limits, invalid types)
- Authentication errors (invalid tokens, expired sessions)
- Validation errors (missing fields, invalid formats)

## Support

For issues or questions, please contact the development team.
