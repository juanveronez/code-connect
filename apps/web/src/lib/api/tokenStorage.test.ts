import { afterEach, describe, expect, it } from 'vitest'
import { clearToken, getToken, setToken } from './tokenStorage'

const KEY = 'cc.access_token'

afterEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('tokenStorage', () => {
  describe('setToken with remember=true', () => {
    it('stores token in localStorage', () => {
      setToken('tok', true)
      expect(localStorage.getItem(KEY)).toBe('tok')
    })

    it('clears sessionStorage', () => {
      sessionStorage.setItem(KEY, 'old')
      setToken('tok', true)
      expect(sessionStorage.getItem(KEY)).toBeNull()
    })
  })

  describe('setToken with remember=false', () => {
    it('stores token in sessionStorage', () => {
      setToken('tok', false)
      expect(sessionStorage.getItem(KEY)).toBe('tok')
    })

    it('clears localStorage', () => {
      localStorage.setItem(KEY, 'old')
      setToken('tok', false)
      expect(localStorage.getItem(KEY)).toBeNull()
    })
  })

  describe('getToken', () => {
    it('returns token from localStorage', () => {
      localStorage.setItem(KEY, 'local-tok')
      expect(getToken()).toBe('local-tok')
    })

    it('falls back to sessionStorage when localStorage is empty', () => {
      sessionStorage.setItem(KEY, 'session-tok')
      expect(getToken()).toBe('session-tok')
    })

    it('returns null when both storages are empty', () => {
      expect(getToken()).toBeNull()
    })
  })

  describe('clearToken', () => {
    it('removes token from both storages', () => {
      localStorage.setItem(KEY, 'a')
      sessionStorage.setItem(KEY, 'b')
      clearToken()
      expect(localStorage.getItem(KEY)).toBeNull()
      expect(sessionStorage.getItem(KEY)).toBeNull()
    })
  })
})
