"use client"

import { BarChart3, TrendingUp, Users, Building2, CheckCircle, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function CoordinatorAnalyticsPage() {
  const analytics = {
    totalPlacements: 156,
    placementRate: 68,
    avgPackage: "8.5 LPA",
    topCompany: "Google",
    departmentStats: [
      { dept: "CSE", placed: 45, total: 60, percentage: 75 },
      { dept: "IT", placed: 38, total: 50, percentage: 76 },
      { dept: "ECE", placed: 32, total: 55, percentage: 58 },
      { dept: "EEE", placed: 25, total: 45, percentage: 56 },
      { dept: "MECH", placed: 16, total: 40, percentage: 40 },
    ],
    companyStats: [
      { company: "Google", students: 12, package: "18 LPA" },
      { company: "Microsoft", students: 10, package: "16 LPA" },
      { company: "Amazon", students: 15, package: "14 LPA" },
      { company: "TCS", students: 45, package: "4.5 LPA" },
      { company: "Infosys", students: 35, package: "5 LPA" },
    ]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-indigo-600" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>
          <p className="text-muted-foreground">Placement statistics and performance metrics</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Placements</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPlacements}</div>
            <p className="text-xs text-green-600">+12% from last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.placementRate}%</div>
            <Progress value={analytics.placementRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Package</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgPackage}</div>
            <p className="text-xs text-green-600">+8% from last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Recruiter</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.topCompany}</div>
            <p className="text-xs text-muted-foreground">Highest placements</p>
          </CardContent>
        </Card>
      </div>

      {/* Department-wise Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Department-wise Placement Statistics</CardTitle>
          <CardDescription>Placement performance across all departments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.departmentStats.map((dept) => (
            <div key={dept.dept} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-16 justify-center">{dept.dept}</Badge>
                  <span className="text-sm font-medium">
                    {dept.placed} / {dept.total} students placed
                  </span>
                </div>
                <span className="text-sm font-bold text-indigo-600">{dept.percentage}%</span>
              </div>
              <Progress value={dept.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Company-wise Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Company-wise Placement Statistics</CardTitle>
          <CardDescription>Students placed in different companies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.companyStats.map((company) => (
              <div key={company.company} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Building2 className="h-8 w-8 text-indigo-600" />
                  <div>
                    <p className="font-medium">{company.company}</p>
                    <p className="text-sm text-muted-foreground">Package: {company.package}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{company.students}</span>
                  <span className="text-sm text-muted-foreground">students</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Placement Trend</CardTitle>
            <CardDescription>Placements over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: "January", count: 25 },
                { month: "February", count: 32 },
                { month: "March", count: 28 },
                { month: "April", count: 35 },
                { month: "May", count: 22 },
                { month: "June", count: 14 },
              ].map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-indigo-600">{data.count} placements</span>
                  </div>
                  <Progress value={(data.count / 35) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Package Distribution</CardTitle>
            <CardDescription>Salary range distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { range: "15+ LPA", count: 25, color: "bg-green-500" },
                { range: "10-15 LPA", count: 35, color: "bg-blue-500" },
                { range: "7-10 LPA", count: 42, color: "bg-indigo-500" },
                { range: "4-7 LPA", count: 54, color: "bg-purple-500" },
              ].map((data) => (
                <div key={data.range} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{data.range}</span>
                    <span className="text-muted-foreground">{data.count} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={(data.count / 54) * 100} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {Math.round((data.count / 156) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
