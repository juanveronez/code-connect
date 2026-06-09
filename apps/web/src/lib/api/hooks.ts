import { useMutation, useQuery } from '@tanstack/react-query'
import { login, register, getProfile } from './auth'
import type { LoginPayload, RegisterPayload } from './auth.types'
import { useAuth } from '../auth/AuthContext'

export function useLogin() {
  return useMutation({ mutationFn: (payload: LoginPayload) => login(payload) })
}

export function useRegister() {
  return useMutation({ mutationFn: (payload: RegisterPayload) => register(payload) })
}

export function useProfile() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: isAuthenticated,
  })
}
