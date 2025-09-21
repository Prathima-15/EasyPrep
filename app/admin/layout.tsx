"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Skip authentication checks for signin page
  const isSigninPage = pathname === "/admin/signin"

  useEffect(() => {
    if (!isSigninPage && !isLoading) {
      if (!isAuthenticated) {
        router.push("/admin/signin")
      } else if (user?.role !== "admin") {
        // Redirect non-admin users to student dashboard
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, user, router, isSigninPage])

  // For signin page, just render children without layout
  if (isSigninPage) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:ml-64 p-6 lg:p-8">{children}</main>
    </div>
  )
}