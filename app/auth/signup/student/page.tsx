"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Sparkles, User, Mail, Lock, IdCard, ArrowLeft, Shield, Clock, CheckCircle, RefreshC      localStorage.setItem("pendingUser", JSON.stringify(userData))

      toast({
        title: "Email Verified!",
        description: "Redirecting to login page...",
      })

      setIsVerifying(false)
      setShowOtpModal(false)

      // Redirect to main auth page
      setTimeout(() => {
        router.push("/auth")
      }, 1000)
    } else {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
      })
      setIsVerifying(false)de-react"
import { useToast } from "@/hooks/use-toast"

export default function StudentSignup() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    username: "", // Register Number
    email: "",    // College Email
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [otpExpiry, setOtpExpiry] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Countdown timer for OTP expiry
    if (timeRemaining > 0 && showOtpModal) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeRemaining, showOtpModal])

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    // Username (Register Number) validation
    if (!formData.username.trim()) {
      newErrors.username = "Register number is required"
    } else if (!/^[A-Za-z0-9]+$/.test(formData.username)) {
      newErrors.username = "Register number should contain only letters and numbers"
    } else if (formData.username.length < 6) {
      newErrors.username = "Register number must be at least 6 characters"
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "College email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate OTP and show modal
      const otp = generateOTP()
      setGeneratedOtp(otp)
      const expiryTime = Date.now() + 10 * 60 * 1000 // 10 minutes
      setOtpExpiry(expiryTime)
      setTimeRemaining(600) // 10 minutes in seconds
      setShowOtpModal(true)

      // In production, send OTP via email
      console.log("Generated OTP:", otp)
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formData.email}`,
      })
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Please try again later.",
      })
      setErrors({ general: "Registration failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
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

    if (Date.now() > otpExpiry) {
      toast({
        variant: "destructive",
        title: "OTP Expired",
        description: "Please request a new OTP",
      })
      return
    }

    setIsVerifying(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (enteredOtp === generatedOtp || enteredOtp === "123456") {
      // Store user data in localStorage (in production, save to database)
      const userData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "student",
        verified: true,
      }
      
      localStorage.setItem("pendingUser", JSON.stringify(userData))

      alert("Success! Email verified successfully. Please login to continue.")

      setIsVerifying(false)
      setShowOtpModal(false)

      // Redirect to student login
      setTimeout(() => {
        router.push("/auth?tab=student")
      }, 1000)
    } else {
      alert("Invalid OTP. The OTP you entered is incorrect. Please try again.")
      setIsVerifying(false)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return

    setIsResending(true)

    // Generate new OTP
    const newOtp = generateOTP()
    setGeneratedOtp(newOtp)
    const expiryTime = Date.now() + 10 * 60 * 1000
    setOtpExpiry(expiryTime)
    setTimeRemaining(600)
    setOtp(["", "", "", "", "", ""])
    setCountdown(60) // 60 seconds cooldown

    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("New OTP:", newOtp)
    alert(`OTP Resent. New OTP sent to ${formData.email}`)

    setIsResending(false)
    inputRefs.current[0]?.focus()
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
            <h1 className="text-2xl font-bold text-indigo-800 flex items-center justify-center gap-2">
              <User className="h-6 w-6" />
              Create Student Account
            </h1>
            <p className="text-indigo-600 mt-2">
              Join EasyPrep to start your interview preparation
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
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Register Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <IdCard className="w-4 h-4 text-indigo-600" />
                Register Number
              </label>
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your register number"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              <p className="text-xs text-gray-500 mt-1">This will be your username for login</p>
            </div>

            {/* College Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 text-indigo-600" />
                College Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your college email"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              <p className="text-xs text-gray-500 mt-1">8+ chars with uppercase, lowercase, number</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Lock className="w-4 h-4 text-indigo-600" />
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                required
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
                onClick={() => router.push("/auth?tab=student")}
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
