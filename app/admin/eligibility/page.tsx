"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail,
  User,
  FileQuestion,
  Shield,
  Zap,
  RefreshCw,
  Settings,
  TrendingUp,
  Users,
  Upload,
  FileText,
  Download
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EligibilityUser {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "suspended"
  emailVerified: boolean
  profileComplete: boolean
  questionsSubmitted: number
  questionsApproved: number
  contributionRating: number
  lastSubmission: string
  eligibilityStatus: "eligible" | "ineligible" | "restricted"
  restrictions: string[]
  eligibilityReasons: string[]
  college?: string
  branch?: string
  role: string
  joinDate: string
}

interface EligibilityRule {
  id: string
  name: string
  description: string
  type: "boolean" | "number" | "string"
  enabled: boolean
  value: string | number | boolean
  operator?: "greater" | "less" | "equal" | "contains"
}

export default function EligibilityMonitor() {
  const [searchQuery, setSearchQuery] = useState("")
  const [eligibilityFilter, setEligibilityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<{
    total: number
    processed: number
    eligible: number
    ineligible: number
    errors: string[]
  } | null>(null)
  const { toast } = useToast()

  // Mock eligibility data
  const mockUsers: EligibilityUser[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@college.edu",
      status: "active",
      emailVerified: true,
      profileComplete: true,
      questionsSubmitted: 23,
      questionsApproved: 18,
      contributionRating: 4.2,
      lastSubmission: "2 hours ago",
      eligibilityStatus: "eligible",
      restrictions: [],
      eligibilityReasons: ["Email verified", "Profile complete", "Good contribution rating"],
      college: "MIT",
      branch: "Computer Science",
      role: "student",
      joinDate: "2023-09-15"
    },
    {
      id: "2",
      name: "Jane Smith", 
      email: "jane.smith@university.edu",
      status: "active",
      emailVerified: true,
      profileComplete: true,
      questionsSubmitted: 45,
      questionsApproved: 42,
      contributionRating: 4.8,
      lastSubmission: "1 day ago",
      eligibilityStatus: "eligible",
      restrictions: [],
      eligibilityReasons: ["Email verified", "Profile complete", "Excellent contribution rating"],
      college: "Stanford",
      branch: "Software Engineering", 
      role: "student",
      joinDate: "2023-08-22"
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.j@example.com",
      status: "active",
      emailVerified: false,
      profileComplete: false,
      questionsSubmitted: 2,
      questionsApproved: 0,
      contributionRating: 0,
      lastSubmission: "Never",
      eligibilityStatus: "ineligible",
      restrictions: ["Email not verified", "Profile incomplete"],
      eligibilityReasons: [],
      role: "student",
      joinDate: "2024-01-10"
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@college.edu",
      status: "suspended",
      emailVerified: true,
      profileComplete: true,
      questionsSubmitted: 8,
      questionsApproved: 2,
      contributionRating: 2.1,
      lastSubmission: "3 days ago",
      eligibilityStatus: "restricted",
      restrictions: ["Account suspended", "Low contribution rating"],
      eligibilityReasons: [],
      college: "UC Berkeley",
      branch: "Computer Science",
      role: "student", 
      joinDate: "2023-11-05"
    },
    {
      id: "5",
      name: "Alex Chen",
      email: "alex.chen@university.edu",
      status: "active",
      emailVerified: true,
      profileComplete: false,
      questionsSubmitted: 3,
      questionsApproved: 3,
      contributionRating: 3.2,
      lastSubmission: "1 week ago",
      eligibilityStatus: "ineligible",
      restrictions: ["Profile incomplete"],
      eligibilityReasons: ["Email verified"],
      college: "CMU",
      branch: "Data Science",
      role: "student",
      joinDate: "2023-12-01"
    }
  ]

  const eligibilityRules: EligibilityRule[] = [
    {
      id: "1",
      name: "Email Verification",
      description: "User must have a verified email address",
      type: "boolean",
      enabled: true,
      value: true
    },
    {
      id: "2", 
      name: "Profile Completion",
      description: "User profile must be complete with college and branch info",
      type: "boolean",
      enabled: true,
      value: true
    },
    {
      id: "3",
      name: "Account Status",
      description: "Account must be active (not suspended or inactive)",
      type: "string",
      enabled: true,
      value: "active",
      operator: "equal"
    },
    {
      id: "4",
      name: "Minimum Contribution Rating",
      description: "User must have a contribution rating of at least 3.0",
      type: "number",
      enabled: true,
      value: 3.0,
      operator: "greater"
    },
    {
      id: "5",
      name: "Daily Submission Limit",
      description: "Maximum 5 questions per day",
      type: "number",
      enabled: true,
      value: 5,
      operator: "less"
    },
    {
      id: "6",
      name: "Weekly Submission Limit", 
      description: "Maximum 20 questions per week",
      type: "number",
      enabled: true,
      value: 20,
      operator: "less"
    }
  ]

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEligibility = eligibilityFilter === "all" || user.eligibilityStatus === eligibilityFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    
    return matchesSearch && matchesEligibility && matchesStatus
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check if file is Excel format
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.csv'
      ]
      
      if (file.type === 'text/csv' || validTypes.includes(file.type) || 
          file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        setUploadedFile(file)
        toast({
          title: "File Selected",
          description: `${file.name} ready for upload`,
        })
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select an Excel file (.xlsx, .xls) or CSV file",
          variant: "destructive"
        })
      }
    }
  }

  const handleProcessExcel = async () => {
    if (!uploadedFile) return

    setIsUploading(true)
    try {
      // Mock processing - replace with real Excel processing logic
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock results
      const results = {
        total: 150,
        processed: 147,
        eligible: 134,
        ineligible: 13,
        errors: [
          "Row 25: Missing email address",
          "Row 48: Invalid college format",
          "Row 92: Duplicate entry"
        ]
      }
      
      setUploadResults(results)
      toast({
        title: "Excel Processing Complete",
        description: `Processed ${results.processed} students. ${results.eligible} eligible, ${results.ineligible} ineligible.`,
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to process Excel file. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownloadTemplate = () => {
    // Mock template download - replace with real template file
    const csvContent = "Name,Email,College,Branch,Student_ID,Year\nJohn Doe,john.doe@college.edu,MIT,Computer Science,CS2023001,3\nJane Smith,jane.smith@college.edu,MIT,Electrical Engineering,EE2023002,2"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'student_eligibility_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Template Downloaded",
      description: "Excel template has been downloaded successfully",
    })
  }

  const getEligibilityBadge = (status: string) => {
    switch (status) {
      case "eligible":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Eligible</Badge>
      case "ineligible":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Ineligible</Badge>
      case "restricted":
        return <Badge className="bg-orange-100 text-orange-800"><AlertTriangle className="h-3 w-3 mr-1" />Restricted</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleRevalidateEligibility = async (userId: string) => {
    toast({
      title: "Eligibility Revalidated",
      description: "User eligibility has been rechecked against current rules",
    })
  }

  const handleBulkRevalidate = async () => {
    toast({
      title: "Bulk Revalidation Started",
      description: "Revalidating eligibility for all users...",
    })
  }

  const handleGrantEligibility = async (userId: string) => {
    toast({
      title: "Eligibility Granted",
      description: "User has been granted temporary eligibility",
    })
  }

  const handleRevokeEligibility = async (userId: string) => {
    toast({
      title: "Eligibility Revoked",
      description: "User eligibility has been revoked",
      variant: "destructive"
    })
  }

  const eligibleCount = mockUsers.filter(u => u.eligibilityStatus === "eligible").length
  const ineligibleCount = mockUsers.filter(u => u.eligibilityStatus === "ineligible").length
  const restrictedCount = mockUsers.filter(u => u.eligibilityStatus === "restricted").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-8 w-8" />
            Eligibility Monitor
          </h1>
          <p className="text-muted-foreground">Monitor and manage user eligibility for question submission</p>
        </div>
        <Button onClick={handleBulkRevalidate} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Revalidate All Users
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eligible</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{eligibleCount}</div>
            <Progress value={(eligibleCount / mockUsers.length) * 100} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ineligible</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{ineligibleCount}</div>
            <Progress value={(ineligibleCount / mockUsers.length) * 100} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restricted</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{restrictedCount}</div>
            <Progress value={(restrictedCount / mockUsers.length) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Bulk Student Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk Student Upload
            </CardTitle>
            <CardDescription>
              Upload Excel file to add multiple eligible students at once
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="excel-upload">Choose Excel File</Label>
              <Input
                id="excel-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: .xlsx, .xls, .csv (Max 10MB)
              </p>
            </div>
            
            {uploadedFile && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">{uploadedFile.name}</span>
                  </div>
                  <Badge variant="outline">{(uploadedFile.size / 1024).toFixed(1)} KB</Badge>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleDownloadTemplate} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Template
              </Button>
              <Button 
                onClick={handleProcessExcel}
                disabled={!uploadedFile || isUploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? "Processing..." : "Process File"}
              </Button>
            </div>

            {uploadResults && (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium">Upload Results</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div>Total Students: <span className="font-medium">{uploadResults.total}</span></div>
                    <div>Processed: <span className="font-medium">{uploadResults.processed}</span></div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-green-600">Eligible: <span className="font-medium">{uploadResults.eligible}</span></div>
                    <div className="text-red-600">Ineligible: <span className="font-medium">{uploadResults.ineligible}</span></div>
                  </div>
                </div>
                {uploadResults.errors.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-red-600">Processing Errors:</h5>
                    <ul className="text-xs text-red-600 space-y-1">
                      {uploadResults.errors.map((error, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-red-400">•</span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-2">Required Columns:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>Name</strong> - Full name of the student</li>
                  <li>• <strong>Email</strong> - Valid email address</li>
                  <li>• <strong>College</strong> - Institution name</li>
                  <li>• <strong>Branch</strong> - Department/Branch</li>
                  <li>• <strong>Student_ID</strong> - Unique student identifier</li>
                  <li>• <strong>Year</strong> - Current academic year</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">File Requirements:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Maximum file size: 10MB</li>
                  <li>• Supported formats: .xlsx, .xls, .csv</li>
                  <li>• First row should contain column headers</li>
                  <li>• No empty rows in between data</li>
                </ul>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Tip:</strong> Download the template file to see the correct format and column structure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Eligibility Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Eligibility Rules
          </CardTitle>
          <CardDescription>Current rules for question submission eligibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligibilityRules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{rule.name}</h4>
                  <Badge className={rule.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {rule.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                <div className="text-sm">
                  <strong>Value:</strong> {rule.value?.toString()} {rule.operator && `(${rule.operator})`}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={eligibilityFilter} onValueChange={setEligibilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Eligibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Eligibility</SelectItem>
                <SelectItem value="eligible">Eligible</SelectItem>
                <SelectItem value="ineligible">Ineligible</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Eligibility Status ({filteredUsers.length})</CardTitle>
          <CardDescription>Monitor and manage user eligibility for question submission</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Eligibility</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Contributions</TableHead>
                <TableHead>Last Submission</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        {user.college && (
                          <div className="text-xs text-muted-foreground">{user.college}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getEligibilityBadge(user.eligibilityStatus)}
                      {user.restrictions.length > 0 && (
                        <div className="text-xs text-red-600">
                          {user.restrictions.slice(0, 2).join(", ")}
                          {user.restrictions.length > 2 && ` +${user.restrictions.length - 2} more`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {user.emailVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">Email</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.profileComplete ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">Profile</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <strong>{user.questionsSubmitted}</strong> submitted
                      </div>
                      <div className="text-sm">
                        <strong>{user.questionsApproved}</strong> approved
                      </div>
                      <div className="text-sm">
                        <strong>{user.contributionRating.toFixed(1)}</strong> ★ rating
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{user.lastSubmission}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRevalidateEligibility(user.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage Eligibility</DialogTitle>
                            <DialogDescription>
                              Override eligibility rules for {user.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Current Status</h4>
                              <div className="space-y-2">
                                <div>Eligibility: {getEligibilityBadge(user.eligibilityStatus)}</div>
                                <div>Account Status: {getStatusBadge(user.status)}</div>
                              </div>
                            </div>
                            
                            {user.restrictions.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Restrictions</h4>
                                <ul className="text-sm space-y-1">
                                  {user.restrictions.map((restriction, index) => (
                                    <li key={index} className="text-red-600">• {restriction}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {user.eligibilityReasons.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Eligible Criteria Met</h4>
                                <ul className="text-sm space-y-1">
                                  {user.eligibilityReasons.map((reason, index) => (
                                    <li key={index} className="text-green-600">• {reason}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            {user.eligibilityStatus !== "eligible" && (
                              <Button 
                                onClick={() => handleGrantEligibility(user.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Grant Eligibility
                              </Button>
                            )}
                            {user.eligibilityStatus === "eligible" && (
                              <Button 
                                variant="destructive"
                                onClick={() => handleRevokeEligibility(user.id)}
                              >
                                Revoke Eligibility
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}