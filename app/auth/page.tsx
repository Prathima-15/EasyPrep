"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SignInForm } from "@/components/auth/sign-in-form"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, Sparkles, Shield } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"


export default function AuthPage() {
  const [tab, setTab] = useState("student")
  const { signIn } = useAuth()
  const router = useRouter()
  const [coordinatorError, setCoordinatorError] = useState("")
  const [adminError, setAdminError] = useState("")

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
              <form className="w-full" onSubmit={async (e) => {
                e.preventDefault();
                setCoordinatorError("");
                const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
                try {
                  await signIn(email, password);
                  const user = JSON.parse(localStorage.getItem("easyprep_user") || "null");
                  if (user?.role === "moderator") {
                    router.replace("/admin");
                  } else {
                    setCoordinatorError("Not a coordinator account");
                  }
                } catch (err: any) {
                  setCoordinatorError(err.message || "Login failed");
                }
              }}>
                <div className="flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-red-600" />
                  <span className="ml-2 text-2xl font-bold">Coordinator Login</span>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full mb-4 p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full mb-6 p-2 border rounded"
                  required
                />
                <button type="submit" className="w-full border font-semibold py-2 rounded bg-white hover:bg-gray-100 transition" style={{ borderColor: 'var(--primary)' }}>Login</button>
                {coordinatorError && <p className="mt-4 text-red-600 text-center text-sm">{coordinatorError}</p>}
                <div className="mt-6 text-center bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-700 font-semibold mb-1">Demo Coordinator Login (Admin Panel Access):</p>
                  <p className="text-xs text-gray-600">Email: <span className="font-mono">coordinator@example.com</span></p>
                  <p className="text-xs text-gray-600">Password: <span className="font-mono">password123</span></p>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="admin">
              <form className="w-full" onSubmit={async (e) => {
                e.preventDefault();
                setAdminError("");
                const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
                try {
                  await signIn(email, password);
                  const user = JSON.parse(localStorage.getItem("easyprep_user") || "null");
                  if (user?.role === "admin") {
                    router.replace("/dashboard/coordinator");
                  } else {
                    setAdminError("Not an admin account");
                  }
                } catch (err: any) {
                  setAdminError(err.message || "Login failed");
                }
              }}>
                <div className="flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-red-600" />
                  <span className="ml-2 text-2xl font-bold">Admin Login</span>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full mb-4 p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full mb-6 p-2 border rounded"
                  required
                />
                <button type="submit" className="w-full border font-semibold py-2 rounded bg-white hover:bg-gray-100 transition" style={{ borderColor: 'var(--primary)' }}>Login</button>
                {adminError && <p className="mt-4 text-red-600 text-center text-sm">{adminError}</p>}
                <div className="mt-6 text-center bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-700 font-semibold mb-1">Demo Admin Login (Coordinator Dashboard Access):</p>
                  <p className="text-xs text-gray-600">Email: <span className="font-mono">admin@easyprep.com</span></p>
                  <p className="text-xs text-gray-600">Password: <span className="font-mono">password123</span></p>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
