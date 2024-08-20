import { AnnotationRow } from 'app/state/annotation'

export function getAnnotationTitle(
  annotation: AnnotationRow | undefined | null,
) {
  if (!annotation) {
    return '--'
  }

  return `${annotation.id} - ${annotation.object_name}`
}
