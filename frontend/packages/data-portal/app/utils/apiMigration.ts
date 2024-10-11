/* eslint-disable @typescript-eslint/no-explicit-any */
type FieldMapValue<Source, Target> =
  | keyof Source
  | ((source: Source) => Target[keyof Target])
type FieldMap<Source, Target> = {
  [TargetKey in keyof Target]?: FieldMapValue<Source, Target[TargetKey]>
}
type ExcludeKeys<T, K extends keyof T> = Omit<T, K>

/**
 * This function defines a mapping from a source object to a target object.
 *
 * @param fieldMap - Maps fields from Source to Target
 * @param notMapped - Specifies fields in Target to be excluded
 *
 * @returns A function that takes a Source object and returns a Target object
 */
export function remapAPI<
  Source extends Record<string, any>,
  Target extends Record<string, any>,
>(
  fieldMap: FieldMap<Source, Target>,
  notMapped: (keyof Target)[], // `notMapped` specifies fields in Target to be excluded
) {
  return (source: Source): ExcludeKeys<Target, (typeof notMapped)[number]> => {
    const result: Partial<Target> = {}

    const notMappedSet = new Set(notMapped) // convert to set for faster lookup

    for (const [targetKey, value] of Object.entries(fieldMap) as [
      keyof Target,
      FieldMapValue<Source, Target>,
    ][]) {
      if (!notMappedSet.has(targetKey)) {
        if (typeof value === 'function') {
          const transform = value
          result[targetKey] = transform(source)
        } else if (value in source) {
          const sourceKey = value
          result[targetKey] = source[sourceKey]
        }
      }
    }

    return result as ExcludeKeys<Target, (typeof notMapped)[number]>
  }
}
