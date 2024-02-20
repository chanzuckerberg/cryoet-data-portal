import { Annotation } from 'app/state/annotation'

export function getAnnotationTitle(annotation: Annotation | undefined | null) {
  if (!annotation) {
    return '--'
  }

  return `${annotation.id} - ${annotation.object_name}`
}
