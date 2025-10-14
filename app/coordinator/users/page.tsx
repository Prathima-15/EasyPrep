"use client"

import { useState } from "react"
import { Users, Search, Filter, UserPlus, Edit, Trash2, Eye, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { getManageableDepartments, canManageDepartment } from "@/lib/department-mapping"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface User {
  id: string
  name: string
  email: string
  department: string
  role: string
  status: "active" | "inactive"
  joinedDate: string
}

export default function CoordinatorUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { user: currentUser } = useAuth()
  
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      department: "IT",
      role: "student",
      status: "active",
      joinedDate: "2024-01-15"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      department: "ADS",
      role: "student",
      status: "active",
      joinedDate: "2024-01-20"
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.j@example.com",
      department: "CSE",
      role: "student",
      status: "active",
      joinedDate: "2024-02-01"
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.w@example.com",
      department: "CSD",
      role: "student",
      status: "inactive",
      joinedDate: "2024-02-05"
    },
    {
      id: "5",
      name: "Tom Brown",
      email: "tom.b@example.com",
      department: "AIML",
      role: "student",
      status: "active",
      joinedDate: "2024-02-10"
    },
  ])

  // Get departments this coordinator can manage
  const manageableDepartments = currentUser?.department 
    ? getManageableDepartments(currentUser.department)
    : []

  // Filter users based on coordinator's managed departments
  const managedUsers = users.filter(user => 
    currentUser?.department 
      ? canManageDepartment(currentUser.department, user.department)
      : false
  )

  const filteredUsers = managedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">
              Manage students from: {manageableDepartments.join(", ")}
            </p>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managedUsers.length}</div>
            <p className="text-xs text-muted-foreground">In your departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {managedUsers.filter(u => u.status === "active").length}
            </div>
            <p className="text-xs text-green-600">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {managedUsers.filter(u => u.role === "student").length}
            </div>
            <p className="text-xs text-muted-foreground">Student accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {managedUsers.filter(u => u.status === "inactive").length}
            </div>
            <p className="text-xs text-red-600">Suspended accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage and view all registered users</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.department}</Badge>
                  </TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joinedDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
