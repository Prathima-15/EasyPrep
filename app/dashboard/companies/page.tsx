"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Building2, Users, TrendingUp } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Mock data - replace with real data later
  const companies = [
    {
      id: 1,
      name: "Google",
      logo: "/google-logo.png",
      totalQuestions: 234,
      difficulty: "Hard",
      recentQuestions: 12,
      roles: ["Software Engineer", "Product Manager", "Data Scientist"],
    },
    {
      id: 2,
      name: "Microsoft",
      logo: "/microsoft-logo.png",
      totalQuestions: 189,
      difficulty: "Medium",
      recentQuestions: 8,
      roles: ["Software Engineer", "Program Manager"],
    },
    {
      id: 3,
      name: "Amazon",
      logo: "/amazon-logo.png",
      totalQuestions: 267,
      difficulty: "Hard",
      recentQuestions: 15,
      roles: ["Software Engineer", "Solutions Architect"],
    },
    {
      id: 4,
      name: "Meta",
      logo: "/meta-logo-abstract.png",
      totalQuestions: 156,
      difficulty: "Medium",
      recentQuestions: 6,
      roles: ["Software Engineer", "Data Engineer"],
    },
    {
      id: 5,
      name: "Apple",
      logo: "/apple-logo.png",
      totalQuestions: 143,
      difficulty: "Medium",
      recentQuestions: 9,
      roles: ["Software Engineer", "Hardware Engineer"],
    },
    {
      id: 6,
      name: "Netflix",
      logo: "/netflix-inspired-logo.png",
      totalQuestions: 98,
      difficulty: "Hard",
      recentQuestions: 4,
      roles: ["Software Engineer", "Data Scientist"],
    },
  ]

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCompanyClick = (companyId: number) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <img
                  src={company.logo || "/placeholder.svg"}
                  alt={`${company.name} logo`}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getDifficultyColor(company.difficulty)}>{company.difficulty}</Badge>
                    <span className="text-sm text-muted-foreground">{company.totalQuestions} questions</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{company.roles.length} roles</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span>{company.recentQuestions} recent</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Available Roles:</p>
                <div className="flex flex-wrap gap-1">
                  {company.roles.slice(0, 2).map((role, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                  {company.roles.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{company.roles.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                className="w-full bg-transparent"
                variant="outline"
                onClick={() => handleCompanyClick(company.id)}
              >
                <Building2 className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No companies found</h3>
          <p className="text-muted-foreground">Try adjusting your search query</p>
        </div>
      )}
    </div>
  )
}
