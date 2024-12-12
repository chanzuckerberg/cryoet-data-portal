import { createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'

import { HeaderKeyPhoto } from './HeaderKeyPhoto'

function renderKeyPhoto(url?: string) {
  function HeaderKeyPhotoWrapper() {
    return <HeaderKeyPhoto title="title" url={url} />
  }

  const HeaderKeyPhotoStub = createRemixStub([
    {
      path: '/',
      Component: HeaderKeyPhotoWrapper,
    },
  ])

  render(<HeaderKeyPhotoStub />)
}

describe('<HeaderKeyPhoto />', () => {
  it('should render key photo fallback if no url', () => {
    renderKeyPhoto()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('should render image and link if has url', () => {
    const url = 'https://example.com/img.jpg'
    renderKeyPhoto(url)

    const imgNode = screen.queryByRole('img')
    expect(imgNode).toBeVisible()
    expect(imgNode).toHaveAttribute('src', url)
  })
})
