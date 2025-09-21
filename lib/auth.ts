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
]

export const signIn = async (email: string, password: string): Promise<User> => {
  // Mock sign in - replace with real authentication
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === email)
  if (!user || password !== "password123") {
    throw new Error("Invalid credentials")
  }

  // Store in localStorage for persistence
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
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem("easyprep_user")
  return stored ? JSON.parse(stored) : null
}
