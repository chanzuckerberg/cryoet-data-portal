import { Annotation } from 'app/state/annotation'

export function getAnnotationTitle(annotation: Annotation | undefined | null) {
  return annotation?.s3_path?.split('/').at(-1) ?? '--'
}
