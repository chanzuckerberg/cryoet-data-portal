import { removeNullishValues } from './object'

describe('removeNullishValues()', () => {
  it('should filter out null or undefined values', () => {
    const input = {
      a: 1,
      b: true,
      c: false,
      d: [1, 2, 3],
      e: { a: 1, b: 2, c: 3 },
      f: null,
      g: undefined,
    }
    const expected = {
      a: 1,
      b: true,
      c: false,
      d: [1, 2, 3],
      e: { a: 1, b: 2, c: 3 },
    }

    expect(removeNullishValues(input)).toStrictEqual(expected)
  })
})
