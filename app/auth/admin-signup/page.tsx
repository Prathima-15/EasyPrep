"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Sparkles, User, Mail, Lock, Shield, Clock, CheckCircle, RefreshCw, UserCog, Briefcase, Building2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { authAPI } from "@/lib/api-client"

export default function AdminSignup() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    department: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const departments = ["IT", "CSE", "ECE", "CIVIL", "EEE", "MECH", "MCT", "BME", "FT", "Placement"]

  useEffect(() => {
    if (timeRemaining > 0 && showOtpModal) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeRemaining, showOtpModal])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required"
    }

    if (!formData.department) {
      newErrors.department = "Department is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Call real backend API
      const result = await authAPI.signupAdmin({
        name: formData.name,
        email: formData.email,
        username: formData.designation, // Using designation as username
        department: formData.department,
        password: formData.password,
      })

      if (result.success && result.data) {
        // Store user ID for OTP verification
        setUserId(result.data.userId)
        
        // Show OTP modal
        setShowOtpModal(true)
        setTimeRemaining(600) // 10 minutes in seconds
        
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${formData.email}`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: result.message || "Please try again later.",
        })
        if (result.errors) {
          const newErrors: Record<string, string> = {}
          result.errors.forEach((err: any) => {
            if (err.param) newErrors[err.param] = err.msg
          })
          setErrors(newErrors)
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill(""))
    setOtp(newOtp)

    const nextEmptyIndex = newOtp.findIndex((digit) => !digit)
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerifyOTP = async () => {
    const enteredOtp = otp.join("")

    if (enteredOtp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Incomplete OTP",
        description: "Please enter all 6 digits",
      })
      return
    }

    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User ID not found. Please try signing up again.",
      })
      return
    }

    setIsVerifying(true)

    try {
      const result = await authAPI.verifyOTP({ userId, otp: enteredOtp })

      if (result.success) {
        toast({
          title: "Email Verified!",
          description: "Redirecting to login page...",
        })

        setShowOtpModal(false)

        // Redirect to staff login
        setTimeout(() => {
          router.push("/auth?tab=staff")
        }, 1500)
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: result.message || "Invalid or expired OTP",
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Please try again",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User ID not found. Please try signing up again.",
      })
      return
    }

    setIsResending(true)

    try {
      const result = await authAPI.resendOTP(userId)

      if (result.success) {
        setTimeRemaining(600)
        setOtp(["", "", "", "", "", ""])
        setCountdown(60) // 60 seconds cooldown

        toast({
          title: "OTP Resent",
          description: `New verification code sent to ${formData.email}`,
        })

        inputRefs.current[0]?.focus()
      } else {
        toast({
          variant: "destructive",
          title: "Failed to Resend",
          description: result.message || "Please try again.",
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Resend",
        description: error.message || "Please try again.",
      })
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <Sparkles className="h-4 w-4 text-sky-500" />
            <span className="text-2xl font-bold text-gray-900">EasyPrep</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-2">
              <UserCog className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-indigo-600">
              Create Admin Account
            </h1>
            <p className="text-gray-600 mt-2">
              Join EasyPrep as an admin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 text-indigo-600" />
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 text-indigo-600" />
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Designation */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Designation
              </label>
              <input
                name="designation"
                type="text"
                placeholder="Enter your designation"
                value={formData.designation}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                  errors.designation ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                  errors.department ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Lock className="w-4 h-4 text-indigo-600" />
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Shield className="w-4 h-4 text-indigo-600" />
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Navigation */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => router.push("/auth")}
                className="text-indigo-600 underline font-medium"
              >
                Sign in here
              </button>
            </p>
            <button
              type="button"
              onClick={() => router.push("/auth")}
              className="flex items-center justify-center text-gray-600 text-sm mx-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Main Login
            </button>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-600 mb-2">Verify Your Email</h2>
              <p className="text-gray-600">
                We've sent a 6-digit code to <strong>{formData.email}</strong>
              </p>
            </div>

            <div className="space-y-6">
              {/* OTP Input Boxes */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Time remaining: {formatTime(timeRemaining)}</span>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOTP}
                disabled={isVerifying || otp.join("").length !== 6}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                  isVerifying || otp.join("").length !== 6
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify OTP
                  </span>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || isResending}
                    className={`font-medium ${
                      countdown > 0 || isResending
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-indigo-600 hover:text-indigo-700'
                    }`}
                  >
                    {isResending ? (
                      "Sending..."
                    ) : countdown > 0 ? (
                      `Resend in ${countdown}s`
                    ) : (
                      "Resend OTP"
                    )}
                  </button>
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowOtpModal(false)}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
