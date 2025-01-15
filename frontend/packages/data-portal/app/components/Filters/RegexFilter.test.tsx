import { beforeEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { IdPrefix } from 'app/constants/idPrefixes'
import { QueryParams } from 'app/constants/query'
import { RemixMock } from 'app/mocks/Remix.mock'

import { RegexFilterProps } from './RegexFilter'

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

const remixMock = new RemixMock()

describe('<RegexFilter />', () => {
  beforeEach(() => {
    remixMock.reset()
  })

  it('should render title', async () => {
    const title = 'Test Title'
    await renderRegexFilter({ title })
    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByText(title)).toBeVisible()
  })

  it('should render initial value', async () => {
    const label = 'Open Filters'
    const queryParam = QueryParams.DatasetId
    const value = '123'
    remixMock.mockSearchParams(new URLSearchParams([[queryParam, value]]))
    await renderRegexFilter({
      label,
      queryParam,
    })

    expect(screen.getByText(`${IdPrefix.Dataset}-${value}`)).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: label }))
    expect(screen.getByRole('textbox')).toHaveValue(value)
  })

  it('should disable apply if value does not match regex', async () => {
    const label = 'Open Filters'
    const queryParam = QueryParams.DatasetId
    await renderRegexFilter({
      label,
      queryParam,
      regex: /[a-z]+/,
    })

    await userEvent.click(screen.getByRole('button', { name: label }))
    await userEvent.type(screen.getByRole('textbox'), '123')

    expect(screen.getByRole('button', { name: 'apply' })).toBeDisabled()
  })

  it('should set value on apply click', async () => {
    const label = 'Open Filters'
    const queryParam = QueryParams.DatasetId
    await renderRegexFilter({
      label,
      queryParam,
    })

    await userEvent.click(screen.getByRole('button', { name: label }))
    await userEvent.type(screen.getByRole('textbox'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'apply' }))

    expect(remixMock.getLastSetParams()?.toString()).toBe(`${queryParam}=123`)
  })

  it('should normalize initial value', async () => {
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

    await userEvent.click(screen.getByRole('button', { name: label }))
    expect(screen.getByRole('textbox')).toHaveValue(value)
  })

  it('should normalize value', async () => {
    const label = 'Open Filters'
    const queryParam = QueryParams.DatasetId
    const value = '123'
    const normalizedValue = `${IdPrefix.Dataset}-123`
    await renderRegexFilter({
      label,
      queryParam,
      displayNormalizer: () => normalizedValue,
    })

    await userEvent.click(screen.getByRole('button', { name: label }))
    await userEvent.type(screen.getByRole('textbox'), value)
    await userEvent.click(screen.getByRole('button', { name: 'apply' }))
    await userEvent.click(screen.getByRole('button', { name: label }))

    expect(screen.getByRole('textbox')).toHaveValue(normalizedValue)
  })

  it('should normalize param value', async () => {
    const label = 'Open Filters'
    const queryParam = QueryParams.DatasetId
    const value = `${IdPrefix.Dataset}-123`
    const normalizedValue = `123`
    await renderRegexFilter({
      label,
      queryParam,
      paramNormalizer: () => normalizedValue,
    })

    await userEvent.click(screen.getByRole('button', { name: label }))
    await userEvent.type(screen.getByRole('textbox'), value)
    await userEvent.click(screen.getByRole('button', { name: 'apply' }))

    expect(remixMock.getLastSetParams()?.toString()).toBe(
      `${queryParam}=${normalizedValue}`,
    )
  })
})
