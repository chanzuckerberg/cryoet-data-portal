import { createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'

import { GO, UNIPROTKB } from 'app/constants/annotationObjectIdLinks'

async function renderObjectIdLink(id: string) {
  const { ObjectIdLink } = await import('./ObjectIdLink')

  function ObjectIdLinkWrapper() {
    return <ObjectIdLink id={id} />
  }

  const ObjectIdLinkStub = createRemixStub([
    {
      path: '/',
      Component: ObjectIdLinkWrapper,
    },
  ])

  render(<ObjectIdLinkStub />)
}

describe('<ObjectIdLink />', () => {
  it('should render go link', async () => {
    const id = 'GO:123'
    await renderObjectIdLink(id)

    expect(screen.getByRole('link')).toHaveAttribute('href', `${GO}${id}`)
  })

  it('should render UniProtKB link', async () => {
    const rawId = 123
    const id = `UniProtKB:${rawId}`
    await renderObjectIdLink(id)

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `${UNIPROTKB}${rawId}`,
    )
  })

  it('should not render link if not matched', async () => {
    const id = 'test-id-123'
    await renderObjectIdLink(id)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText(id)).toBeVisible()
  })
})
