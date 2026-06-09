import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { ProtectedRoute } from './ProtectedRoute'
import * as tokenStorage from '../../../lib/api/tokenStorage'
import { vi } from 'vitest'

vi.mock('../../../lib/api/tokenStorage')

describe('ProtectedRoute', () => {
  it('renders children when authenticated', () => {
    vi.mocked(tokenStorage.getToken).mockReturnValue('valid-token')
    renderWithProviders(
      <Routes>
        <Route path="/" element={<ProtectedRoute><p>Protected content</p></ProtectedRoute>} />
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>,
      { initialEntries: ['/'] },
    )
    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('redirects to /login when not authenticated', () => {
    vi.mocked(tokenStorage.getToken).mockReturnValue(null)
    renderWithProviders(
      <Routes>
        <Route path="/" element={<ProtectedRoute><p>Protected content</p></ProtectedRoute>} />
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>,
      { initialEntries: ['/'] },
    )
    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })
})
