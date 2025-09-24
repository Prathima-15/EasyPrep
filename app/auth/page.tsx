"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SignInForm } from "@/components/auth/sign-in-form"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, Sparkles } from "lucide-react"

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <Sparkles className="h-4 w-4 text-sky-500 absolute -top-1 -right-1" />
            </div>
            <span className="text-2xl font-bold text-gray-900">EasyPrep</span>
          </div>
        </div>

        {/* Auth Form */}
        {isSignIn ? (
          <SignInForm onToggleMode={() => setIsSignIn(false)} />
        ) : (
          <SignUpForm onToggleMode={() => setIsSignIn(true)} />
        )}

        {/* Coordinator/Admin Login Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            <button
              type="button"
              onClick={() => router.push("/auth/coordinator-login")}
              className="text-green-600 hover:text-green-700 font-medium underline mx-2"
            >
              Coordinator Login
            </button>
            |
            <button
              type="button"
              onClick={() => router.push("/admin/signin")}
              className="text-red-600 hover:text-red-700 font-medium underline ml-2"
            >
              Admin Portal
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
