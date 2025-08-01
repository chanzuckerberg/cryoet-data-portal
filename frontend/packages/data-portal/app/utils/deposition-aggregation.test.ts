import {
  aggregateDatasetInfo,
  aggregateOrganismCounts,
  collectUniqueDatasets,
} from './deposition-aggregation'

describe('deposition-aggregation', () => {
  describe('aggregateDatasetInfo', () => {
    it('should aggregate annotation dataset information correctly', () => {
      const mockData = [
        {
          groupBy: {
            annotation: {
              run: {
                dataset: { id: 1, title: 'Dataset 1', organismName: 'E. coli' },
              },
            },
          },
          count: 5,
        },
        {
          groupBy: {
            annotation: {
              run: {
                dataset: {
                  id: 2,
                  title: 'Dataset 2',
                  organismName: 'S. cerevisiae',
                },
              },
            },
          },
          count: 3,
        },
      ]

      const result = aggregateDatasetInfo(mockData, true)

      expect(result.datasets).toEqual([
        { id: 1, title: 'Dataset 1', organismName: 'E. coli' },
        { id: 2, title: 'Dataset 2', organismName: 'S. cerevisiae' },
      ])
      expect(result.counts).toEqual({ 1: 5, 2: 3 })
      expect(result.organismCounts).toEqual({
        'E. coli': 5,
        'S. cerevisiae': 3,
      })
    })

    it('should aggregate tomogram dataset information correctly', () => {
      const mockData = [
        {
          groupBy: {
            run: {
              dataset: { id: 1, title: 'Dataset 1', organismName: 'E. coli' },
            },
          },
          count: 5,
        },
        {
          groupBy: {
            run: {
              dataset: {
                id: 2,
                title: 'Dataset 2',
                organismName: 'S. cerevisiae',
              },
            },
          },
          count: 3,
        },
      ]

      const result = aggregateDatasetInfo(mockData, false)

      expect(result.datasets).toEqual([
        { id: 1, title: 'Dataset 1', organismName: 'E. coli' },
        { id: 2, title: 'Dataset 2', organismName: 'S. cerevisiae' },
      ])
      expect(result.counts).toEqual({ 1: 5, 2: 3 })
      expect(result.organismCounts).toEqual({
        'E. coli': 5,
        'S. cerevisiae': 3,
      })
    })

    it('should handle missing dataset information', () => {
      const mockData = [
        {
          groupBy: { annotation: { run: { dataset: null } } },
          count: 5,
        },
        {
          groupBy: null,
          count: 3,
        },
      ]

      const result = aggregateDatasetInfo(mockData, true)

      expect(result.datasets).toEqual([])
      expect(result.counts).toEqual({})
      expect(result.organismCounts).toEqual({})
    })

    it('should handle empty data', () => {
      const result = aggregateDatasetInfo([], true)
      expect(result.datasets).toEqual([])
      expect(result.counts).toEqual({})
      expect(result.organismCounts).toEqual({})
    })
  })

  describe('aggregateOrganismCounts', () => {
    it('should aggregate organism counts correctly', () => {
      const mockData = [
        { organismName: 'E. coli', count: 10 },
        { organismName: 'S. cerevisiae', count: 5 },
        { organismName: 'E. coli', count: 3 }, // duplicate to test aggregation
      ]

      const result = aggregateOrganismCounts(mockData)

      expect(result).toEqual({
        'E. coli': 13,
        'S. cerevisiae': 5,
      })
    })

    it('should handle missing organism information', () => {
      const mockData = [
        { organismName: null, count: 5 },
        { organismName: '', count: 3 },
        { count: 7 }, // missing organismName
      ]

      const result = aggregateOrganismCounts(mockData)

      expect(result).toEqual({})
    })

    it('should handle empty data', () => {
      expect(aggregateOrganismCounts([])).toEqual({})
    })

    it('should ignore null counts', () => {
      const mockData = [
        { organismName: 'E. coli', count: null },
        { organismName: 'S. cerevisiae', count: 5 },
      ]

      const result = aggregateOrganismCounts(mockData)

      expect(result).toEqual({
        'S. cerevisiae': 5,
      })
    })
  })

  describe('collectUniqueDatasets', () => {
    it('should collect unique datasets', () => {
      const mockItems = [
        { dataset: { id: 1, title: 'Dataset 1', organismName: 'E. coli' } },
        {
          dataset: { id: 2, title: 'Dataset 2', organismName: 'S. cerevisiae' },
        },
        { dataset: { id: 1, title: 'Dataset 1', organismName: 'E. coli' } }, // duplicate
      ]

      const result = collectUniqueDatasets(mockItems)

      expect(result).toHaveLength(2)
      expect(result).toEqual([
        { id: 1, title: 'Dataset 1', organismName: 'E. coli' },
        { id: 2, title: 'Dataset 2', organismName: 'S. cerevisiae' },
      ])
    })

    it('should handle items with missing dataset', () => {
      const mockItems = [
        { dataset: { id: 1, title: 'Dataset 1', organismName: 'E. coli' } },
        { dataset: null },
        {}, // no dataset property
      ]

      const result = collectUniqueDatasets(mockItems)

      expect(result).toHaveLength(1)
      expect(result).toEqual([
        { id: 1, title: 'Dataset 1', organismName: 'E. coli' },
      ])
    })

    it('should handle empty items', () => {
      expect(collectUniqueDatasets([])).toEqual([])
    })

    it('should sort datasets by title', () => {
      const mockItems = [
        { dataset: { id: 2, title: 'Z Dataset', organismName: null } },
        { dataset: { id: 1, title: 'A Dataset', organismName: 'E. coli' } },
        { dataset: { id: 3, title: 'M Dataset', organismName: null } },
      ]

      const result = collectUniqueDatasets(mockItems)

      expect(result).toEqual([
        { id: 1, title: 'A Dataset', organismName: 'E. coli' },
        { id: 3, title: 'M Dataset', organismName: null },
        { id: 2, title: 'Z Dataset', organismName: null },
      ])
    })

    it('should handle datasets with missing title or id', () => {
      const mockItems = [
        { dataset: { id: 1, title: 'Valid Dataset', organismName: 'E. coli' } },
        { dataset: { id: null, title: 'Missing ID', organismName: null } },
        { dataset: { id: 2, title: null, organismName: null } },
        { dataset: { title: 'Missing ID completely', organismName: null } },
      ]

      const result = collectUniqueDatasets(mockItems)

      expect(result).toHaveLength(1)
      expect(result).toEqual([
        { id: 1, title: 'Valid Dataset', organismName: 'E. coli' },
      ])
    })
  })
})
