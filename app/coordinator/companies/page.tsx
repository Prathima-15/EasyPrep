"use client"

import { useState, useEffect } from "react"
import { Building2, Upload, FileText, Users, CheckCircle, Download, Trash2, Eye, Edit, Plus, Paperclip, Image as ImageIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { companyAPI } from "@/lib/api-client"

interface Company {
  _id: string
  name: string
  jobDescription: string
  role: string
  logo?: string
  createdAt: string
  eligibleStudentsFile: string
  totalEligibleStudents: number
  status: "active" | "inactive"
  attachmentFile?: string // PDF or image file
}

export default function CoordinatorCompanyManagementPage() {
  const { toast } = useToast()
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [newCompany, setNewCompany] = useState({
    name: "",
    jobDescription: "",
    role: "",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null) // PDF or image file
  const [logoFile, setLogoFile] = useState<File | null>(null) // Company logo
  const [isUploading, setIsUploading] = useState(false)
  
  // Update/Edit states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    jobDescription: "",
    role: "",
  })
  const [editFile, setEditFile] = useState<File | null>(null)
  const [editAttachmentFile, setEditAttachmentFile] = useState<File | null>(null) // PDF or image for edit
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null) // Logo for edit
  const [isUpdating, setIsUpdating] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate file type
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/vnd.ms-excel") {
        setSelectedFile(file)
      } else {
        alert("Please upload a valid Excel file (.xlsx or .xls)")
      }
    }
  }

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate file type - PDF or images
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif"
      ]
      
      if (validTypes.includes(file.type)) {
        setAttachmentFile(file)
      } else {
        alert("Please upload a valid file (PDF, JPG, PNG, or GIF)")
      }
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate file type - images only
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml"
      ]
      
      if (validTypes.includes(file.type)) {
        setLogoFile(file)
      } else {
        alert("Please upload a valid image file (JPG, PNG, GIF, WebP, SVG)")
      }
    }
  }

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    setIsLoading(true)
    try {
      const result = await companyAPI.getAll()
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCompany.name || !newCompany.jobDescription || !newCompany.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (name, job description, role)",
        variant: "destructive",
      })
      return
    }

    if (!selectedFile) {
      toast({
        title: "Validation Error",
        description: "Please upload an Excel file with eligible students",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('name', newCompany.name)
      formData.append('jobDescription', newCompany.jobDescription)
      formData.append('role', newCompany.role)
      formData.append('eligibleStudentsFile', selectedFile)
      formData.append('createdBy', 'coordinator') // You can get actual user from auth context
      
      if (logoFile) {
        formData.append('logo', logoFile)
      }
      
      if (attachmentFile) {
        formData.append('attachmentFile', attachmentFile)
      }

      const result = await companyAPI.create(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Company created successfully!",
        })
        
        // Refresh companies list
        fetchCompanies()
        
        // Reset form
        setNewCompany({ name: "", jobDescription: "", role: "" })
        setSelectedFile(null)
        setAttachmentFile(null)
        setLogoFile(null)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create company",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create company",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      return
    }

    try {
      const result = await companyAPI.delete(id)
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Company deleted successfully!",
        })
        
        // Refresh companies list
        fetchCompanies()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete company",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete company",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setEditFormData({
      name: company.name,
      role: company.role,
      jobDescription: company.jobDescription,
    })
    setEditFile(null)
    setEditAttachmentFile(null)
    setEditLogoFile(null)
    setIsEditDialogOpen(true)
  }

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/vnd.ms-excel") {
        setEditFile(file)
      } else {
        alert("Please upload a valid Excel file (.xlsx or .xls)")
      }
    }
  }

  const handleEditAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif"
      ]
      
      if (validTypes.includes(file.type)) {
        setEditAttachmentFile(file)
      } else {
        alert("Please upload a valid file (PDF, JPG, PNG, or GIF)")
      }
    }
  }

  const handleEditLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml"
      ]
      
      if (validTypes.includes(file.type)) {
        setEditLogoFile(file)
      } else {
        alert("Please upload a valid image file (JPG, PNG, GIF, WebP, or SVG)")
      }
    }
  }

  const handleUpdate = async () => {
    if (!editFormData.name || !editFormData.role || !editFormData.jobDescription) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required company details (Name, Role, and Job Description)",
        variant: "destructive",
      })
      return
    }

    if (!editingCompany) return

    setIsUpdating(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('name', editFormData.name)
      formData.append('role', editFormData.role)
      formData.append('jobDescription', editFormData.jobDescription)
      formData.append('updatedBy', 'coordinator') // You can get actual user from auth context
      
      if (editFile) {
        formData.append('eligibleStudentsFile', editFile)
      }
      
      if (editAttachmentFile) {
        formData.append('attachmentFile', editAttachmentFile)
      }

      if (editLogoFile) {
        formData.append('logo', editLogoFile)
      }

      const result = await companyAPI.update(editingCompany._id, formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Company updated successfully!",
        })
        
        // Refresh companies list
        fetchCompanies()
        
        // Close dialog and reset
        setIsEditDialogOpen(false)
        setEditingCompany(null)
        setEditFormData({ name: "", role: "", jobDescription: "" })
        setEditFile(null)
        setEditAttachmentFile(null)
        setEditLogoFile(null)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update company",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update company",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const result = await companyAPI.downloadTemplate()
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Template downloaded successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to download template",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to download template",
        variant: "destructive",
      })
    }
  }

  const handleViewEligibleStudents = async (company: Company) => {
    try {
      const result = await companyAPI.getEligibleStudents(company._id)
      
      if (result.success && result.data) {
        // You can show this in a modal or navigate to a details page
        const data = result.data as any
        const studentsInfo = data.students
          .slice(0, 5)
          .map((s: any) => `${s.registerNumber} - ${s.name} (${s.department})`)
          .join('\n')
        
        toast({
          title: `Eligible Students - ${data.companyName}`,
          description: `Total: ${data.students.length} students\n\nShowing first 5:\n${studentsInfo}`,
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch eligible students",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch eligible students",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-indigo-600" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Company Management</h1>
          <p className="text-muted-foreground">Upload company job descriptions and manage eligible students</p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </TabsTrigger>
          <TabsTrigger value="manage">
            <Eye className="h-4 w-4 mr-2" />
            Manage Companies
          </TabsTrigger>
        </TabsList>

        {/* Upload Company Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Company</CardTitle>
              <CardDescription>
                Upload company details, job description, and eligible students list
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Google, Microsoft, Amazon"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    required
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Job Role/Position *</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Software Engineer, Data Analyst, Product Manager"
                    value={newCompany.role}
                    onChange={(e) => setNewCompany({ ...newCompany, role: e.target.value })}
                    required
                  />
                </div>

                {/* Company Logo */}
                <div className="space-y-2">
                  <Label htmlFor="logo">Company Logo (Optional)</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="cursor-pointer"
                  />
                  {logoFile && (
                    <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground mt-2 p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>{logoFile.name}</span>
                        <Badge variant="secondary">{(logoFile.size / 1024).toFixed(2)} KB</Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setLogoFile(null)}
                        className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload company logo (JPG, PNG, GIF, WebP, SVG)
                  </p>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description *</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Enter the complete job description including requirements, responsibilities, and qualifications..."
                    value={newCompany.jobDescription}
                    onChange={(e) => setNewCompany({ ...newCompany, jobDescription: e.target.value })}
                    rows={6}
                    className="resize-none"
                    required
                  />
                  
                  {/* File Upload for Job Description */}
                  <div className="mt-3">
                    <Label htmlFor="attachmentFile" className="text-sm">Or Upload Job Description File (PDF/Image)</Label>
                    <Input
                      id="attachmentFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.gif"
                      onChange={handleAttachmentChange}
                      className="cursor-pointer mt-1"
                    />
                    {attachmentFile && (
                      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground mt-2 p-2 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {attachmentFile.type === "application/pdf" ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <ImageIcon className="h-4 w-4" />
                          )}
                          <span>{attachmentFile.name}</span>
                          <Badge variant="secondary">{(attachmentFile.size / 1024).toFixed(2)} KB</Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAttachmentFile(null)}
                          className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload PDF or image file (JPG, PNG, GIF) instead of typing description
                    </p>
                  </div>
                </div>

                {/* Excel File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="excelFile">Eligible Students (Excel File)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="excelFile"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDownloadTemplate}
                      className="whitespace-nowrap"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Template
                    </Button>
                  </div>
                  {selectedFile && (
                    <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{selectedFile.name}</span>
                        <Badge variant="secondary">{(selectedFile.size / 1024).toFixed(2)} KB</Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                        className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload an Excel file (.xlsx or .xls) containing eligible student details
                  </p>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Company & Eligible Students
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Companies Tab */}
        <TabsContent value="manage" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companies.length}</div>
                <p className="text-xs text-muted-foreground">Active recruitment drives</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Eligible Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {companies.reduce((sum, c) => sum + c.totalEligibleStudents, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across all companies</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Drives</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {companies.filter(c => c.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>
          </div>

          {/* Companies Table */}
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Companies</CardTitle>
              <CardDescription>View and manage all companies and their eligible students</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Job Description</TableHead>
                    <TableHead>Uploaded Date</TableHead>
                    <TableHead>Eligible Students</TableHead>
                    <TableHead>Attachment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                          <span className="text-muted-foreground">Loading companies...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : companies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Building2 className="h-12 w-12 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No companies added yet</p>
                          <p className="text-sm text-muted-foreground">Upload your first company to get started</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    companies.map((company) => (
                      <TableRow key={company._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {company.logo && (
                              <img 
                                src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/${company.logo}`}
                                alt={`${company.name} logo`}
                                className="w-8 h-8 rounded object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            )}
                            <span>{company.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-indigo-600">{company.role}</TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate text-sm text-muted-foreground">
                            {company.jobDescription}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{company.totalEligibleStudents}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {company.attachmentFile ? (
                            <div className="flex items-center gap-1 text-sm">
                              {company.attachmentFile.endsWith('.pdf') ? (
                                <FileText className="h-4 w-4 text-red-500" />
                              ) : (
                                <ImageIcon className="h-4 w-4 text-blue-500" />
                              )}
                              <span className="text-muted-foreground truncate max-w-[100px]">
                                {company.attachmentFile}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">No file</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={company.status === "active" ? "default" : "secondary"}>
                            {company.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewEligibleStudents(company)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(company)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(company._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Company Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Company Details</DialogTitle>
            <DialogDescription>
              Modify company information, job description, and eligible students list
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-companyName">Company Name</Label>
              <Input
                id="edit-companyName"
                placeholder="e.g., Google, Microsoft, Amazon"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="edit-role">
                Role <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-role"
                placeholder="e.g., Software Engineer, Data Scientist"
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                required
              />
            </div>

            {/* Company Logo */}
            <div className="space-y-2">
              <Label htmlFor="edit-logo">Company Logo</Label>
              <Input
                id="edit-logo"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={handleEditLogoChange}
                className="cursor-pointer"
              />
              {editLogoFile && (
                <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>{editLogoFile.name}</span>
                    <Badge variant="secondary">{(editLogoFile.size / 1024).toFixed(2)} KB</Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditLogoFile(null)}
                    className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              )}
              {!editLogoFile && editingCompany?.logo && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/${editingCompany.logo}`} 
                      alt="Current logo"
                      className="w-8 h-8 rounded object-cover"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                    <span>Current: {editingCompany.logo}</span>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Upload JPG, PNG, GIF, WebP, or SVG. Leave empty to keep existing logo.
              </p>
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-jobDescription">Job Description</Label>
              <Textarea
                id="edit-jobDescription"
                placeholder="Enter the complete job description..."
                value={editFormData.jobDescription}
                onChange={(e) => setEditFormData({ ...editFormData, jobDescription: e.target.value })}
                rows={6}
                className="resize-none"
              />
              
              {/* File Upload for Job Description */}
              <div className="mt-3">
                <Label htmlFor="edit-attachmentFile" className="text-sm">Or Upload Job Description File (PDF/Image)</Label>
                <Input
                  id="edit-attachmentFile"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  onChange={handleEditAttachmentChange}
                  className="cursor-pointer mt-1"
                />
                {editAttachmentFile && (
                  <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground mt-2 p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {editAttachmentFile.type === "application/pdf" ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <ImageIcon className="h-4 w-4" />
                      )}
                      <span>{editAttachmentFile.name}</span>
                      <Badge variant="secondary">{(editAttachmentFile.size / 1024).toFixed(2)} KB</Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditAttachmentFile(null)}
                      className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}
                {!editAttachmentFile && editingCompany?.attachmentFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 p-2 border rounded-lg bg-gray-50">
                    <Paperclip className="h-4 w-4" />
                    <span>Current: {editingCompany.attachmentFile}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Upload PDF or image file instead of typing description
                </p>
              </div>
            </div>

            {/* Excel File Upload */}
            <div className="space-y-2">
              <Label htmlFor="edit-excelFile">Eligible Students (Excel File)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="edit-excelFile"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleEditFileChange}
                  className="cursor-pointer"
                />
              </div>
              {editFile && (
                <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{editFile.name}</span>
                    <Badge variant="secondary">{(editFile.size / 1024).toFixed(2)} KB</Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditFile(null)}
                    className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              )}
              {!editFile && editingCompany && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border rounded-lg bg-gray-50">
                  <FileText className="h-4 w-4" />
                  <span>Current: {editingCompany.eligibleStudentsFile}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Leave empty to keep the existing file, or upload a new one to replace it
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingCompany(null)
                setEditFormData({ name: "", role: "", jobDescription: "" })
                setEditFile(null)
                setEditAttachmentFile(null)
                setEditLogoFile(null)
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Company
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
