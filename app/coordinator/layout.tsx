"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { CoordinatorSidebar } from "@/components/coordinator/coordinator-sidebar"

export default function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth?tab=coordinator")
      } else if (user?.role !== "moderator") {
        // Redirect non-coordinator users to their respective dashboards
        if (user?.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      }
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "moderator") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <CoordinatorSidebar />
      <main className="lg:ml-64 p-6 lg:p-8">{children}</main>
    </div>
  )
}
