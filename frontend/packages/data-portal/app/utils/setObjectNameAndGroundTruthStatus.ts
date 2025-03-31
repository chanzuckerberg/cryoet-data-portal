export const setObjectNameAndGroundTruthStatus = (
  objectName: string | null | undefined,
  groundTruthStatus: boolean,
  acc: Map<string, boolean>,
): Map<string, boolean> => {
  if (!objectName) return acc // Skip invalid entries

  if (acc.has(objectName)) {
    // If the objectName is already in the map
    if (groundTruthStatus) {
      acc.set(objectName, true) // If any runs have the ground truth status, set the annotatedObject to true
    }
  } else {
    acc.set(objectName, groundTruthStatus)
  }

  return acc
}
