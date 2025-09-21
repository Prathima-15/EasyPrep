"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export default function AdminSignOut() {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/admin/signin"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">Clear Authentication</h2>
        <p className="mb-4">Click to clear any existing authentication and go to admin signin</p>
        <Button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
          Clear Auth & Go to Admin Signin
        </Button>
      </div>
    </div>
  )
}