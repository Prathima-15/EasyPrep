# Reviews & Questions Feature - Debug Guide

## Current Setup

### ✅ What's Working
1. **MongoDB Models**: Company, Review, and Question models are properly defined
2. **API Routes**: Backend routes are properly registered at:
   - GET `/api/companies/:companyId/reviews` - Fetch reviews
   - POST `/api/companies/:companyId/reviews` - Create review
   - GET `/api/companies/:companyId/questions` - Fetch questions
   - POST `/api/companies/:companyId/questions` - Create questions
3. **Frontend Components**: 
   - `AddReviewQuestionDialog` - Simplified question form (no tags, category, difficulty)
   - `CompanyTabs` - Display reviews and questions

### 🔍 How It Works

#### 1. Company Creation
- Companies are created in MongoDB with a unique `_id` (ObjectId)
- Example: `673d8a2e5f1b2c3d4e5f6789`

#### 2. Review/Question Submission
- When you submit a review or question, it stores:
  ```javascript
  {
    companyId: "673d8a2e5f1b2c3d4e5f6789", // MongoDB ObjectId
    companyName: "Google Inc.",
    studentId: 123, // MySQL user ID
    studentName: "John Doe",
    // ... other fields
  }
  ```

#### 3. Data Fetching
- Frontend calls: `/api/companies/${companyId}/reviews`
- Backend filters: `Review.find({ companyId: companyId })`
- Same for questions

### 🐛 Why Data Might Not Show

#### Reason 1: No Data Yet
- Have you submitted any reviews or questions?
- Check MongoDB to see if documents exist

#### Reason 2: Wrong Company ID
- The `companyId` in the URL must match the MongoDB `_id`
- Example: `/dashboard/companies/673d8a2e5f1b2c3d4e5f6789`

#### Reason 3: Status Filter
- Reviews default filter: `status = 'approved'`
- Questions default filter: `status = 'approved'` (but auto-approved)
- Check if status field is correct

### 📝 Testing Steps

1. **Check Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   - Server should show: "MongoDB: Connected"

2. **Check MongoDB Data**
   ```bash
   # In MongoDB Shell or Compass
   use easyprep
   
   # Check companies
   db.companies.find()
   
   # Check reviews
   db.reviews.find()
   
   # Check questions
   db.questions.find()
   ```

3. **Check Console Logs**
   - Backend logs will show:
     ```
     Fetching reviews for companyId: 673d8a2e5f1b2c3d4e5f6789
     Found 0 reviews for company 673d8a2e5f1b2c3d4e5f6789
     ```
   - Frontend logs will show API responses

4. **Submit Test Data**
   - Go to any company details page
   - Click "Add Review/Question" button
   - Submit a review with:
     - Role: Software Engineer
     - Rating: 5 stars
     - Difficulty: Medium
     - Summary: Great experience
     - Pros: Good culture
     - Cons: Long hours
     - Topics: DSA, System Design
   
   - Submit a question with:
     - Question: Explain closures in JavaScript
     - Answer: (optional)

5. **Verify Data Appears**
   - Refresh the page
   - Check "Reviews" tab - should show your review
   - Check "Questions" tab - should show your question

### 🔧 Added Debug Logging

I've added console.log statements in:
- **Backend** (`backend/src/routes/reviews.js`):
  - Logs when fetching reviews/questions
  - Logs when creating reviews/questions
  - Logs company found/not found

Check your backend terminal for these logs when testing.

### 🎯 Next Steps

1. **Restart Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test the Flow**:
   - Open a company details page
   - Open browser console (F12)
   - Submit a review and question
   - Watch both frontend console and backend terminal

3. **Check for Errors**:
   - Frontend: Check browser console
   - Backend: Check terminal output
   - Look for red error messages

### 💡 Tips

- Each company has a unique MongoDB `_id`
- Reviews and questions are linked to companies via `companyId`
- The simplified question form now only asks for:
  - Question Text (required)
  - Answer (optional)
- Category and difficulty are auto-set to:
  - Category: "Technical / DSA"
  - Difficulty: "Medium"
- AI classification can be added later

### 🚨 Common Issues

1. **"Company not found"**: 
   - Wrong companyId in URL
   - Company doesn't exist in MongoDB

2. **"Failed to fetch reviews"**:
   - Backend server not running
   - MongoDB not connected
   - CORS error (check backend logs)

3. **Empty tabs**:
   - No data submitted yet
   - Wrong status filter
   - CompanyId mismatch

4. **"Not authorized"**:
   - Not logged in
   - JWT token expired
   - Missing authorization header
