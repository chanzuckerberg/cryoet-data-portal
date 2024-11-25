/* eslint-disable @typescript-eslint/no-explicit-any */
type FieldMapValue<Source, TargetValue> =
  | keyof Source
  | ((source: Source) => TargetValue)
type FieldMap<Source, Target, NotMapped extends keyof Target> = {
  [TargetKey in keyof Omit<Target, NotMapped>]: FieldMapValue<
    Source,
    Target[TargetKey]
  >
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
  NotMapped extends keyof Target = never,
>(fieldMap: FieldMap<Source, Target, NotMapped>) {
  return (source: Source): ExcludeKeys<Target, NotMapped> => {
    const result: Partial<Target> = {}

    for (const [targetKey, value] of Object.entries(fieldMap) as [
      keyof Target,
      FieldMapValue<Source, Target[keyof Target]>,
    ][]) {
      if (typeof value === 'function') {
        const transform = value
        result[targetKey] = transform(source)
      } else if (value in source) {
        const sourceKey = value
        result[targetKey] = source[sourceKey]
      }
    }

    return result as ExcludeKeys<Target, NotMapped>
  }
}

type APIValue = string | number | boolean | object | undefined | null

type APIStructure = {
  [key: string]: APIValue | APIStructure | APIValue[] | APIStructure[]
}

type SourceKeyPicker<
  Structure extends APIStructure,
  SourceMap extends Record<string, Structure>,
> = {
  [key in keyof Structure]:
    | keyof SourceMap
    | SourceKeyPicker<
        Structure[key] extends APIStructure[]
          ? Structure[key][number] & APIStructure
          : Structure[key] & APIStructure,
        Record<
          keyof SourceMap,
          Structure[key] extends APIStructure[]
            ? Structure[key][number] & APIStructure
            : Structure[key] & APIStructure
        >
      >
}

/**
 * Picks fields from multiple sources of the same structure and combines them into a single object.
 * When combining arrays, the function assumes that they are of the same length and that the order of the elements is the same.
 *
 * @param sources Sources to pick fields from.
 * @param key Mapping of fields to pick from each source where the value is the key from the sources map.
 *
 * @returns Final structure with fields picked from each source.
 */
export function pickAPISource<Structure extends APIStructure>(
  sources: Record<string, Structure>,
  key: SourceKeyPicker<Structure, typeof sources>,
): Structure {
  type NestedStructure = Structure[keyof Structure] & APIStructure

  return Object.entries(key).reduce((acc, [targetKey, value]) => {
    // If the key picker returned an object (another key picker), recursively pick fields from the sources
    if (typeof value === 'object') {
      // Extract the nested key picker
      const nestedMap = value as SourceKeyPicker<
        Structure[keyof Structure] & APIStructure,
        Record<string, Structure[keyof Structure] & APIStructure>
      >
      let nestedSourceIsArray = false
      const nestedSourceValues = Object.entries(sources).reduce(
        (nestedSourceValuesAcc, [sourceKey, sourceStructure]) => {
          nestedSourceIsArray = Array.isArray(sourceStructure[targetKey])
          return {
            ...nestedSourceValuesAcc,
            [sourceKey]: sourceStructure[targetKey as keyof Structure],
          }
        },
        {} as {
          [key in keyof typeof sources]: Structure[keyof Structure]
        },
      )

      // If the field is an array, recurse over each element of the array
      if (nestedSourceIsArray) {
        // Combine the arrays of each source into an array of the sources with their corresponding values
        // (e.g. [{s1: [1, 2], s2: [3, 4]}] -> [{s1: 1, s2: 3}, {s1: 2, s2: 4}])
        const newSourcesArray = new Array(
          Object.values(nestedSourceValues).length,
        ) as Record<keyof typeof sources, APIStructure>[]
        Object.entries(nestedSourceValues).forEach(
          ([sourceKey, sourceArray]) => {
            ;(sourceArray as APIStructure[]).forEach(
              (sourceArrayValue, index) => {
                if (newSourcesArray[index] === undefined) {
                  newSourcesArray[index] = {}
                }
                newSourcesArray[index][sourceKey] = sourceArrayValue
              },
            )
          },
        )

        acc[targetKey as keyof Structure] = newSourcesArray.map((newSources) =>
          pickAPISource<(typeof newSourcesArray)[number][string]>(
            newSources,
            nestedMap,
          ),
        ) as unknown as Structure[keyof Structure]

        return acc
      }

      // The object is not an array, so recurse over the object
      const newSources = nestedSourceValues as Record<string, NestedStructure>

      acc[targetKey as keyof Structure] = pickAPISource<NestedStructure>(
        newSources,
        value as SourceKeyPicker<NestedStructure, typeof newSources>,
      )
      return acc
    }

    // Normal assignment of fields
    acc[targetKey as keyof Structure] = sources[value as keyof typeof sources][
      targetKey
    ] as Structure[keyof Structure]
    return acc
  }, {} as Structure)
}
