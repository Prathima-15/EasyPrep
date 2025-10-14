"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Sparkles,
  LayoutDashboard,
  Users,
  FileQuestion,
  Building2,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"

export function CoordinatorSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    { name: "Dashboard", href: "/coordinator", icon: LayoutDashboard },
    { name: "User Management", href: "/coordinator/users", icon: Users },
    { name: "Question Management", href: "/coordinator/questions", icon: FileQuestion },
    { name: "Company Management", href: "/coordinator/companies", icon: Building2 },
    { name: "Analytics & Insights", href: "/coordinator/analytics", icon: BarChart3 },
    { name: "Audit Logs", href: "/coordinator/audit", icon: FileText },
    { name: "Settings", href: "/coordinator/settings", icon: Settings },
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
          <div className="flex items-center space-x-2 p-6 border-b border-sidebar-border bg-indigo-50">
            <div className="relative">
              <Shield className="h-8 w-8 text-indigo-600" />
              <Sparkles className="h-4 w-4 text-amber-500 absolute -top-1 -right-1" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-sidebar-foreground">EasyPrep</span>
              <Badge variant="default" className="text-xs w-fit bg-indigo-600">Coordinator</Badge>
            </div>
          </div>

          {/* Coordinator Profile */}
          <div className="p-6 border-b border-sidebar-border bg-indigo-50/50">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-indigo-600 text-white">
                  {user?.name?.charAt(0).toUpperCase() || "C"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <Badge variant="outline" className="text-xs mt-1">Coordinator</Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : ""}`} />
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
              className="w-full justify-start text-sidebar-foreground hover:bg-indigo-100 hover:text-indigo-800"
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
