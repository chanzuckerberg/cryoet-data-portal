import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { QueryParams } from 'app/constants/query'
import { RemixMock } from 'app/mocks/Remix.mock'

import { InputFilterData, MultiInputFilterProps } from './MultiInputFilter'

const remixMock = new RemixMock()

async function renderMultiInputFilter({
  filters = [],
  label = '',
  subtitle,
  title,
}: Partial<MultiInputFilterProps> = {}) {
  const { MultiInputFilter } = await import('./MultiInputFilter')

  render(
    <MultiInputFilter
      filters={filters}
      label={label}
      subtitle={subtitle}
      title={title}
    />,
  )
}

describe('<MultiInputFilter />', () => {
  beforeEach(() => {
    remixMock.reset()
  })

  it('should render label', async () => {
    const label = 'Test Label'
    await renderMultiInputFilter({ label })

    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('should render default title and subtitle', async () => {
    await renderMultiInputFilter()
    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('filterByAnyOfTheFollowing')).toBeInTheDocument()
    expect(screen.getByText('(limitOneValuePerField)')).toBeInTheDocument()
  })

  it('should render title', async () => {
    const title = 'Test Title'
    await renderMultiInputFilter({ title })
    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByText(title)).toBeInTheDocument()
  })

  it('should render subtitle', async () => {
    const subtitle = 'Test Subtitle'
    await renderMultiInputFilter({ subtitle })
    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByText(subtitle)).toBeInTheDocument()
  })

  it('should update values', async () => {
    const filter: InputFilterData = {
      id: 'filter',
      label: 'Filter',
      queryParam: QueryParams.DatasetId,
    }

    await renderMultiInputFilter({ filters: [filter] })
    await userEvent.click(screen.getByRole('button'))

    const input = screen.getByRole('textbox')
    const value = 'value'
    await userEvent.type(input, value)
    expect(input).toHaveValue(value)
  })

  it('should apply filters on click', async () => {
    const filter: InputFilterData = {
      id: 'filter',
      label: 'Filter',
      queryParam: QueryParams.DatasetId,
    }

    await renderMultiInputFilter({ filters: [filter] })
    await userEvent.click(screen.getByRole('button'))

    const input = screen.getByRole('textbox')
    const value = '123'
    await userEvent.type(input, value)
    await userEvent.click(screen.getByRole('button', { name: 'apply' }))

    expect(remixMock.getLastSetParams()?.toString()).toEqual(
      `${QueryParams.DatasetId}=${value}`,
    )
  })

  it('should reset filters on click', async () => {
    const filter: InputFilterData = {
      id: 'filter',
      label: 'Filter',
      queryParam: QueryParams.DatasetId,
    }

    await renderMultiInputFilter({ filters: [filter] })
    await userEvent.click(screen.getByRole('button'))

    const input = screen.getByRole('textbox')
    const value = '123'
    await userEvent.type(input, value)
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))

    expect(remixMock.setParams).not.toHaveBeenCalled()
  })

  it('should show initial values', async () => {
    const label = 'Open Filters'
    const filter: InputFilterData = {
      id: 'filter',
      label: 'Filter',
      queryParam: QueryParams.DatasetId,
    }

    remixMock.mockSearchParams(
      new URLSearchParams([[filter.queryParam, '123']]),
    )

    await renderMultiInputFilter({ label, filters: [filter] })
    await userEvent.click(screen.getByRole('button', { name: label }))

    const input = screen.getByRole('textbox')
    const value = '123'
    expect(input).toHaveValue(value)
  })

  it("should disable apply if values haven't changed", async () => {
    const label = 'Open Filters'
    const filter: InputFilterData = {
      id: 'filter',
      label: 'Filter',
      queryParam: QueryParams.DatasetId,
    }

    remixMock.mockSearchParams(
      new URLSearchParams([[filter.queryParam, '123']]),
    )

    await renderMultiInputFilter({ label, filters: [filter] })
    await userEvent.click(screen.getByRole('button', { name: label }))

    expect(screen.getByRole('button', { name: 'apply' })).toBeDisabled()
  })

  it('should disable apply if invalid prefix id', async () => {
    const filter: InputFilterData = {
      id: 'filter',
      label: 'Filter',
      queryParam: QueryParams.DatasetId,
    }

    await renderMultiInputFilter({ filters: [filter] })
    await userEvent.click(screen.getByRole('button'))

    const input = screen.getByRole('textbox')
    const value = 'derp-123'
    await userEvent.type(input, value)

    expect(screen.getByRole('button', { name: 'apply' })).toBeDisabled()
  })
})
