// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals'

export class LocalStorageMock {
  setValue = jest.fn()

  useLocalStorageValue = jest.fn()

  constructor() {
    jest.mock('@react-hookz/web', () => ({
      useLocalStorageValue: this.useLocalStorageValue,
    }))

    this.reset()
  }

  mockValue(value: string | null) {
    this.useLocalStorageValue.mockReturnValue({
      set: this.setValue,
      value,
    })
  }

  reset() {
    this.useLocalStorageValue.mockReturnValue({
      set: this.setValue,
      value: null,
    })
  }
}
