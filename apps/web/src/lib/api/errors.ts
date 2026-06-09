import { isAxiosError } from 'axios'

export function authErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) return 'Email ou senha inválidos'
    if (error.response?.status === 409) return 'Este email já está em uso'
  }
  return fallback
}
