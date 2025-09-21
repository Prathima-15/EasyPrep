"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, MapPin, Users } from "lucide-react"
import { CompanyTabs } from "@/components/dashboard/company-tabs"

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = Number.parseInt(params.id as string)

  // Mock data - replace with real data later
  const companies = [
    {
      id: 1,
      name: "Google",
      logo: "/google-logo.png",
      description:
        "Google is a multinational technology company that specializes in Internet-related services and products.",
      jobRole: "Software Engineer",
      jobDescription:
        "We are looking for a Software Engineer to join our team and help build the next generation of products that will impact billions of users worldwide. You will work on large-scale systems and cutting-edge technologies.",
      location: "Mountain View, CA",
      employees: "100,000+",
      industry: "Technology",
      difficulty: "Hard",
      totalQuestions: 234,
    },
    {
      id: 2,
      name: "Microsoft",
      logo: "/microsoft-logo.png",
      description:
        "Microsoft is a multinational technology corporation that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, and personal computers.",
      jobRole: "Software Engineer",
      jobDescription:
        "Join Microsoft as a Software Engineer and work on products that empower every person and organization on the planet to achieve more. You'll collaborate with talented engineers to build scalable solutions.",
      location: "Redmond, WA",
      employees: "200,000+",
      industry: "Technology",
      difficulty: "Medium",
      totalQuestions: 189,
    },
    // Add more companies as needed
  ]

  const company = companies.find((c) => c.id === companyId)

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
          <img
            src={company.logo || "/placeholder.svg"}
            alt={`${company.name} logo`}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
              <Badge className={getDifficultyColor(company.difficulty)}>{company.difficulty}</Badge>
            </div>
            <h2 className="text-xl text-primary font-semibold mb-3">{company.jobRole}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {company.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {company.employees} employees
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                {company.industry}
              </div>
            </div>

            <p className="text-muted-foreground mb-4">{company.description}</p>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Job Description</h3>
              <p className="text-sm text-muted-foreground">{company.jobDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Tabs */}
      <CompanyTabs companyId={companyId} companyName={company.name} />
    </div>
  )
}
