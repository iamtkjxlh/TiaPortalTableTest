import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App.jsx'

describe('App', () => {
  it('renders the home navigation links', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'TIA Portal Demo' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Table With Tree' })).toHaveAttribute(
      'href',
      '/table-with-tree'
    )
    expect(screen.getByRole('link', { name: 'Table Without Tree' })).toHaveAttribute(
      'href',
      '/table-without-tree'
    )
  })
})
