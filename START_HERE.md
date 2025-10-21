# 🚀 START HERE - Quick Launch Guide

## 1️⃣ Install Backend Dependencies (1 minute)
```powershell
cd "e:\Mini Project\EasyPrep\backend"
npm install
```

## 2️⃣ Configure Backend Environment (2 minutes)
Open `backend/.env` and update these 3 lines:
```env
DB_PASSWORD=YourMySQLPassword
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

## 3️⃣ Create Database (1 minute)
```powershell
# Option A: If mysql is in PATH
mysql -u root -p < "e:\Mini Project\EasyPrep\backend\database\schema.sql"

# Option B: Use full path
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < "e:\Mini Project\EasyPrep\backend\database\schema.sql"
```
Enter your MySQL password when prompted.

## 4️⃣ Start Backend (30 seconds)
```powershell
cd "e:\Mini Project\EasyPrep\backend"
npm run dev
```

✅ You should see:
```
✓ MySQL Database connected successfully
✓ MongoDB connected successfully
🚀 Server running on port 5000
```

## 5️⃣ Start Frontend (30 seconds)
Open a NEW PowerShell terminal:
```powershell
cd "e:\Mini Project\EasyPrep"
npm run dev
```

## 6️⃣ Test It! (1 minute)
1. Open browser: http://localhost:3000
2. Click on "Sign up" under Student or Staff
3. Fill the form
4. See beautiful toast notifications! 🎉

---

## ⚠️ Common Issues

### "npm install" fails?
```powershell
npm cache clean --force
npm install
```

### Backend can't connect to MySQL?
- Make sure MySQL service is running
- Check password in `.env` is correct
- Try: `Get-Service -Name MySQL*`

### Backend can't connect to MongoDB?
- Make sure MongoDB service is running
- Try: `Get-Service -Name MongoDB`
- Or: `Start-Service -Name MongoDB`

### Port 5000 already in use?
Change PORT in `backend/.env`:
```env
PORT=5001
```
And update frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## 📚 Full Documentation
- See `PROJECT_STATUS.md` for complete overview
- See `QUICK_SETUP.md` for detailed setup
- See `backend/SETUP_DATABASE.md` for database help

## 🎯 Quick Test Checklist
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Toast notifications working (no alert dialogs)
- [ ] Can submit signup form
- [ ] OTP modal appears
- [ ] Backend terminal shows API requests

## 🎉 You're All Set!
Everything is configured and ready. Just follow the 6 steps above and you'll be running in 5 minutes!

Need help? Check the other documentation files or the backend terminal for error messages.
