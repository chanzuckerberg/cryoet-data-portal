import { OrderBy } from 'app/__generated_v2__/graphql'

export function extractIds(
  items: Array<{ id: number }> | undefined | null,
): number[] {
  return items?.map((item) => item.id) ?? []
}

export function unionIds(...idArrays: number[][]): number[] {
  return Array.from(new Set(idArrays.flat()))
}

export function intersectIds(idsA: number[], idsB: number[]): number[] {
  const setB = new Set(idsB)
  return idsA.filter((id) => setB.has(id))
}

export function buildDatasetsOrderBy(titleOrderDirection?: OrderBy) {
  return titleOrderDirection
    ? [{ title: titleOrderDirection }, { releaseDate: OrderBy.Desc }]
    : [{ releaseDate: OrderBy.Desc }, { title: OrderBy.Asc }]
}
