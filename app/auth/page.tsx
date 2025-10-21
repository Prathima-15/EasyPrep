"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SignInForm } from "@/components/auth/sign-in-form"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, Sparkles, Shield } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


export default function AuthPage() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState("student")
  
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam && ["student", "staff"].includes(tabParam)) {
      setTab(tabParam)
    }
  }, [searchParams])
  const { signIn } = useAuth()
  const router = useRouter()
  const [staffUsername, setStaffUsername] = useState("")
  const [staffPassword, setStaffPassword] = useState("")
  const [staffError, setStaffError] = useState("")
  const [staffLoading, setStaffLoading] = useState(false)

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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="student" className="flex-1">Student</TabsTrigger>
              <TabsTrigger value="staff" className="flex-1">Staff Login</TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <SignInForm onToggleMode={() => {}} />
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground mt-2">Demo: <span className="font-mono">student@example.com</span> / <span className="font-mono">password123</span></p>
              </div>
            </TabsContent>
            <TabsContent value="staff">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="h-8 w-8 text-indigo-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-indigo-600">Staff Login</CardTitle>
                  <CardDescription>Access coordinator or admin dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setStaffError("");
                    setStaffLoading(true);
                    try {
                      await signIn(staffUsername, staffPassword);
                      const user = JSON.parse(localStorage.getItem("easyprep_user") || "null");
                      
                      // Redirect based on role
                      if (user?.role === "moderator") {
                        router.replace("/coordinator");
                      } else if (user?.role === "admin") {
                        router.replace("/admin");
                      } else {
                        setStaffError("Invalid staff credentials");
                      }
                    } catch (err: any) {
                      setStaffError(err.message || "Login failed");
                    } finally {
                      setStaffLoading(false);
                    }
                  }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="staff-username">Username</Label>
                      <Input
                        id="staff-username"
                        type="text"
                        placeholder="Enter your username"
                        value={staffUsername}
                        onChange={(e) => setStaffUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-password">Password</Label>
                      <Input
                        id="staff-password"
                        type="password"
                        placeholder="Enter your password"
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        required
                      />
                    </div>
                    {staffError && <p className="text-sm text-red-500">{staffError}</p>}
                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={staffLoading}>
                      {staffLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <button type="button" onClick={() => router.push("/auth/staff-signup")} className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Sign up
                      </button>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Demo Coordinator: <span className="font-mono">coordinator</span> / <span className="font-mono">password123</span>
                      <br />
                      Demo Admin: <span className="font-mono">admin</span> / <span className="font-mono">password123</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
