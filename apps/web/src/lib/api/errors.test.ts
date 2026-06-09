import { describe, expect, it } from 'vitest'
import { authErrorMessage } from './errors'

function axiosError(status: number) {
  return { isAxiosError: true, response: { status } }
}

describe('authErrorMessage', () => {
  it('returns invalid-credentials message for 401', () => {
    expect(authErrorMessage(axiosError(401), 'fallback')).toBe('Email ou senha inválidos')
  })

  it('returns email-taken message for 409', () => {
    expect(authErrorMessage(axiosError(409), 'fallback')).toBe('Este email já está em uso')
  })

  it('returns fallback for other status codes', () => {
    expect(authErrorMessage(axiosError(500), 'fallback')).toBe('fallback')
  })

  it('returns fallback for non-axios errors', () => {
    expect(authErrorMessage(new Error('oops'), 'fallback')).toBe('fallback')
  })
})
