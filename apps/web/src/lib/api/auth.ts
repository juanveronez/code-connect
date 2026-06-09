import { api } from './client'
import type { AuthResponse, LoginPayload, RegisterPayload, UserProfile } from './auth.types'

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', payload)
  return res.data
}

export async function register(payload: RegisterPayload): Promise<UserProfile> {
  const res = await api.post<UserProfile>('/auth/register', payload)
  return res.data
}

export async function getProfile(): Promise<UserProfile> {
  const res = await api.get<UserProfile>('/auth/profile')
  return res.data
}
