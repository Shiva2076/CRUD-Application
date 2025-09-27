"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signupUser, loginUser } from '@/services/authAPIs'
import { User, LoginPayload, SignupPayload } from '@/types/auth'

// Define the context shape
interface AuthContextType {
  // State
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  login: (credentials: LoginPayload) => Promise<void>
  signup: (userData: SignupPayload) => Promise<void>
  logout: () => void
  
  // Utils
  updateUser: (userData: Partial<User>) => void
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated
  const isAuthenticated = !!user

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')
      
      if (token && userData) {
        setUser(JSON.parse(userData))
        // Optionally verify token with backend here
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      // Clear invalid data
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginPayload) => {
    try {
      setIsLoading(true)
      const response = await loginUser(credentials)
      
      // Store token and user data
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user_data', JSON.stringify(response.user))
      
      // Update state
      setUser(response.user)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Login failed:', error)
      throw error // Re-throw so component can handle it
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: SignupPayload) => {
    try {
      setIsLoading(true)
      const response = await signupUser(userData)
      
      // Store token and user data
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user_data', JSON.stringify(response.user))
      
      // Update state
      setUser(response.user)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Signup failed:', error)
      throw error // Re-throw so component can handle it
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear storage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    
    // Clear state
    setUser(null)
    
    // Redirect to login
    router.push('/auth/login')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user_data', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}