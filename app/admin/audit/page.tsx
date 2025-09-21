"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search, 
  Filter, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Shield,
  User,
  FileQuestion,
  Building2,
  Download,
  Calendar,
  Clock,
  Eye,
  Trash2,
  Edit,
  UserPlus,
  UserMinus
} from "lucide-react"

interface AuditLog {
  id: string
  timestamp: string
  adminId: string
  adminName: string
  action: string
  actionType: "approve" | "reject" | "delete" | "edit" | "user_action" | "system"
  targetType: "question" | "user" | "company" | "topic" | "system"
  targetId?: string
  targetName?: string
  details: string
  ipAddress: string
  userAgent: string
  severity: "low" | "medium" | "high" | "critical"
}

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [adminFilter, setAdminFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [dateRange, setDateRange] = useState("7d")

  // Mock audit log data
  const auditLogs: AuditLog[] = [
    {
      id: "1",
      timestamp: "2024-01-15T14:30:25Z",
      adminId: "admin1",
      adminName: "Admin User",
      action: "Question Approved",
      actionType: "approve",
      targetType: "question",
      targetId: "q123",
      targetName: "Implement thread-safe singleton pattern",
      details: "Approved question with feedback: 'Well-structured technical question'",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "low"
    },
    {
      id: "2",
      timestamp: "2024-01-15T14:25:15Z",
      adminId: "admin1", 
      adminName: "Admin User",
      action: "User Suspended",
      actionType: "user_action",
      targetType: "user",
      targetId: "u456",
      targetName: "John Doe",
      details: "User suspended for violation of content policy - inappropriate question content",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "high"
    },
    {
      id: "3",
      timestamp: "2024-01-15T13:45:30Z",
      adminId: "admin2",
      adminName: "Super Admin",
      action: "Question Rejected",
      actionType: "reject",
      targetType: "question",
      targetId: "q124",
      targetName: "What is your greatest weakness?",
      details: "Question rejected - too generic and already covered extensively",
      ipAddress: "192.168.1.101", 
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      severity: "low"
    },
    {
      id: "4",
      timestamp: "2024-01-15T12:20:45Z",
      adminId: "admin1",
      adminName: "Admin User",
      action: "Question Deleted",
      actionType: "delete",
      targetType: "question",
      targetId: "q125",
      targetName: "Inappropriate content question",
      details: "Question permanently deleted due to inappropriate content and policy violation",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "critical"
    },
    {
      id: "5",
      timestamp: "2024-01-15T11:15:20Z",
      adminId: "admin2",
      adminName: "Super Admin",
      action: "User Role Changed",
      actionType: "user_action",
      targetType: "user",
      targetId: "u789",
      targetName: "Jane Smith",
      details: "User role changed from 'student' to 'moderator'",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      severity: "medium"
    },
    {
      id: "6",
      timestamp: "2024-01-15T10:30:10Z",
      adminId: "system",
      adminName: "System",
      action: "Automatic User Validation",
      actionType: "system",
      targetType: "user",
      targetId: "u890",
      targetName: "Alex Chen",
      details: "User eligibility automatically revalidated - marked as eligible",
      ipAddress: "127.0.0.1",
      userAgent: "EasyPrep System/1.0",
      severity: "low"
    }
  ]

  const adminUsers = ["Admin User", "Super Admin", "System"]

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.targetName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === "all" || log.actionType === actionFilter
    const matchesAdmin = adminFilter === "all" || log.adminName === adminFilter
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter
    
    return matchesSearch && matchesAction && matchesAdmin && matchesSeverity
  })

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "approve":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "reject":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-600" />
      case "edit":
        return <Edit className="h-4 w-4 text-blue-600" />
      case "user_action":
        return <User className="h-4 w-4 text-purple-600" />
      case "system":
        return <Shield className="h-4 w-4 text-gray-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case "question":
        return <FileQuestion className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
      case "company":
        return <Building2 className="h-4 w-4" />
      case "system":
        return <Shield className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const exportAuditLogs = () => {
    // Mock export functionality
    console.log("Exporting audit logs...")
  }

  const severityCounts = {
    critical: auditLogs.filter(log => log.severity === "critical").length,
    high: auditLogs.filter(log => log.severity === "high").length,
    medium: auditLogs.filter(log => log.severity === "medium").length,
    low: auditLogs.filter(log => log.severity === "low").length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground">Track all admin actions and system events</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportAuditLogs} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{severityCounts.critical}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{severityCounts.high}</div>
            <p className="text-xs text-muted-foreground">Important actions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(auditLogs.filter(log => log.adminName !== "System").map(log => log.adminName)).size}
            </div>
            <p className="text-xs text-muted-foreground">In this period</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="edit">Edit</SelectItem>
                <SelectItem value="user_action">User Action</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select value={adminFilter} onValueChange={setAdminFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Admins" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Admins</SelectItem>
                {adminUsers.map((admin) => (
                  <SelectItem key={admin} value={admin}>
                    {admin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Events ({filteredLogs.length})</CardTitle>
          <CardDescription>Complete log of admin actions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    <div>{formatDate(log.timestamp)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {log.adminName === "System" ? "SYS" : log.adminName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{log.adminName}</div>
                        <div className="text-xs text-muted-foreground">{log.adminId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.actionType)}
                      <span className="font-medium">{log.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTargetIcon(log.targetType)}
                      <div>
                        <div className="font-medium text-sm">{log.targetName || log.targetType}</div>
                        {log.targetId && (
                          <div className="text-xs text-muted-foreground">{log.targetId}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm line-clamp-2">{log.details}</p>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}