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
