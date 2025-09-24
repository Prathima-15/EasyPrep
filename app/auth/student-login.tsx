"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function StudentLogin() {
  const [registerNumber, setRegisterNumber] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const { signIn } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // For demo, use registerNumber as email
      await signIn(registerNumber, password);
      const user = JSON.parse(localStorage.getItem("easyprep_user") || "null");
      if (user?.role === "student") {
        router.push("/dashboard/student");
      } else {
        setError("Not a student account");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }
