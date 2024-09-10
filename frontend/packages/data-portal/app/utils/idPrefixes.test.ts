import { QueryParams } from 'app/constants/query'

import { extractNumericId, getPrefixedId } from './idPrefixes'

describe('extractNumericId()', () => {
  it('should extract numeric id from string', () => {
    const testCases = [
      { input: 'id1', output: '1' },
      { input: 'id-123', output: '123' },
      { input: 'id-1234', output: '1234' },
      { input: 'xyz-123', output: '123' },
      { input: 'id-0008', output: '0008' },
    ]

    testCases.forEach((testCase) =>
      expect(extractNumericId(testCase.input)).toEqual(testCase.output),
    )
  })
})

describe('getPrefixedId()', () => {
  it('should add prefix to id', () => {
    const testCases = [
      { queryParam: QueryParams.DepositionId, id: '123', output: 'CZCDP-123' },
      {
        queryParam: QueryParams.DepositionId,
        id: 'deposition-123',
        output: 'CZCDP-123',
      },
      {
        queryParam: QueryParams.DepositionId,
        id: 'deposition-123-456',
        output: 'CZCDP-123456',
      },
      {
        queryParam: QueryParams.DepositionId,
        id: 'deposition-0008',
        output: 'CZCDP-0008',
      },
    ]

    testCases.forEach((testCase) =>
      expect(getPrefixedId(testCase.queryParam, testCase.id)).toEqual(
        testCase.output,
      ),
    )
  })
})
