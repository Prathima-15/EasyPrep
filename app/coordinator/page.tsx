"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getManageableDepartments } from "@/lib/department-mapping"
import { 
  Building2, 
  Users, 
  CheckCircle, 
  TrendingUp,
  ArrowRight,
  FileText,
  BarChart3,
  GraduationCap
} from "lucide-react"

export default function CoordinatorPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  // Get departments this coordinator can manage
  const manageableDepartments = user?.department 
    ? getManageableDepartments(user.department)
    : []

  // Mock coordinator data - replace with real data later
  const coordinatorStats = {
    totalCompanies: 12,
    activeCompanies: 8,
    totalEligibleStudents: 247,
    placementRate: 68,
  }

  const recentActivities = [
    { id: 1, action: "Added new company", company: "Google", date: "2 hours ago" },
    { id: 2, action: "Updated eligible students", company: "Microsoft", date: "5 hours ago" },
    { id: 3, action: "Uploaded job description", company: "Amazon", date: "1 day ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coordinator Dashboard</h1>
          <p className="text-muted-foreground">Manage companies and placement activities</p>
        </div>
        <Badge variant="default" className="bg-indigo-600">Coordinator Panel</Badge>
      </div>

      {/* Managed Departments Info Card */}
      {user?.department && manageableDepartments.length > 0 && (
        <Card className="border-indigo-200 bg-indigo-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-indigo-900">Your Managed Departments</CardTitle>
            </div>
            <CardDescription className="text-indigo-700">
              As a {user.department} coordinator, you can manage students from the following departments:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {manageableDepartments.map((dept) => (
                <Badge 
                  key={dept} 
                  variant="default" 
                  className="bg-indigo-600 text-white px-3 py-1"
                >
                  {dept}
                </Badge>
              ))}
            </div>
            {user.department === "Placement" && (
              <p className="text-xs text-indigo-600 mt-3 italic">
                * As Placement coordinator, you have access to all departments
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coordinatorStats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{coordinatorStats.activeCompanies} active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eligible Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coordinatorStats.totalEligibleStudents}</div>
            <p className="text-xs text-muted-foreground">Across all companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drives</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coordinatorStats.activeCompanies}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coordinatorStats.placementRate}%</div>
            <p className="text-xs text-green-600">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage placement activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start bg-indigo-600 hover:bg-indigo-700"
              onClick={() => router.push("/coordinator/companies")}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Manage Companies
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push("/coordinator/analytics")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <FileText className="h-4 w-4 text-indigo-600 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.company}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
