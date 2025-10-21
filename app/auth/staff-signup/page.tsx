"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { BookOpen, Sparkles, Shield } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function StaffSignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  // OTP Modal state
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [otpError, setOtpError] = useState("")
  const [verifyingOTP, setVerifyingOTP] = useState(false)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const departments = [
    "IT",
    "CSE",
    "ECE",
    "CIVIL",
    "EEE",
    "MECH",
    "MCT",
    "BME",
    "FT",
    "Placement",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleOTPChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOTPPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "")
    const newOtp = [...otp]
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    
    setOtp(newOtp)
    
    // Focus the next empty box or the last box
    const nextEmptyIndex = newOtp.findIndex(val => !val)
    if (nextEmptyIndex !== -1) {
      otpInputRefs.current[nextEmptyIndex]?.focus()
    } else {
      otpInputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.name || !formData.email || !formData.department || !formData.password) {
      setError("All fields are required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      // Simulate API call - Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save to localStorage (temporary - replace with API call)
      const pendingUser = {
        ...formData,
        role: formData.department === "Placement" ? "admin" : "moderator",
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem("easyprep_pending_staff", JSON.stringify(pendingUser))

      // Show OTP modal and notify user
      setShowOTPModal(true)
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formData.email}`,
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err.message || "Please try again later.",
      })
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setOtpError("")
    
    const otpString = otp.join("")
    
    if (otpString.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP")
      return
    }

    setVerifyingOTP(true)

    try {
      // Simulate OTP verification - Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const pendingUser = JSON.parse(localStorage.getItem("easyprep_pending_staff") || "{}")
      
      // Save verified user (temporary - will be replaced with API)
      const verifiedUser = {
        ...pendingUser,
        verified: true,
      }
      
      localStorage.setItem("easyprep_user", JSON.stringify(verifiedUser))
      localStorage.removeItem("easyprep_pending_staff")

      // Close modal and redirect to staff login
      setShowOTPModal(false)
      
      toast({
        title: "Email Verified!",
        description: "Redirecting to login page...",
      })
      
      // Redirect to staff login page
      setTimeout(() => {
        router.replace("/auth?tab=staff")
      }, 1000)
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: err.message || "Invalid OTP. Please try again.",
      })
      setOtpError(err.message || "OTP verification failed")
    } finally {
      setVerifyingOTP(false)
    }
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

        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-indigo-600">Staff Registration</CardTitle>
            <CardDescription>Create your coordinator or admin account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.department === "Placement" 
                    ? "Placement department members will have admin access" 
                    : formData.department 
                    ? "You will be registered as a coordinator" 
                    : ""}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/auth?tab=staff")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Signin
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* OTP Verification Modal */}
        <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-indigo-600">Verify Your Email</DialogTitle>
              <DialogDescription className="text-center">
                We've sent a 6-digit OTP to <span className="font-semibold">{formData.email}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-center block">Enter OTP</Label>
                <div className="flex justify-center gap-3" onPaste={handleOTPPaste}>
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        otpInputRefs.current[index] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="w-14 h-14 text-center text-2xl font-bold border-2 border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 rounded-lg"
                    />
                  ))}
                </div>
              </div>
              {otpError && <p className="text-sm text-red-500 text-center">{otpError}</p>}
              <Button
                onClick={handleVerifyOTP}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={verifyingOTP}
              >
                {verifyingOTP ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Resend OTP logic
                  setOtpError("")
                  setOtp(["", "", "", "", "", ""])
                  otpInputRefs.current[0]?.focus()
                }}
              >
                Resend OTP
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
