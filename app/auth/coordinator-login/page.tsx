"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function CoordinatorLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { signIn } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      const user = JSON.parse(localStorage.getItem("easyprep_user") || "null");
      if (user?.role === "moderator") {
        router.push("/dashboard/coordinator");
      } else {
        setError("Not a coordinator account");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleLogin}>
        <div className="flex items-center justify-center mb-6">
          <Shield className="h-8 w-8 text-red-600" />
          <span className="ml-2 text-2xl font-bold">Coordinator Login</span>
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-semibold">Login</button>
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </form>
    </div>
  )
}
