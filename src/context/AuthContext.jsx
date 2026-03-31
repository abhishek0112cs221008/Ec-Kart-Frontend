import { createContext, useContext, useState, useCallback } from 'react'
import { fetchCurrentUser } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('eckart_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = useCallback((userData) => {
    localStorage.setItem('eckart_user', JSON.stringify(userData))
    localStorage.setItem('eckart_token', userData.accessToken)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('eckart_user')
    localStorage.removeItem('eckart_token')
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const userData = await fetchCurrentUser()
      // Merge with existing user (to keep token/refreshToken if not returned by /me)
      const updatedUser = { ...user, ...userData }
      localStorage.setItem('eckart_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      return updatedUser
    } catch (e) {
      console.error('Refresh user failed:', e)
      throw e
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth() {
  return useContext(AuthContext)
}
