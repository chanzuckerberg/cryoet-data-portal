import { createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'

import { NCBI, OBO, WORMBASE } from 'app/constants/datasetInfoLinks'

import { InfoLinkProps } from './InfoLink'

async function renderInfoLink({ id, value }: InfoLinkProps) {
  const { InfoLink } = await import('./InfoLink')

  function InfoLinkWrapper() {
    return <InfoLink id={id} value={value} />
  }

  const InfoLinkStub = createRemixStub([
    {
      path: '/',
      Component: InfoLinkWrapper,
    },
  ])

  render(<InfoLinkStub />)
}

describe('<InfoLink />', () => {
  it('should render placeholder if no value', async () => {
    await renderInfoLink({ id: 123 })
    expect(screen.getByText('--')).toBeInTheDocument()
  })

  it('should render ncbi link', async () => {
    const id = 123
    const value = 'value'
    await renderInfoLink({ id, value })

    const link = screen.queryByRole('link', { name: value })
    expect(link).toBeVisible()
    expect(link).toHaveAttribute('href', `${NCBI}${id}`)
  })

  it('should render ncbi link with id prefix', async () => {
    const rawId = 123
    const id = `NCBITaxon:${rawId}`
    const value = 'value'
    await renderInfoLink({ id, value })

    const link = screen.queryByRole('link', { name: value })
    expect(link).toBeVisible()
    expect(link).toHaveAttribute('href', `${NCBI}${rawId}`)
  })

  it('should render wormbase link', async () => {
    const id = 'WBStrain12345678'
    const value = 'value'
    await renderInfoLink({ id, value })

    const link = screen.queryByRole('link', { name: value })
    expect(link).toBeVisible()
    expect(link).toHaveAttribute('href', `${WORMBASE}${id}`)
  })

  it('should render obo link', async () => {
    const id = 'foobar:123'
    const value = 'value'
    await renderInfoLink({ id, value })

    const link = screen.queryByRole('link', { name: value })
    expect(link).toBeVisible()
    expect(link).toHaveAttribute('href', `${OBO}${id.replaceAll(':', '_')}`)
  })

  it('should not render link if no pattern match', async () => {
    const id = 'someid123'
    const value = 'value'
    await renderInfoLink({ id, value })

    expect(screen.queryByRole('link', { name: value })).not.toBeInTheDocument()
    expect(screen.getByText(value)).toBeInTheDocument()
  })
})
