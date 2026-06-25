/**
 * Identity of an annotated / identified object.
 *
 * An object's uniqueness is determined by ALL of these four fields. Two entries
 * that match on name, ontology ID, state, AND description represent the same
 * object; differing on any one of them makes them distinct objects.
 */
export interface AnnotationObjectIdentity {
  objectName?: string | null
  objectId?: string | null
  objectState?: string | null
  objectDescription?: string | null
}

export function getObjectIdentityKey(object: AnnotationObjectIdentity): string {
  // JSON encoding is used so the four fields combine into an unambiguous key
  // (no separator can collide with values, and null/undefined are preserved).
  return JSON.stringify([
    object.objectName ?? null,
    object.objectId ?? null,
    object.objectState ?? null,
    object.objectDescription ?? null,
  ])
}

/**
 * Remove entries that match on all four identity fields, preserving the first
 * occurrence and original ordering.
 */
export function dedupeObjectsByIdentity<T extends AnnotationObjectIdentity>(
  objects: T[],
): T[] {
  const seen = new Set<string>()

  return objects.filter((object) => {
    const key = getObjectIdentityKey(object)

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}
