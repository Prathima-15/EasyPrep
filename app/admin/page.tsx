"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  FileQuestion, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Building2,
  BookOpen,
  Shield
} from "lucide-react"

export default function AdminDashboard() {
  // Mock admin data - replace with real data later
  const adminStats = {
    totalUsers: 2847,
    activeUsers: 2156,
    suspendedUsers: 23,
    totalQuestions: 1247,
    pendingApproval: 45,
    approvedToday: 127,
    rejectedToday: 8,
    eligibleUsers: 2089,
    ineligibleUsers: 758,
    totalCompanies: 156,
    totalTopics: 34,
    adminActions: 89,
  }

  const recentActivity = [
    {
      type: "question_approved",
      user: "John Doe",
      action: "Question approved",
      details: "System Design question for Google",
      time: "2 minutes ago",
      status: "approved"
    },
    {
      type: "user_suspended",
      user: "Jane Smith", 
      action: "User suspended",
      details: "Violation of content policy",
      time: "15 minutes ago",
      status: "suspended"
    },
    {
      type: "question_rejected",
      user: "Mike Johnson",
      action: "Question rejected", 
      details: "Duplicate content detected",
      time: "1 hour ago",
      status: "rejected"
    },
    {
      type: "company_added",
      user: "Admin",
      action: "Company added",
      details: "Tesla added to platform",
      time: "2 hours ago", 
      status: "added"
    }
  ]

  const pendingTasks = [
    { task: "Review flagged questions", count: 12, priority: "high" },
    { task: "Approve pending company reviews", count: 8, priority: "medium" },
    { task: "Process user appeals", count: 3, priority: "high" },
    { task: "Update topic categories", count: 5, priority: "low" },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "question_approved": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "question_rejected": return <XCircle className="h-4 w-4 text-red-600" />
      case "user_suspended": return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "company_added": return <Building2 className="h-4 w-4 text-blue-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">Monitor and manage the EasyPrep platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {adminStats.activeUsers} active, {adminStats.suspendedUsers} suspended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalQuestions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {adminStats.pendingApproval} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Eligibility</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.eligibleUsers.toLocaleString()}</div>
            <Progress value={(adminStats.eligibleUsers / adminStats.totalUsers) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((adminStats.eligibleUsers / adminStats.totalUsers) * 100)}% eligible
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Actions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.approvedToday}</div>
            <p className="text-xs text-muted-foreground">
              {adminStats.approvedToday} approved, {adminStats.rejectedToday} rejected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Total companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalTopics}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Actions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.adminActions}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest admin actions and system events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground">by {activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Pending Tasks
            </CardTitle>
            <CardDescription>Items requiring admin attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.task}</p>
                  <p className="text-xs text-muted-foreground">{task.count} items</p>
                </div>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}