import { OrderBy } from 'app/__generated_v2__/graphql'

import {
  buildDatasetsOrderBy,
  extractIds,
  intersectIds,
  unionIds,
} from './queryUtils'

describe('extractIds', () => {
  it('should extract ids from an array of objects', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(extractIds(items)).toEqual([1, 2, 3])
  })

  it('should return empty array for undefined input', () => {
    expect(extractIds(undefined)).toEqual([])
  })

  it('should return empty array for null input', () => {
    expect(extractIds(null)).toEqual([])
  })
})

describe('unionIds', () => {
  it('should merge two arrays and remove duplicates', () => {
    const result = unionIds([1, 2, 3], [3, 4, 5])
    expect(result).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]))
    expect(result).toHaveLength(5)
  })

  it('should handle both arrays empty', () => {
    expect(unionIds([], [])).toEqual([])
  })

  it('should handle completely overlapping arrays', () => {
    const result = unionIds([1, 2, 3], [1, 2, 3])
    expect(result).toEqual(expect.arrayContaining([1, 2, 3]))
    expect(result).toHaveLength(3)
  })
})

describe('intersectIds', () => {
  it('should return ids present in both arrays', () => {
    expect(intersectIds([1, 2, 3, 4], [3, 4, 5, 6])).toEqual([3, 4])
  })

  it('should return empty array when no overlap', () => {
    expect(intersectIds([1, 2], [3, 4])).toEqual([])
  })
})

describe('buildDatasetsOrderBy', () => {
  it('should sort by title asc then release date desc when title direction is asc', () => {
    expect(buildDatasetsOrderBy(OrderBy.Asc)).toEqual([
      { title: OrderBy.Asc },
      { releaseDate: OrderBy.Desc },
    ])
  })

  it('should sort by title desc then release date desc when title direction is desc', () => {
    expect(buildDatasetsOrderBy(OrderBy.Desc)).toEqual([
      { title: OrderBy.Desc },
      { releaseDate: OrderBy.Desc },
    ])
  })

  it('should default to release date desc then title asc when no direction given', () => {
    expect(buildDatasetsOrderBy()).toEqual([
      { releaseDate: OrderBy.Desc },
      { title: OrderBy.Asc },
    ])
  })
})
