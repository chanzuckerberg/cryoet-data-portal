export function getAnnotationName(id: number, objectName: string | undefined) {
  return `${id} ${objectName ?? ''}`
}
