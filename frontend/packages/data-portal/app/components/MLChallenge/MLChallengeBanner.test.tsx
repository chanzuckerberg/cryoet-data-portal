import { beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockI18n } from 'app/components/I18n.mock'

async function renderMlChallengeBanner() {
  const { MLChallengeBanner } = await import('./MLChallengeBanner')
  render(<MLChallengeBanner />)
}

jest.unstable_mockModule('app/components/I18n', () => ({ I18n: MockI18n }))

const DEFAULT_RETURN_VALUE = { pathname: '/' }
const useLocationMock = jest.fn().mockReturnValue(DEFAULT_RETURN_VALUE)

jest.mock('@remix-run/react', () => ({
  useLocation: useLocationMock,
}))

const setLocalStorageValueMock = jest.fn()
const DEFAULT_LOCAL_STORAGE_VALUE = {
  value: null,
  set: setLocalStorageValueMock,
}
const useLocalStorageValueMock = jest
  .fn()
  .mockReturnValue(DEFAULT_LOCAL_STORAGE_VALUE)

jest.mock('@react-hookz/web', () => ({
  useLocalStorageValue: useLocalStorageValueMock,
}))

function setTime(time: string) {
  jest.useFakeTimers().setSystemTime(new Date(time))
}

describe('<MLChallengeBanner />', () => {
  beforeEach(() => {
    jest.useRealTimers()
  })

  const paths = ['/', '/browse-data/datasets', '/browse-data/depositions']

  paths.forEach((pathname) => {
    it(`should render on ${pathname}`, async () => {
      useLocationMock.mockImplementation(() => ({ pathname }))
      await renderMlChallengeBanner()
      expect(screen.queryByRole('banner')).toBeVisible()
      useLocationMock.mockReturnValue(DEFAULT_RETURN_VALUE)
    })
  })

  it('should not render on blocked pages', async () => {
    useLocationMock.mockImplementation(() => ({ pathname: '/competition' }))
    await renderMlChallengeBanner()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    useLocationMock.mockReturnValue(DEFAULT_RETURN_VALUE)
  })

  it('should render challenge began message', async () => {
    setTime('2024-12-01')

    await renderMlChallengeBanner()
    expect(screen.getByText('mlCompetitionHasBegun')).toBeVisible()
  })

  it('should render challenge ending message', async () => {
    setTime('2025-01-30')

    await renderMlChallengeBanner()
    expect(screen.getByText('mlCompetitionEnding')).toBeVisible()
  })

  it('should render challenge ended message', async () => {
    setTime('2025-02-07')

    await renderMlChallengeBanner()
    expect(screen.getByText('mlCompetitionEnded')).toBeVisible()
  })

  it('should not render banner if was dismissed', async () => {
    setTime('2024-12-01')
    useLocalStorageValueMock.mockReturnValueOnce({
      value: 'mlCompetitionHasBegun',
      set: jest.fn(),
    })

    await renderMlChallengeBanner()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should render banner if last dismissed was previous state', async () => {
    setTime('2025-01-30')
    useLocalStorageValueMock.mockReturnValueOnce({
      value: 'mlCompetitionHasBegun',
      set: jest.fn(),
    })

    await renderMlChallengeBanner()
    expect(screen.getByRole('banner')).toBeVisible()
  })

  it('should dismiss banner on click', async () => {
    setTime('2024-12-01')

    await renderMlChallengeBanner()
    // need to disable delay because of the fake timers:
    // https://github.com/testing-library/user-event/issues/833#issuecomment-1013632841
    const user = userEvent.setup({ delay: null })
    await user.click(screen.getByRole('button'))

    // expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(setLocalStorageValueMock).toHaveBeenCalledWith(
      'mlCompetitionHasBegun',
    )
  })
})
