import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { router } from './router'
import { queryClient } from './lib/api/queryClient'
import { AuthProvider } from './lib/auth/AuthContext'

if (import.meta.env.DEV) {
  const React = await import('react')
  const ReactDOM = await import('react-dom')
  const { default: axe } = await import('@axe-core/react')
  axe(React, ReactDOM, 1000)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
