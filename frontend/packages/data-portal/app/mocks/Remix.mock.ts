// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals'

const DEFAULT_PATHNAME = '/'

type ParamKeyValuePair = [string, string]

type URLSearchParamsInit =
  | string
  | ParamKeyValuePair[]
  | Record<string, string | string[]>
  | URLSearchParams

type SetURLSearchParams = (
  nextInit?:
    | URLSearchParamsInit
    | ((prev: URLSearchParams) => URLSearchParamsInit),
) => void

export class RemixMock {
  useLocation = jest.fn()

  useNavigation = jest.fn()

  setParams = jest.fn()

  useSearchParams = jest.fn()

  constructor() {
    jest.mock('@remix-run/react', () => ({
      Link: jest.fn(),
      useLocation: this.useLocation,
      useNavigation: this.useNavigation,
      useSearchParams: this.useSearchParams,
    }))

    this.reset()
  }

  mockPathname(pathname: string) {
    this.useLocation.mockReturnValue({ pathname })
  }

  mockSearchParams(value: URLSearchParams) {
    this.useSearchParams.mockReturnValue([value, this.setParams])
  }

  getLastSetParams() {
    const setParams = this.setParams.mock.calls[0][0] as SetURLSearchParams
    const params =
      typeof setParams === 'function'
        ? setParams(new URLSearchParams())
        : setParams

    return params as unknown as URLSearchParams
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
