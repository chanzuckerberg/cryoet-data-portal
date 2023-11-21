interface AnnotationType {
  s3_path: string
}

export function getAnnotationTitle(
  annotation: AnnotationType | undefined | null,
) {
  return annotation?.s3_path?.split('/').at(-1) ?? '--'
}
