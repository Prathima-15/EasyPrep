"use client"

import { useState } from "react"
import { FileText, Search, Filter, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AuditLog {
  id: string
  action: string
  user: string
  userRole: string
  timestamp: string
  details: string
  status: "success" | "failed" | "warning"
}

export default function CoordinatorAuditPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: "1",
      action: "Added Company",
      user: "John Coordinator",
      userRole: "Coordinator",
      timestamp: "2024-03-15 10:30 AM",
      details: "Added Google to company list",
      status: "success"
    },
    {
      id: "2",
      action: "Updated Eligible Students",
      user: "Jane Coordinator",
      userRole: "Coordinator",
      timestamp: "2024-03-15 09:15 AM",
      details: "Updated Microsoft eligible students list",
      status: "success"
    },
    {
      id: "3",
      action: "Deleted Question",
      user: "Admin User",
      userRole: "Admin",
      timestamp: "2024-03-14 05:45 PM",
      details: "Removed duplicate question",
      status: "warning"
    },
    {
      id: "4",
      action: "Login Failed",
      user: "Unknown User",
      userRole: "Student",
      timestamp: "2024-03-14 03:20 PM",
      details: "Invalid credentials attempted",
      status: "failed"
    },
    {
      id: "5",
      action: "Updated Company Details",
      user: "John Coordinator",
      userRole: "Coordinator",
      timestamp: "2024-03-14 11:00 AM",
      details: "Modified Amazon job description",
      status: "success"
    },
  ])

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
            <p className="text-muted-foreground">Track all system activities and changes</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-xs text-muted-foreground">All recorded activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <Badge variant="default" className="bg-green-600">Success</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(l => l.status === "success").length}
            </div>
            <p className="text-xs text-green-600">Completed actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <Badge variant="destructive">Failed</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(l => l.status === "failed").length}
            </div>
            <p className="text-xs text-red-600">Failed attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(l => l.status === "warning").length}
            </div>
            <p className="text-xs text-yellow-600">Attention required</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>View all system activities and user actions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.userRole}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate text-sm text-muted-foreground">
                      {log.details}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        log.status === "success" 
                          ? "default" 
                          : log.status === "failed"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        log.status === "success"
                          ? "bg-green-600"
                          : log.status === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                      }
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No logs found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
