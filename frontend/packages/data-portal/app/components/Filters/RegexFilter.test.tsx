import { beforeEach } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { IdPrefix } from 'app/constants/idPrefixes'
import { QueryParams } from 'app/constants/query'
import { RemixMock } from 'app/mocks/Remix.mock'

import { RegexFilterProps } from './RegexFilter'

// Initialize mock before any imports
const remixMock = new RemixMock()

async function renderRegexFilter({
  displayNormalizer,
  id = 'id',
  label = 'label',
  paramNormalizer,
  queryParam = QueryParams.DatasetId,
  regex = /.*/,
  title = 'title',
}: Partial<RegexFilterProps> = {}) {
  const { RegexFilter } = await import('./RegexFilter')

  render(
    <RegexFilter
      displayNormalizer={displayNormalizer}
      id={id}
      label={label}
      paramNormalizer={paramNormalizer}
      queryParam={queryParam}
      regex={regex}
      title={title}
    />,
  )
}

describe('<RegexFilter />', () => {
  beforeEach(() => {
    remixMock.reset()
  })

  it('should render title', async () => {
    const user = userEvent.setup()
    const title = 'Test Title'
    await renderRegexFilter({ title })

    await user.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText(title)).toBeVisible()
    })
  })

  it('should render initial value', async () => {
    const user = userEvent.setup()
    const label = 'Open Filters'
    const queryParam = QueryParams.DatasetId
    const value = '123'
    remixMock.mockSearchParams(new URLSearchParams([[queryParam, value]]))
    await renderRegexFilter({
      label,
      queryParam,
    })

    expect(screen.getByText(`${IdPrefix.Dataset}-${value}`)).toBeVisible()

    await user.click(screen.getByRole('button', { name: label }))

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue(value)
    })
  })

  it('should disable apply if value does not match regex', async () => {
    const user = userEvent.setup()
    const label = 'Open Filters'
    const queryParam = QueryParams.DatasetId
    await renderRegexFilter({
      label,
      queryParam,
      regex: /[a-z]+/,
    })

    await user.click(screen.getByRole('button', { name: label }))

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeVisible()
    })

    await user.type(screen.getByRole('textbox'), '123')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'apply' })).toBeDisabled()
    })
  })

  it('should set value on apply click', async () => {
    const user = userEvent.setup()
    const label = 'Open Filters'
    const queryParam = QueryParams.DatasetId
    await renderRegexFilter({
      label,
      queryParam,
    })

    await user.click(screen.getByRole('button', { name: label }))

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeVisible()
    })

    await user.type(screen.getByRole('textbox'), '123')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'apply' })).toBeEnabled()
    })

    await user.click(screen.getByRole('button', { name: 'apply' }))

    expect(remixMock.getLastSetParams()?.toString()).toBe(`${queryParam}=123`)
  })

  it('should normalize initial value', async () => {
    const user = userEvent.setup()
    const label = 'Open Filters'
    const queryParam = QueryParams.DatasetId
    const value = '123'
    const normalizedValue = `${IdPrefix.Dataset}-123`
    remixMock.mockSearchParams(new URLSearchParams([[queryParam, value]]))
    await renderRegexFilter({
      label,
      queryParam,
      displayNormalizer: () => normalizedValue,
    })

    expect(screen.getByText(normalizedValue)).toBeVisible()

    await user.click(screen.getByRole('button', { name: label }))

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue(value)
    })
  })

  it('should normalize value', async () => {
    const user = userEvent.setup()
    const label = 'Open Filters'
    const queryParam = QueryParams.DatasetId
    const value = '123'
    const normalizedValue = `${IdPrefix.Dataset}-123`
    await renderRegexFilter({
      label,
      queryParam,
      displayNormalizer: () => normalizedValue,
    })

    await user.click(screen.getByRole('button', { name: label }))

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeVisible()
    })

    await user.type(screen.getByRole('textbox'), value)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'apply' })).toBeEnabled()
    })

    await user.click(screen.getByRole('button', { name: 'apply' }))

    // Wait for the form to close and reopen
    await user.click(screen.getByRole('button', { name: label }))

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue(normalizedValue)
    })
  })

  it('should normalize param value', async () => {
    const user = userEvent.setup()
    const label = 'Open Filters'
    const queryParam = QueryParams.DatasetId
    const value = `${IdPrefix.Dataset}-123`
    const normalizedValue = `123`
    await renderRegexFilter({
      label,
      queryParam,
      paramNormalizer: () => normalizedValue,
    })

    await user.click(screen.getByRole('button', { name: label }))

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeVisible()
    })

    await user.type(screen.getByRole('textbox'), value)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'apply' })).toBeEnabled()
    })

    await user.click(screen.getByRole('button', { name: 'apply' }))

    expect(remixMock.getLastSetParams()?.toString()).toBe(
      `${queryParam}=${normalizedValue}`,
    )
  })
})
