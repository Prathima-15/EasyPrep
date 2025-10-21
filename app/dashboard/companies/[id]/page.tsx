"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, Users, FileText, Download } from "lucide-react"
import { CompanyTabs } from "@/components/dashboard/company-tabs"
import { useState, useEffect } from "react"
import { companyAPI } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Company {
  _id: string
  name: string
  role: string
  logo?: string
  jobDescription: string
  eligibleStudentsFile?: string
  attachmentFile?: string
  totalEligibleStudents: number
  status: string
  createdAt: string
}

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const companyId = params.id as string

  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

  useEffect(() => {
    fetchCompanyDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  const fetchCompanyDetails = async () => {
    setIsLoading(true)
    try {
      const result = await companyAPI.getById(companyId)
      
      if (result.success && result.data) {
        setCompany(result.data as any)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch company details",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch company details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading company details...</p>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Company not found</h3>
        <p className="text-muted-foreground mb-4">The company you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/dashboard/companies")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Companies
        </Button>
      </div>
    )
  }

  const handleDownloadAttachment = () => {
    if (company.attachmentFile) {
      window.open(`${API_URL}/uploads/${company.attachmentFile}`, '_blank')
    }
  }

  const handleDownloadEligibleStudents = () => {
    if (company.eligibleStudentsFile) {
      window.open(`${API_URL}/uploads/${company.eligibleStudentsFile}`, '_blank')
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push("/dashboard/companies")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Companies
      </Button>

      {/* Company Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start gap-6">
          {company.logo ? (
            <img
              src={`${API_URL}/uploads/${company.logo}`}
              alt={`${company.name} logo`}
              className="w-20 h-20 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Building2 className="h-10 w-10 text-indigo-600" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
              <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                {company.status}
              </Badge>
            </div>
            <h2 className="text-xl text-primary font-semibold mb-3">{company.role}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {company.totalEligibleStudents} eligible students
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Posted on {new Date(company.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-foreground mb-2">Job Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{company.jobDescription}</p>
            </div>

            {/* Download Buttons */}
            <div className="flex gap-3">
              {company.attachmentFile && (
                <Button onClick={handleDownloadAttachment} variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Job Description
                </Button>
              )}
              {company.eligibleStudentsFile && (
                <Button onClick={handleDownloadEligibleStudents} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Eligible Students List
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Company Tabs */}
      <CompanyTabs companyId={companyId} companyName={company.name} />
    </div>
  )
}
