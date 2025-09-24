"use client"

import { BookOpen, Sparkles } from "lucide-react"

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center gap-2 mb-8">
        <BookOpen className="h-8 w-8 text-indigo-600" />
        <span className="text-3xl font-bold">Student Dashboard</span>
        <Sparkles className="h-5 w-5 text-sky-500" />
      </div>
      <div className="bg-white rounded shadow p-6">
        {/* TODO: Add student-specific analytics, eligible companies, trending topics, and contributions */}
        <h2 className="text-xl font-semibold mb-4">Welcome, Student!</h2>
        <p>Here you can view eligible companies, department analytics, submit questions/reviews, and track your contributions.</p>
      </div>
    </div>
  )
}
