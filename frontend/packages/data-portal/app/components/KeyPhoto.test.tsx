import { render, screen } from '@testing-library/react'

import { KeyPhoto } from './KeyPhoto'

describe('<KeyPhoto />', () => {
  it('should show fallback if no image is defined', () => {
    render(<KeyPhoto title="test" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('should show image if defined', () => {
    const src = 'https://example.com/image.jpg'
    render(<KeyPhoto title="test" src={src} />)

    const imgNode = screen.queryByRole('img')
    expect(imgNode).toBeVisible()
    expect(imgNode).toHaveAttribute('src', src)
  })
})
