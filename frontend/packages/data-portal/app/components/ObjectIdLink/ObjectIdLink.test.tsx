import { createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'

import {
  CDPO,
  CHEBI,
  CL,
  GO,
  PDB,
  UBERON,
  UNIPROTKB,
} from 'app/constants/annotationObjectIdLinks'

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

  it('should render CheBI link', async () => {
    const rawId = '4705'
    const id = `CHEBI:${rawId}`
    await renderObjectIdLink(id)

    expect(screen.getByRole('link')).toHaveAttribute('href', `${CHEBI}${rawId}`)
  })

  it('should render UBERON link', async () => {
    const rawId = '0003527'
    const id = `UBERON:${rawId}`
    await renderObjectIdLink(id)

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `${UBERON}${rawId}`,
    )
  })

  it('should render CDPO link', async () => {
    const id = 'CDPO:0000001'
    await renderObjectIdLink(id)

    expect(screen.getByRole('link')).toHaveAttribute('href', CDPO)
  })

  it('should render CL link', async () => {
    const rawId = '0000972'
    const id = `CL:${rawId}`
    await renderObjectIdLink(id)

    expect(screen.getByRole('link')).toHaveAttribute('href', `${CL}${rawId}`)
  })

  it('should render PDB link', async () => {
    const rawId = '1ABC'
    const id = `PDB-${rawId}`
    await renderObjectIdLink(id)

    expect(screen.getByRole('link')).toHaveAttribute('href', `${PDB}${rawId}`)
  })

  it('should not render link if not matched', async () => {
    const id = 'test-id-123'
    await renderObjectIdLink(id)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText(id)).toBeVisible()
  })
})
