/* eslint-disable testing-library/no-node-access */
import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockI18n } from 'app/components/I18n.mock'
import { QueryParams } from 'app/constants/query'
import { TestIds } from 'app/constants/testIds'
import { RemixMock } from 'app/mocks/Remix.mock'

import { TableLayoutTab, TablePageLayoutProps } from './types'

async function renderTablePageLayout(tabs: TablePageLayoutProps['tabs']) {
  const { TablePageLayout } = await import('./TablePageLayout')

  render(<TablePageLayout tabs={tabs} tabsTitle="Test" />)
}

jest.unstable_mockModule('app/components/I18n', () => ({ I18n: MockI18n }))

const remixMock = new RemixMock()

function getTabs(count: number): TableLayoutTab[] {
  return Array.from({ length: count }, (_, i) => ({
    title: `Test Tab ${i}`,
    filteredCount: 50,
    totalCount: 50,
    countLabel: 'objects',
    table: <div>Test Table {i}</div>,
  }))
}

describe('<TablePageLayout />', () => {
  beforeEach(() => {
    remixMock.reset()
  })

  it('should render no tabs if there is only one tab', async () => {
    const tabs = getTabs(1)
    await renderTablePageLayout(tabs)
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })

  it('should render tabs if > 1 tabs', async () => {
    const tabs = getTabs(2)
    await renderTablePageLayout(tabs)
    expect(screen.getByRole('tablist')).toBeVisible()
  })

  it('should render active tab', async () => {
    const tabs = getTabs(2)
    const activeTab = tabs[1]
    remixMock.mockSearchParams(
      new URLSearchParams([[QueryParams.TableTab, activeTab.title]]),
    )

    await renderTablePageLayout(tabs)
    expect(screen.getByText(activeTab.title, { selector: 'p' })).toBeVisible()
  })

  it('should render no total results if total count is 0', async () => {
    const tabs = getTabs(1)
    tabs[0].totalCount = 0
    tabs[0].noTotalResults = <div>no total results</div>

    await renderTablePageLayout(tabs)
    expect(screen.getByText('no total results')).toBeVisible()
  })

  it('should render no filter results if filtered count is 0', async () => {
    const tabs = getTabs(1)
    tabs[0].filteredCount = 0
    tabs[0].noFilteredResults = <p>no filter results</p>

    await renderTablePageLayout(tabs)
    expect(screen.getByText('no filter results')).toBeVisible()
  })

  it('should render pagination if greater than max page amount', async () => {
    const tabs = getTabs(1)

    await renderTablePageLayout(tabs)
    expect(screen.getByTestId(TestIds.Pagination)).toBeVisible()
  })

  it('should not render pagination if less than max page amount', async () => {
    const tabs = getTabs(1)
    tabs[0].totalCount = 10
    tabs[0].filteredCount = 10

    await renderTablePageLayout(tabs)
    expect(screen.queryByTestId(TestIds.Pagination)).not.toBeInTheDocument()
  })

  it('should remove page param if greater than max pages', async () => {
    const tabs = getTabs(1)
    remixMock.mockSearchParams(new URLSearchParams([['page', '100']]))

    await renderTablePageLayout(tabs)
    expect(remixMock.setParams).toHaveBeenCalled()
    expect(remixMock.getLastSetParams()?.toString()).toEqual('')
  })

  it('should open next page on click', async () => {
    const tabs = getTabs(1)
    await renderTablePageLayout(tabs)
    await userEvent.click(
      screen
        .getByTestId(TestIds.Pagination)
        .querySelector('[data-order=last]')!,
    )

    expect(remixMock.getLastSetParams()?.toString()).toEqual('page=2')
  })

  it('should disable previous page button on first page', async () => {
    const tabs = getTabs(1)
    await renderTablePageLayout(tabs)

    expect(
      screen
        .queryByTestId(TestIds.Pagination)
        ?.querySelector('[data-order=first]'),
    ).toHaveAttribute('disabled')
  })

  it('should open previous page on click', async () => {
    const tabs = getTabs(1)
    remixMock.mockSearchParams(new URLSearchParams([['page', '2']]))
    await renderTablePageLayout(tabs)

    await userEvent.click(
      screen
        .getByTestId(TestIds.Pagination)
        .querySelector('[data-order=first]')!,
    )

    expect(remixMock.getLastSetParams()?.toString()).toEqual('page=1')
  })

  it('should disable next button on last page', async () => {
    const tabs = getTabs(1)
    remixMock.mockSearchParams(new URLSearchParams([['page', '3']]))
    await renderTablePageLayout(tabs)

    await userEvent.click(
      screen
        .getByTestId(TestIds.Pagination)
        .querySelector('[data-order=first]')!,
    )

    expect(
      screen
        .queryByTestId(TestIds.Pagination)
        ?.querySelector('[data-order=last]'),
    ).toHaveAttribute('disabled')
  })

  it('should change page on click', async () => {
    const tabs = getTabs(1)
    await renderTablePageLayout(tabs)
    await userEvent.click(screen.getByText('3', { selector: 'li' }))

    expect(remixMock.getLastSetParams()?.toString()).toEqual('page=3')
  })
})
