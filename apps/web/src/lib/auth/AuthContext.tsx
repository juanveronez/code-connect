import { createContext, useContext, useState, type ReactNode } from 'react'
import { clearToken, getToken, setToken } from '../api/tokenStorage'
import { queryClient } from '../api/queryClient'

type AuthContextValue = {
  isAuthenticated: boolean
  setSession: (token: string, remember: boolean) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getToken() !== null)

  function setSession(token: string, remember: boolean) {
    setToken(token, remember)
    setIsAuthenticated(true)
  }

  function signOut() {
    clearToken()
    queryClient.removeQueries({ queryKey: ['profile'] })
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setSession, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
