"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { 
  Search, 
  Filter, 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  ShieldCheck,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: "student" | "moderator" | "admin"
  status: "active" | "inactive" | "suspended"
  lastLogin: string
  questionsSubmitted: number
  contributionRating: number
  college?: string
  branch?: string
  verified: boolean
  profileComplete: boolean
  eligibleToSubmit: boolean
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [eligibilityFilter, setEligibilityFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const { toast } = useToast()

  // Mock user data - replace with real data later
  const mockUsers: User[] = [
    {
      id: "1",
      name: "John Doe", 
      email: "john.doe@college.edu",
      role: "student",
      status: "active",
      lastLogin: "2 hours ago",
      questionsSubmitted: 23,
      contributionRating: 4.2,
      college: "MIT",
      branch: "Computer Science",
      verified: true,
      profileComplete: true,
      eligibleToSubmit: true
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@university.edu", 
      role: "student",
      status: "active",
      lastLogin: "1 day ago",
      questionsSubmitted: 45,
      contributionRating: 4.8,
      college: "Stanford",
      branch: "Software Engineering",
      verified: true,
      profileComplete: true,
      eligibleToSubmit: true
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.j@example.com",
      role: "moderator", 
      status: "active",
      lastLogin: "30 minutes ago",
      questionsSubmitted: 12,
      contributionRating: 3.9,
      verified: true,
      profileComplete: true,
      eligibleToSubmit: true
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@college.edu",
      role: "student",
      status: "suspended",
      lastLogin: "3 days ago",
      questionsSubmitted: 8,
      contributionRating: 2.1,
      college: "UC Berkeley",
      branch: "Computer Science",
      verified: false,
      profileComplete: false,
      eligibleToSubmit: false
    },
    {
      id: "5", 
      name: "Alex Chen",
      email: "alex.chen@university.edu",
      role: "student",
      status: "inactive",
      lastLogin: "2 weeks ago",
      questionsSubmitted: 3,
      contributionRating: 3.2,
      college: "CMU",
      branch: "Data Science",
      verified: true,
      profileComplete: false,
      eligibleToSubmit: false
    }
  ]

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter  
    const matchesEligibility = eligibilityFilter === "all" || 
                              (eligibilityFilter === "eligible" && user.eligibleToSubmit) ||
                              (eligibilityFilter === "ineligible" && !user.eligibleToSubmit)
    
    return matchesSearch && matchesStatus && matchesRole && matchesEligibility
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800"><Shield className="h-3 w-3 mr-1" />Admin</Badge>
      case "moderator":
        return <Badge className="bg-blue-100 text-blue-800"><ShieldCheck className="h-3 w-3 mr-1" />Moderator</Badge>
      case "student":
        return <Badge className="bg-purple-100 text-purple-800"><Users className="h-3 w-3 mr-1" />Student</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getEligibilityStatus = (user: User) => {
    if (user.eligibleToSubmit) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    toast({
      title: "Status Updated", 
      description: `User status changed to ${newStatus}`,
    })
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    toast({
      title: "Role Updated",
      description: `User role changed to ${newRole}`,
    })
    setIsRoleDialogOpen(false)
  }

  const handleDeleteUser = async (userId: string) => {
    toast({
      title: "User Deleted",
      description: "User account has been permanently deleted",
      variant: "destructive"
    })
  }

  const exportUsers = () => {
    toast({
      title: "Export Started",
      description: "User data export will be ready shortly",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8" />
            User Management
          </h1>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
        </div>
        <Button onClick={exportUsers} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Users
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockUsers.filter(u => u.status === "active").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eligible Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockUsers.filter(u => u.eligibleToSubmit).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockUsers.filter(u => u.status === "suspended").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={eligibilityFilter} onValueChange={setEligibilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Eligibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Eligibility</SelectItem>
                <SelectItem value="eligible">Eligible</SelectItem>
                <SelectItem value="ineligible">Ineligible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Eligible</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        {user.college && (
                          <div className="text-xs text-muted-foreground">{user.college}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getEligibilityStatus(user)}</TableCell>
                  <TableCell>{user.questionsSubmitted}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{user.contributionRating.toFixed(1)}</span>
                      <span className="text-muted-foreground">★</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                              Modify user role and status
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Status</label>
                              <Select onValueChange={(value) => handleStatusChange(user.id, value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder={user.status} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                  <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Role</label>
                              <Select onValueChange={(value) => handleRoleChange(user.id, value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder={user.role} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="student">Student</SelectItem>
                                  <SelectItem value="moderator">Moderator</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to permanently delete {user.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}