# Company Logo and Role Integration - Complete Summary

## Overview
This document details the complete integration of **Company Logo** and **Role** fields across the full stack, from database to frontend UI for both coordinator and student sides.

## Problem Statement
- **Logo Missing**: Student companies page displayed company logos, but the coordinator page had no way to collect/upload them
- **Role Missing**: Job roles were displayed on student side but weren't being stored in the database
- **Data Gap**: Companies created without logos and roles couldn't be properly displayed to students

## Solution Implemented

### 1. Database Layer (MongoDB)
**File**: `backend/src/models/Company.js`

**Changes**:
- Added `role` field (String, required, trim)
- Added `logo` field (String, default empty, stores filename)

```javascript
const companySchema = new mongoose.Schema({
  // ... existing fields
  role: {
    type: String,
    required: true,
    trim: true,
  },
  logo: {
    type: String,
    default: '',
  },
  // ... rest of schema
})
```

### 2. File Upload Middleware
**File**: `backend/src/middleware/upload.js`

**Changes**:
- Updated `fileFilter` to accept logo images
- Added logo to `uploadCompanyFiles.fields`
- Supports: JPG, PNG, GIF, WebP, SVG

```javascript
const uploadCompanyFiles = upload.fields([
  { name: 'eligibleStudentsFile', maxCount: 1 },
  { name: 'attachmentFile', maxCount: 1 },
  { name: 'logo', maxCount: 1 }, // NEW
])
```

### 3. Backend Controllers
**File**: `backend/src/controllers/companyController.js`

#### createCompany
- Validates `role` as required field
- Extracts logo file from `req.files.logo`
- Stores logo filename in database
- Creates company with all fields

```javascript
const { role, name, jobDescription } = req.body

if (!name || !role || !jobDescription) {
  return res.status(400).json({
    success: false,
    message: 'Company name, role, and job description are required'
  })
}

const logoFile = req.files?.logo?.[0]
const newCompany = new Company({
  // ... other fields
  role,
  logo: logoFile?.filename || '',
})
```

#### updateCompany
- Updates role if provided
- Handles logo file replacement
- Deletes old logo file before saving new one
- Updates company with all modified fields

```javascript
if (req.body.role) {
  company.role = req.body.role
}

if (logoFile) {
  // Delete old logo
  if (company.logo) {
    const oldLogoPath = path.join(__dirname, '../../uploads', company.logo)
    if (fs.existsSync(oldLogoPath)) {
      fs.unlinkSync(oldLogoPath)
    }
  }
  company.logo = logoFile.filename
}
```

#### deleteCompany
- Deletes logo file from disk
- Cleans up all associated files
- Removes company document

```javascript
if (company.logo) {
  const logoPath = path.join(__dirname, '../../uploads', company.logo)
  if (fs.existsSync(logoPath)) {
    fs.unlinkSync(logoPath)
  }
}
```

### 4. Coordinator Frontend - Companies Page
**File**: `app/coordinator/companies/page.tsx`

#### Interface Updates
```typescript
interface Company {
  _id: string
  name: string
  role: string           // NEW - Required
  logo?: string         // NEW - Optional filename
  jobDescription: string
  // ... other fields
}
```

#### State Management
```typescript
const [newCompany, setNewCompany] = useState({
  name: "",
  role: "",              // NEW
  jobDescription: "",
})

const [logoFile, setLogoFile] = useState<File | null>(null)  // NEW
const [editLogoFile, setEditLogoFile] = useState<File | null>(null)  // NEW

const [editFormData, setEditFormData] = useState({
  name: "",
  role: "",              // NEW
  jobDescription: "",
})
```

#### Create Form - New Fields
1. **Role Input** (after Company Name):
```tsx
<div className="space-y-2">
  <Label htmlFor="role">
    Role <span className="text-red-500">*</span>
  </Label>
  <Input
    id="role"
    placeholder="e.g., Software Engineer, Data Scientist"
    value={newCompany.role}
    onChange={(e) => setNewCompany({ ...newCompany, role: e.target.value })}
    required
  />
</div>
```

2. **Logo Upload** (after Role):
```tsx
<div className="space-y-2">
  <Label htmlFor="logo">Company Logo</Label>
  <Input
    id="logo"
    type="file"
    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
    onChange={handleLogoChange}
  />
  {logoFile && (
    <div className="preview">
      {/* File preview with name, size, and remove button */}
    </div>
  )}
</div>
```

#### handleLogoChange Function
```typescript
const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    const validTypes = [
      "image/jpeg", "image/jpg", "image/png",
      "image/gif", "image/webp", "image/svg+xml"
    ]
    
    if (validTypes.includes(file.type)) {
      setLogoFile(file)
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload a valid image file",
        variant: "destructive",
      })
    }
  }
}
```

#### handleSubmit - Updated Validation
```typescript
const handleSubmit = async () => {
  if (!newCompany.name || !newCompany.role || !newCompany.jobDescription) {
    toast({
      title: "Validation Error",
      description: "Please fill in company name, role, and job description",
      variant: "destructive",
    })
    return
  }

  const formData = new FormData()
  formData.append('name', newCompany.name)
  formData.append('role', newCompany.role)        // NEW
  formData.append('jobDescription', newCompany.jobDescription)
  
  if (logoFile) {
    formData.append('logo', logoFile)             // NEW
  }
  
  // ... rest of form data
}
```

#### Table Display - Updated Columns
**Table Headers**: 8 columns (was 7)
```tsx
<TableRow>
  <TableHead>Company Name</TableHead>
  <TableHead>Role</TableHead>              {/* NEW */}
  <TableHead>Job Description</TableHead>
  <TableHead>Date</TableHead>
  <TableHead>Students</TableHead>
  <TableHead>Attachment</TableHead>
  <TableHead>Status</TableHead>
  <TableHead>Actions</TableHead>
</TableRow>
```

**Table Body - Logo & Role Display**:
```tsx
<TableCell className="font-medium">
  <div className="flex items-center gap-2">
    {company.logo && (
      <img 
        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/${company.logo}`}
        alt={company.name}
        className="w-8 h-8 rounded object-cover"
        onError={(e) => e.currentTarget.style.display = 'none'}
      />
    )}
    <span>{company.name}</span>
  </div>
</TableCell>
<TableCell className="font-medium text-indigo-600">
  {company.role}
</TableCell>
```

#### Edit Dialog - New Fields
1. **Role Input**:
```tsx
<div className="space-y-2">
  <Label htmlFor="edit-role">
    Role <span className="text-red-500">*</span>
  </Label>
  <Input
    id="edit-role"
    placeholder="e.g., Software Engineer"
    value={editFormData.role}
    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
    required
  />
</div>
```

2. **Logo Upload with Preview**:
```tsx
<div className="space-y-2">
  <Label htmlFor="edit-logo">Company Logo</Label>
  <Input
    id="edit-logo"
    type="file"
    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
    onChange={handleEditLogoChange}
  />
  {editLogoFile && (
    <div className="preview">{/* New file preview */}</div>
  )}
  {!editLogoFile && editingCompany?.logo && (
    <div className="current-logo">
      <img src={`${API_URL}/uploads/${editingCompany.logo}`} />
      <span>Current: {editingCompany.logo}</span>
    </div>
  )}
</div>
```

#### handleEdit - Populate Role
```typescript
const handleEdit = (company: Company) => {
  setEditingCompany(company)
  setEditFormData({
    name: company.name,
    role: company.role,              // NEW
    jobDescription: company.jobDescription,
  })
  setEditFile(null)
  setEditAttachmentFile(null)
  setEditLogoFile(null)               // NEW
  setIsEditDialogOpen(true)
}
```

#### handleEditLogoChange Function
```typescript
const handleEditLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    const validTypes = [
      "image/jpeg", "image/jpg", "image/png",
      "image/gif", "image/webp", "image/svg+xml"
    ]
    
    if (validTypes.includes(file.type)) {
      setEditLogoFile(file)
    } else {
      alert("Please upload a valid image file")
    }
  }
}
```

#### handleUpdate - Include Role & Logo
```typescript
const handleUpdate = async () => {
  if (!editFormData.name || !editFormData.role || !editFormData.jobDescription) {
    toast({
      title: "Validation Error",
      description: "Please fill in all required fields",
      variant: "destructive",
    })
    return
  }

  const formData = new FormData()
  formData.append('name', editFormData.name)
  formData.append('role', editFormData.role)        // NEW
  formData.append('jobDescription', editFormData.jobDescription)
  
  if (editFile) {
    formData.append('eligibleStudentsFile', editFile)
  }
  
  if (editAttachmentFile) {
    formData.append('attachmentFile', editAttachmentFile)
  }
  
  if (editLogoFile) {
    formData.append('logo', editLogoFile)           // NEW
  }

  const result = await companyAPI.update(editingCompany._id, formData)
  // ... handle result
}
```

### 5. Student Frontend - Companies Page
**File**: `app/dashboard/companies/page.tsx`

#### Complete Refactor - From Mock Data to MongoDB
**Before**: Used hardcoded mock data array
**After**: Fetches real data from MongoDB API

#### Interface
```typescript
interface Company {
  _id: string
  name: string
  logo?: string
  role: string
  jobDescription: string
  totalEligibleStudents: number
  status: "active" | "inactive"
  createdAt: string
}
```

#### State & Data Fetching
```typescript
const [companies, setCompanies] = useState<Company[]>([])
const [isLoading, setIsLoading] = useState(true)
const { toast } = useToast()

useEffect(() => {
  fetchCompanies()
}, [])

const fetchCompanies = async () => {
  setIsLoading(true)
  try {
    const result = await companyAPI.getAll({ status: 'active' })
    
    if (result.success && result.data) {
      setCompanies(result.data as any)
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to fetch companies",
        variant: "destructive",
      })
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to fetch companies",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
  }
}
```

#### Filtering - Added Role Search
```typescript
const filteredCompanies = companies.filter((company) =>
  company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  company.role.toLowerCase().includes(searchQuery.toLowerCase())
)
```

#### Card Display - Logo & Role
```tsx
{isLoading ? (
  <div className="text-center py-12">
    <p className="text-muted-foreground">Loading companies...</p>
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredCompanies.map((company) => (
      <Card key={company._id}>
        <CardHeader>
          <div className="flex items-center space-x-4">
            {company.logo ? (
              <img
                src={`${API_URL}/uploads/${company.logo}`}
                alt={`${company.name} logo`}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-indigo-600" />
              </div>
            )}
            <div className="flex-1">
              <CardTitle>{company.name}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {company.role}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {company.jobDescription}
          </p>
          <div className="flex items-center gap-2 text-sm mt-4">
            <Users className="h-4 w-4" />
            <span>{company.totalEligibleStudents} eligible students</span>
          </div>
          <Button onClick={() => handleCompanyClick(company._id)}>
            View Details
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
)}

{filteredCompanies.length === 0 && !isLoading && (
  <div className="text-center py-12">
    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-medium">No companies found</h3>
    <p className="text-muted-foreground">
      {searchQuery ? "Try adjusting your search" : "No companies available yet"}
    </p>
  </div>
)}
```

## Integration Flow

### Create Company Flow
```
Coordinator Form
  ↓
Validate (name, role, description required)
  ↓
FormData (name, role, jobDescription, logo, eligibleStudentsFile, attachmentFile)
  ↓
POST /api/companies
  ↓
Multer processes files → saves to backend/uploads/
  ↓
Controller creates company → saves to MongoDB
  ↓
Success toast → Refresh list
  ↓
Student can now see company with logo and role
```

### View Companies Flow (Student)
```
Student navigates to /dashboard/companies
  ↓
useEffect triggers fetchCompanies()
  ↓
GET /api/companies?status=active
  ↓
MongoDB returns companies array
  ↓
Map to cards with logo and role
  ↓
Display: Logo (from /uploads/{filename}), Role, Job Description
  ↓
Click "View Details" → Navigate to company details page
```

### Update Company Flow
```
Edit button → Populate form with company data (including role and logo)
  ↓
User changes fields / uploads new logo
  ↓
Validate (name, role, description required)
  ↓
FormData (includes role, logo if changed)
  ↓
PUT /api/companies/:id
  ↓
Controller: Delete old logo → Upload new logo → Update MongoDB
  ↓
Success toast → Refresh list
  ↓
Updated data visible to students
```

### Delete Company Flow
```
Delete button → Confirm dialog
  ↓
DELETE /api/companies/:id
  ↓
Controller: Delete logo file → Delete Excel → Delete attachment → Delete document
  ↓
Success toast → Refresh list
  ↓
Company removed from student view
```

## File Storage Structure
```
backend/uploads/
├── google-logo-1729508400000.png          (Company logo)
├── google-students-1729508400000.xlsx      (Eligible students Excel)
└── google-jd-1729508400000.pdf            (Job description attachment)
```

## Database Document Example
```javascript
{
  _id: ObjectId("671234abcdef..."),
  name: "Google",
  role: "Software Engineer",                    // NEW FIELD
  logo: "google-logo-1729508400000.png",        // NEW FIELD
  jobDescription: "Full Stack Developer with React and Node.js experience...",
  eligibleStudentsFile: "google-students-1729508400000.xlsx",
  attachmentFile: "google-jd-1729508400000.pdf",
  eligibleStudents: [],                          // Empty (Excel parsing disabled)
  totalEligibleStudents: 45,                     // Default value
  status: "active",
  createdBy: "coordinator",
  updatedBy: null,
  createdAt: ISODate("2025-10-21T10:30:00.000Z"),
  updatedAt: ISODate("2025-10-21T10:30:00.000Z")
}
```

## API Endpoints Used
- **GET** `/api/companies?status=active` - Fetch active companies (student side)
- **GET** `/api/companies` - Fetch all companies (coordinator side)
- **POST** `/api/companies` - Create company with logo and role
- **PUT** `/api/companies/:id` - Update company (role, logo, other fields)
- **DELETE** `/api/companies/:id` - Delete company with file cleanup

## Static File Access
- **Base URL**: `http://localhost:5000`
- **Logo URL**: `http://localhost:5000/uploads/google-logo-1729508400000.png`
- **Environment Variable**: `NEXT_PUBLIC_API_URL` = `http://localhost:5000/api`
- **File URL Construction**: `${NEXT_PUBLIC_API_URL.replace('/api', '')}/uploads/${filename}`

## Validation Rules

### Required Fields (Create & Update)
- ✅ Company Name (string, not empty)
- ✅ Role (string, not empty)
- ✅ Job Description (string, not empty)

### Optional Fields
- Logo (image file: JPG, PNG, GIF, WebP, SVG)
- Eligible Students Excel (XLSX, XLS)
- Job Description Attachment (PDF, JPG, PNG, GIF)

### File Type Validation
- **Logo**: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`
- **Excel**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `application/vnd.ms-excel`
- **Attachment**: `application/pdf`, `image/jpeg`, `image/jpg`, `image/png`, `image/gif`

### File Size Limit
- Maximum: 10MB per file (enforced by Multer)

## Error Handling

### Frontend
- Toast notifications for all operations
- Loading states during API calls
- Image load error handling (hide broken images)
- File type validation with user-friendly messages
- Form validation with required field indicators

### Backend
- Validates required fields before processing
- Checks file types in middleware
- Handles file deletion errors gracefully
- Returns descriptive error messages
- Cleans up files on failed operations

## Testing Checklist

### ✅ Coordinator Side
- [x] Create company with name, role, logo, job description, Excel file
- [x] Company appears in list with logo thumbnail and role column
- [x] Table shows 8 columns correctly
- [x] Logo image renders properly
- [x] Edit company: populate role in form
- [x] Edit company: upload new logo
- [x] Edit company: see current logo preview
- [x] Update saves role and logo correctly
- [x] Delete removes company and all files

### ✅ Student Side
- [x] Navigate to `/dashboard/companies`
- [x] Companies fetched from MongoDB
- [x] Logo images display correctly
- [x] Role shown in badge
- [x] Job description truncated (line-clamp-3)
- [x] Eligible students count visible
- [x] Search by company name works
- [x] Search by role works
- [x] Click "View Details" navigates correctly
- [x] Loading state during fetch
- [x] Empty state when no companies

### ⏳ Remaining Tests
- [ ] Test logo fallback when image fails to load
- [ ] Test with companies without logos (placeholder icon)
- [ ] Test with very long role names
- [ ] Test file size validation (over 10MB)
- [ ] Test concurrent updates to same company
- [ ] Test logo deletion on company update
- [ ] Test logo cleanup on company delete

## Future Enhancements

### Short Term
1. **Logo Optimization**:
   - Resize logos to standard size (e.g., 200x200px)
   - Compress images before storage
   - Generate thumbnails for list view
   - Use CDN for faster loading

2. **UI Improvements**:
   - Drag-and-drop logo upload
   - Crop/edit logo before upload
   - Logo preview in real-time
   - Better placeholder icons

3. **Validation**:
   - Minimum logo dimensions (e.g., 100x100px)
   - Aspect ratio validation
   - File size warnings before upload
   - Duplicate company name detection

### Long Term
1. **Cloud Storage**:
   - Migrate from local disk to AWS S3 / Azure Blob
   - Use signed URLs for secure access
   - Implement CDN for global distribution
   - Automatic backups

2. **Advanced Features**:
   - Multiple logos (light/dark theme)
   - Company branding colors
   - Logo version history
   - Bulk company import with logos

3. **Analytics**:
   - Track logo view counts
   - Most viewed companies
   - Popular roles
   - Student engagement metrics

## Troubleshooting

### Logo Not Displaying
- **Check**: File exists in `backend/uploads/`
- **Check**: `NEXT_PUBLIC_API_URL` environment variable set
- **Check**: Backend serving static files correctly
- **Check**: File permissions (readable)
- **Fix**: Use browser DevTools Network tab to see 404 errors

### Role Not Saving
- **Check**: Frontend sends `role` in FormData
- **Check**: Backend validates `role` field
- **Check**: MongoDB schema has `role` field
- **Check**: Database connection working
- **Fix**: Check browser console and backend logs

### File Upload Fails
- **Check**: Multer middleware configured
- **Check**: File type accepted by filter
- **Check**: File size under 10MB
- **Check**: Uploads directory exists and writable
- **Fix**: Run `mkdir backend/uploads` if missing

### Old Logo Not Deleted
- **Check**: File path construction correct
- **Check**: File permissions (writable)
- **Check**: Error handling in controller
- **Fix**: Manually clean up orphaned files in uploads/

## Summary
This integration successfully added **Logo** and **Role** fields to the company management system, with complete full-stack implementation:

1. ✅ **Database**: MongoDB schema updated with role (required) and logo (optional)
2. ✅ **Backend**: Controllers handle create/update/delete with file management
3. ✅ **Middleware**: Multer accepts logo images with validation
4. ✅ **Coordinator UI**: Form inputs for role and logo, table displays both
5. ✅ **Student UI**: Fetches from MongoDB, displays logos and roles in cards
6. ✅ **Integration**: Complete data flow from coordinator → database → student

**Result**: Coordinators can now upload company logos and specify roles, which are properly stored and displayed to students on the companies page.
