import { QueryParams } from 'app/constants/query'

import {
  getPrefixedId,
  isFilterPrefixValid,
  removeIdPrefix,
} from './idPrefixes'

describe('removeIdPrefix()', () => {
  it('should extract numeric id from string', () => {
    const testCases = [
      {
        queryParam: QueryParams.DepositionId,
        input: 'id1',
        output: '1',
      },
      {
        queryParam: QueryParams.DatasetId,
        input: 'id-123',
        output: '123',
      },
      {
        queryParam: QueryParams.AnnotationId,
        input: 'id-1234',
        output: '1234',
      },
      {
        queryParam: QueryParams.DepositionId,
        input: 'xyz-123',
        output: '123',
      },
      {
        queryParam: QueryParams.DepositionId,
        input: 'id-0008',
        output: '0008',
      },
    ]

    testCases.forEach((testCase) =>
      expect(removeIdPrefix(testCase.input, testCase.queryParam)).toEqual(
        testCase.output,
      ),
    )
  })
  it('should return the same string if the queryParam does not have a prefix', () => {
    const testCases = [
      {
        queryParam: QueryParams.AuthorName,
        input: 'Jane Doe',
        output: 'Jane Doe',
      },
    ]

    testCases.forEach((testCase) =>
      expect(removeIdPrefix(testCase.input, testCase.queryParam)).toEqual(
        testCase.output,
      ),
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
      expect(getPrefixedId(testCase.id, testCase.queryParam)).toEqual(
        testCase.output,
      ),
    )
  })
})

describe('isFilterPrefixValid()', () => {
  it('should validate filter prefix', () => {
    const testCases = [
      {
        queryParam: QueryParams.DepositionId,
        value: 'CZCDP-123',
        output: true,
      },
      { queryParam: QueryParams.DepositionId, value: '123', output: true },
      { queryParam: QueryParams.AnnotationId, value: 'AN123', output: true },
      { queryParam: QueryParams.AnnotationId, value: 'NAN-123', output: false },
      { queryParam: QueryParams.DatasetId, value: '1-23', output: false },
    ]

    testCases.forEach((testCase) =>
      expect(isFilterPrefixValid(testCase.value, testCase.queryParam)).toEqual(
        testCase.output,
      ),
    )
  })
})
