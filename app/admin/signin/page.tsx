"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Sparkles, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminSignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signIn, isLoading, isAuthenticated, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        router.push("/admin")
      } else {
        // Non-admin users get redirected to student dashboard
        router.push("/dashboard")
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges. Redirected to student dashboard.",
          variant: "destructive"
        })
      }
    }
  }, [isAuthenticated, user, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await signIn(email, password)
      // The useEffect above will handle the redirection based on user role
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Invalid admin credentials",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Admin Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Shield className="h-10 w-10 text-red-600" />
              <Sparkles className="h-5 w-5 text-amber-500 absolute -top-1 -right-1" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">EasyPrep</span>
              <span className="text-sm font-medium text-red-600">Admin Portal</span>
            </div>
          </div>
        </div>

        {/* Admin Sign In Form */}
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="text-center bg-red-50 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-red-800 flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              Admin Access
            </CardTitle>
            <CardDescription className="text-red-600">
              Secure administrator portal for EasyPrep platform management
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5" 
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Access Admin Portal"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">Demo Credentials</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    <strong>Email:</strong> admin@easyprep.com<br />
                    <strong>Password:</strong> password123
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700 text-center">
                🔒 This is a secure admin portal. All actions are logged and monitored.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Not an admin?{" "}
                <button 
                  type="button" 
                  onClick={() => router.push("/auth")} 
                  className="text-red-600 hover:text-red-700 font-medium underline"
                >
                  Student Sign In
                </button>
              </p>
              <p className="text-sm text-gray-600">
                <button 
                  type="button" 
                  onClick={() => router.push("/")} 
                  className="text-gray-600 hover:text-gray-700 underline"
                >
                  Back to Home
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}