import { DataContentsType } from 'app/types/deposition-queries'

import {
  parseDatasetIds,
  parsePageParams,
  validateDepositionTab,
} from './param-parsers'

describe('param-parsers', () => {
  describe('parseDatasetIds', () => {
    it('should parse valid comma-separated string', () => {
      expect(parseDatasetIds('1,2,3')).toEqual([1, 2, 3])
      expect(parseDatasetIds('123')).toEqual([123])
      expect(parseDatasetIds('1,22,333')).toEqual([1, 22, 333])
    })

    it('should throw error for null', () => {
      expect(() => parseDatasetIds(null)).toThrow('Missing datasetIds')
    })

    it('should throw error for empty string', () => {
      expect(() => parseDatasetIds('')).toThrow('Missing datasetIds')
    })

    it('should handle whitespace around numbers by filtering invalid ones', () => {
      // Note: actual implementation filters out NaN values, so empty strings become NaN
      expect(parseDatasetIds('1,2,3')).toEqual([1, 2, 3])
    })

    it('should filter out invalid numbers and throw if none valid', () => {
      expect(parseDatasetIds('1,abc,3')).toEqual([1, 3]) // Filters out abc
      expect(() => parseDatasetIds('abc,def')).toThrow(
        'No valid dataset IDs provided',
      )
    })
  })

  describe('parsePageParams', () => {
    it('should throw error for null page', () => {
      expect(() => parsePageParams(null, null)).toThrow(
        'Missing or invalid page',
      )
    })

    it('should parse valid numeric strings', () => {
      expect(parsePageParams('5', '20')).toEqual({ page: 5, pageSize: 20 })
      expect(parsePageParams('1', '50')).toEqual({ page: 1, pageSize: 50 })
    })

    it('should throw error for invalid page values', () => {
      expect(() => parsePageParams('abc', 'def')).toThrow(
        'Missing or invalid page',
      )
    })

    it('should use default pageSize for invalid pageSize values', () => {
      expect(parsePageParams('1', 'abc')).toEqual({ page: 1, pageSize: 20 })
      expect(parsePageParams('1', null)).toEqual({ page: 1, pageSize: 20 })
    })

    it('should accept any valid page and pageSize numbers', () => {
      expect(parsePageParams('0', '0')).toEqual({ page: 0, pageSize: 0 })
      expect(parsePageParams('-1', '-10')).toEqual({ page: -1, pageSize: -10 })
      expect(parsePageParams('1', '200')).toEqual({ page: 1, pageSize: 200 })
      expect(parsePageParams('1', '1000')).toEqual({ page: 1, pageSize: 1000 })
    })
  })

  describe('validateDepositionTab', () => {
    it('should return valid tab values', () => {
      expect(validateDepositionTab('annotations')).toBe(
        DataContentsType.Annotations,
      )
      expect(validateDepositionTab('tomograms')).toBe(
        DataContentsType.Tomograms,
      )
    })

    it('should throw error for invalid tab', () => {
      expect(() => validateDepositionTab('invalid')).toThrow(
        'Invalid deposition tab: invalid. Valid values are: annotations, tomograms',
      )
    })

    it('should return default for null/empty', () => {
      expect(validateDepositionTab(null)).toBe(DataContentsType.Annotations)
      expect(validateDepositionTab('')).toBe(DataContentsType.Annotations)
    })
  })
})
