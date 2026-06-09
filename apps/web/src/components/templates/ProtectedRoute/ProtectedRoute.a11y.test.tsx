import { vi } from 'vitest'
import { runAxe } from '../../../test/a11y'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { ProtectedRoute } from './ProtectedRoute'
import * as tokenStorage from '../../../lib/api/tokenStorage'

vi.mock('../../../lib/api/tokenStorage')

describe('ProtectedRoute – accessibility (WCAG 2 AA)', () => {
  it('has no violations when rendering children', async () => {
    vi.mocked(tokenStorage.getToken).mockReturnValue('valid-token')
    const { container } = renderWithProviders(
      <ProtectedRoute>
        <main><h1>Conteúdo protegido</h1></main>
      </ProtectedRoute>,
    )
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
