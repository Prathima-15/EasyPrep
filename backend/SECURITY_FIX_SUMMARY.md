# Security Fix: OTP Verification Before Database Insertion

## Problem Identified
Users were being created in the database **before** OTP verification, which caused:
- ✗ Unverified accounts accumulating in the database
- ✗ Anyone could spam fake signups
- ✗ Database pollution with potentially invalid email addresses
- ✗ Security vulnerability: accounts existed even if OTP was never verified

## Solution Implemented
Changed to a **two-phase signup process**:

### Phase 1: Temporary Storage (Before OTP Verification)
- User data is stored in an in-memory `pendingSignups` Map
- User receives a **temporary ID** in format: `temp_1729508400000_xy7z9abc2`
- Password is pre-hashed using bcrypt before temporary storage
- OTP and expiry time (10 minutes) stored in the Map
- Automatic cleanup: entries older than 15 minutes are deleted

### Phase 2: Database Creation (After OTP Verification)
- User verifies OTP
- System validates OTP matches and hasn't expired
- **Only then** is the user created in the database with `verified=1`
- Temporary data is removed from Map
- User receives their real database ID

## Files Modified

### 1. `backend/src/routes/auth.js`
**Added:**
- `const bcrypt = require('bcryptjs')` - For password hashing
- `const pendingSignups = new Map()` - Temporary storage for pending signups

**Updated Routes:**
- ✅ `POST /signup/student` - Stores data in Map instead of DB
- ✅ `POST /signup/staff` - Stores data in Map instead of DB  
- ✅ `POST /verify-otp` - Creates user in DB after OTP validation
- ✅ `POST /resend-otp` - Works with both temporary and database users

### 2. `backend/src/models/User.js`
**Added:**
- `markAsVerified(userId)` - Method to mark user as verified
- `isPasswordHashed` parameter in `create()` - Prevents double-hashing

## Flow Comparison

### OLD FLOW (Insecure) ❌
```
1. User submits signup form
2. → Create user in database (verified=0)
3. → Send OTP email
4. User verifies OTP
5. → Update verified=1
```
**Problem:** User exists in DB even if OTP never verified

### NEW FLOW (Secure) ✅
```
1. User submits signup form
2. → Store in pendingSignups Map (tempUserId)
3. → Send OTP email
4. User verifies OTP
5. → Create user in database (verified=1)
6. → Delete from pendingSignups Map
```
**Benefit:** Only verified users exist in database

## Data Structure

### pendingSignups Map Entry
```javascript
{
  "temp_1729508400000_xy7z9abc2": {
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    department: "CSE",
    password: "$2a$10$...", // Already hashed
    role: "student",
    otp: "123456",
    otpExpiry: 1729509000000, // Timestamp
    createdAt: 1729508400000  // Timestamp
  }
}
```

## Automatic Cleanup
- **OTP Expiry:** 10 minutes from creation
- **Session Expiry:** 15 minutes from creation
- Expired entries are automatically removed during cleanup cycles

## API Response Changes

### Signup Routes (`/signup/student`, `/signup/staff`)
**Before:**
```json
{
  "success": true,
  "message": "Signup successful. Please verify OTP.",
  "data": { "userId": 123 }  // Real DB ID
}
```

**After:**
```json
{
  "success": true,
  "message": "Signup successful. Please verify OTP.",
  "data": { "userId": "temp_1729508400000_xy7z9abc2" }  // Temporary ID
}
```

### Verify OTP Route (`/verify-otp`)
**After (new behavior):**
```json
{
  "success": true,
  "message": "Email verified successfully. Account created!",
  "data": { "userId": 123 }  // Real DB ID returned after creation
}
```

## Frontend Compatibility
✅ **No frontend changes required!**
- Frontend stores `userId` (now tempUserId) in state
- Passes it to verify-otp endpoint
- Backend handles both temporary and real IDs transparently
- After verification, real ID is returned

## Production Considerations

### Current Implementation (Development)
- Uses **in-memory Map** for temporary storage
- ⚠️ **Limitation:** Data lost on server restart
- ✅ **Benefit:** Simple, fast, no additional dependencies

### Recommended for Production
Replace in-memory Map with one of:

1. **Redis** (Recommended)
   ```javascript
   // Set with expiry
   await redis.setex(`pending:${tempUserId}`, 900, JSON.stringify(data));
   // Get
   const data = await redis.get(`pending:${tempUserId}`);
   // Auto-expires after 15 minutes
   ```

2. **Database Table**
   ```sql
   CREATE TABLE pending_signups (
     temp_user_id VARCHAR(50) PRIMARY KEY,
     user_data JSON,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     INDEX (created_at)
   );
   ```

3. **Session Store** (Express-session with Redis/Memcached)

## Testing Checklist

- [ ] Test student signup → verify OTP → check user created in DB
- [ ] Test staff signup → verify OTP → check role assigned correctly
- [ ] Test OTP expiry (wait 10 minutes)
- [ ] Test resend OTP functionality
- [ ] Test session expiry (wait 15 minutes, try to verify)
- [ ] Verify no unverified users in database after failed OTP attempts
- [ ] Test auto-cleanup of expired pending signups
- [ ] Test with both Placement (admin) and non-Placement (moderator) departments

## Security Improvements

✅ **Database Protection**
- Only verified users stored in database
- No accumulation of spam/fake accounts

✅ **Email Validation**
- User must have access to email to create account
- OTP ensures email ownership

✅ **Resource Management**
- Temporary data auto-expires
- No manual cleanup needed

✅ **Data Integrity**
- Password pre-hashed before temporary storage
- No plaintext passwords at any stage

## Rollback Plan
If issues are discovered:
1. Revert `auth.js` routes to previous version
2. Remove `pendingSignups` Map
3. Revert User model changes
4. Frontend continues working (backward compatible)

## Notes
- Temporary IDs are easily identifiable with `temp_` prefix
- Backend maintains backward compatibility with any existing database users
- Frontend remains unchanged and unaffected by this security fix
- Email service (Nodemailer) unchanged
