"use client"

import { Shield, TrendingUp } from "lucide-react"

export default function CoordinatorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="h-8 w-8 text-red-600" />
        <span className="text-3xl font-bold">Coordinator Dashboard</span>
        <TrendingUp className="h-5 w-5 text-green-500" />
      </div>
      <div className="bg-white rounded shadow p-6">
        {/* TODO: Add coordinator-specific company management, approval workflows, and department analytics */}
        <h2 className="text-xl font-semibold mb-4">Welcome, Coordinator!</h2>
        <p>Here you can manage companies, approve/reject student submissions, and view department analytics.</p>
      </div>
    </div>
  )
}
