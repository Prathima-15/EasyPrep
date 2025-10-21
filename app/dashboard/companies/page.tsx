"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Building2, Users, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { companyAPI } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

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

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
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

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

  const handleCompanyClick = (companyId: string) => {
    router.push(`/dashboard/companies/${companyId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Companies</h1>
          <p className="text-muted-foreground">Explore interview experiences from top companies</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Companies Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading companies...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company._id} className="hover:shadow-lg transition-shadow duration-300">
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
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {company.role}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Job Description:</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {company.jobDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{company.totalEligibleStudents} eligible students</span>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleCompanyClick(company._id)}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCompanies.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No companies found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search query" : "No companies available yet"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
