"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SignInForm } from "@/components/auth/sign-in-form"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, Sparkles, Shield, UserCog } from "lucide-react"
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
    if (tabParam && ["student", "coordinator", "admin"].includes(tabParam)) {
      setTab(tabParam)
    }
  }, [searchParams])
  const { signIn } = useAuth()
  const router = useRouter()
  const [coordinatorEmail, setCoordinatorEmail] = useState("")
  const [coordinatorPassword, setCoordinatorPassword] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [coordinatorError, setCoordinatorError] = useState("")
  const [adminError, setAdminError] = useState("")
  const [coordinatorLoading, setCoordinatorLoading] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)

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
              <TabsTrigger value="coordinator" className="flex-1">Coordinator</TabsTrigger>
              <TabsTrigger value="admin" className="flex-1">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <SignInForm onToggleMode={() => {}} />
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground mt-2">Demo: <span className="font-mono">student@example.com</span> / <span className="font-mono">password123</span></p>
              </div>
            </TabsContent>
            <TabsContent value="coordinator">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="h-8 w-8 text-indigo-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-indigo-600">Coordinator Login</CardTitle>
                  <CardDescription>Access the admin panel and manage student data</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setCoordinatorError("");
                    setCoordinatorLoading(true);
                    try {
                      await signIn(coordinatorEmail, coordinatorPassword);
                      const user = JSON.parse(localStorage.getItem("easyprep_user") || "null");
                      if (user?.role === "moderator") {
                        router.replace("/coordinator");
                      } else {
                        setCoordinatorError("Not a coordinator account");
                      }
                    } catch (err: any) {
                      setCoordinatorError(err.message || "Login failed");
                    } finally {
                      setCoordinatorLoading(false);
                    }
                  }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="coordinator-username">Username</Label>
                      <Input
                        id="coordinator-username"
                        type="text"
                        placeholder="Enter your username"
                        value={coordinatorEmail}
                        onChange={(e) => setCoordinatorEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coordinator-password">Password</Label>
                      <Input
                        id="coordinator-password"
                        type="password"
                        placeholder="Enter your password"
                        value={coordinatorPassword}
                        onChange={(e) => setCoordinatorPassword(e.target.value)}
                        required
                      />
                    </div>
                    {coordinatorError && <p className="text-sm text-red-500">{coordinatorError}</p>}
                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={coordinatorLoading}>
                      {coordinatorLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <button type="button" onClick={() => router.push("/auth/coordinator-signup")} className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Sign up
                      </button>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Demo: <span className="font-mono">coordinator@example.com</span> / <span className="font-mono">password123</span></p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="admin">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <UserCog className="h-8 w-8 text-indigo-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-indigo-600">Admin Login</CardTitle>
                  <CardDescription>Access coordinator dashboard and system settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setAdminError("");
                    setAdminLoading(true);
                    try {
                      await signIn(adminEmail, adminPassword);
                      const user = JSON.parse(localStorage.getItem("easyprep_user") || "null");
                      if (user?.role === "admin") {
                        router.replace("/dashboard/coordinator");
                      } else {
                        setAdminError("Not an admin account");
                      }
                    } catch (err: any) {
                      setAdminError(err.message || "Login failed");
                    } finally {
                      setAdminLoading(false);
                    }
                  }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-username">Username</Label>
                      <Input
                        id="admin-username"
                        type="text"
                        placeholder="Enter your username"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                      />
                    </div>
                    {adminError && <p className="text-sm text-red-500">{adminError}</p>}
                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={adminLoading}>
                      {adminLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <button type="button" onClick={() => router.push("/auth/admin-signup")} className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Sign up
                      </button>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Demo: <span className="font-mono">admin@easyprep.com</span> / <span className="font-mono">password123</span></p>
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
