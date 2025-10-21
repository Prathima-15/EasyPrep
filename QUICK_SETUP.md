# Quick Setup Instructions

## Step 1: Install Backend Dependencies
```powershell
cd "e:\Mini Project\EasyPrep\backend"
npm install
```

## Step 2: Configure Environment Variables
Open `backend/.env` and update with your credentials:
```env
DB_PASSWORD=your_mysql_root_password
MONGODB_URI=mongodb://localhost:27017/easyprep
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Step 3: Import MySQL Schema
```powershell
# Using MySQL command line (adjust path if needed)
mysql -u root -p < "e:\Mini Project\EasyPrep\backend\database\schema.sql"

# Or if mysql is not in PATH:
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < "e:\Mini Project\EasyPrep\backend\database\schema.sql"
```

## Step 4: Start MongoDB
```powershell
# MongoDB should be running as a service
# Check status:
Get-Service -Name MongoDB

# Or start it:
Start-Service -Name MongoDB
```

## Step 5: Start Backend Server
```powershell
cd "e:\Mini Project\EasyPrep\backend"
npm run dev
```

Expected output:
```
✓ MySQL Database connected successfully
✓ MongoDB connected successfully
🚀 Server running on port 5000
```

## Step 6: Start Frontend
Open a new terminal:
```powershell
cd "e:\Mini Project\EasyPrep"
npm run dev
```

## Step 7: Test the Application
1. Open browser: http://localhost:3000
2. Go to `/auth` page
3. Click "Sign up" (student or staff)
4. Fill the form and submit
5. You should see toast notifications (no more alert dialogs!)
6. Check backend terminal for API calls

## Next Steps:
- Continue building MongoDB routes for companies/questions
- Integrate frontend with backend APIs
- Test authentication flow end-to-end
