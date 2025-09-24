"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview"

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth")
      } else {
        // Role-based routing (swapped)
        if (user?.role === "admin") {
          router.replace("/dashboard/coordinator")
        } else if (user?.role === "moderator") {
          router.replace("/admin")
        }
        // For students, stay on the main dashboard
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

  if (!isAuthenticated) {
    return null
  }

  // Only show student dashboard for student role
  if (user?.role === "student") {
    return <AnalyticsOverview />
  }

  // For admin/moderator roles, they should be redirected by the useEffect above
  return null
}
