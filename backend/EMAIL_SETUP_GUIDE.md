# 📧 Email Configuration Guide for EasyPrep

## Problem Solved ✅

**Error**: `ECONNREFUSED 127.0.0.1:587` - Email service couldn't connect to SMTP server

**Solution**: Configure Gmail SMTP settings in `.env` file

---

## 🔧 Quick Setup Steps

### 1. Edit the `.env` File

Open `backend/.env` and update these fields:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

### 2. Get Gmail App Password (REQUIRED)

You **cannot** use your regular Gmail password. You must generate an **App Password**:

#### Steps to Generate Gmail App Password:

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/
   - Sign in with your Gmail account

2. **Enable 2-Step Verification** (if not already enabled)
   - Go to: https://myaccount.google.com/security
   - Click on "2-Step Verification"
   - Follow the setup wizard

3. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - OR search for "App passwords" in Google Account settings
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter name: `EasyPrep Backend`
   - Click **Generate**

4. **Copy the 16-character Password**
   - Google will show a 16-character password like: `abcd efgh ijkl mnop`
   - Copy this password (remove spaces if copying manually)

5. **Paste in `.env` File**
   ```env
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```

### 3. Update Other Environment Variables

Also update these fields in `.env`:

```env
# MySQL Password
DB_PASSWORD=your_actual_mysql_password

# JWT Secret (generate a random string)
JWT_SECRET=some_very_long_random_string_here_at_least_32_characters_long
```

**Generate JWT Secret**: Use this PowerShell command:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 4. Restart the Backend Server

After updating `.env`:

```powershell
# Stop the current server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

---

## ✅ Verify Email Configuration

### Test Email Sending:

1. Start the backend server
2. Try signing up a new user
3. Check the console for:
   ```
   ✅ OTP email sent: <messageId>
   ```
4. Check your email inbox for the OTP

### If Still Getting Errors:

#### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"
- ❌ Using regular Gmail password instead of App Password
- ✅ Generate and use App Password (see step 2 above)

#### Error: "Less secure app access"
- Gmail no longer supports "less secure apps"
- ✅ You MUST use App Passwords with 2-Step Verification

#### Error: "ECONNREFUSED" or "connect timeout"
- ❌ Wrong EMAIL_HOST or EMAIL_PORT
- ✅ Must be: `smtp.gmail.com` and port `587`

#### Error: "EAUTH - Authentication failed"
- ❌ Wrong email or password in `.env`
- ✅ Double-check EMAIL_USER and EMAIL_PASSWORD

---

## 🔐 Security Best Practices

### ⚠️ IMPORTANT: Keep `.env` File Secure

1. **Never commit `.env` to Git**
   - Already added to `.gitignore`
   - Contains sensitive credentials

2. **Don't Share `.env` File**
   - Each developer should have their own
   - Use their own Gmail account and App Password

3. **For Production**
   - Use environment variables on your hosting platform
   - Don't use personal Gmail accounts
   - Consider using:
     - SendGrid
     - AWS SES (Simple Email Service)
     - Mailgun
     - SMTP2GO
     - Postmark

---

## 📝 Alternative: Using Other Email Services

### SendGrid (Recommended for Production)

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

### Outlook/Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_outlook_password
```

### Custom SMTP Server

```env
EMAIL_HOST=your_smtp_server.com
EMAIL_PORT=587
EMAIL_USER=your_username
EMAIL_PASSWORD=your_password
```

---

## 🧪 Test Email Functionality

### Manual Test:

1. Sign up with a real email address
2. Check your email for OTP
3. Verify OTP code works
4. Check backend console logs

### Expected Console Output:

```
✅ OTP email sent: <1234567890abcdef@gmail.com>
```

### Expected Email:

- **Subject**: "Verify Your Email - EasyPrep"
- **Content**: Welcome message with 6-digit OTP code
- **Valid for**: 10 minutes

---

## 📋 Complete `.env` File Example

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YourMySQLPassword123
DB_NAME=easyprep_db
DB_PORT=3306

# MongoDB
MONGODB_URI=mongodb://localhost:27017/easyprep

# JWT
JWT_SECRET=Xy9Kp2Lm4Nq7Rt8Vw1Za3Bc5Df6Hj9Km
JWT_EXPIRES_IN=7d

# Gmail SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=myemail@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## 🎯 Summary

**What Caused the Error:**
- Missing or incorrect `.env` file
- Email host defaulting to localhost (127.0.0.1) instead of Gmail SMTP

**What Fixed It:**
- Created `.env` file with proper Gmail SMTP configuration
- Set `EMAIL_HOST=smtp.gmail.com`
- Set `EMAIL_PORT=587`

**Next Steps:**
1. ✅ Update `.env` with your Gmail and App Password
2. ✅ Update MySQL password
3. ✅ Generate and set JWT_SECRET
4. ✅ Restart backend server
5. ✅ Test signup with real email

---

**Need Help?**
- Gmail App Passwords: https://support.google.com/accounts/answer/185833
- Gmail SMTP Settings: https://support.google.com/a/answer/176600
- Nodemailer Docs: https://nodemailer.com/about/
