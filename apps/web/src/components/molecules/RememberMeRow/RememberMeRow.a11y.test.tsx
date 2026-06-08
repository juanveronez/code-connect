import { render } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { MemoryRouter } from 'react-router-dom'
import { runAxe } from '../../../test/a11y'
import { RememberMeRow } from './RememberMeRow'

function Wrapper() {
  const { register } = useForm<{ rememberMe: boolean }>()
  return (
    <MemoryRouter>
      <RememberMeRow registration={register('rememberMe')} />
    </MemoryRouter>
  )
}

describe('RememberMeRow – accessibility (WCAG 2 AA)', () => {
  it('checkbox with implicit label and link has no violations', async () => {
    const { container } = render(<Wrapper />)
    expect((await runAxe(container)).violations).toHaveLength(0)
  })
})
