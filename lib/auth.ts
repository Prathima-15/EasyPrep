// Authentication utilities and types
export interface User {
  id: string
  email: string
  name: string
  college?: string
  branch?: string
  role?: "student" | "admin" | "moderator"
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock authentication functions - replace with real auth later
export const mockUsers: User[] = [
  {
    id: "1",
    email: "student@example.com",
    name: "John Doe",
    college: "MIT",
    branch: "Computer Science",
    role: "student",
  },
  {
    id: "2",
    email: "admin@easyprep.com",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "3",
    email: "coordinator@example.com",
    name: "Jane Smith",
    college: "MIT",
    branch: "ECE",
    role: "moderator",
  },
]

export const signIn = async (username: string, password: string): Promise<User> => {
  // Import API client
  const { authAPI } = await import("@/lib/api-client")
  
  // Call real backend API
  const result = await authAPI.login({ username, password })
  
  if (!result.success || !result.data) {
    throw new Error(result.message || "Invalid credentials")
  }

  // Transform backend user to frontend User type
  const user: User = {
    id: result.data.user.id.toString(),
    email: result.data.user.email,
    name: result.data.user.name,
    branch: result.data.user.department,
    role: result.data.user.role,
  }

  // Token is already stored by authAPI.login()
  // Also store user data for quick access
  localStorage.setItem("easyprep_user", JSON.stringify(user))
  
  return user
}

export const signUp = async (userData: {
  email: string
  password: string
  name: string
  college?: string
  branch?: string
}): Promise<User> => {
  // Mock sign up - replace with real authentication
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name,
    college: userData.college,
    branch: userData.branch,
    role: "admin",
  }

  mockUsers.push(newUser)
  localStorage.setItem("easyprep_user", JSON.stringify(newUser))
  return newUser
}

export const signOut = async (): Promise<void> => {
  localStorage.removeItem("easyprep_user")
  localStorage.removeItem("easyprep_token")
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  // Check if token exists
  const token = localStorage.getItem("easyprep_token")
  if (!token) return null

  const stored = localStorage.getItem("easyprep_user")
  return stored ? JSON.parse(stored) : null
}
