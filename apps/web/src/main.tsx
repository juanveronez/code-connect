import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'

if (import.meta.env.DEV) {
  const React = await import('react')
  const ReactDOM = await import('react-dom')
  const { default: axe } = await import('@axe-core/react')
  axe(React, ReactDOM, 1000)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
