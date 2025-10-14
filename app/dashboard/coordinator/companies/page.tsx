"use client"

import { useState } from "react"
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

interface Company {
  id: string
  name: string
  jobDescription: string
  uploadedDate: string
  eligibleStudentsFile: string
  totalEligibleStudents: number
  status: "active" | "inactive"
  attachmentFile?: string // PDF or image file
}

export default function CoordinatorCompanyManagementPage() {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "Google",
      jobDescription: "Software Engineer - Full Stack Developer with 2+ years of experience in React, Node.js, and cloud technologies.",
      uploadedDate: "2024-03-15",
      eligibleStudentsFile: "google_eligible_students.xlsx",
      totalEligibleStudents: 45,
      status: "active",
      attachmentFile: "google_jd.pdf"
    },
    {
      id: "2",
      name: "Microsoft",
      jobDescription: "Cloud Solutions Architect - Experience with Azure, AWS, and enterprise architecture.",
      uploadedDate: "2024-03-10",
      eligibleStudentsFile: "microsoft_eligible_students.xlsx",
      totalEligibleStudents: 32,
      status: "active",
      attachmentFile: "microsoft_jd.png"
    },
  ])

  const [newCompany, setNewCompany] = useState({
    name: "",
    jobDescription: "",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null) // PDF or image file
  const [isUploading, setIsUploading] = useState(false)
  
  // Update/Edit states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    jobDescription: "",
  })
  const [editFile, setEditFile] = useState<File | null>(null)
  const [editAttachmentFile, setEditAttachmentFile] = useState<File | null>(null) // PDF or image for edit
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCompany.name || !newCompany.jobDescription) {
      alert("Please fill in all company details")
      return
    }

    if (!selectedFile) {
      alert("Please upload an Excel file with eligible students")
      return
    }

    setIsUploading(true)

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newCompanyData: Company = {
      id: (companies.length + 1).toString(),
      name: newCompany.name,
      jobDescription: newCompany.jobDescription,
      uploadedDate: new Date().toISOString().split('T')[0],
      eligibleStudentsFile: selectedFile.name,
      totalEligibleStudents: Math.floor(Math.random() * 50) + 20, // Mock count
      status: "active",
      attachmentFile: attachmentFile?.name
    }

    setCompanies([...companies, newCompanyData])
    setNewCompany({ name: "", jobDescription: "" })
    setSelectedFile(null)
    setAttachmentFile(null)
    setIsUploading(false)

    alert("Company and eligible students uploaded successfully!")
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      setCompanies(companies.filter(c => c.id !== id))
      alert("Company deleted successfully!")
    }
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setEditFormData({
      name: company.name,
      jobDescription: company.jobDescription,
    })
    setEditFile(null)
    setEditAttachmentFile(null)
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

  const handleUpdate = async () => {
    if (!editFormData.name || !editFormData.jobDescription) {
      alert("Please fill in all company details")
      return
    }

    if (!editingCompany) return

    setIsUpdating(true)

    // Simulate update delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const updatedCompany: Company = {
      ...editingCompany,
      name: editFormData.name,
      jobDescription: editFormData.jobDescription,
      eligibleStudentsFile: editFile ? editFile.name : editingCompany.eligibleStudentsFile,
      totalEligibleStudents: editFile ? Math.floor(Math.random() * 50) + 20 : editingCompany.totalEligibleStudents,
      attachmentFile: editAttachmentFile ? editAttachmentFile.name : editingCompany.attachmentFile,
    }

    setCompanies(companies.map(c => c.id === editingCompany.id ? updatedCompany : c))
    setIsUpdating(false)
    setIsEditDialogOpen(false)
    setEditingCompany(null)
    setEditFormData({ name: "", jobDescription: "" })
    setEditFile(null)
    setEditAttachmentFile(null)

    alert("Company updated successfully!")
  }

  const handleDownloadTemplate = () => {
    // In a real app, this would download an actual Excel template
    alert("Excel template will be downloaded with columns: Student ID, Name, Email, Department, CGPA, Skills")
  }

  const handleViewEligibleStudents = (company: Company) => {
    alert(`Viewing eligible students for ${company.name}\n\nFile: ${company.eligibleStudentsFile}\nTotal Students: ${company.totalEligibleStudents}`)
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
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Google, Microsoft, Amazon"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  />
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Enter the complete job description including requirements, responsibilities, and qualifications..."
                    value={newCompany.jobDescription}
                    onChange={(e) => setNewCompany({ ...newCompany, jobDescription: e.target.value })}
                    rows={6}
                    className="resize-none"
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        {attachmentFile.type === "application/pdf" ? (
                          <FileText className="h-4 w-4" />
                        ) : (
                          <ImageIcon className="h-4 w-4" />
                        )}
                        <span>{attachmentFile.name}</span>
                        <Badge variant="secondary">{(attachmentFile.size / 1024).toFixed(2)} KB</Badge>
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{selectedFile.name}</span>
                      <Badge variant="secondary">{(selectedFile.size / 1024).toFixed(2)} KB</Badge>
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
                    <TableHead>Job Description</TableHead>
                    <TableHead>Uploaded Date</TableHead>
                    <TableHead>Eligible Students</TableHead>
                    <TableHead>Attachment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate text-sm text-muted-foreground">
                          {company.jobDescription}
                        </div>
                      </TableCell>
                      <TableCell>{company.uploadedDate}</TableCell>
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
                            onClick={() => handleDelete(company.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {companies.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No companies uploaded yet</p>
                  <p className="text-sm text-muted-foreground">Upload your first company to get started</p>
                </div>
              )}
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    {editAttachmentFile.type === "application/pdf" ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                    <span>{editAttachmentFile.name}</span>
                    <Badge variant="secondary">{(editAttachmentFile.size / 1024).toFixed(2)} KB</Badge>
                  </div>
                )}
                {!editAttachmentFile && editingCompany?.attachmentFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{editFile.name}</span>
                  <Badge variant="secondary">{(editFile.size / 1024).toFixed(2)} KB</Badge>
                </div>
              )}
              {!editFile && editingCompany && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                setEditFormData({ name: "", jobDescription: "" })
                setEditFile(null)
                setEditAttachmentFile(null)
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
