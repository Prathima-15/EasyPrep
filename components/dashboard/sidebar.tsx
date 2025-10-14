"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BookOpen,
  Sparkles,
  Home,
  Building2,
  FileQuestion,
  BarChart3,
  Bookmark,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"

export function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    // Common items for all roles
    { name: "Home", href: "/dashboard", icon: Home, roles: ["student", "moderator", "admin"] },
    
    // Student-specific items
    ...(user?.role === "student" ? [
      { name: "Companies", href: "/dashboard/companies", icon: Building2, roles: ["student"] },
      { name: "My Interview Questions", href: "/dashboard/questions", icon: FileQuestion, roles: ["student"] },
      { name: "Difficulty Analytics", href: "/dashboard/analytics", icon: BarChart3, roles: ["student"] },
      { name: "Saved Questions", href: "/dashboard/saved", icon: Bookmark, roles: ["student"] },
    ] : []),
    
    // Coordinator-specific items (now shows admin features)
    ...(user?.role === "moderator" ? [
      { name: "Admin Panel", href: "/admin", icon: Home, roles: ["moderator"] },
      { name: "Question Management", href: "/admin/questions", icon: FileQuestion, roles: ["moderator"] },
      { name: "User Management", href: "/admin/users", icon: Building2, roles: ["moderator"] },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3, roles: ["moderator"] },
    ] : []),
    
    // Admin-specific items (now shows coordinator features)  
    ...(user?.role === "admin" ? [
      { name: "Coordinator Dashboard", href: "/dashboard/coordinator", icon: Home, roles: ["admin"] },
      { name: "Company Management", href: "/dashboard/coordinator/companies", icon: Building2, roles: ["admin"] },
      { name: "Review Questions", href: "/admin/questions", icon: FileQuestion, roles: ["admin"] },
      { name: "Student Analytics", href: "/dashboard/analytics", icon: BarChart3, roles: ["admin"] },
      { name: "Manage Users", href: "/admin/users", icon: Building2, roles: ["admin"] },
    ] : []),
    
    // Settings for all roles
    { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["student", "moderator", "admin"] },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 p-6 border-b border-sidebar-border">
            <div className="relative">
              <BookOpen className="h-8 w-8 text-sidebar-primary" />
              <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1" />
            </div>
            <span className="text-2xl font-bold text-sidebar-foreground">EasyPrep</span>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              )
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
