import { jest } from '@jest/globals'
import { createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockI18n } from './I18n.mock'

const MOCK_DEPOSITION = {
  id: 123,
  title: 'Title',
}

jest.unstable_mockModule('app/components/I18n', () => ({
  __esModule: true,
  I18n: MockI18n,
}))

const setDepositionIdMock = jest.fn()

jest.unstable_mockModule('app/hooks/useQueryParam', () => ({
  useQueryParam: jest.fn().mockReturnValue([null, setDepositionIdMock]),
}))

const setPreviousSingleDatasetParamsMock = jest.fn()

jest.unstable_mockModule('app/state/filterHistory', () => ({
  useDepositionHistory: jest.fn(() => ({
    previousSingleDepositionParams: 'object=foo',
  })),

  useSingleDatasetFilterHistory: jest.fn(() => ({
    previousSingleDatasetParams: `object=foo&deposition-id=${MOCK_DEPOSITION.id}`,
    setPreviousSingleDatasetParams: setPreviousSingleDatasetParamsMock,
  })),
}))

async function renderDepositionFilterBanner() {
  const { DepositionFilterBanner } = await import('./DepositionFilterBanner')

  function DepositionFilterBannerWrapper() {
    return (
      <DepositionFilterBanner
        deposition={MOCK_DEPOSITION}
        labelI18n="onlyDisplayingRunsWithAnnotations"
      />
    )
  }

  const DepositionFilterBannerStub = createRemixStub([
    {
      path: '/',
      Component: DepositionFilterBannerWrapper,
    },
  ])

  render(<DepositionFilterBannerStub />)
}

describe('<DepositionFilterBanner />', () => {
  it('should render deposition url', async () => {
    await renderDepositionFilterBanner()

    const text = screen.getByText('onlyDisplayingRunsWithAnnotations')
    expect(text).toHaveAttribute(
      'data-values',
      JSON.stringify({
        ...MOCK_DEPOSITION,
        url: `/depositions/${MOCK_DEPOSITION.id}?object=foo`,
      }),
    )
  })

  it('should remove filter on click', async () => {
    await renderDepositionFilterBanner()

    await userEvent.click(screen.getByRole('button', { name: 'removeFilter' }))

    expect(setDepositionIdMock).toHaveBeenCalledWith(null)
    expect(setPreviousSingleDatasetParamsMock).toHaveBeenCalledWith(
      'object=foo',
    )
  })
})
