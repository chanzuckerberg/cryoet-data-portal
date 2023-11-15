import { Annotation } from 'app/state/annotation'

type AnnotationType = Pick<Annotation, 's3_annotations_path'>

export function getAnnotationTitle(
  annotation: AnnotationType | undefined | null,
) {
  return annotation?.s3_annotations_path?.split('/').at(-1) ?? '--'
}
