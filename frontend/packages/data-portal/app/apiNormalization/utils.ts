export function stringCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: 'base' })
}
