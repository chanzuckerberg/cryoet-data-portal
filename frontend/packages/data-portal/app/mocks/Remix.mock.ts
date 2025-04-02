// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals'

const DEFAULT_PATHNAME = '/'

type SetURLSearchParamsValue =
  | URLSearchParams
  | ((prev: URLSearchParams) => URLSearchParams)

export class RemixMock {
  useLocation = jest.fn()

  useNavigation = jest.fn()

  setParams = jest.fn()

  useSearchParams = jest.fn()

  navigateFn = jest.fn()

  constructor() {
    jest.mock('@remix-run/react', () => ({
      Link: jest.fn(),
      useLocation: this.useLocation,
      useNavigation: this.useNavigation,
      useSearchParams: this.useSearchParams,
      useNavigate: () => this.navigateFn,
    }))
    this.reset()
  }

  mockPathname(pathname: string) {
    this.useLocation.mockReturnValue({ pathname })
  }

  mockSearchParams(value: URLSearchParams) {
    this.useSearchParams.mockReturnValue([value, this.setParams])
  }

  getLastSetParams(prevParams = new URLSearchParams()) {
    const setParams = this.setParams.mock.lastCall?.[0] as
      | SetURLSearchParamsValue
      | undefined

    const params =
      typeof setParams === 'function' ? setParams(prevParams) : setParams

    return params
  }

  reset() {
    this.useLocation.mockReturnValue({ pathname: DEFAULT_PATHNAME })

    this.useNavigation.mockReturnValue({
      state: 'idle',
    })

    this.setParams = jest.fn()
    this.useSearchParams.mockReturnValue([
      new URLSearchParams(),
      this.setParams,
    ])
  }
}
