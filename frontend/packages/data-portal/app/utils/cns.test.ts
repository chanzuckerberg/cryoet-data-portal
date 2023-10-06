import { cns } from './cns'

describe('cns()', () => {
  it('should merge classes', () => {
    const testCases = [
      { input: ['a', 'b'], output: 'a b' },
      { input: ['a', false], output: 'a' },
      { input: ['a', { b: true, c: false }], output: 'a b' },
      { input: ['a', ['b', 'c', { d: false, e: true }]], output: 'a b c e' },
    ]

    testCases.forEach((testCase) =>
      expect(cns(...testCase.input)).toEqual(testCase.output),
    )
  })

  it('should merge tailwind classes', () => {
    expect(cns('p-0 w-3 h-3', 'p-4 w-2')).toEqual('h-3 p-4 w-2')
  })
})
